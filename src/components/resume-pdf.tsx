'use client'


import { StyleSheet, Document, Page, View, Text } from '@react-pdf/renderer'
import { useResumeStore } from '@/store/useResumeStore'
import type { Experience, Education, Skill, Project } from '@/types/resume'

const getFontSize = (type: 'heading' | 'subheading' | 'body', fontSize: string) => {
  switch (fontSize) {
    case 'small':
      return type === 'heading' ? 24 : type === 'subheading' ? 14 : 10;
    case 'large':
      return type === 'heading' ? 32 : type === 'subheading' ? 18 : 14;
    default: // medium
      return type === 'heading' ? 28 : type === 'subheading' ? 16 : 12;
  }
};

const getSpacing = (spacing: string) => {
  switch (spacing) {
    case 'small':
      return 15;
    case 'large':
      return 35;
    default: // medium
      return 25;
  }
};

const formatDate = (date: string, dateFormat: string) => {
  try {
    if (!date) return '';
    const dateObj = new Date(date);
    
    switch (dateFormat) {
      case 'MM/YYYY':
        return dateObj.toLocaleDateString('en-US', {
          month: '2-digit',
          year: 'numeric',
        });
      case 'MMM YYYY':
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      case 'MMMM YYYY':
        return dateObj.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
      default:
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
    }
  } catch (error) {
    console.error('Invalid date format:', error);
    return date;
  }
};

export function ResumePDF() {
  try {
    const { contact, summary, experience, education, skills, projects, style: styling, languages, references } = useResumeStore.getState();

    const styles = StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: styling.font || 'Helvetica',
        fontSize: getFontSize('body', styling.fontSize),
        color: '#1F2937',
      },
      header: {
        marginBottom: getSpacing(styling.spacing),
        borderBottom: '2px solid #3B82F6',
        paddingBottom: 20,
      },
      title: {
        fontSize: getFontSize('heading', styling.fontSize),
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#2563EB',
      },
      subtitle: {
        fontSize: getFontSize('body', styling.fontSize),
        color: '#4B5563',
        marginBottom: 4,
      },
      section: {
        marginBottom: getSpacing(styling.spacing),
      },
      sectionTitle: {
        fontSize: getFontSize('subheading', styling.fontSize),
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 12,
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: 4,
      },
      itemTitle: {
        fontSize: getFontSize('subheading', styling.fontSize),
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
      },
      itemSubtitle: {
        fontSize: getFontSize('body', styling.fontSize),
        color: '#4B5563',
        marginBottom: 4,
      },
      description: {
        fontSize: getFontSize('body', styling.fontSize),
        color: '#374151',
        marginBottom: 8,
        lineHeight: 1.5,
      },
      bulletContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 8,
      },
      bullet: {
        width: 3,
        height: 3,
        backgroundColor: '#3B82F6',
        borderRadius: 1.5,
        marginRight: 8,
        marginTop: 6,
      },
      bulletText: {
        flex: 1,
        fontSize: getFontSize('body', styling.fontSize),
        color: '#374151',
        lineHeight: 1.5,
      },
      skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
      },
      skillTag: {
        backgroundColor: '#EFF6FF',
        borderRadius: 4,
        padding: '4 8',
        marginRight: 8,
        marginBottom: 8,
        color: '#3B82F6',
        fontSize: getFontSize('body', styling.fontSize),
      },
      contactInfo: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
      },
      contactIcon: {
        width: 12,
        height: 12,
        marginRight: 6,
      },
      contactText: {
        fontSize: getFontSize('body', styling.fontSize),
        color: '#4B5563',
      }
    })

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>{contact.fullName}</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{contact.email}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{contact.phone}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{contact.location}</Text>
            </View>
          </View>

          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.description}>{summary}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experience.map((exp: Experience) => (
                <View key={exp.id} style={{ marginBottom: getSpacing(styling.spacing) / 2 }}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemSubtitle}>
                    {exp.company}
                  </Text>
                  <Text style={styles.itemSubtitle}>
                    {formatDate(exp.startDate, styling.dateFormat)} - {exp.current ? 'Present' : formatDate(exp.endDate, styling.dateFormat)}
                  </Text>
                  {exp.description.map((desc: string, i: number) => (
                    <View key={i} style={styles.bulletContainer}>
                      <View style={styles.bullet} />
                      <Text style={styles.bulletText}>{desc}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu: Education) => (
                <View key={edu.id} style={{ marginBottom: getSpacing(styling.spacing) / 2 }}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemSubtitle}>
                    {edu.school} • {edu.field}
                  </Text>
                  <Text style={styles.itemSubtitle}>
                    {formatDate(edu.startDate, styling.dateFormat)} - {formatDate(edu.endDate, styling.dateFormat)}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsGrid}>
                {skills.map((skill: Skill) => (
                  <View key={skill.id} style={styles.skillTag}>
                    <Text style={styles.itemTitle}>{skill.category}</Text>
                    <Text>{skill.skills.join(', ')}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.skillsGrid}>
                {languages.map((lang) => (
                  <View key={lang.id} style={styles.skillTag}>
                    <Text>{lang.language} - {lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {references.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>References</Text>
              {references.map((ref) => (
                <View key={ref.id} style={{ marginBottom: 12 }}>
                  <Text style={styles.itemTitle}>{ref.name}</Text>
                  <Text style={styles.itemSubtitle}>{ref.relationship}</Text>
                  <Text style={styles.contactText}>{ref.email}</Text>
                  <Text style={styles.contactText}>{ref.phone}</Text>
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((project: Project) => (
                <View key={project.id} style={{ marginBottom: 15 }}>
                  <Text style={styles.itemTitle}>{project.name}</Text>
                  {project.description.map((desc: string, i: number) => (
                    <Text key={i} style={styles.description}>{desc}</Text>
                  ))}
                  <View style={styles.skillsGrid}>
                    {project.technologies.map((tech: string, i: number) => (
                      <View key={i} style={styles.skillTag}>
                        <Text>{tech}</Text>
                      </View>
                    ))}
                  </View>
                  {project.link && (
                    <Text style={styles.description}>
                      Link: {project.link}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </Page>
      </Document>
    )
  } catch (error) {
    console.error('Error rendering PDF:', error);
    return null;
  }
}