import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { t } from '../services/i18n';

const ACCENT = '#4F46E5';

// ─── tiny helpers ────────────────────────────────────────────────────────────
function Field({ label, value, onChangeText, multiline, placeholder }) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
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

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function EditCVScreen({ route, navigation }) {
  const { cvData: initial, jobDescription } = route.params;
  const [d, setD] = useState(() => JSON.parse(JSON.stringify(initial))); // deep clone

  const setP = useCallback((key, val) =>
    setD(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [key]: val } })), []);

  const setExp = useCallback((i, key, val) =>
    setD(prev => {
      const exp = prev.experience.map((e, idx) => idx === i ? { ...e, [key]: val } : e);
      return { ...prev, experience: exp };
    }), []);

  const setBullet = useCallback((expIdx, bIdx, val) =>
    setD(prev => {
      const exp = prev.experience.map((e, i) => {
        if (i !== expIdx) return e;
        const bullets = e.bullets.map((b, j) => j === bIdx ? val : b);
        return { ...e, bullets };
      });
      return { ...prev, experience: exp };
    }), []);

  const removeBullet = useCallback((expIdx, bIdx) =>
    setD(prev => {
      const exp = prev.experience.map((e, i) => {
        if (i !== expIdx) return e;
        return { ...e, bullets: e.bullets.filter((_, j) => j !== bIdx) };
      });
      return { ...prev, experience: exp };
    }), []);

  const addBullet = useCallback((expIdx) =>
    setD(prev => {
      const exp = prev.experience.map((e, i) =>
        i === expIdx ? { ...e, bullets: [...(e.bullets || []), ''] } : e
      );
      return { ...prev, experience: exp };
    }), []);

  const setEdu = useCallback((i, key, val) =>
    setD(prev => {
      const education = prev.education.map((e, idx) => idx === i ? { ...e, [key]: val } : e);
      return { ...prev, education };
    }), []);

  const handleSave = () => {
    navigation.navigate('Result', { cvData: d, jobDescription, updatedCvData: d });
  };

  const p = d.personalInfo || {};

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* Personal Info */}
        <SectionHeader title={t('edit.personal')} />
        <Field label={t('edit.name')} value={p.name} onChangeText={v => setP('name', v)} />
        <Field label={t('edit.title')} value={p.title} onChangeText={v => setP('title', v)} />
        <Field label={t('edit.email')} value={p.email} onChangeText={v => setP('email', v)} />
        <Field label={t('edit.phone')} value={p.phone} onChangeText={v => setP('phone', v)} />
        <Field label={t('edit.location')} value={p.location} onChangeText={v => setP('location', v)} />
        <Field label="LinkedIn" value={p.linkedin} onChangeText={v => setP('linkedin', v)} />

        {/* Summary */}
        <SectionHeader title={t('edit.summary')} />
        <Field
          label={t('edit.summaryLabel')}
          value={d.summary}
          onChangeText={v => setD(prev => ({ ...prev, summary: v }))}
          multiline
        />

        {/* Experience */}
        {d.experience?.length > 0 && (
          <>
            <SectionHeader title={t('edit.experience')} />
            {d.experience.map((exp, i) => (
              <View key={i} style={s.expCard}>
                <View style={s.expNum}><Text style={s.expNumText}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Field label={t('edit.position')} value={exp.position} onChangeText={v => setExp(i, 'position', v)} />
                  <Field label={t('edit.company')} value={exp.company} onChangeText={v => setExp(i, 'company', v)} />
                  <View style={s.dateRow}>
                    <View style={{ flex: 1 }}>
                      <Field label={t('edit.startDate')} value={exp.startDate} onChangeText={v => setExp(i, 'startDate', v)} />
                    </View>
                    <View style={s.dateSep} />
                    <View style={{ flex: 1 }}>
                      <Field label={t('edit.endDate')} value={exp.endDate} onChangeText={v => setExp(i, 'endDate', v)} />
                    </View>
                  </View>
                  <Text style={s.bulletsLabel}>{t('edit.bullets')}</Text>
                  {(exp.bullets || []).map((b, j) => (
                    <View key={j} style={s.bulletRow}>
                      <TextInput
                        style={s.bulletInput}
                        value={b}
                        onChangeText={v => setBullet(i, j, v)}
                        multiline
                        textAlignVertical="top"
                        placeholder={`Madde ${j + 1}`}
                        placeholderTextColor="#9CA3AF"
                      />
                      <TouchableOpacity style={s.bulletDel} onPress={() => removeBullet(i, j)}>
                        <Text style={s.bulletDelText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={s.addBulletBtn} onPress={() => addBullet(i)}>
                    <Text style={s.addBulletText}>{t('edit.addBullet')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {d.education?.length > 0 && (
          <>
            <SectionHeader title={t('edit.education')} />
            {d.education.map((edu, i) => (
              <View key={i} style={s.expCard}>
                <View style={s.expNum}><Text style={s.expNumText}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Field label={t('edit.school')} value={edu.school} onChangeText={v => setEdu(i, 'school', v)} />
                  <Field label={t('edit.degree')} value={edu.degree} onChangeText={v => setEdu(i, 'degree', v)} />
                  <Field label={t('edit.field')} value={edu.field} onChangeText={v => setEdu(i, 'field', v)} />
                  <Field label={t('edit.year')} value={edu.year} onChangeText={v => setEdu(i, 'year', v)} />
                </View>
              </View>
            ))}
          </>
        )}

        {/* Skills */}
        <SectionHeader title={t('edit.skills')} />
        <TagList
          items={d.skills || []}
          onChange={v => setD(prev => ({ ...prev, skills: v }))}
          placeholder="Beceri ekle..."
        />

        {/* Languages */}
        <SectionHeader title={t('edit.languages')} />
        {(d.languages || []).map((lang, i) => (
          <View key={i} style={s.dateRow}>
            <View style={{ flex: 1 }}>
              <Field
                label={t('edit.language')}
                value={lang.language}
                onChangeText={v => setD(prev => {
                  const languages = prev.languages.map((l, idx) => idx === i ? { ...l, language: v } : l);
                  return { ...prev, languages };
                })}
              />
            </View>
            <View style={s.dateSep} />
            <View style={{ flex: 1 }}>
              <Field
                label={t('edit.level')}
                value={lang.level}
                onChangeText={v => setD(prev => {
                  const languages = prev.languages.map((l, idx) => idx === i ? { ...l, level: v } : l);
                  return { ...prev, languages };
                })}
              />
            </View>
          </View>
        ))}

        {/* Certifications */}
        {d.certifications?.length > 0 && (
          <>
            <SectionHeader title={t('edit.certifications')} />
            <TagList
              items={d.certifications || []}
              onChange={v => setD(prev => ({ ...prev, certifications: v }))}
              placeholder="Sertifika ekle..."
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Save bar */}
      <View style={s.saveBar}>
        <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={s.cancelText}>{t('edit.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
          <Text style={s.saveText}>{t('edit.save')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },

  expCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  expNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  expNumText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  dateRow: { flexDirection: 'row', gap: 8 },
  dateSep: { width: 1 },

  bulletsLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#fff',
    minHeight: 48,
  },
  bulletDel: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  bulletDelText: { fontSize: 11, color: '#EF4444', fontWeight: '700' },
  addBulletBtn: { alignSelf: 'flex-start', marginTop: 2, marginBottom: 4 },
  addBulletText: { fontSize: 13, color: ACCENT, fontWeight: '600' },

  saveBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
