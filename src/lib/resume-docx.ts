import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx'

import type { ResumeData, ResumeStyle } from '@/types/resume'

type DocxFont = 'Times New Roman' | 'Georgia' | 'Cambria' | 'Garamond' | 'Calibri' | 'Helvetica' | 'Arial' | 'Roboto' | 'Lato' | 'Open Sans'

const fontDisplayMap: Record<string, DocxFont> = {
  'times new roman': 'Times New Roman',
  georgia: 'Georgia',
  cambria: 'Cambria',
  garamond: 'Garamond',
  calibri: 'Calibri',
  helvetica: 'Helvetica',
  arial: 'Arial',
  roboto: 'Roboto',
  lato: 'Lato',
  'open sans': 'Open Sans',
}

const fontSizeMap = {
  small: { heading: 32, sub: 18, body: 18 },
  medium: { heading: 40, sub: 22, body: 20 },
  large: { heading: 48, sub: 26, body: 24 },
} as const

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

const hexToDocx = (hex: string) => (/^#?[0-9a-fA-F]{6}$/.test(hex) ? hex.replace('#', '').toUpperCase() : '1F2937')

interface DocxResumeData extends ResumeData {
  referencesMode: 'uponRequest' | 'include'
}

export async function buildResumeDocxBlob(data: DocxResumeData): Promise<Blob> {
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

  const sizes = fontSizeMap[style.fontSize]
  const font = fontDisplayMap[style.font] ?? 'Calibri'
  const accent = hexToDocx(style.color)

  const run = (text: string, opts: Partial<{ bold: boolean; italics: boolean; size: number; color: string }> = {}) =>
    new TextRun({
      text,
      font,
      bold: opts.bold,
      italics: opts.italics,
      size: opts.size ?? sizes.body,
      color: opts.color,
    })

  const paragraph = (children: TextRun[], opts: Partial<{ alignment: (typeof AlignmentType)[keyof typeof AlignmentType]; spacingAfter: number; spacingBefore: number }> = {}) =>
    new Paragraph({
      children,
      alignment: opts.alignment,
      spacing: { after: opts.spacingAfter ?? 80, before: opts.spacingBefore ?? 0 },
    })

  const sectionTitle = (title: string) =>
    new Paragraph({
      children: [run(title.toUpperCase(), { bold: true, size: sizes.sub, color: accent })],
      spacing: { before: 240, after: 100 },
      border: getSeparator(style.separator, accent),
    })

  const rightTab = [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }] as const

  const titleWithDate = (left: TextRun[], right: string) =>
    new Paragraph({
      children: [...left, new TextRun({ text: '\t' }), run(right, { italics: true })],
      tabStops: [...rightTab],
      spacing: { after: 40 },
    })

  const bullet = (text: string) =>
    new Paragraph({
      children: [run(text)],
      bullet: { level: 0 },
      spacing: { after: 40 },
    })

  const blocks: Paragraph[] = []

  // Header
  blocks.push(
    new Paragraph({
      children: [run(contact.fullName || 'Your Name', { bold: true, size: sizes.heading })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 160, line: 360 },
    })
  )

  type ContactBit =
    | { kind: 'text'; value: string }
    | { kind: 'link'; label: string; href: string }

  const contactItems: ContactBit[] = []
  if (contact.location) contactItems.push({ kind: 'text', value: contact.location })
  if (contact.phone) contactItems.push({ kind: 'text', value: contact.phone })
  if (contact.email) contactItems.push({ kind: 'link', label: contact.email, href: `mailto:${contact.email}` })
  if (contact.linkedin) contactItems.push({ kind: 'link', label: 'LinkedIn', href: contact.linkedin })
  if (contact.github) contactItems.push({ kind: 'link', label: 'GitHub', href: contact.github })
  if (contact.website) contactItems.push({ kind: 'link', label: 'Portfolio', href: contact.website })

  if (contactItems.length > 0) {
    const children: (TextRun | ExternalHyperlink)[] = []
    contactItems.forEach((item, index) => {
      if (index > 0) children.push(run('  •  '))
      if (item.kind === 'text') {
        children.push(run(item.value))
      } else {
        children.push(
          new ExternalHyperlink({
            link: item.href,
            children: [run(item.label, { color: '2563EB' })],
          })
        )
      }
    })
    blocks.push(
      new Paragraph({
        children,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
  }

  if (summary) {
    blocks.push(sectionTitle('Professional Summary'))
    blocks.push(paragraph([run(summary)]))
  }

  if (experience.length > 0) {
    blocks.push(sectionTitle('Experience'))
    for (const exp of experience) {
      blocks.push(
        titleWithDate(
          [run(exp.position, { bold: true })],
          `${formatDate(exp.startDate, style.dateFormat)} - ${exp.current ? 'Present' : formatDate(exp.endDate, style.dateFormat)}`
        )
      )
      blocks.push(paragraph([run(exp.company, { italics: true })], { spacingAfter: 40 }))
      for (const d of exp.description) blocks.push(bullet(d))
    }
  }

  if (education.length > 0) {
    blocks.push(sectionTitle('Education'))
    for (const edu of education) {
      blocks.push(
        titleWithDate(
          [run(`${edu.degree}${edu.field ? `, ${edu.field}` : ''}`, { bold: true })],
          `${formatDate(edu.startDate, style.dateFormat)} - ${formatDate(edu.endDate, style.dateFormat)}`
        )
      )
      const detail = `${edu.school}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`
      blocks.push(paragraph([run(detail, { italics: true })]))
    }
  }

  if (skills.length > 0) {
    blocks.push(sectionTitle('Skills'))
    for (const s of skills) {
      blocks.push(
        new Paragraph({
          children: [
            run(`${s.category}: `, { bold: true }),
            run(s.skills.filter(Boolean).join(', ')),
          ],
          spacing: { after: 40 },
        })
      )
    }
  }

  if (projects.length > 0) {
    blocks.push(sectionTitle('Projects'))
    for (const p of projects) {
      blocks.push(
        titleWithDate([run(p.name, { bold: true })], p.link ?? '')
      )
      if (p.technologies.length > 0) {
        blocks.push(paragraph([run(p.technologies.filter(Boolean).join(' · '), { italics: true })], { spacingAfter: 40 }))
      }
      for (const d of p.description) blocks.push(bullet(d))
    }
  }

  if (certifications.length > 0) {
    blocks.push(sectionTitle('Certifications'))
    for (const c of certifications) {
      blocks.push(
        titleWithDate(
          [run(c.name, { bold: true }), run(` — ${c.issuer}`)],
          formatDate(c.date, style.dateFormat)
        )
      )
    }
  }

  if (awards.length > 0) {
    blocks.push(sectionTitle('Awards'))
    for (const a of awards) {
      blocks.push(
        titleWithDate([run(a.title, { bold: true })], formatDate(a.date, style.dateFormat))
      )
      blocks.push(paragraph([run(a.issuer, { italics: true })], { spacingAfter: 40 }))
      if (a.description) blocks.push(paragraph([run(a.description)]))
    }
  }

  if (languages.length > 0) {
    blocks.push(sectionTitle('Languages'))
    for (const l of languages) {
      blocks.push(
        titleWithDate([run(l.language, { bold: true })], l.proficiency.charAt(0).toUpperCase() + l.proficiency.slice(1))
      )
    }
  }

  blocks.push(sectionTitle('References'))
  if (referencesMode === 'uponRequest') {
    blocks.push(paragraph([run('References available upon request.', { italics: true })]))
  } else {
    for (const r of references) {
      blocks.push(paragraph([run(r.name, { bold: true })], { spacingAfter: 20 }))
      blocks.push(paragraph([run(r.relationship, { italics: true })], { spacingAfter: 20 }))
      blocks.push(paragraph([run(`${r.email} • ${r.phone}`)]))
    }
  }

  const doc = new Document({
    creator: 'Dravvy',
    title: contact.fullName ? `${contact.fullName} - Resume` : 'Resume',
    styles: {
      default: {
        document: {
          run: { font, size: sizes.body },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: blocks,
      },
    ],
  })

  return Packer.toBlob(doc)
}

function getSeparator(separator: ResumeStyle['separator'], accent: string) {
  switch (separator) {
    case 'no separator':
      return undefined
    case 'double line':
      return {
        bottom: {
          color: accent,
          space: 1,
          style: BorderStyle.DOUBLE,
          size: 6,
        },
      }
    case 'bold line':
      return {
        bottom: {
          color: accent,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 18,
        },
      }
    default:
      return {
        bottom: {
          color: accent,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      }
  }
}
