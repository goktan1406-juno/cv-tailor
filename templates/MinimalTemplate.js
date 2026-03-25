// ATS dostu - sade, düz metin odaklı
import { View, Text, StyleSheet } from 'react-native';

export function MinimalTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;

  return (
    <View style={s.root}>
      <Text style={s.name}>{p?.name}</Text>
      {p?.title ? <Text style={s.title}>{p.title}</Text> : null}

      <Text style={s.contactLine}>
        {[p?.email, p?.phone, p?.location, p?.linkedin].filter(Boolean).join('  ·  ')}
      </Text>

      <View style={s.divider} />

      {summary ? (
        <Block label="ÖZET">
          <Text style={s.body}>{summary}</Text>
        </Block>
      ) : null}

      {experience?.length > 0 && (
        <Block label="DENEYİM">
          {experience.map((exp, i) => (
            <View key={i} style={s.item}>
              <Text style={s.itemTitle}>{exp.position} | {exp.company}</Text>
              <Text style={s.itemMeta}>{exp.startDate} – {exp.endDate}</Text>
              {exp.bullets?.map((b, j) => (
                <Text key={j} style={s.bullet}>- {b}</Text>
              ))}
            </View>
          ))}
        </Block>
      )}

      {education?.length > 0 && (
        <Block label="EĞİTİM">
          {education.map((edu, i) => (
            <View key={i} style={s.item}>
              <Text style={s.itemTitle}>{edu.degree}{edu.field ? ` - ${edu.field}` : ''}</Text>
              <Text style={s.itemMeta}>{edu.school} | {edu.year}</Text>
            </View>
          ))}
        </Block>
      )}

      {skills?.length > 0 && (
        <Block label="BECERİLER">
          <Text style={s.body}>{skills.join(', ')}</Text>
        </Block>
      )}

      {languages?.length > 0 && (
        <Block label="DİLLER">
          <Text style={s.body}>
            {languages.map(l => `${l.language}${l.level ? ` (${l.level})` : ''}`).join(', ')}
          </Text>
        </Block>
      )}

      {certifications?.length > 0 && (
        <Block label="SERTİFİKALAR">
          {certifications.map((c, i) => (
            <Text key={i} style={s.bullet}>- {c}</Text>
          ))}
        </Block>
      )}
    </View>
  );
}

function Block({ label, children }) {
  return (
    <View style={s.block}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { backgroundColor: '#fff', padding: 20 },
  name: { fontSize: 22, fontWeight: '700', color: '#000' },
  title: { fontSize: 14, color: '#333', marginTop: 2 },
  contactLine: { fontSize: 12, color: '#555', marginTop: 6 },
  divider: { height: 1, backgroundColor: '#000', marginVertical: 14 },
  block: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#000', letterSpacing: 1.2, marginBottom: 6 },
  body: { fontSize: 13, color: '#333', lineHeight: 20 },
  item: { marginBottom: 10 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#000' },
  itemMeta: { fontSize: 12, color: '#555', marginBottom: 4 },
  bullet: { fontSize: 13, color: '#333', lineHeight: 20 },
});
