// components/templates/Classic/pdf.tsx
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import { CV } from '@/types/cv';



const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.4
  },
  header: { 
    fontSize: 24, 
    marginBottom: 12, 
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000'
  },
  subHeader: { 
    fontSize: 10, 
    color: '#000000',
    marginTop: 12,
    marginBottom: 15,
    textAlign: 'center' 
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 20,
    color: '#000000',
    textAlign: 'justify'
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    borderBottom: '1pt solid #000',
    paddingBottom: 2,
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase',
    color: '#000000'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  experienceItem: {
    marginBottom: 10
  },
  company: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000'
  },
  roleLocation: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#000000',
    marginBottom: 2
  },
  date: {
    fontSize: 10,
    color: '#000000'
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#000000',
    textAlign: 'justify'
  },
  educationItem: {
    marginBottom: 8
  },
  institution: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000'
  },
  degree: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#000000'
  },
  skills: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#000000'
  }
});

export const ClassicPDF = ({ data }: { data: CV }) => {
  // Filter visible sections based on hiddenSections
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.header}>{data.personalInfo.fullName}</Text>
          <View style={{ height: 10 }} />
          <Text style={styles.subHeader}>
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.linkedin && `in/${data.personalInfo.linkedin.split('/').pop()}`,
              data.personalInfo.website,
            ].filter(Boolean).join(' • ')}
          </Text>
          {data.personalInfo.summary && (
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          )}
        </View>

        {/* Render sections in custom order */}
        {visibleSections.map((section) => {
          if (section === 'experience' && data.experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience
                  .sort((a, b) => a.order - b.order)
                  .map((job) => (
                    <View key={job.id} style={styles.experienceItem}>
                      <View style={styles.row}>
                        <Text style={styles.company}>{job.company}</Text>
                        <Text style={styles.date}>{job.dateRange}</Text>
                      </View>
                       <Text style={styles.roleLocation}>
                        {job.role} • {job.location}
                      </Text>
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
                {data.education
                  .sort((a, b) => a.order - b.order)
                  .map((edu) => (
                    <View key={edu.id} style={styles.educationItem}>
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
              <View key="skills">
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.skills}>
                  <Text style={{fontWeight: 'bold'}}>Skills: </Text>
                  {data.skills.join(', ')}.
                </Text>
              </View>
            );
          }

          if (section === 'projects' && data.projects && data.projects.length > 0) {
            return (
              <View key="projects">
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects
                  .sort((a, b) => a.order - b.order)
                  .map((project) => (
                    <View key={project.id} style={styles.experienceItem}>
                      <View style={styles.row}>
                        <Text style={styles.company}>{project.name}</Text>
                        <Text style={styles.date}>{project.dateRange}</Text>
                      </View>
                       {project.link && (
                        <Text style={styles.roleLocation}>{project.link}</Text>
                      )}
                      <Text style={styles.description}>{project.description}</Text>
                    </View>
                  ))}
              </View>
            );
          }

          if (section === 'certifications' && data.certifications && data.certifications.length > 0) {
            return (
              <View key="certifications">
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <View key={cert.id} style={styles.educationItem}>
                      <View style={styles.row}>
                        <Text style={styles.institution}>{cert.name}</Text>
                        <Text style={styles.date}>{cert.date}</Text>
                      </View>
                      <Text style={styles.degree}>{cert.issuer}</Text>
                       {cert.link && (
                        <Text style={styles.degree}>{cert.link}</Text>
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
