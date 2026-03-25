import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { tailorCV } from '../services/api';
import { loadCredits, deductCredit } from '../services/credits';
import { useFocusEffect } from '@react-navigation/native';
import { t } from '../services/i18n';

const ACCENT = '#4F46E5';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Field({ label, value, onChangeText, multiline, placeholder, hint }) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      {hint && <Text style={f.hint}>{hint}</Text>}
      <TextInput
        style={[f.input, multiline && f.multiline]}
        value={value ?? ''}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ''}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}
const f = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '600', color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.6 },
  hint: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: '#111827', backgroundColor: '#FAFAFA' },
  multiline: { minHeight: 80, paddingTop: 10 },
});

function SectionHeader({ title }) {
  return <Text style={sh.title}>{title}</Text>;
}
const sh = StyleSheet.create({
  title: { fontSize: 13, fontWeight: '800', color: '#111827', marginTop: 20, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1.5, borderBottomColor: '#EEF2FF' },
});

function TagList({ items, onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft('');
  };
  return (
    <View>
      <View style={tl.chips}>
        {items.map((item, i) => (
          <View key={i} style={tl.chip}>
            <Text style={tl.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => onChange(items.filter((_, j) => j !== i))} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
              <Text style={tl.x}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={tl.row}>
        <TextInput
          style={tl.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={tl.addBtn} onPress={add}>
          <Text style={tl.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const tl = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontSize: 13, color: ACCENT, fontWeight: '500' },
  x: { fontSize: 11, color: '#9CA3AF', fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#111827', backgroundColor: '#FAFAFA' },
  addBtn: { width: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: ACCENT, borderRadius: 10 },
  addText: { fontSize: 20, color: '#fff', fontWeight: '300' },
});

function AddButton({ label, onPress }) {
  return (
    <TouchableOpacity style={ab.btn} onPress={onPress} activeOpacity={0.7}>
      <Text style={ab.text}>+ {label}</Text>
    </TouchableOpacity>
  );
}
const ab = StyleSheet.create({
  btn: { borderWidth: 1.5, borderColor: '#E0E7FF', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  text: { fontSize: 13, fontWeight: '600', color: ACCENT },
});

const BLANK_EXP = () => ({ company: '', position: '', startDate: '', endDate: '', bullets: [''] });
const BLANK_EDU = () => ({ school: '', degree: '', field: '', year: '' });
const BLANK_LANG = () => ({ language: '', level: '' });

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function CreateCVScreen({ navigation }) {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({ name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' });
  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState([BLANK_EXP()]);
  const [education, setEducation] = useState([BLANK_EDU()]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([BLANK_LANG()]);
  const [certifications, setCertifications] = useState([]);
  const [jobDescription, setJobDescription] = useState('');

  useFocusEffect(useCallback(() => {
    loadCredits().then(d => setCredits(d.credits));
  }, []));

  const setP = (key, val) => setPersonalInfo(prev => ({ ...prev, [key]: val }));

  const setExp = (i, key, val) => setExperience(prev =>
    prev.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const setBullet = (expIdx, bIdx, val) => setExperience(prev =>
    prev.map((e, i) => i !== expIdx ? e : { ...e, bullets: e.bullets.map((b, j) => j === bIdx ? val : b) }));

  const removeBullet = (expIdx, bIdx) => setExperience(prev =>
    prev.map((e, i) => i !== expIdx ? e : { ...e, bullets: e.bullets.filter((_, j) => j !== bIdx) }));

  const addBullet = (expIdx) => setExperience(prev =>
    prev.map((e, i) => i === expIdx ? { ...e, bullets: [...e.bullets, ''] } : e));

  const removeExp = (i) => setExperience(prev => prev.filter((_, idx) => idx !== i));

  const setEdu = (i, key, val) => setEducation(prev =>
    prev.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const removeEdu = (i) => setEducation(prev => prev.filter((_, idx) => idx !== i));

  const setLang = (i, key, val) => setLanguages(prev =>
    prev.map((l, idx) => idx === i ? { ...l, [key]: val } : l));

  const removeLang = (i) => setLanguages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!personalInfo.name.trim()) {
      Alert.alert(t('alert.nameRequired'), t('alert.nameRequiredMsg'));
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

    const cvData = { personalInfo, summary, experience, education, skills, languages, certifications };
    const cvText = JSON.stringify(cvData);

    setLoading(true);
    try {
      const result = await tailorCV({ cvText, jobDescription });
      navigation.navigate('Result', { cvData: result, jobDescription });
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || t('alert.unexpectedError');
      Alert.alert(t('alert.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Personal Info */}
        <SectionHeader title={t('edit.personal')} />
        <Field label={t('edit.name')} value={personalInfo.name} onChangeText={v => setP('name', v)} placeholder={t('create.namePlaceholder')} />
        <Field label={t('edit.title')} value={personalInfo.title} onChangeText={v => setP('title', v)} placeholder={t('create.titlePlaceholder')} />
        <Field label={t('edit.email')} value={personalInfo.email} onChangeText={v => setP('email', v)} placeholder={t('create.emailPlaceholder')} />
        <Field label={t('edit.phone')} value={personalInfo.phone} onChangeText={v => setP('phone', v)} placeholder={t('create.phonePlaceholder')} />
        <Field label={t('edit.location')} value={personalInfo.location} onChangeText={v => setP('location', v)} placeholder={t('create.locationPlaceholder')} />
        <Field label="LinkedIn" value={personalInfo.linkedin} onChangeText={v => setP('linkedin', v)} placeholder={t('create.linkedinPlaceholder')} />

        {/* Summary */}
        <SectionHeader title={t('edit.summary')} />
        <Field
          label={t('edit.summaryLabel')}
          value={summary}
          onChangeText={setSummary}
          multiline
          placeholder={t('create.summaryPlaceholder')}
          hint={t('create.summaryHint')}
        />

        {/* Experience */}
        <SectionHeader title={t('edit.experience')} />
        {experience.map((exp, i) => (
          <View key={i} style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.expNum}><Text style={s.expNumText}>{i + 1}</Text></View>
              <Text style={s.cardTitle}>{exp.position || exp.company || `${t('create.expN')} ${i + 1}`}</Text>
              {experience.length > 1 && (
                <TouchableOpacity onPress={() => removeExp(i)} style={s.removeBtn}>
                  <Text style={s.removeBtnText}>{t('create.remove')}</Text>
                </TouchableOpacity>
              )}
            </View>
            <Field label={t('edit.position')} value={exp.position} onChangeText={v => setExp(i, 'position', v)} placeholder={t('create.positionPlaceholder')} />
            <Field label={t('edit.company')} value={exp.company} onChangeText={v => setExp(i, 'company', v)} placeholder={t('create.companyPlaceholder')} />
            <View style={s.dateRow}>
              <View style={{ flex: 1 }}>
                <Field label={t('edit.startDate')} value={exp.startDate} onChangeText={v => setExp(i, 'startDate', v)} placeholder={t('create.startPlaceholder')} />
              </View>
              <View style={{ width: 8 }} />
              <View style={{ flex: 1 }}>
                <Field label={t('edit.endDate')} value={exp.endDate} onChangeText={v => setExp(i, 'endDate', v)} placeholder={t('create.endPlaceholder')} />
              </View>
            </View>
            <Text style={s.bulletsLabel}>{t('create.bulletsLabel')}</Text>
            {exp.bullets.map((b, j) => (
              <View key={j} style={s.bulletRow}>
                <TextInput
                  style={s.bulletInput}
                  value={b}
                  onChangeText={v => setBullet(i, j, v)}
                  multiline
                  textAlignVertical="top"
                  placeholder={t('create.bulletPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                />
                {exp.bullets.length > 1 && (
                  <TouchableOpacity style={s.bulletDel} onPress={() => removeBullet(i, j)}>
                    <Text style={s.bulletDelText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={s.addBulletBtn} onPress={() => addBullet(i)}>
              <Text style={s.addBulletText}>{t('create.addBullet')}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <AddButton label={t('create.addExp')} onPress={() => setExperience(prev => [...prev, BLANK_EXP()])} />

        {/* Education */}
        <SectionHeader title={t('edit.education')} />
        {education.map((edu, i) => (
          <View key={i} style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.expNum}><Text style={s.expNumText}>{i + 1}</Text></View>
              <Text style={s.cardTitle}>{edu.school || `${t('create.eduN')} ${i + 1}`}</Text>
              {education.length > 1 && (
                <TouchableOpacity onPress={() => removeEdu(i)} style={s.removeBtn}>
                  <Text style={s.removeBtnText}>{t('create.remove')}</Text>
                </TouchableOpacity>
              )}
            </View>
            <Field label={t('edit.school')} value={edu.school} onChangeText={v => setEdu(i, 'school', v)} placeholder={t('create.schoolPlaceholder')} />
            <Field label={t('edit.degree')} value={edu.degree} onChangeText={v => setEdu(i, 'degree', v)} placeholder={t('create.degreePlaceholder')} />
            <Field label={t('edit.field')} value={edu.field} onChangeText={v => setEdu(i, 'field', v)} placeholder={t('create.fieldPlaceholder')} />
            <Field label={t('edit.year')} value={edu.year} onChangeText={v => setEdu(i, 'year', v)} placeholder={t('create.yearPlaceholder')} />
          </View>
        ))}
        <AddButton label={t('create.addEdu')} onPress={() => setEducation(prev => [...prev, BLANK_EDU()])} />

        {/* Skills */}
        <SectionHeader title={t('edit.skills')} />
        <TagList items={skills} onChange={setSkills} placeholder={t('create.skillsPlaceholder')} />

        {/* Languages */}
        <SectionHeader title={t('edit.languages')} />
        {languages.map((lang, i) => (
          <View key={i} style={s.langRow}>
            <View style={{ flex: 2 }}>
              <Field label={t('edit.language')} value={lang.language} onChangeText={v => setLang(i, 'language', v)} placeholder={t('create.langPlaceholder')} />
            </View>
            <View style={{ width: 8 }} />
            <View style={{ flex: 2 }}>
              <Field label={t('edit.level')} value={lang.level} onChangeText={v => setLang(i, 'level', v)} placeholder={t('create.levelPlaceholder')} />
            </View>
            {languages.length > 1 && (
              <TouchableOpacity style={s.langDel} onPress={() => removeLang(i)}>
                <Text style={s.langDelText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <AddButton label={t('create.addLang')} onPress={() => setLanguages(prev => [...prev, BLANK_LANG()])} />

        {/* Certifications */}
        <SectionHeader title={t('edit.certifications')} />
        <TagList items={certifications} onChange={setCertifications} placeholder={t('create.certPlaceholder')} />

        {/* Job Description */}
        <SectionHeader title={t('home.jobDesc')} />
        <TextInput
          style={s.jobInput}
          multiline
          placeholder={t('create.jobDescPlaceholder')}
          placeholderTextColor="#9CA3AF"
          value={jobDescription}
          onChangeText={setJobDescription}
          textAlignVertical="top"
        />
        {jobDescription.length > 0 && (
          <Text style={s.charCount}>{jobDescription.length} {t('home.chars')}</Text>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* CTA bar */}
      <View style={s.bar}>
        <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={s.cancelText}>{t('create.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.submitText}>{t('create.submit')}</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },

  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
  expNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  expNumText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  removeBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#FEF2F2' },
  removeBtnText: { fontSize: 11, color: '#EF4444', fontWeight: '600' },

  dateRow: { flexDirection: 'row' },
  langRow: { flexDirection: 'row', alignItems: 'flex-start' },
  langDel: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  langDelText: { fontSize: 11, color: '#EF4444', fontWeight: '700' },

  bulletsLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletInput: {
    flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 7, fontSize: 13, color: '#111827',
    backgroundColor: '#fff', minHeight: 48,
  },
  bulletDel: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  bulletDelText: { fontSize: 11, color: '#EF4444', fontWeight: '700' },
  addBulletBtn: { alignSelf: 'flex-start', marginTop: 2, marginBottom: 4 },
  addBulletText: { fontSize: 13, color: ACCENT, fontWeight: '600' },

  jobInput: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 14, fontSize: 14, color: '#111827', lineHeight: 22,
    height: 140, backgroundColor: '#FAFAFA',
  },
  charCount: { fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 6 },

  bar: {
    flexDirection: 'row', gap: 10, padding: 16,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  submitBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: ACCENT, alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  submitText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
