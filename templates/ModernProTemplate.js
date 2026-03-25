import { View, Text, StyleSheet } from 'react-native';

const NAVY = '#0F2D52';
const BLUE = '#1A56A0';
const LIGHT = '#EBF2FB';

export function ModernProTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;

  return (
    <View style={s.page}>
      <View style={s.header}>
        <View style={s.accentBar} />
        <View style={s.headerContent}>
          <Text style={s.name}>{p?.name}</Text>
          {p?.title ? <Text style={s.title}>{p.title}</Text> : null}
          <View style={s.contactRow}>
            {[p?.email, p?.phone, p?.location, p?.linkedin].filter(Boolean).map((item, i, arr) => (
              <Text key={i} style={s.contactItem}>
                {item}{i < arr.length - 1 ? <Text style={s.sep}>  |  </Text> : ''}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View style={s.body}>
        {summary ? (
          <Section title="Profile">
            <Text style={s.para}>{summary}</Text>
          </Section>
        ) : null}

        {experience?.length > 0 && (
          <Section title="Professional Experience">
            {experience.map((exp, i) => (
              <View key={i} style={[s.card, i > 0 && { marginTop: 7 }]}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardPosition}>{exp.position}</Text>
                  <Text style={s.cardDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={s.cardCompany}>{exp.company}</Text>
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
          <Section title="Education">
            {education.map((edu, i) => (
              <View key={i} style={[s.card, i > 0 && { marginTop: 5 }]}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardPosition}>{edu.school}</Text>
                  <Text style={s.cardDate}>{edu.year}</Text>
                </View>
                <Text style={s.cardCompany}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</Text>
              </View>
            ))}
          </Section>
        )}

        {skills?.length > 0 && (
          <Section title="Core Skills">
            <View style={s.skillsWrap}>
              {skills.map((sk, i) => (
                <View key={i} style={s.skillPill}>
                  <Text style={s.skillText}>{sk}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {(languages?.length > 0 || certifications?.length > 0) && (
          <Section title={languages?.length && certifications?.length ? 'Languages & Certifications' : languages?.length ? 'Languages' : 'Certifications'}>
            <Text style={s.para}>
              {[...(languages || []).map(l => `${l.language}${l.level ? ` (${l.level})` : ''}`), ...(certifications || [])].join('  ·  ')}
            </Text>
          </Section>
        )}
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{title}</Text>
        <View style={s.sectionLine} />
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: '#fff' },
  header: { flexDirection: 'row', backgroundColor: NAVY },
  accentBar: { width: 5, backgroundColor: BLUE },
  headerContent: { flex: 1, padding: 14, paddingLeft: 14 },
  name: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  title: { fontSize: 9, color: '#93C5FD', marginTop: 3, fontWeight: '500' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  contactItem: { fontSize: 8, color: '#CBD5E1' },
  sep: { color: '#475569' },

  body: { padding: 14 },
  section: { marginBottom: 9 },
  sectionHead: { marginBottom: 5 },
  sectionTitle: { fontSize: 8, fontWeight: '800', color: NAVY, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 3 },
  sectionLine: { height: 2, backgroundColor: BLUE, width: 28, borderRadius: 1 },

  para: { fontSize: 9, color: '#374151', lineHeight: 14 },
  card: { paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: LIGHT },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardPosition: { fontSize: 10, fontWeight: '700', color: '#111827', flex: 1 },
  cardDate: { fontSize: 8, color: '#6B7280', marginLeft: 6 },
  cardCompany: { fontSize: 9, color: BLUE, fontWeight: '600', marginTop: 1, marginBottom: 2 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 1 },
  bulletArrow: { fontSize: 10, color: BLUE, fontWeight: '700', marginRight: 4, lineHeight: 14 },
  bulletText: { flex: 1, fontSize: 9, color: '#374151', lineHeight: 14 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  skillPill: { backgroundColor: LIGHT, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 2, borderLeftWidth: 2, borderLeftColor: BLUE },
  skillText: { fontSize: 8, color: NAVY, fontWeight: '600' },
});
