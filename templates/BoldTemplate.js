import { View, Text, StyleSheet } from 'react-native';

const NAVY = '#0F172A';
const ACCENT = '#38BDF8';
const WHITE = '#F8FAFC';
const LIGHT_GRAY = '#94A3B8';

export function BoldTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;

  return (
    <View style={s.root}>
      {/* Koyu Header */}
      <View style={s.header}>
        <Text style={s.name}>{p?.name}</Text>
        {p?.title ? <Text style={s.title}>{p.title}</Text> : null}
        <View style={s.accentBar} />
        <View style={s.contactWrap}>
          {p?.email ? (
            <Text style={s.contactItem}>✉  {p.email}</Text>
          ) : null}
          {p?.phone ? (
            <Text style={s.contactItem}>✆  {p.phone}</Text>
          ) : null}
          {p?.location ? (
            <Text style={s.contactItem}>⌖  {p.location}</Text>
          ) : null}
          {p?.linkedin ? (
            <Text style={s.contactItem}>in  {p.linkedin}</Text>
          ) : null}
        </View>
      </View>

      <View style={s.body}>
        {summary ? (
          <Section title="Özet">
            <Text style={s.bodyText}>{summary}</Text>
          </Section>
        ) : null}

        {experience?.length > 0 && (
          <Section title="Deneyim">
            {experience.map((exp, i) => (
              <View key={i} style={s.expItem}>
                <Text style={s.expPosition}>{exp.position}</Text>
                <View style={s.expMeta}>
                  <Text style={s.expCompany}>{exp.company}</Text>
                  <Text style={s.expDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                {exp.bullets?.map((b, j) => (
                  <View key={j} style={s.bulletRow}>
                    <Text style={s.bulletArrow}>›</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section title="Eğitim">
            {education.map((edu, i) => (
              <View key={i} style={s.expItem}>
                <Text style={s.expPosition}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</Text>
                <View style={s.expMeta}>
                  <Text style={s.expCompany}>{edu.school}</Text>
                  <Text style={s.expDate}>{edu.year}</Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        {skills?.length > 0 && (
          <Section title="Beceriler">
            <View style={s.skillsWrap}>
              {skills.map((sk, i) => (
                <View key={i} style={s.skillChip}>
                  <Text style={s.skillText}>{sk}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {languages?.length > 0 && (
          <Section title="Diller">
            <View style={s.skillsWrap}>
              {languages.map((l, i) => (
                <View key={i} style={[s.skillChip, { borderColor: ACCENT }]}>
                  <Text style={s.skillText}>{l.language}{l.level ? ` · ${l.level}` : ''}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="Sertifikalar">
            {certifications.map((c, i) => (
              <View key={i} style={s.bulletRow}>
                <Text style={s.bulletArrow}>›</Text>
                <Text style={s.bulletText}>{c}</Text>
              </View>
            ))}
          </Section>
        )}
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={s.sectionLine} />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { backgroundColor: WHITE },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  name: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 0.8 },
  title: { fontSize: 14, color: ACCENT, marginTop: 4, fontWeight: '600' },
  accentBar: { width: 40, height: 3, backgroundColor: ACCENT, borderRadius: 2, marginVertical: 12 },
  contactWrap: { gap: 4 },
  contactItem: { fontSize: 12, color: LIGHT_GRAY },
  body: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: NAVY, letterSpacing: 1.5 },
  sectionLine: { height: 2, backgroundColor: NAVY, marginTop: 5, marginBottom: 12, opacity: 0.15 },
  bodyText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  expItem: { marginBottom: 14 },
  expPosition: { fontSize: 14, fontWeight: '700', color: NAVY },
  expMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginBottom: 6 },
  expCompany: { fontSize: 13, color: ACCENT, fontWeight: '600' },
  expDate: { fontSize: 12, color: LIGHT_GRAY },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 3 },
  bulletArrow: { color: ACCENT, fontWeight: '700', fontSize: 16, marginRight: 6, lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 20 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    borderWidth: 1,
    borderColor: NAVY,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillText: { fontSize: 12, color: NAVY, fontWeight: '600' },
});
