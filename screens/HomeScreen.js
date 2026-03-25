import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { tailorCV } from '../services/api';
import { loadCredits, deductCredit } from '../services/credits';
import ScanningOverlay from '../components/ScanningOverlay';
import { t } from '../services/i18n';

const ACCENT = '#4F46E5';

export default function HomeScreen({ navigation }) {
  const [mode, setMode] = useState('pdf'); // 'pdf' | 'create'
  const [cvFile, setCvFile] = useState(null);
  const [cvUri, setCvUri] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [isPro, setIsPro] = useState(false);

  useFocusEffect(useCallback(() => {
    loadCredits().then(d => {
      setCredits(d.credits);
      setIsPro(!!(d.subscription && new Date(d.subscription.expiresAt) > new Date()));
    });
  }, []));

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      let uri = asset.uri;
      if (uri.startsWith('content://')) {
        const dest = new File(Paths.cache, asset.name || 'cv.pdf');
        new File(uri).copy(dest);
        uri = dest.uri;
      }

      setCvFile(asset);
      setCvUri(uri);
    } catch (err) {
      Alert.alert(t('alert.error'), err?.message || t('alert.pdfError'));
    }
  };

  const handleTailor = async () => {
    if (mode === 'pdf' && !cvUri) {
      Alert.alert(t('alert.cvRequired'), t('alert.cvRequiredMsg'));
      return;
    }
    if (!jobDescription.trim()) {
      Alert.alert(t('alert.jobRequired'), t('alert.jobRequiredMsg'));
      return;
    }
    if (credits !== null && credits <= 0) {
      navigation.navigate('Subscription');
      return;
    }
    const ok = deductCredit();
    if (!ok) { navigation.navigate('Subscription'); return; }
    setCredits(c => Math.max(0, (c ?? 1) - 1));
    setLoading(true);
    try {
      const cvData = await tailorCV({ cvUri, cvFileName: cvFile?.name, jobDescription });
      navigation.navigate('Result', { cvData, jobDescription });
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || t('alert.unexpectedError');
      Alert.alert(t('alert.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setCvFile(null);
    setCvUri(null);
  };

  if (loading) {
    return (
      <ScanningOverlay
        fileName={cvFile?.name}
        onCancel={() => setLoading(false)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroTitle}>{t('home.title')}</Text>
          <Text style={s.heroSub}>{t('home.sub')}</Text>
        </View>

        {/* Mode toggle */}
        <View style={s.modeToggle}>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'pdf' && s.modeBtnActive]}
            onPress={() => switchMode('pdf')}
            activeOpacity={0.8}
          >
            <Text style={[s.modeBtnText, mode === 'pdf' && s.modeBtnTextActive]}>{t('home.tab.pdf')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'create' && s.modeBtnActive]}
            onPress={() => switchMode('create')}
            activeOpacity={0.8}
          >
            <Text style={[s.modeBtnText, mode === 'create' && s.modeBtnTextActive]}>{t('home.tab.create')}</Text>
          </TouchableOpacity>
        </View>

        {/* CV input */}
        <View style={s.section}>
          <Text style={s.label}>{mode === 'pdf' ? t('home.cvFile') : t('home.cvFile')}</Text>

          {mode === 'pdf' ? (
            <TouchableOpacity
              style={[s.uploadArea, cvFile && s.uploadAreaDone]}
              onPress={pickPDF}
              activeOpacity={0.7}
            >
              {cvFile ? (
                <>
                  <View style={s.uploadDoneIcon}>
                    <Text style={s.uploadDoneCheck}>✓</Text>
                  </View>
                  <View style={s.uploadFileInfo}>
                    <Text style={s.uploadFileName} numberOfLines={1}>{cvFile.name}</Text>
                    <Text style={s.uploadFileSize}>
                      {cvFile.size ? `${(cvFile.size / 1024).toFixed(0)} KB` : 'PDF'}
                      {' · '}{t('home.changeFile')}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={s.uploadEmptyIcon}>
                    <Text style={s.uploadEmptyEmoji}>📄</Text>
                  </View>
                  <Text style={s.uploadEmptyTitle}>{t('home.pdfSelect')}</Text>
                  <Text style={s.uploadEmptySub}>{t('home.pdfSelectSub')}</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.createCard} onPress={() => navigation.navigate('CreateCV')} activeOpacity={0.8}>
              <View style={s.createIcon}>
                <Text style={s.createIconText}>+</Text>
              </View>
              <View style={s.createInfo}>
                <Text style={s.createTitle}>{t('home.createCard.title')}</Text>
                <Text style={s.createSub}>{t('home.createCard.sub')}</Text>
              </View>
              <Text style={s.createArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Job Description */}
        <View style={s.section}>
          <Text style={s.label}>{t('home.jobDesc')}</Text>
          <TextInput
            style={s.textArea}
            multiline
            placeholder={t('home.jobDescPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={jobDescription}
            onChangeText={setJobDescription}
            textAlignVertical="top"
          />
          {jobDescription.length > 0 && (
            <Text style={s.charCount}>{jobDescription.length} {t('home.chars')}</Text>
          )}
        </View>

        {/* Credit bar */}
        <View style={s.creditBar}>
          <View>
            <Text style={s.creditBarLabel}>{t('home.credits')}</Text>
            <Text style={[s.creditBarNum, credits === 0 && { color: '#EF4444' }]}>
              {credits === null ? '—' : credits}
            </Text>
          </View>
          <TouchableOpacity style={[s.creditBarBtn, isPro && s.creditBarBtnPro]} onPress={() => navigation.navigate('Subscription')} activeOpacity={0.75}>
            <View style={[s.creditBarBtnInner, isPro && s.creditBarBtnProInner]}>
              <Text style={s.creditBarBtnText}>
                {isPro ? t('home.pro') : credits === 0 ? t('home.buyCredits') : t('home.seePlan')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[s.cta, credits === 0 && s.ctaDisabled]}
          onPress={handleTailor}
          activeOpacity={0.85}
        >
          <Text style={s.ctaText}>{credits === 0 ? t('home.creditRequired') : t('home.editBtn')}</Text>
          <View style={s.ctaArrow}>
            <Text style={s.ctaArrowText}>→</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 24 },

  hero: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 34,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeBtnText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  modeBtnTextActive: { color: '#111827' },

  creditBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  creditBarLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 },
  creditBarNum: { fontSize: 20, fontWeight: '800', color: ACCENT },
  creditBarBtn: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  creditBarBtnInner: {},
  creditBarBtnPro: { backgroundColor: '#10B981' },
  creditBarBtnProInner: {},
  creditBarBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  ctaDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0 },

  section: { paddingHorizontal: 24, marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    gap: 7,
  },
  uploadAreaDone: {
    borderStyle: 'solid',
    borderColor: '#A5B4FC',
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    gap: 14,
  },
  uploadEmptyIcon: {
    width: 48, height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  uploadEmptyEmoji: { fontSize: 22 },
  uploadEmptyTitle: { fontSize: 15, fontWeight: '600', color: '#374151' },
  uploadEmptySub: { fontSize: 12, color: '#9CA3AF' },

  uploadDoneIcon: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
  },
  uploadDoneCheck: { fontSize: 18, color: '#fff', fontWeight: '700' },
  uploadFileInfo: { flex: 1 },
  uploadFileName: { fontSize: 14, fontWeight: '600', color: '#3730A3' },
  uploadFileSize: { fontSize: 11, color: '#818CF8', marginTop: 2 },

  textArea: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: '#111827',
    lineHeight: 22,
    height: 130,
    backgroundColor: '#FAFAFA',
  },
  textAreaTall: { height: 160 },

  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#F5F7FF',
  },
  createIcon: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIconText: { fontSize: 24, color: '#fff', fontWeight: '300', lineHeight: 28 },
  createInfo: { flex: 1 },
  createTitle: { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 3 },
  createSub: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
  createArrow: { fontSize: 18, color: '#818CF8' },
  charCount: {
    fontSize: 11, color: '#9CA3AF',
    textAlign: 'right', marginTop: 6,
  },

  cta: {
    marginHorizontal: 24,
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 12,
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  ctaArrow: {
    width: 32, height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaArrowText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
