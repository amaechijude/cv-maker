import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { CV } from '@/types/cv';
import { ATSKeywordsSection } from '../ATSSection';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, color: '#333' },
  header: { borderBottomWidth: 2, borderBottomColor: '#1a1a1a', paddingBottom: 15, marginBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  name: { fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', color: '#000' },
  contact: { fontSize: 9, color: '#666', marginTop: 5 },
  container: { flexDirection: 'row', gap: 30 },
  mainCol: { flex: 2 },
  sideCol: { flex: 1 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 3, marginBottom: 12, marginTop: 15, color: '#1a1a1a' },
  jobTitle: { fontSize: 11, fontWeight: 'bold', color: '#000' },
  companyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  companyName: { fontSize: 10, fontWeight: 'bold', color: '#1d4ed8' },
  dateRange: { fontSize: 9, fontWeight: 'medium', color: '#666' },
  location: { fontSize: 9, color: '#999', fontStyle: 'italic' },
  description: { fontSize: 10, marginBottom: 10, color: '#444', textAlign: 'justify' },
  skillBadge: { backgroundColor: '#f3f4f6', padding: '3 6', borderRadius: 3, fontSize: 8, marginRight: 4, marginBottom: 4, color: '#374151' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  eduItem: { marginBottom: 10 },
  eduDegree: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  eduInfo: { fontSize: 9, color: '#444' }
});

export const ProfessionalPDF = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document title={`${data.personalInfo.fullName} - CV`}>
      <Page size="A4" style={styles.page}>
        {/* Hidden ATS Keywords */}
        <ATSKeywordsSection keywords={data.atsKeywords} />

        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{data.personalInfo.fullName}</Text>
            <Text style={styles.contact}>
              {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join('  •  ')}
            </Text>
             <Text style={styles.contact}>
              {[data.personalInfo.website, data.personalInfo.linkedin].filter(Boolean).join('  •  ')}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.mainCol}>
            {data.personalInfo.summary && (
              <View>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.description}>{data.personalInfo.summary}</Text>
              </View>
            )}

            {visibleSections.map((section) => {
              if (section === 'experience' && data.experience.length > 0) {
                return (
                  <View key="experience">
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
                    {data.experience.sort((a, b) => a.order - b.order).map((job) => (
                      <View key={job.id}>
                        <View style={styles.companyRow}>
                          <Text style={styles.jobTitle}>{job.role}</Text>
                          <Text style={styles.dateRange}>{job.dateRange}</Text>
                        </View>
                        <View style={styles.companyRow}>
                          <Text style={styles.companyName}>{job.company}</Text>
                          <Text style={styles.location}>{job.location}</Text>
                        </View>
                        <Text style={styles.description}>{job.description}</Text>
                      </View>
                    ))}
                  </View>
                );
              }

              if (section === 'projects' && data.projects && data.projects.length > 0) {
                return (
                  <View key="projects">
                    <Text style={styles.sectionTitle}>Key Projects</Text>
                    {data.projects.sort((a, b) => a.order - b.order).map((project) => (
                      <View key={project.id}>
                        <View style={styles.companyRow}>
                          <Text style={styles.jobTitle}>{project.name}</Text>
                          <Text style={styles.dateRange}>{project.dateRange}</Text>
                        </View>
                        {project.link && <Text style={{fontSize: 8, color: '#1d4ed8', marginBottom: 2}}>{project.link}</Text>}
                        <Text style={styles.description}>{project.description}</Text>
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })}
          </View>

          <View style={styles.sideCol}>
            {visibleSections.map((section) => {
              if (section === 'skills' && data.skills.length > 0) {
                return (
                  <View key="skills">
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillsContainer}>
                      {data.skills.map((skill) => (
                        <Text key={skill} style={styles.skillBadge}>{skill}</Text>
                      ))}
                    </View>
                  </View>
                );
              }

              if (section === 'education' && data.education.length > 0) {
                return (
                  <View key="education">
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.sort((a, b) => a.order - b.order).map((edu) => (
                      <View key={edu.id} style={styles.eduItem}>
                        <Text style={styles.eduDegree}>{edu.degree}</Text>
                        <Text style={styles.eduInfo}>{edu.institution}</Text>
                        <Text style={styles.dateRange}>{edu.dateRange}</Text>
                      </View>
                    ))}
                  </View>
                );
              }

              if (section === 'certifications' && data.certifications && data.certifications.length > 0) {
                return (
                  <View key="certifications">
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {data.certifications.sort((a, b) => a.order - b.order).map((cert) => (
                      <View key={cert.id} style={styles.eduItem}>
                        <Text style={styles.eduDegree}>{cert.name}</Text>
                        <Text style={styles.eduInfo}>{cert.issuer}</Text>
                        <Text style={styles.dateRange}>{cert.date}</Text>
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};
