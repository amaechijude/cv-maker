// components/templates/Classic/pdf.tsx
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import { CV } from '@/types/cv';
import { ATSKeywordsSection } from '../ATSSection';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.5
  },
  header: { 
    fontSize: 24, 
    marginBottom: 10, 
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000'
  },
  subHeader: { 
    fontSize: 10, 
    color: '#333',
    marginBottom: 15,
    textAlign: 'center' 
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 20,
    color: '#333',
    textAlign: 'justify'
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    marginBottom: 10,
    marginTop: 15,
    textTransform: 'uppercase',
    color: '#000000'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  experienceItem: {
    marginBottom: 12
  },
  company: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000'
  },
  roleLocation: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 3
  },
  date: {
    fontSize: 10,
    color: '#333'
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#444',
    textAlign: 'justify'
  },
  educationItem: {
    marginBottom: 10
  },
  institution: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000'
  },
  degree: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#333'
  },
  skills: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#444'
  }
});

export const ClassicPDF = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document title={`${data.personalInfo.fullName} - CV`}>
      <Page size="A4" style={styles.page}>
        {/* Hidden ATS Keywords */}
        <ATSKeywordsSection keywords={data.atsKeywords} />

        {/* Header */}
        <View>
          <Text style={styles.header}>{data.personalInfo.fullName}</Text>
          <Text style={styles.subHeader}>
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.location,
              data.personalInfo.linkedin,
              data.personalInfo.website,
            ].filter(Boolean).join('  •  ')}
          </Text>
          {data.personalInfo.summary && (
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          )}
        </View>

        {visibleSections.map((section) => {
          if (section === 'experience' && data.experience.length > 0) {
            return (
              <View key="experience" wrap={false}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience
                  .sort((a, b) => a.order - b.order)
                  .map((job) => (
                    <View key={job.id} style={styles.experienceItem} wrap={false}>
                      <View style={styles.row}>
                        <Text style={styles.company}>{job.company}</Text>
                        <Text style={styles.date}>{job.dateRange}</Text>
                      </View>
                       <Text style={styles.roleLocation}>
                        {job.role}  •  {job.location}
                      </Text>
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
                {data.education
                  .sort((a, b) => a.order - b.order)
                  .map((edu) => (
                    <View key={edu.id} style={styles.educationItem} wrap={false}>
                      <View style={styles.row}>
                        <Text style={styles.institution}>{edu.institution}</Text>
                        <Text style={styles.date}>{edu.dateRange}</Text>
                      </View>
                      <Text style={styles.degree}>{edu.degree}</Text>
                    </View>
                  ))}
              </View>
            );
          }

          if (section === 'skills' && data.skills.length > 0) {
            return (
              <View key="skills" wrap={false}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.skills}>
                  {data.skills.join('  •  ')}
                </Text>
              </View>
            );
          }

          if (section === 'projects' && data.projects && data.projects.length > 0) {
            return (
              <View key="projects" wrap={false}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects
                  .sort((a, b) => a.order - b.order)
                  .map((project) => (
                    <View key={project.id} style={styles.experienceItem} wrap={false}>
                      <View style={styles.row}>
                        <Text style={styles.company}>{project.name}</Text>
                        <Text style={styles.date}>{project.dateRange}</Text>
                      </View>
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
                {data.certifications
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <View key={cert.id} style={styles.educationItem} wrap={false}>
                      <View style={styles.row}>
                        <Text style={styles.institution}>{cert.name}</Text>
                        <Text style={styles.date}>{cert.date}</Text>
                      </View>
                      <Text style={styles.degree}>{cert.issuer}</Text>
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
