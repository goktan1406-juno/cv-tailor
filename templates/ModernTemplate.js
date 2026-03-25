import { View, Text, StyleSheet } from 'react-native';

const BLUE = '#2563EB';
const DARK = '#1E293B';
const GRAY = '#64748B';
const LIGHT = '#EFF6FF';

export function ModernTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.name}>{p?.name}</Text>
        {p?.title ? <Text style={s.title}>{p.title}</Text> : null}
        <View style={s.contactRow}>
          {p?.email ? <Text style={s.contact}>{p.email}</Text> : null}
          {p?.phone ? <Text style={s.contactSep}>·</Text> : null}
          {p?.phone ? <Text style={s.contact}>{p.phone}</Text> : null}
          {p?.location ? <Text style={s.contactSep}>·</Text> : null}
          {p?.location ? <Text style={s.contact}>{p.location}</Text> : null}
        </View>
        {p?.linkedin ? <Text style={s.contactLink}>{p.linkedin}</Text> : null}
      </View>

      <View style={s.body}>
        {/* Özet */}
        {summary ? (
          <Section title="Profesyonel Özet">
            <Text style={s.bodyText}>{summary}</Text>
          </Section>
        ) : null}

        {/* Deneyim */}
        {experience?.length > 0 && (
          <Section title="İş Deneyimi">
            {experience.map((exp, i) => (
              <View key={i} style={s.expItem}>
                <View style={s.expHeader}>
                  <Text style={s.expPosition}>{exp.position}</Text>
                  <Text style={s.expDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={s.expCompany}>{exp.company}</Text>
                {exp.bullets?.map((b, j) => (
                  <View key={j} style={s.bulletRow}>
                    <View style={s.bulletDot} />
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Eğitim */}
        {education?.length > 0 && (
          <Section title="Eğitim">
            {education.map((edu, i) => (
              <View key={i} style={s.eduItem}>
                <View style={s.expHeader}>
                  <Text style={s.expPosition}>{edu.degree} – {edu.field}</Text>
                  <Text style={s.expDate}>{edu.year}</Text>
                </View>
                <Text style={s.expCompany}>{edu.school}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Beceriler */}
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

        {/* Diller */}
        {languages?.length > 0 && (
          <Section title="Diller">
            {languages.map((l, i) => (
              <Text key={i} style={s.bodyText}>
                {l.language}
                {l.level ? ` — ${l.level}` : ''}
              </Text>
            ))}
          </Section>
        )}

        {/* Sertifikalar */}
        {certifications?.length > 0 && (
          <Section title="Sertifikalar">
            {certifications.map((c, i) => (
              <View key={i} style={s.bulletRow}>
                <View style={s.bulletDot} />
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
      <View style={s.sectionTitleRow}>
        <View style={s.sectionAccent} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { backgroundColor: '#fff' },
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  name: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  title: { fontSize: 14, color: '#BFDBFE', marginTop: 4, fontWeight: '500' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, alignItems: 'center' },
  contact: { fontSize: 12, color: '#DBEAFE' },
  contactSep: { fontSize: 12, color: '#BFDBFE', marginHorizontal: 6 },
  contactLink: { fontSize: 12, color: '#BFDBFE', marginTop: 4 },
  body: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionAccent: { width: 4, height: 18, backgroundColor: BLUE, borderRadius: 2, marginRight: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: DARK, textTransform: 'uppercase', letterSpacing: 1 },
  bodyText: { fontSize: 13, color: GRAY, lineHeight: 20 },
  expItem: { marginBottom: 14 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expPosition: { fontSize: 14, fontWeight: '700', color: DARK, flex: 1 },
  expDate: { fontSize: 12, color: GRAY, marginLeft: 8 },
  expCompany: { fontSize: 13, color: BLUE, fontWeight: '600', marginTop: 2, marginBottom: 6 },
  eduItem: { marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: BLUE, marginTop: 7, marginRight: 8 },
  bulletText: { flex: 1, fontSize: 13, color: GRAY, lineHeight: 19 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { backgroundColor: LIGHT, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  skillText: { fontSize: 12, color: BLUE, fontWeight: '600' },
});
