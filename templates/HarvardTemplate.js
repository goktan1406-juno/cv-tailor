import { View, Text, StyleSheet } from 'react-native';

export function HarvardTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;
  const contact = [p?.email, p?.phone, p?.location, p?.linkedin].filter(Boolean);

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{p?.name}</Text>
        {p?.title ? <Text style={s.jobTitle}>{p.title}</Text> : null}
        <Text style={s.contact}>{contact.join('  ·  ')}</Text>
      </View>

      <View style={s.rule} />

      <View style={s.body}>
        {summary ? (
          <Section title="PROFESSIONAL SUMMARY">
            <Text style={s.para}>{summary}</Text>
          </Section>
        ) : null}

        {experience?.length > 0 && (
          <Section title="EXPERIENCE">
            {experience.map((exp, i) => (
              <View key={i} style={s.expBlock}>
                <View style={s.expRow}>
                  <Text style={s.expPosition}>{exp.position}</Text>
                  <Text style={s.expDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={s.expCompany}>{exp.company}</Text>
                {exp.bullets?.map((b, j) => (
                  <View key={j} style={s.bulletRow}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section title="EDUCATION">
            {education.map((edu, i) => (
              <View key={i} style={s.expBlock}>
                <View style={s.expRow}>
                  <Text style={s.expPosition}>{edu.school}</Text>
                  <Text style={s.expDate}>{edu.year}</Text>
                </View>
                <Text style={s.expCompany}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
              </View>
            ))}
          </Section>
        )}

        {skills?.length > 0 && (
          <Section title="SKILLS">
            <Text style={s.para}>{skills.join('  ·  ')}</Text>
          </Section>
        )}

        {languages?.length > 0 && (
          <Section title="LANGUAGES">
            <Text style={s.para}>
              {languages.map(l => `${l.language}${l.level ? ` (${l.level})` : ''}`).join('  ·  ')}
            </Text>
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="CERTIFICATIONS">
            {certifications.map((c, i) => (
              <View key={i} style={s.bulletRow}>
                <Text style={s.bulletDot}>•</Text>
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
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionRule} />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: '#fff', padding: 18 },
  header: { alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', letterSpacing: 1, textTransform: 'uppercase' },
  jobTitle: { fontSize: 10, color: '#444', marginTop: 3, letterSpacing: 0.5 },
  contact: { fontSize: 8, color: '#555', marginTop: 5, textAlign: 'center', lineHeight: 13 },
  rule: { height: 2, backgroundColor: '#1a1a1a', marginBottom: 10 },
  body: {},
  section: { marginBottom: 8 },
  sectionTitle: { fontSize: 8, fontWeight: '700', color: '#1a1a1a', letterSpacing: 1.5, marginBottom: 3 },
  sectionRule: { height: 1, backgroundColor: '#ccc', marginBottom: 6 },
  para: { fontSize: 9, color: '#333', lineHeight: 14 },
  expBlock: { marginBottom: 7 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expPosition: { fontSize: 10, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  expDate: { fontSize: 8, color: '#555', marginLeft: 6 },
  expCompany: { fontSize: 9, color: '#555', fontStyle: 'italic', marginTop: 1, marginBottom: 3 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 1 },
  bulletDot: { fontSize: 9, color: '#333', marginRight: 5, lineHeight: 14 },
  bulletText: { flex: 1, fontSize: 9, color: '#333', lineHeight: 14 },
});
