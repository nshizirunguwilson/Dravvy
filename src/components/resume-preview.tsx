'use client'

import * as React from 'react'

import { useResumeStore } from '@/store/useResumeStore'
import { RESUME_INK, resumeTheme, sectionInkColor } from '@/lib/resume-theme'
import type { ResumeStyle } from '@/types/resume'

/**
 * Font stacks for the A4 preview.
 *
 * Roboto, Lato, Open Sans and Garamond are loaded as real webfonts in the root
 * layout, so their variables come first and the choice always renders. The
 * rest come from Windows or macOS, with a same-genre fallback behind them so a
 * machine without the face still shows serif for serif and sans for sans.
 */
const fontStack: Record<string, string> = {
  'times new roman': '"Times New Roman", Times, "Liberation Serif", serif',
  georgia: 'Georgia, "Gelasio", "Times New Roman", serif',
  cambria: 'Cambria, Caladea, Georgia, serif',
  garamond: 'Garamond, var(--font-resume-garamond), "EB Garamond", Georgia, serif',
  calibri: 'Calibri, Carlito, "Helvetica Neue", Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  arial: 'Arial, "Liberation Sans", "Helvetica Neue", sans-serif',
  roboto: 'var(--font-resume-roboto), Roboto, "Helvetica Neue", Arial, sans-serif',
  lato: 'var(--font-resume-lato), Lato, "Helvetica Neue", Arial, sans-serif',
  'open sans': 'var(--font-resume-open-sans), "Open Sans", "Helvetica Neue", Arial, sans-serif',
}

const formatDate = (raw: string, fmt: ResumeStyle['dateFormat']) => {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  switch (fmt) {
    case 'MM/YYYY':
      return date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
    case 'MMMM YYYY':
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    default:
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
}

const fontSizeMap = {
  small: { heading: 22, sub: 13, body: 11 },
  medium: { heading: 26, sub: 15, body: 12.5 },
  large: { heading: 30, sub: 17, body: 14 },
} as const

const spacingMap = { small: 12, medium: 18, large: 26 } as const

export function ResumePreview() {
  const contact = useResumeStore((s) => s.contact)
  const summary = useResumeStore((s) => s.summary)
  const experience = useResumeStore((s) => s.experience)
  const education = useResumeStore((s) => s.education)
  const skills = useResumeStore((s) => s.skills)
  const projects = useResumeStore((s) => s.projects)
  const certifications = useResumeStore((s) => s.certifications)
  const awards = useResumeStore((s) => s.awards)
  const languages = useResumeStore((s) => s.languages)
  const references = useResumeStore((s) => s.references)
  const referencesMode = useResumeStore((s) => s.referencesMode)
  const style = useResumeStore((s) => s.style)

  const sizes = fontSizeMap[style.fontSize]
  const gap = spacingMap[style.spacing]
  const family = fontStack[style.font] ?? fontStack.helvetica
  const accent = style.color
  const theme = resumeTheme(style.theme)
  const headingInk = sectionInkColor(theme, accent)

  const Divider = () => {
    const width = `${theme.ruleWidth * 100}%`
    if (style.separator === 'no separator') return <div style={{ height: gap / 2 }} />
    if (style.separator === 'double line') {
      return (
        <div style={{ marginTop: gap / 2, marginBottom: gap / 2, width }}>
          <div style={{ height: 1, backgroundColor: accent }} />
          <div style={{ height: 1, marginTop: 2, backgroundColor: accent }} />
        </div>
      )
    }
    return (
      <div
        style={{
          height: style.separator === 'bold line' ? 3 : 1,
          width,
          backgroundColor: accent,
          marginTop: gap / 2,
          marginBottom: gap / 2,
        }}
      />
    )
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      {theme.rulePlacement === 'above' && <Divider />}
      <h2
        style={{
          fontSize: sizes.sub * theme.sectionScale,
          color: headingInk,
          textTransform: 'uppercase',
          letterSpacing: `${theme.sectionTracking}em`,
          marginTop: theme.rulePlacement === 'below' ? gap / 2 : 0,
          marginBottom: theme.rulePlacement === 'below' ? 0 : gap / 3,
          fontWeight: 700,
        }}
      >
        {title}
      </h2>
      {theme.rulePlacement === 'below' && <Divider />}
      {children}
    </section>
  )

  type Bit =
    | { kind: 'text'; value: string }
    | { kind: 'link'; label: string; href: string }

  const contactItems: Bit[] = []
  if (contact.location) contactItems.push({ kind: 'text', value: contact.location })
  if (contact.phone) contactItems.push({ kind: 'text', value: contact.phone })
  if (contact.email) contactItems.push({ kind: 'link', label: contact.email, href: `mailto:${contact.email}` })
  if (contact.linkedin) contactItems.push({ kind: 'link', label: 'LinkedIn', href: contact.linkedin })
  if (contact.github) contactItems.push({ kind: 'link', label: 'GitHub', href: contact.github })
  if (contact.website) contactItems.push({ kind: 'link', label: 'Portfolio', href: contact.website })

  return (
    <div className="relative">
      {/* Pedestal, a neutral tray with the A4 page floating on it. */}
      <div className="rounded-xl border border-line bg-surface-2/60 p-4 md:p-6">
        {/* Control bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-7">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-positive" aria-hidden />
            <span className="text-slate-12">Live preview</span>
            <span aria-hidden className="text-slate-5">·</span>
            <span className="num-tabular">A4 · 210 × 297 mm</span>
          </div>
          <span className="text-[12px] font-medium text-slate-6">
            What you see is what exports
          </span>
        </div>

        {/* The page */}
        <div className="mt-1 overflow-x-auto">
          {/* The page itself is always white with dark ink, in light and dark
              theme alike, because that is exactly what the PDF and DOCX
              exports produce. */}
          <article
            className="mx-auto shadow-lg"
            style={{
              backgroundColor: '#ffffff',
              color: '#111827',
              fontFamily: family,
              fontSize: sizes.body,
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              lineHeight: 1.5,
            }}
          >
        <header style={{ textAlign: theme.headerAlign, marginBottom: gap }}>
          <h1
            style={{
              fontSize: sizes.heading,
              fontWeight: 700,
              letterSpacing: `${theme.nameTracking}em`,
              textTransform: theme.nameUppercase ? 'uppercase' : 'none',
              color: RESUME_INK.ink,
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            {contact.fullName || 'Your Name'}
          </h1>
          <p style={{ fontSize: sizes.body, color: '#374151', lineHeight: 1.5 }}>
            {contactItems.map((bit, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span style={{ margin: '0 6px' }}>•</span>}
                {bit.kind === 'text' ? (
                  <span>{bit.value}</span>
                ) : (
                  <a
                    href={bit.href}
                    target={bit.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    style={{ color: '#374151', textDecoration: 'none' }}
                  >
                    {bit.label}
                  </a>
                )}
              </React.Fragment>
            ))}
          </p>
        </header>

        {summary && (
          <Section title="Professional Summary">
            <p style={{ color: '#1f2937' }}>{summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: gap / 1.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: sizes.body + 1 }}>{exp.position || 'Position'}</strong>
                  <span style={{ color: '#4b5563' }}>
                    {formatDate(exp.startDate, style.dateFormat)} - {exp.current ? 'Present' : formatDate(exp.endDate, style.dateFormat)}
                  </span>
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic' }}>{exp.company}</p>
                <ul style={{ marginTop: 4, paddingLeft: 18, listStyle: 'disc' }}>
                  {exp.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: gap / 1.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: sizes.body + 1 }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</strong>
                  <span style={{ color: '#4b5563' }}>
                    {formatDate(edu.startDate, style.dateFormat)} - {formatDate(edu.endDate, style.dateFormat)}
                  </span>
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic' }}>
                  {edu.school}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: 4, columnGap: 12 }}>
              {skills.map((s) => (
                <React.Fragment key={s.id}>
                  <span style={{ fontWeight: 600 }}>{s.category}</span>
                  <span>{s.skills.filter(Boolean).join(', ')}</span>
                </React.Fragment>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p) => (
              <div key={p.id} style={{ marginBottom: gap / 1.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: sizes.body + 1 }}>{p.name}</strong>
                  {p.link && <span style={{ color: '#4b5563' }}>{p.link}</span>}
                </div>
                {p.technologies.length > 0 && (
                  <p style={{ color: '#4b5563', fontStyle: 'italic' }}>{p.technologies.filter(Boolean).join(' · ')}</p>
                )}
                <ul style={{ marginTop: 4, paddingLeft: 18, listStyle: 'disc' }}>
                  {p.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: gap / 2, display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <strong>{c.name}</strong>
                  <span style={{ color: '#4b5563' }}> - {c.issuer}</span>
                </span>
                <span style={{ color: '#4b5563' }}>{formatDate(c.date, style.dateFormat)}</span>
              </div>
            ))}
          </Section>
        )}

        {awards.length > 0 && (
          <Section title="Awards">
            {awards.map((a) => (
              <div key={a.id} style={{ marginBottom: gap / 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{a.title}</strong>
                  <span style={{ color: '#4b5563' }}>{formatDate(a.date, style.dateFormat)}</span>
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic' }}>{a.issuer}</p>
                {a.description && <p>{a.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {languages.length > 0 && (
          <Section title="Languages">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 4, columnGap: 16 }}>
              {languages.map((l) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#4b5563', textTransform: 'capitalize' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {referencesMode === 'uponRequest' ? (
          <Section title="References">
            <p style={{ color: '#4b5563', fontStyle: 'italic' }}>References available upon request.</p>
          </Section>
        ) : (
          references.length > 0 && (
            <Section title="References">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: gap / 2 }}>
                {references.map((r) => (
                  <div key={r.id}>
                    <strong>{r.name}</strong>
                    <p style={{ color: '#4b5563', fontStyle: 'italic' }}>{r.relationship}</p>
                    <p>{r.email}</p>
                    <p>{r.phone}</p>
                  </div>
                ))}
              </div>
            </Section>
          )
        )}
          </article>
        </div>
      </div>
    </div>
  )
}
