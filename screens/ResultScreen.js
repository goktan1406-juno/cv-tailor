import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { saveCV } from '../services/storage';
import { hasActiveSubscription } from '../services/credits';
import { t } from '../services/i18n';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { HarvardTemplate } from '../templates/HarvardTemplate';
import { ModernProTemplate } from '../templates/ModernProTemplate';
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate';
import { CleanATSTemplate } from '../templates/CleanATSTemplate';
import { buildHTML } from '../utils/buildHTML';

const ACCENT = '#4F46E5';

const TEMPLATES = [
  { id: 'harvard',   label: 'Harvard',    sub: () => t('tpl.harvard.sub'),    color: '#1a1a1a', Component: HarvardTemplate },
  { id: 'modernpro', label: 'Modern Pro', sub: () => t('tpl.modernpro.sub'),  color: '#1A56A0', Component: ModernProTemplate },
  { id: 'executive', label: 'Executive',  sub: () => t('tpl.executive.sub'),  color: '#B8973A', Component: ExecutiveTemplate },
  { id: 'cleanats',  label: 'Clean ATS',  sub: () => t('tpl.cleanats.sub'),   color: '#374151', Component: CleanATSTemplate },
];

function scoreColor(n) {
  if (n >= 80) return '#10B981';
  if (n >= 60) return '#F59E0B';
  return '#EF4444';
}

function scoreLabel(n) {
  if (n >= 80) return t('result.excellent');
  if (n >= 60) return t('result.good');
  if (n >= 40) return t('result.fair');
  return t('result.poor');
}

const PLACEMENT_META = {
  skills:     { label: t('edit.skills'),      color: '#4F46E5', bg: '#EEF2FF' },
  summary:    { label: t('edit.summary'),     color: '#0891B2', bg: '#ECFEFF' },
  experience: { label: t('edit.experience'),  color: '#7C3AED', bg: '#F5F3FF' },
};

function normalizeSkill(sk) {
  if (typeof sk === 'string') return { skill: sk, placement: 'skills', suggestion: null, experienceIndex: null };
  return sk;
}

function ScorePanel({ score, missingSkills, addedSkills, onAddSkill }) {
  const [expanded, setExpanded] = useState(false);
  if (score == null) return null;
  const color = scoreColor(score);
  const pct = Math.min(100, Math.max(0, score));
  const skills = (missingSkills || []).map(normalizeSkill);
  const addedCount = skills.filter(s => addedSkills.includes(s.skill)).length;

  return (
    <View style={sp.card}>
      {/* Score row */}
      <View style={sp.row}>
        <View style={[sp.badge, { backgroundColor: color + '18', borderColor: color + '40' }]}>
          <Text style={[sp.scoreNum, { color }]}>{pct}</Text>
          <Text style={[sp.scoreOf, { color }]}>/100</Text>
        </View>
        <View style={sp.right}>
          <Text style={sp.label}>{scoreLabel(pct)}</Text>
          <Text style={sp.sub}>{t('result.scoreLabel')}</Text>
          <View style={sp.barBg}>
            <View style={[sp.barFill, { width: `${pct}%`, backgroundColor: color }]} />
          </View>
        </View>
        {skills.length > 0 && (
          <TouchableOpacity style={sp.toggleBtn} onPress={() => setExpanded(v => !v)} activeOpacity={0.7}>
            <Text style={sp.toggleCount}>{addedCount}/{skills.length}</Text>
            <Text style={sp.toggleLabel}>{t('result.missingSkill')}</Text>
            <Text style={sp.toggleChevron}>{expanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Missing skills — collapsible */}
      {expanded && skills.length > 0 && (
        <View style={sp.missingWrap}>
          {skills.map((item, i) => {
            const added = addedSkills.includes(item.skill);
            const meta = PLACEMENT_META[item.placement] || PLACEMENT_META.skills;
            return (
              <View key={i} style={[sp.skillCard, added && sp.skillCardAdded]}>
                <View style={sp.skillCardTop}>
                  <Text style={[sp.skillName, added && sp.skillNameAdded]}>{item.skill}</Text>
                  <View style={[sp.placementBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[sp.placementText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>
                {item.suggestion && !added && (
                  <Text style={sp.suggestionText} numberOfLines={2}>{item.suggestion}</Text>
                )}
                {added ? (
                  <Text style={sp.addedLabel}>✓ {t('result.added')}</Text>
                ) : (
                  <TouchableOpacity
                    style={[sp.addBtn, { backgroundColor: meta.bg, borderColor: meta.color + '40' }]}
                    onPress={() => onAddSkill(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={[sp.addBtnText, { color: meta.color }]}>
                      + {item.placement === 'experience' ? t('result.addToExp') : item.placement === 'summary' ? t('result.addToSummary') : t('result.addToSkills')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const sp = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  badge: {
    width: 72, height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 1,
  },
  scoreNum: { fontSize: 26, fontWeight: '800' },
  scoreOf: { fontSize: 11, fontWeight: '600', marginTop: 6 },
  right: { flex: 1 },
  label: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  sub: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  barBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },

  toggleBtn: { alignItems: 'center', justifyContent: 'center', paddingLeft: 12 },
  toggleCount: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
  toggleLabel: { fontSize: 9, color: '#9CA3AF', textAlign: 'center', lineHeight: 13 },
  toggleChevron: { fontSize: 9, color: '#9CA3AF', marginTop: 2 },

  missingWrap: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 8 },

  skillCard: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAFAFA',
    gap: 6,
  },
  skillCardAdded: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  skillCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skillName: { fontSize: 14, fontWeight: '700', color: '#111827', flex: 1 },
  skillNameAdded: { color: '#15803D' },
  placementBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  placementText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  suggestionText: { fontSize: 12, color: '#6B7280', lineHeight: 17, fontStyle: 'italic' },
  addBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addBtnText: { fontSize: 12, fontWeight: '600' },
  addedLabel: { fontSize: 12, color: '#16A34A', fontWeight: '600' },
});

export default function ResultScreen({ route, navigation }) {
  const { cvData: initialData, jobDescription } = route.params;
  const [cvData, setCvData] = useState(initialData);
  const [addedSkills, setAddedSkills] = useState([]);
  const [selectedId, setSelectedId] = useState('harvard');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  const openSaveModal = () => {
    const defaultName = jobDescription?.trim().split('\n')[0].slice(0, 48) || 'CV';
    setSaveName(defaultName);
    setSaveModal(true);
  };

  const confirmSave = () => {
    const name = saveName.trim() || 'CV';
    try {
      saveCV({ cvData, jobDescription, name });
      setSaved(true);
      setSaveModal(false);
    } catch (err) {
      Alert.alert(t('alert.error'), err?.message || t('alert.saveFailed'));
    }
  };

  const handleAddSkill = (item) => {
    const { skill, placement, suggestion, experienceIndex } = item;
    setAddedSkills(prev => [...prev, skill]);
    setCvData(prev => {
      if (placement === 'summary') {
        return { ...prev, summary: (prev.summary || '') + ' ' + suggestion };
      }
      if (placement === 'experience') {
        const exp = (prev.experience || []).map((e, idx) => {
          if (idx === (experienceIndex ?? 0)) {
            return { ...e, bullets: [...(e.bullets || []), suggestion] };
          }
          return e;
        });
        return { ...prev, experience: exp };
      }
      // default: skills
      return { ...prev, skills: [...(prev.skills || []), skill] };
    });
  };

  // Pick up edits coming back from EditCVScreen
  useEffect(() => {
    if (route.params?.updatedCvData) {
      setCvData(route.params.updatedCvData);
      navigation.setParams({ updatedCvData: undefined });
    }
  }, [route.params?.updatedCvData]);

  const { Component } = TEMPLATES.find(t => t.id === selectedId);



  const handleShare = async () => {
    if (!hasActiveSubscription()) {
      navigation.navigate('Subscription');
      return;
    }
    setBusy(true);
    try {
      const { uri } = await Print.printToFileAsync({
        html: buildHTML(selectedId, cvData),
        base64: false,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: t('result.shareTitle'),
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      Alert.alert(t('alert.error'), err?.message || t('alert.pdfFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.root}>
      {/* Save name modal */}
      <Modal visible={saveModal} transparent animationType="fade" onRequestClose={() => setSaveModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{t('result.saveTitle')}</Text>
            <Text style={s.modalSub}>{t('result.saveSub')}</Text>
            <TextInput
              style={s.modalInput}
              value={saveName}
              onChangeText={setSaveName}
              placeholder={t('result.savePlaceholder')}
              placeholderTextColor="#9CA3AF"
              autoFocus
              selectTextOnFocus
            />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setSaveModal(false)}>
                <Text style={s.modalCancelText}>{t('result.saveCancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={confirmSave}>
                <Text style={s.modalConfirmText}>{t('result.saveConfirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Template Selector */}
      <View style={s.selectorWrap}>
        <Text style={s.selectorTitle}>{t('result.template')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.selectorRow}
        >
          {TEMPLATES.map(tmpl => {
            const active = selectedId === tmpl.id;
            return (
              <TouchableOpacity
                key={tmpl.id}
                style={[s.chip, active && { backgroundColor: tmpl.color, borderColor: tmpl.color }]}
                onPress={() => setSelectedId(tmpl.id)}
                activeOpacity={0.75}
              >
                <View style={[s.chipDot, { backgroundColor: active ? '#fff' : tmpl.color }]} />
                <Text style={[s.chipLabel, active && { color: '#fff' }]}>{tmpl.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scrollable content: score panel + preview */}
      <ScrollView
        style={s.previewScroll}
        contentContainerStyle={s.previewContent}
        showsVerticalScrollIndicator={false}
      >
        <ScorePanel
          score={cvData.score}
          missingSkills={cvData.missingSkills}
          addedSkills={addedSkills}
          onAddSkill={handleAddSkill}
        />

        <View style={s.previewCard}>
          <Component data={cvData} />
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={s.bar}>
        <TouchableOpacity style={s.barBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={s.barBtnIcon}>←</Text>
          <Text style={s.barBtnText}>{t('result.actionNew')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.barBtn}
          onPress={() => navigation.navigate('EditCV', { cvData, jobDescription })}
        >
          <Text style={s.barBtnIcon}>✎</Text>
          <Text style={s.barBtnText}>{t('result.actionEdit')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.barBtn, saved && s.barBtnSaved]}
          onPress={openSaveModal}
          disabled={saved}
        >
          <Text style={s.barBtnIcon}>{saved ? '✓' : '♡'}</Text>
          <Text style={s.barBtnText}>{saved ? t('result.actionSaved') : t('result.actionSave')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.barBtnPrimary, busy && { opacity: 0.6 }]}
          onPress={handleShare}
          disabled={busy}
        >
          {busy
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.barBtnPrimaryText}>{t('result.actionShare')}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },

  selectorWrap: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: 14,
    paddingBottom: 14,
  },
  selectorTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectorRow: { paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  chipDot: { width: 7, height: 7, borderRadius: 4 },
  chipLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },

  previewScroll: { flex: 1 },
  previewContent: { padding: 16 },
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  barBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 2,
    minWidth: 64,
  },
  barBtnSaved: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  barBtnIcon: { fontSize: 17, color: '#374151' },
  barBtnText: { fontSize: 10, color: '#6B7280', fontWeight: '500' },

  barBtnPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  barBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#6B7280', marginBottom: 18 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FAFAFA',
    marginBottom: 18,
  },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalCancel: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  modalConfirm: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
  },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
