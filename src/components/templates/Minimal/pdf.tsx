// components/templates/Minimal/pdf.tsx
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { CV } from '@/types/cv';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Inter', fontSize: 10, lineHeight: 1.5 },
  header: { fontSize: 20, marginBottom: 5, fontWeight: 'bold' },
  subHeader: { fontSize: 9, color: '#666', marginBottom: 15 },
  summary: { fontSize: 10, lineHeight: 1.6, marginBottom: 20, color: '#333' },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginTop: 15 },
  experienceItem: { marginBottom: 12 },
  companyRole: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  dateLocation: { fontSize: 9, color: '#666', marginBottom: 4 },
  description: { fontSize: 10, lineHeight: 1.5, color: '#333' },
  educationItem: { marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  skills: { fontSize: 10, lineHeight: 1.6 }
});

export const MinimalPDF = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>{data.personalInfo.fullName}</Text>
          <Text style={styles.subHeader}>
            {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.website, data.personalInfo.linkedin].filter(Boolean).join(' • ')}
          </Text>
          {data.personalInfo.summary && <Text style={styles.summary}>{data.personalInfo.summary}</Text>}
        </View>

        {visibleSections.map((section) => {
          if (section === 'experience' && data.experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience.sort((a, b) => a.order - b.order).map((job) => (
                  <View key={job.id} style={styles.experienceItem}>
                    <Text style={styles.companyRole}>{job.company} — {job.role}</Text>
                    <Text style={styles.dateLocation}>{job.dateRange} • {job.location}</Text>
                    <Text style={styles.description}>{job.description}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (section === 'education' && data.education.length > 0) {
            return (
              <View key="education">
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.sort((a, b) => a.order - b.order).map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <View style={styles.row}>
                      <Text style={styles.companyRole}>{edu.institution}</Text>
                      <Text style={styles.dateLocation}>{edu.dateRange}</Text>
                    </View>
                    <Text style={styles.description}>{edu.degree}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (section === 'skills' && data.skills.length > 0) {
            return (
              <View key="skills">
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.skills}>{data.skills.join(' • ')}</Text>
              </View>
            );
          }
          return null;
        })}
      </Page>
    </Document>
  );
};
