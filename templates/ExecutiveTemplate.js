import { View, Text, StyleSheet } from 'react-native';

const CHARCOAL = '#1C1C1E';
const GOLD = '#B8973A';
const STONE = '#F5F4F0';
const MID = '#4A4A4A';

export function ExecutiveTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = data;

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{p?.name}</Text>
        <View style={s.goldRule} />
        {p?.title ? <Text style={s.title}>{p.title}</Text> : null}
        <View style={s.contactGrid}>
          {p?.email ? <ContactItem label="Email" value={p.email} /> : null}
          {p?.phone ? <ContactItem label="Phone" value={p.phone} /> : null}
          {p?.location ? <ContactItem label="Location" value={p.location} /> : null}
          {p?.linkedin ? <ContactItem label="LinkedIn" value={p.linkedin} /> : null}
        </View>
      </View>

      <View style={s.body}>
        {summary ? (
          <Section title="Executive Summary">
            <Text style={s.para}>{summary}</Text>
          </Section>
        ) : null}

        {experience?.length > 0 && (
          <Section title="Career History">
            {experience.map((exp, i) => (
              <View key={i} style={s.expItem}>
                <View style={s.expLeft}>
                  <Text style={s.expDate}>{exp.startDate}</Text>
                  <View style={s.timeline} />
                  <Text style={s.expDate}>{exp.endDate}</Text>
                </View>
                <View style={s.expRight}>
                  <Text style={s.expPosition}>{exp.position}</Text>
                  <Text style={s.expCompany}>{exp.company}</Text>
                  {exp.bullets?.map((b, j) => (
                    <View key={j} style={s.bulletRow}>
                      <View style={s.bulletSquare} />
                      <Text style={s.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <View key={i} style={s.eduRow}>
                <Text style={s.eduYear}>{edu.year}</Text>
                <View style={s.eduDetails}>
                  <Text style={s.expPosition}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                  <Text style={s.expCompany}>{edu.school}</Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        <View style={s.twoCol}>
          {skills?.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={s.colTitle}>Core Competencies</Text>
              <View style={s.goldRule2} />
              {skills.map((sk, i) => (
                <View key={i} style={s.compRow}>
                  <View style={s.compDot} />
                  <Text style={s.compText}>{sk}</Text>
                </View>
              ))}
            </View>
          )}
          {(languages?.length > 0 || certifications?.length > 0) && (
            <View style={{ flex: 1, marginLeft: 14 }}>
              {languages?.length > 0 && (
                <>
                  <Text style={s.colTitle}>Languages</Text>
                  <View style={s.goldRule2} />
                  {languages.map((l, i) => (
                    <View key={i} style={s.compRow}>
                      <View style={s.compDot} />
                      <Text style={s.compText}>{l.language}{l.level ? ` · ${l.level}` : ''}</Text>
                    </View>
                  ))}
                </>
              )}
              {certifications?.length > 0 && (
                <>
                  <Text style={[s.colTitle, { marginTop: 8 }]}>Certifications</Text>
                  <View style={s.goldRule2} />
                  {certifications.map((c, i) => (
                    <View key={i} style={s.compRow}>
                      <View style={s.compDot} />
                      <Text style={s.compText}>{c}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function ContactItem({ label, value }) {
  return (
    <View style={s.contactItem}>
      <Text style={s.contactLabel}>{label}</Text>
      <Text style={s.contactValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionGold} />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: '#fff' },
  header: { backgroundColor: CHARCOAL, padding: 16 },
  name: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase' },
  goldRule: { height: 2, backgroundColor: GOLD, width: 36, marginVertical: 7 },
  title: { fontSize: 9, color: '#D1C4A0', letterSpacing: 1, marginBottom: 10 },
  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  contactItem: {},
  contactLabel: { fontSize: 6.5, color: '#888', letterSpacing: 1, textTransform: 'uppercase' },
  contactValue: { fontSize: 8.5, color: '#D4D4D4', marginTop: 1 },

  body: { padding: 14 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 8, fontWeight: '700', color: CHARCOAL, letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionGold: { height: 1.5, backgroundColor: GOLD, marginTop: 4, marginBottom: 7, width: '100%' },

  para: { fontSize: 9, color: MID, lineHeight: 14 },

  expItem: { flexDirection: 'row', marginBottom: 8 },
  expLeft: { width: 40, alignItems: 'center', marginRight: 10 },
  expDate: { fontSize: 7, color: GOLD, fontWeight: '700', textAlign: 'center' },
  timeline: { flex: 1, width: 1.5, backgroundColor: '#E5E5E5', marginVertical: 3 },
  expRight: { flex: 1 },
  expPosition: { fontSize: 10, fontWeight: '700', color: CHARCOAL },
  expCompany: { fontSize: 9, color: GOLD, fontWeight: '600', marginTop: 1, marginBottom: 3 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 2 },
  bulletSquare: { width: 3, height: 3, backgroundColor: GOLD, marginTop: 5, marginRight: 5, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 9, color: MID, lineHeight: 14 },

  eduRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  eduYear: { fontSize: 8, color: GOLD, fontWeight: '700', width: 34, marginRight: 10 },
  eduDetails: { flex: 1 },

  twoCol: { flexDirection: 'row', backgroundColor: STONE, borderRadius: 6, padding: 10, marginTop: 2 },
  colTitle: { fontSize: 7.5, fontWeight: '700', color: CHARCOAL, letterSpacing: 1, textTransform: 'uppercase' },
  goldRule2: { height: 1, backgroundColor: GOLD, marginTop: 3, marginBottom: 5 },
  compRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  compDot: { width: 3, height: 3, backgroundColor: GOLD, borderRadius: 2, marginRight: 5 },
  compText: { fontSize: 9, color: MID },
});
