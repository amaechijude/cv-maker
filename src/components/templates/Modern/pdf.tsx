// components/templates/Modern/pdf.tsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { CV } from '@/types/cv';
import { ATSKeywordsSection } from '../ATSSection';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5 },
  headerBox: { backgroundColor: '#F0F7FF', padding: 20, marginBottom: 20, borderRadius: 6 },
  header: { fontSize: 26, marginBottom: 4, fontWeight: 'bold', color: '#1E3A8A' },
  subHeader: { fontSize: 10, color: '#2563EB', marginBottom: 12, fontWeight: 'medium' },
  summary: { fontSize: 10, lineHeight: 1.6, color: '#374151' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#1E3A8A', borderLeftWidth: 4, borderLeftColor: '#3B82F6', paddingLeft: 10, marginBottom: 12, marginTop: 18, textTransform: 'uppercase', letterSpacing: 1 },
  experienceItem: { marginBottom: 15, paddingLeft: 14 },
  companyRole: { fontSize: 11, fontWeight: 'bold', color: '#1E40AF', marginBottom: 2 },
  dateLocation: { fontSize: 9, color: '#6B7280', marginBottom: 5, fontWeight: 'medium' },
  description: { fontSize: 10, lineHeight: 1.5, color: '#374151', textAlign: 'justify' },
  educationItem: { marginBottom: 10, paddingLeft: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  skills: { fontSize: 10, lineHeight: 1.6, paddingLeft: 14, color: '#374151' }
});

export const ModernPDF = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document title={`${data.personalInfo.fullName} - Modern CV`}>
      <Page size="A4" style={styles.page}>
         {/* Hidden ATS Keywords */}
         <ATSKeywordsSection keywords={data.atsKeywords} />

        <View style={styles.headerBox}>
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
