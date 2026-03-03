// components/templates/Minimal/pdf.tsx
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import { CV } from '@/types/cv';
import { ATSKeywordsSection } from '../ATSSection';

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 9, lineHeight: 1.6, color: '#111' },
  header: { fontSize: 22, marginBottom: 5, fontWeight: 'bold', color: '#000' },
  subHeader: { fontSize: 9, color: '#666', marginBottom: 20 },
  summary: { fontSize: 9, lineHeight: 1.6, marginBottom: 25, color: '#333', textAlign: 'justify' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginTop: 20, borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingBottom: 3, letterSpacing: 1 },
  experienceItem: { marginBottom: 15 },
  companyRole: { fontSize: 10, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  dateLocation: { fontSize: 8, color: '#666', marginBottom: 5 },
  description: { fontSize: 9, lineHeight: 1.6, color: '#333', textAlign: 'justify' },
  educationItem: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  skills: { fontSize: 9, lineHeight: 1.6, color: '#333' }
});

export const MinimalPDF = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document title={`${data.personalInfo.fullName} - CV`}>
      <Page size="A4" style={styles.page}>
         {/* Hidden ATS Keywords */}
         <ATSKeywordsSection keywords={data.atsKeywords} />

        <View>
          <Text style={styles.header}>{data.personalInfo.fullName}</Text>
          <Text style={styles.subHeader}>
            {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.website, data.personalInfo.linkedin].filter(Boolean).join('  •  ')}
          </Text>
          {data.personalInfo.summary && <Text style={styles.summary}>{data.personalInfo.summary}</Text>}
        </View>

        {visibleSections.map((section) => {
          if (section === 'experience' && data.experience.length > 0) {
            return (
              <View key="experience" wrap={false}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience.sort((a, b) => a.order - b.order).map((job) => (
                  <View key={job.id} style={styles.experienceItem} wrap={false}>
                    <Text style={styles.companyRole}>{job.company} — {job.role}</Text>
                    <Text style={styles.dateLocation}>{job.dateRange}  •  {job.location}</Text>
                    <Text style={styles.description}>{job.description}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (section === 'education' && data.education.length > 0) {
            return (
              <View key="education" wrap={false}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.sort((a, b) => a.order - b.order).map((edu) => (
                  <View key={edu.id} style={styles.educationItem} wrap={false}>
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
              <View key="skills" wrap={false}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.skills}>{data.skills.join('  •  ')}</Text>
              </View>
            );
          }
          if (section === 'projects' && data.projects && data.projects.length > 0) {
            return (
              <View key="projects" wrap={false}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.sort((a, b) => a.order - b.order).map((project) => (
                  <View key={project.id} style={styles.experienceItem} wrap={false}>
                    <Text style={styles.companyRole}>{project.name}</Text>
                    <Text style={styles.dateLocation}>{project.dateRange}</Text>
                    {project.link && (
                        <Text style={{fontSize: 8, color: '#1d4ed8', marginBottom: 2}}>{project.link}</Text>
                      )}
                    <Text style={styles.description}>{project.description}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (section === 'certifications' && data.certifications && data.certifications.length > 0) {
            return (
              <View key="certifications" wrap={false}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.sort((a, b) => a.order - b.order).map((cert) => (
                  <View key={cert.id} style={styles.educationItem} wrap={false}>
                    <View style={styles.row}>
                      <Text style={styles.companyRole}>{cert.name}</Text>
                      <Text style={styles.dateLocation}>{cert.date}</Text>
                    </View>
                    <Text style={styles.description}>{cert.issuer}</Text>
                    {cert.link && (
                        <Text style={{fontSize: 8, color: '#1d4ed8', marginTop: 2}}>{cert.link}</Text>
                      )}
                  </View>
                ))}
              </View>
            );
          }
          return null;
        })}
      </Page>
    </Document>
  );
};
