/**
 * Save and resume.
 *
 * Turns the whole builder state into a single portable JSON file the visitor
 * can keep, and reads that file back so they can carry on exactly where they
 * stopped, on any device or browser. Nothing leaves the machine.
 */
import * as z from 'zod'

import type {
  Award,
  Certification,
  ContactInfo,
  Education,
  Experience,
  Language,
  Project,
  Reference,
  ResumeData,
  ResumeStyle,
  Skill,
} from '@/types/resume'

/** Marker written into every file so we can recognise our own. */
export const SNAPSHOT_FORMAT = 'dravvy.resume-progress'

/** Bumped only when the shape changes in a way older readers cannot handle. */
export const SNAPSHOT_VERSION = 1

export const SNAPSHOT_EXTENSION = '.json'

export type ReferencesMode = 'uponRequest' | 'include'

export type SnapshotResume = ResumeData & { referencesMode: ReferencesMode }

export type SnapshotProgress = {
  builderStep: number
  settingsStep: number
}

export type ResumeSnapshot = {
  format: typeof SNAPSHOT_FORMAT
  version: number
  app: 'Dravvy'
  savedAt: string
  progress: SnapshotProgress
  resume: SnapshotResume
}

/* ----------------------------------------------------------------------
 * Reading: deliberately forgiving. A half-finished draft is the normal
 * case, so every field is optional on the way in and filled in after.
 * -------------------------------------------------------------------- */

const optionalString = z.string().optional()
const optionalStringArray = z.array(z.string()).optional()

const rawContact = z.object({
  fullName: optionalString,
  email: optionalString,
  phone: optionalString,
  location: optionalString,
  website: optionalString,
  linkedin: optionalString,
  github: optionalString,
})

const rawExperience = z.object({
  id: optionalString,
  company: optionalString,
  position: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  current: z.boolean().optional(),
  description: optionalStringArray,
})

const rawEducation = z.object({
  id: optionalString,
  school: optionalString,
  degree: optionalString,
  field: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  gpa: optionalString,
})

const rawSkill = z.object({
  id: optionalString,
  category: optionalString,
  skills: optionalStringArray,
})

const rawProject = z.object({
  id: optionalString,
  name: optionalString,
  description: optionalStringArray,
  technologies: optionalStringArray,
  link: optionalString,
})

const rawCertification = z.object({
  id: optionalString,
  name: optionalString,
  issuer: optionalString,
  date: optionalString,
  link: optionalString,
})

const rawAward = z.object({
  id: optionalString,
  title: optionalString,
  issuer: optionalString,
  date: optionalString,
  description: optionalString,
})

const rawLanguage = z.object({
  id: optionalString,
  language: optionalString,
  proficiency: optionalString,
})

const rawReference = z.object({
  id: optionalString,
  name: optionalString,
  relationship: optionalString,
  email: optionalString,
  phone: optionalString,
})

const rawStyle = z.object({
  theme: optionalString,
  fontSize: optionalString,
  spacing: optionalString,
  color: optionalString,
  font: optionalString,
  separator: optionalString,
  dateFormat: optionalString,
  showLinks: z.boolean().optional(),
  showSkillProficiency: z.boolean().optional(),
})

const rawSnapshot = z.object({
  format: z.literal(SNAPSHOT_FORMAT),
  version: z.number(),
  app: z.string().optional(),
  savedAt: optionalString,
  progress: z
    .object({
      builderStep: z.number().optional(),
      settingsStep: z.number().optional(),
    })
    .optional(),
  resume: z.object({
    contact: rawContact.optional(),
    summary: optionalString,
    experience: z.array(rawExperience).optional(),
    education: z.array(rawEducation).optional(),
    skills: z.array(rawSkill).optional(),
    projects: z.array(rawProject).optional(),
    certifications: z.array(rawCertification).optional(),
    awards: z.array(rawAward).optional(),
    languages: z.array(rawLanguage).optional(),
    references: z.array(rawReference).optional(),
    referencesMode: optionalString,
    style: rawStyle.optional(),
  }),
})

/* ----------------------------------------------------------------------
 * Normalising
 * -------------------------------------------------------------------- */

const PROFICIENCIES = [
  'native',
  'fluent',
  'proficient',
  'intermediate',
  'beginner',
  'basic',
] as const

const THEMES = ['modern', 'classic', 'minimal'] as const
const SIZES = ['small', 'medium', 'large'] as const
const SEPARATORS = ['line', 'double line', 'bold line', 'no separator'] as const
const DATE_FORMATS = ['MM/YYYY', 'MMM YYYY', 'MMMM YYYY'] as const

export const DEFAULT_STYLE: ResumeStyle = {
  theme: 'modern',
  fontSize: 'medium',
  spacing: 'medium',
  color: '#2563eb',
  font: 'helvetica',
  separator: 'line',
  dateFormat: 'MM/YYYY',
  showLinks: true,
  showSkillProficiency: true,
}

let idCounter = 0
/** Stable-enough id for rows that arrive without one. */
const makeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  idCounter += 1
  return `imported-${Date.now()}-${idCounter}`
}

const text = (value: string | undefined): string => value ?? ''
const list = (value: string[] | undefined): string[] => value ?? []

const oneOf = <T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T => (allowed.includes(value as T) ? (value as T) : fallback)

const clampStep = (value: number | undefined, max: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.min(Math.max(Math.trunc(value), 0), max)
}

type Raw = z.infer<typeof rawSnapshot>

function normalizeResume(raw: Raw['resume']): SnapshotResume {
  const contact: ContactInfo = {
    fullName: text(raw.contact?.fullName),
    email: text(raw.contact?.email),
    phone: text(raw.contact?.phone),
    location: text(raw.contact?.location),
    website: raw.contact?.website,
    linkedin: raw.contact?.linkedin,
    github: raw.contact?.github,
  }

  const experience: Experience[] = (raw.experience ?? []).map((item) => ({
    id: item.id || makeId(),
    company: text(item.company),
    position: text(item.position),
    startDate: text(item.startDate),
    endDate: text(item.endDate),
    current: item.current ?? false,
    description: list(item.description),
  }))

  const education: Education[] = (raw.education ?? []).map((item) => ({
    id: item.id || makeId(),
    school: text(item.school),
    degree: text(item.degree),
    field: text(item.field),
    startDate: text(item.startDate),
    endDate: text(item.endDate),
    gpa: item.gpa,
  }))

  const skills: Skill[] = (raw.skills ?? []).map((item) => ({
    id: item.id || makeId(),
    category: text(item.category),
    skills: list(item.skills),
  }))

  const projects: Project[] = (raw.projects ?? []).map((item) => ({
    id: item.id || makeId(),
    name: text(item.name),
    description: list(item.description),
    technologies: list(item.technologies),
    link: item.link,
  }))

  const certifications: Certification[] = (raw.certifications ?? []).map((item) => ({
    id: item.id || makeId(),
    name: text(item.name),
    issuer: text(item.issuer),
    date: text(item.date),
    link: item.link,
  }))

  const awards: Award[] = (raw.awards ?? []).map((item) => ({
    id: item.id || makeId(),
    title: text(item.title),
    issuer: text(item.issuer),
    date: text(item.date),
    description: text(item.description),
  }))

  const languages: Language[] = (raw.languages ?? []).map((item) => ({
    id: item.id || makeId(),
    language: text(item.language),
    proficiency: oneOf(item.proficiency, PROFICIENCIES, 'proficient'),
  }))

  const references: Reference[] = (raw.references ?? []).map((item) => ({
    id: item.id || makeId(),
    name: text(item.name),
    relationship: text(item.relationship),
    email: text(item.email),
    phone: text(item.phone),
  }))

  const style: ResumeStyle = {
    theme: oneOf(raw.style?.theme, THEMES, DEFAULT_STYLE.theme),
    fontSize: oneOf(raw.style?.fontSize, SIZES, DEFAULT_STYLE.fontSize),
    spacing: oneOf(raw.style?.spacing, SIZES, DEFAULT_STYLE.spacing),
    color: /^#[0-9A-Fa-f]{6}$/.test(text(raw.style?.color))
      ? (raw.style?.color as string)
      : DEFAULT_STYLE.color,
    font: raw.style?.font || DEFAULT_STYLE.font,
    separator: oneOf(raw.style?.separator, SEPARATORS, DEFAULT_STYLE.separator),
    dateFormat: oneOf(raw.style?.dateFormat, DATE_FORMATS, DEFAULT_STYLE.dateFormat),
    showLinks: raw.style?.showLinks ?? DEFAULT_STYLE.showLinks,
    showSkillProficiency: raw.style?.showSkillProficiency ?? DEFAULT_STYLE.showSkillProficiency,
  }

  return {
    contact,
    summary: text(raw.summary),
    experience,
    education,
    skills,
    projects,
    certifications,
    awards,
    languages,
    references,
    referencesMode: raw.referencesMode === 'include' ? 'include' : 'uponRequest',
    style,
  }
}

/* ----------------------------------------------------------------------
 * Public API
 * -------------------------------------------------------------------- */

export type BuildSnapshotInput = {
  resume: SnapshotResume
  progress?: Partial<SnapshotProgress>
  savedAt?: Date
}

export function buildSnapshot({ resume, progress, savedAt }: BuildSnapshotInput): ResumeSnapshot {
  return {
    format: SNAPSHOT_FORMAT,
    version: SNAPSHOT_VERSION,
    app: 'Dravvy',
    savedAt: (savedAt ?? new Date()).toISOString(),
    progress: {
      builderStep: clampStep(progress?.builderStep, 8),
      settingsStep: clampStep(progress?.settingsStep, 3),
    },
    resume,
  }
}

export function serializeSnapshot(snapshot: ResumeSnapshot): string {
  return `${JSON.stringify(snapshot, null, 2)}\n`
}

export type ParseResult =
  | { ok: true; snapshot: ResumeSnapshot }
  | { ok: false; error: string }

export function parseSnapshot(raw: string): ParseResult {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'That file is not valid JSON. Pick a file saved by Dravvy.' }
  }

  const parsed = rawSnapshot.safeParse(json)
  if (!parsed.success) {
    const wrongFormat = parsed.error.issues.some((issue) => issue.path[0] === 'format')
    return {
      ok: false,
      error: wrongFormat
        ? 'That file was not saved by Dravvy.'
        : 'That file is a Dravvy file, but its contents are damaged.',
    }
  }

  if (parsed.data.version > SNAPSHOT_VERSION) {
    return {
      ok: false,
      error: 'That file was saved by a newer version of Dravvy. Update this page and try again.',
    }
  }

  return {
    ok: true,
    snapshot: {
      format: SNAPSHOT_FORMAT,
      version: parsed.data.version,
      app: 'Dravvy',
      savedAt: parsed.data.savedAt || new Date().toISOString(),
      progress: {
        builderStep: clampStep(parsed.data.progress?.builderStep, 8),
        settingsStep: clampStep(parsed.data.progress?.settingsStep, 3),
      },
      resume: normalizeResume(parsed.data.resume),
    },
  }
}

/** Slug used for the download name. */
export function slugify(raw: string): string {
  return (
    raw
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'resume'
  )
}

export function snapshotFilename(fullName: string, savedAt: Date = new Date()): string {
  const day = savedAt.toISOString().slice(0, 10)
  return `${slugify(fullName || 'my')}-dravvy-progress-${day}${SNAPSHOT_EXTENSION}`
}

export type SnapshotSummary = {
  name: string
  savedAt: string
  entries: number
  filled: { label: string; count: number }[]
}

/** Human-readable rundown of what a snapshot holds, shown before importing. */
export function summarizeSnapshot(snapshot: ResumeSnapshot): SnapshotSummary {
  const { resume } = snapshot
  const filled = [
    { label: 'Work experience', count: resume.experience.length },
    { label: 'Education', count: resume.education.length },
    { label: 'Skill groups', count: resume.skills.length },
    { label: 'Certifications', count: resume.certifications.length },
    { label: 'Awards', count: resume.awards.length },
    { label: 'Projects', count: resume.projects.length },
    { label: 'Languages', count: resume.languages.length },
    { label: 'References', count: resume.references.length },
  ]

  return {
    name: resume.contact.fullName || 'Unnamed draft',
    savedAt: snapshot.savedAt,
    entries: filled.reduce((total, item) => total + item.count, 0),
    filled: filled.filter((item) => item.count > 0),
  }
}
