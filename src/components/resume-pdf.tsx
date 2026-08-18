'use client'

import * as React from 'react'
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'

import { RESUME_INK, resumeTheme, sectionInkColor } from '@/lib/resume-theme'
import { formatResumeDate, runtimeLocale } from '@/lib/format-date'
import type { ResumeData, ResumeStyle } from '@/types/resume'

const fontMap: Record<string, string> = {
  'times new roman': 'Times-Roman',
  georgia: 'Times-Roman',
  cambria: 'Times-Roman',
  garamond: 'Times-Roman',
  calibri: 'Helvetica',
  helvetica: 'Helvetica',
  arial: 'Helvetica',
  roboto: 'Helvetica',
  lato: 'Helvetica',
  'open sans': 'Helvetica',
  montserrat: 'Helvetica',
  outfit: 'Helvetica',
}

const fontSizeMap = {
  small: { heading: 22, sub: 11, body: 9 },
  medium: { heading: 26, sub: 12, body: 10 },
  large: { heading: 30, sub: 14, body: 12 },
} as const

const spacingMap = { small: 6, medium: 10, large: 16 } as const

interface ResumePDFProps {
  data: ResumeData & {
    referencesMode: 'uponRequest' | 'include'
  }
}

export function ResumePDF({ data }: ResumePDFProps) {
  const {
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    awards,
    languages,
    references,
    referencesMode,
    style,
  } = data

  const locale = runtimeLocale()
  const formatDate = (raw: string, fmt: ResumeStyle['dateFormat']) =>
    formatResumeDate(raw, fmt, locale)

  const sizes = fontSizeMap[style.fontSize]
  const gap = spacingMap[style.spacing]
  const fontFamily = fontMap[style.font] ?? 'Helvetica'
  const accent = /^#[0-9a-fA-F]{6}$/.test(style.color) ? style.color : '#1f2937'
  const isBoldFamily = fontFamily === 'Helvetica' ? 'Helvetica-Bold' : 'Times-Bold'
  const isItalicFamily = fontFamily === 'Helvetica' ? 'Helvetica-Oblique' : 'Times-Italic'
  const theme = resumeTheme(style.theme)
  const headingInk = sectionInkColor(theme, accent)

  const styles = StyleSheet.create({
    page: {
      padding: 36,
      fontFamily,
      fontSize: sizes.body,
      color: '#1f2937',
      lineHeight: 1.45,
    },
    header: {
      textAlign: theme.headerAlign,
      marginBottom: gap,
    },
    name: {
      fontSize: sizes.heading,
      fontFamily: isBoldFamily,
      color: RESUME_INK.ink,
      marginBottom: 8,
      lineHeight: 1.2,
      letterSpacing: theme.nameTracking * sizes.heading,
    },
    contactLine: {
      fontSize: sizes.body,
      color: '#374151',
      lineHeight: 1.4,
    },
    contactLink: {
      color: '#374151',
      textDecoration: 'none',
    },
    sectionTitle: {
      fontSize: sizes.sub * theme.sectionScale,
      fontFamily: isBoldFamily,
      color: headingInk,
      letterSpacing: theme.sectionTracking * sizes.sub,
      textTransform: 'uppercase',
      marginBottom: theme.rulePlacement === 'below' ? 0 : gap / 2,
      marginTop: theme.rulePlacement === 'below' ? gap / 2 : 0,
    },
    sectionDivider: {
      marginTop: gap / 2,
      marginBottom: gap / 2,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    itemTitle: {
      fontFamily: isBoldFamily,
      fontSize: sizes.body + 1,
    },
    italic: {
      fontFamily: isItalicFamily,
      color: '#4b5563',
    },
    bulletRow: {
      flexDirection: 'row',
      marginTop: 2,
    },
    bulletDot: {
      width: 12,
      textAlign: 'center',
    },
    bulletText: {
      flex: 1,
    },
    twoCol: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skillRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    skillCategory: {
      width: '30%',
      fontFamily: isBoldFamily,
    },
    skillList: {
      width: '70%',
    },
    item: {
      marginBottom: gap / 1.5,
    },
  })

  const ruleWidth = `${theme.ruleWidth * 100}%`

  const Divider = () => {
    if (style.separator === 'no separator') return <View style={{ height: gap / 4 }} />
    if (style.separator === 'double line') {
      return (
        <View style={[styles.sectionDivider, { width: ruleWidth }]}>
          <View style={{ borderBottomWidth: 0.5, borderBottomColor: accent }} />
          <View style={{ borderBottomWidth: 0.5, borderBottomColor: accent, marginTop: 1.5 }} />
        </View>
      )
    }
    return (
      <View
        style={{
          borderBottomWidth: style.separator === 'bold line' ? 2 : 0.5,
          borderBottomColor: accent,
          width: ruleWidth,
          marginTop: gap / 2,
          marginBottom: gap / 2,
        }}
      />
    )
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View>
      {theme.rulePlacement === 'above' && <Divider />}
      <Text style={styles.sectionTitle}>{title}</Text>
      {theme.rulePlacement === 'below' && <Divider />}
      {children}
    </View>
  )

  type Bit =
    | { kind: 'text'; value: string }
    | { kind: 'link'; label: string; href: string }

  const bits: Bit[] = []
  if (contact.location) bits.push({ kind: 'text', value: contact.location })
  if (contact.phone) bits.push({ kind: 'text', value: contact.phone })
  if (contact.email) bits.push({ kind: 'link', label: contact.email, href: `mailto:${contact.email}` })
  if (style.showLinks !== false) {
    if (contact.linkedin) bits.push({ kind: 'link', label: 'LinkedIn', href: contact.linkedin })
    if (contact.github) bits.push({ kind: 'link', label: 'GitHub', href: contact.github })
    if (contact.website) bits.push({ kind: 'link', label: 'Portfolio', href: contact.website })
  }

  return (
    <Document title={`${contact.fullName || 'Resume'}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {theme.nameUppercase
              ? (contact.fullName || 'Your Name').toUpperCase()
              : contact.fullName || 'Your Name'}
          </Text>
          <Text style={styles.contactLine}>
            {bits.map((bit, index) => (
              <React.Fragment key={index}>
                {index > 0 ? '  •  ' : ''}
                {bit.kind === 'text' ? (
                  bit.value
                ) : (
                  <Link src={bit.href} style={styles.contactLink}>
                    {bit.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </Text>
        </View>

        {summary && (
          <Section title="Professional Summary">
            <Text>{summary}</Text>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.italic}>
                    {formatDate(exp.startDate, style.dateFormat)} - {exp.current ? 'Present' : formatDate(exp.endDate, style.dateFormat)}
                  </Text>
                </View>
                <Text style={styles.italic}>{exp.company}</Text>
                {exp.description.map((d, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{d}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </Text>
                  <Text style={styles.italic}>
                    {formatDate(edu.startDate, style.dateFormat)} - {formatDate(edu.endDate, style.dateFormat)}
                  </Text>
                </View>
                <Text style={styles.italic}>
                  {edu.school}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            {skills.map((s) => (
              <View key={s.id} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{s.category}</Text>
                <Text style={styles.skillList}>{s.skills.filter(Boolean).join(', ')}</Text>
              </View>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p) => (
              <View key={p.id} style={styles.item}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{p.name}</Text>
                  {p.link && <Text style={styles.italic}>{p.link}</Text>}
                </View>
                {p.technologies.length > 0 && (
                  <Text style={styles.italic}>{p.technologies.filter(Boolean).join(' · ')}</Text>
                )}
                {p.description.map((d, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{d}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((c) => (
              <View key={c.id} style={[styles.rowBetween, { marginBottom: 2 }]}>
                <Text>
                  <Text style={{ fontFamily: isBoldFamily }}>{c.name}</Text>
                  <Text style={{ color: '#4b5563' }}> - {c.issuer}</Text>
                </Text>
                <Text style={styles.italic}>{formatDate(c.date, style.dateFormat)}</Text>
              </View>
            ))}
          </Section>
        )}

        {awards.length > 0 && (
          <Section title="Awards">
            {awards.map((a) => (
              <View key={a.id} style={{ marginBottom: gap / 2 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{a.title}</Text>
                  <Text style={styles.italic}>{formatDate(a.date, style.dateFormat)}</Text>
                </View>
                <Text style={styles.italic}>{a.issuer}</Text>
                {a.description ? <Text>{a.description}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {languages.length > 0 && (
          <Section title="Languages">
            {languages.map((l) => (
              <View key={l.id} style={[styles.rowBetween, { marginBottom: 2 }]}>
                <Text style={{ fontFamily: isBoldFamily }}>{l.language}</Text>
                {style.showSkillProficiency !== false && (
                  <Text style={[styles.italic, { textTransform: 'capitalize' }]}>{l.proficiency}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {referencesMode === 'uponRequest' ? (
          <Section title="References">
            <Text style={styles.italic}>References available upon request.</Text>
          </Section>
        ) : (
          references.length > 0 && (
            <Section title="References">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {references.map((r) => (
                  <View key={r.id} style={{ width: '50%', marginBottom: gap / 2, paddingRight: 8 }}>
                    <Text style={styles.itemTitle}>{r.name}</Text>
                    <Text style={styles.italic}>{r.relationship}</Text>
                    <Text>{r.email}</Text>
                    <Text>{r.phone}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )
        )}
      </Page>
    </Document>
  )
}
