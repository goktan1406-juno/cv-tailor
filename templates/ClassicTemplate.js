import { View, Text, StyleSheet } from 'react-native';

const DARK = '#111827';
const MID = '#374151';
const GRAY = '#6B7280';

export function ClassicTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.name}>{p?.name}</Text>
        {p?.title ? <Text style={s.title}>{p.title}</Text> : null}
        <View style={s.divider} />
        <View style={s.contactRow}>
          {[p?.email, p?.phone, p?.location, p?.linkedin]
            .filter(Boolean)
            .map((item, i, arr) => (
              <Text key={i} style={s.contact}>
                {item}{i < arr.length - 1 ? '  |  ' : ''}
              </Text>
            ))}
        </View>
      </View>

      <View style={s.body}>
        {summary ? (
          <Section title="ÖZET">
            <Text style={s.bodyText}>{summary}</Text>
          </Section>
        ) : null}

        {experience?.length > 0 && (
          <Section title="İŞ DENEYİMİ">
            {experience.map((exp, i) => (
              <View key={i} style={s.expItem}>
                <View style={s.expHeader}>
                  <Text style={s.expPosition}>{exp.company} — {exp.position}</Text>
                  <Text style={s.expDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                {exp.bullets?.map((b, j) => (
                  <Text key={j} style={s.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section title="EĞİTİM">
            {education.map((edu, i) => (
              <View key={i} style={s.expItem}>
                <View style={s.expHeader}>
                  <Text style={s.expPosition}>{edu.school}</Text>
                  <Text style={s.expDate}>{edu.year}</Text>
                </View>
                <Text style={s.expSub}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
              </View>
            ))}
          </Section>
        )}

        {skills?.length > 0 && (
          <Section title="BECERİLER">
            <Text style={s.bodyText}>{skills.join(' · ')}</Text>
          </Section>
        )}

        {languages?.length > 0 && (
          <Section title="DİLLER">
            <Text style={s.bodyText}>
              {languages.map(l => `${l.language}${l.level ? ` (${l.level})` : ''}`).join(' · ')}
            </Text>
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="SERTİFİKALAR">
            {certifications.map((c, i) => (
              <Text key={i} style={s.bullet}>• {c}</Text>
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
      <View style={s.sectionLine} />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20, backgroundColor: '#fff' },
  name: { fontSize: 26, fontWeight: '700', color: DARK, letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { fontSize: 14, color: MID, marginTop: 4, letterSpacing: 0.5 },
  divider: { width: 60, height: 2, backgroundColor: DARK, marginVertical: 12 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  contact: { fontSize: 11, color: GRAY },
  body: { paddingHorizontal: 20, paddingBottom: 20 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: DARK, letterSpacing: 1.5 },
  sectionLine: { height: 1, backgroundColor: DARK, marginTop: 4, marginBottom: 10 },
  bodyText: { fontSize: 13, color: MID, lineHeight: 20 },
  expItem: { marginBottom: 12 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  expPosition: { fontSize: 13, fontWeight: '700', color: DARK, flex: 1 },
  expDate: { fontSize: 12, color: GRAY, marginLeft: 8 },
  expSub: { fontSize: 12, color: MID, marginTop: 2 },
  bullet: { fontSize: 13, color: MID, lineHeight: 20, marginTop: 3 },
});
