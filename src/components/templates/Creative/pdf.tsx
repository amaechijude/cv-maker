import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { CV } from '@/types/cv';
import { ATSKeywordsSection } from '../ATSSection';

const styles = StyleSheet.create({
  page: { flexDirection: 'row', backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  sidebar: { width: '33%', backgroundColor: '#111827', color: '#FFFFFF', padding: 30 },
  main: { width: '67%', padding: 40 },
  nameFirst: { fontSize: 24, fontWeight: 'black', color: '#60A5FA', textTransform: 'uppercase' },
  nameLast: { fontSize: 24, fontWeight: 'black', color: '#FFFFFF', textTransform: 'uppercase', marginBottom: 20 },
  sideSectionTitle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#60A5FA', borderBottomWidth: 1, borderBottomColor: '#374151', paddingBottom: 5, marginBottom: 15, marginTop: 25, letterSpacing: 2 },
  sideText: { fontSize: 9, color: '#D1D5DB', marginBottom: 3 },
  label: { fontSize: 8, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 5, marginTop: 10 },
  
  mainSectionTitle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 20, letterSpacing: 3 },
  summaryQuote: { fontSize: 14, fontStyle: 'italic', color: '#1F2937', borderLeftWidth: 4, borderLeftColor: '#3B82F6', paddingLeft: 15, marginBottom: 30 },
  
  expItem: { marginBottom: 25, position: 'relative', paddingLeft: 20 },
  expDot: { position: 'absolute', left: 0, top: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6' },
  expLine: { position: 'absolute', left: 3, top: 12, width: 1, height: '100%', backgroundColor: '#F3F4F6' },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  role: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  dateTag: { fontSize: 8, fontWeight: 'bold', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2 6', borderRadius: 4 },
  company: { fontSize: 9, fontWeight: 'bold', color: '#4B5563', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  desc: { fontSize: 9, color: '#374151', lineHeight: 1.5 },
  
  eduGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  eduCard: { width: '47%', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, borderBottomWidth: 3, borderBottomColor: '#3B82F6', marginBottom: 10 },
  eduDegree: { fontSize: 10, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  eduInst: { fontSize: 8, fontWeight: 'bold', color: '#4B5563', marginBottom: 2 },
  eduDate: { fontSize: 8, color: '#9CA3AF' },
  
  projItem: { marginBottom: 15 },
  projName: { fontSize: 11, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  projLink: { fontSize: 8, color: '#3B82F6', marginBottom: 4 }
});

export const CreativePDF = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  const nameParts = data.personalInfo.fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <Document title={`${data.personalInfo.fullName} - Creative CV`}>
      <Page size="A4" style={styles.page}>
         {/* Hidden ATS Keywords */}
         <ATSKeywordsSection keywords={data.atsKeywords} />

        <View style={styles.sidebar}>
          <Text style={styles.nameFirst}>{firstName}</Text>
          <Text style={styles.nameLast}>{lastName}</Text>
          
          <Text style={styles.label}>Contact</Text>
          <Text style={styles.sideText}>{data.personalInfo.email}</Text>
          <Text style={styles.sideText}>{data.personalInfo.phone}</Text>
          <Text style={styles.sideText}>{data.personalInfo.location}</Text>
          
          {(data.personalInfo.website || data.personalInfo.linkedin) && (
            <View>
              <Text style={styles.label}>Online</Text>
              {data.personalInfo.website && <Text style={styles.sideText}>{data.personalInfo.website}</Text>}
              {data.personalInfo.linkedin && <Text style={styles.sideText}>{data.personalInfo.linkedin}</Text>}
            </View>
          )}

          {visibleSections.includes('skills') && data.skills.length > 0 && (
            <View>
              <Text style={styles.sideSectionTitle}>Expertise</Text>
              {data.skills.map(skill => (
                <Text key={skill} style={styles.sideText}>{skill}</Text>
              ))}
            </View>
          )}

          {visibleSections.includes('certifications') && data.certifications?.length > 0 && (
            <View>
              <Text style={styles.sideSectionTitle}>Awards</Text>
              {data.certifications.map(cert => (
                <View key={cert.id} style={{marginBottom: 8}}>
                  <Text style={[styles.sideText, {fontWeight: 'bold', color: '#FFFFFF'}]}>{cert.name}</Text>
                  <Text style={[styles.sideText, {fontSize: 8}]}>{cert.issuer}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          {data.personalInfo.summary && (
            <View>
              <Text style={styles.mainSectionTitle}>About Me</Text>
              <Text style={styles.summaryQuote}>{data.personalInfo.summary}</Text>
            </View>
          )}

          {visibleSections.map(section => {
            if (section === 'experience' && data.experience.length > 0) {
              return (
                <View key="experience">
                  <Text style={styles.mainSectionTitle}>Experience</Text>
                  {data.experience.sort((a, b) => a.order - b.order).map((job, index) => (
                    <View key={job.id} style={styles.expItem}>
                      <View style={styles.expDot} />
                      {index < data.experience.length - 1 && <View style={styles.expLine} />}
                      <View style={styles.expHeader}>
                        <Text style={styles.role}>{job.role}</Text>
                        <Text style={styles.dateTag}>{job.dateRange}</Text>
                      </View>
                      <Text style={styles.company}>{job.company} / {job.location}</Text>
                      <Text style={styles.desc}>{job.description}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            if (section === 'education' && data.education.length > 0) {
              return (
                <View key="education">
                  <Text style={styles.mainSectionTitle}>Education</Text>
                  <View style={styles.eduGrid}>
                    {data.education.sort((a, b) => a.order - b.order).map(edu => (
                      <View key={edu.id} style={styles.eduCard}>
                        <Text style={styles.eduDegree}>{edu.degree}</Text>
                        <Text style={styles.eduInst}>{edu.institution}</Text>
                        <Text style={styles.eduDate}>{edu.dateRange}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            if (section === 'projects' && data.projects?.length > 0) {
              return (
                <View key="projects">
                  <Text style={styles.mainSectionTitle}>Featured Projects</Text>
                  {data.projects.sort((a, b) => a.order - b.order).map(project => (
                    <View key={project.id} style={styles.projItem}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                         <Text style={styles.projName}>{project.name}</Text>
                         <Text style={{fontSize: 8, color: '#9CA3AF'}}>{project.dateRange}</Text>
                      </View>
                      {project.link && <Text style={styles.projLink}>{project.link}</Text>}
                      <Text style={styles.desc}>{project.description}</Text>
                    </View>
                  ))}
                </View>
              );
            }
            return null;
          })}
        </View>
      </Page>
    </Document>
  );
};
