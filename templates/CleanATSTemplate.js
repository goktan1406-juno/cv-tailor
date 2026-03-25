// Ultra-clean, ATS-optimized — no graphics, pure content
import { View, Text, StyleSheet } from 'react-native';

export function CleanATSTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;
  const contact = [p?.email, p?.phone, p?.location, p?.linkedin].filter(Boolean);

  return (
    <View style={s.page}>
      {/* Header */}
      <Text style={s.name}>{p?.name}</Text>
      {p?.title ? <Text style={s.title}>{p.title}</Text> : null}
      <Text style={s.contact}>{contact.join(' | ')}</Text>
      <View style={s.hr} />

      {/* Summary */}
      {summary ? (
        <Block label="SUMMARY">
          <Text style={s.para}>{summary}</Text>
        </Block>
      ) : null}

      {/* Experience */}
      {experience?.length > 0 && (
        <Block label="WORK EXPERIENCE">
          {experience.map((exp, i) => (
            <View key={i} style={s.expItem}>
              <View style={s.expTop}>
                <Text style={s.expPos}>{exp.position}</Text>
                <Text style={s.expDate}>{exp.startDate} – {exp.endDate}</Text>
              </View>
              <Text style={s.expCo}>{exp.company}</Text>
              {exp.bullets?.map((b, j) => (
                <Text key={j} style={s.bullet}>• {b}</Text>
              ))}
            </View>
          ))}
        </Block>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <Block label="EDUCATION">
          {education.map((edu, i) => (
            <View key={i} style={s.expItem}>
              <View style={s.expTop}>
                <Text style={s.expPos}>{edu.school}</Text>
                <Text style={s.expDate}>{edu.year}</Text>
              </View>
              <Text style={s.expCo}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
            </View>
          ))}
        </Block>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <Block label="TECHNICAL SKILLS">
          <Text style={s.para}>{skills.join(' • ')}</Text>
        </Block>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <Block label="LANGUAGES">
          <Text style={s.para}>
            {languages.map(l => `${l.language}${l.level ? ` (${l.level})` : ''}`).join(' • ')}
          </Text>
        </Block>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <Block label="CERTIFICATIONS">
          {certifications.map((c, i) => (
            <Text key={i} style={s.bullet}>• {c}</Text>
          ))}
        </Block>
      )}
    </View>
  );
}

function Block({ label, children }) {
  return (
    <View style={s.block}>
      <Text style={s.blockLabel}>{label}</Text>
      <View style={s.blockLine} />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: '#fff', padding: 18 },
  name: { fontSize: 17, fontWeight: '700', color: '#000', letterSpacing: 0.3 },
  title: { fontSize: 9, color: '#333', marginTop: 2 },
  contact: { fontSize: 8, color: '#444', marginTop: 4, lineHeight: 13 },
  hr: { height: 1.5, backgroundColor: '#000', marginTop: 8, marginBottom: 10 },

  block: { marginBottom: 8 },
  blockLabel: { fontSize: 8, fontWeight: '700', color: '#000', letterSpacing: 1.2 },
  blockLine: { height: 1, backgroundColor: '#000', marginTop: 3, marginBottom: 5, opacity: 0.25 },

  para: { fontSize: 9, color: '#222', lineHeight: 14 },
  expItem: { marginBottom: 7 },
  expTop: { flexDirection: 'row', justifyContent: 'space-between' },
  expPos: { fontSize: 10, fontWeight: '700', color: '#000', flex: 1 },
  expDate: { fontSize: 8, color: '#444', marginLeft: 6 },
  expCo: { fontSize: 9, color: '#444', marginTop: 1, marginBottom: 2 },
  bullet: { fontSize: 9, color: '#222', lineHeight: 14, marginTop: 1 },
});
