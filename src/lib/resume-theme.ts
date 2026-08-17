/**
 * What "modern", "classic" and "minimal" actually mean.
 *
 * One spec table, read by all three renderers (live preview, PDF, DOCX), so a
 * theme cannot drift between what you see and what you send. Every knob here
 * is deliberately independent of the other styling options: picking a theme
 * never disables the separator, accent, size, spacing or date choices, it only
 * changes heading treatment, header alignment and where the rule sits.
 */
import type { ResumeStyle } from '@/types/resume'

export type ResumeThemeId = ResumeStyle['theme']

export type ResumeThemeSpec = {
  id: ResumeThemeId
  label: string
  /** Where the name and contact line sit. */
  headerAlign: 'center' | 'left'
  /** Set the person's name in capitals. */
  nameUppercase: boolean
  /** Letter spacing on the name, in em. */
  nameTracking: number
  /** Which ink the section headings take. */
  sectionInk: 'accent' | 'ink' | 'muted'
  /** Multiplier on the section heading size. */
  sectionScale: number
  /** Letter spacing on section headings, in em. */
  sectionTracking: number
  /** Whether the separator rule sits above or below the heading. */
  rulePlacement: 'above' | 'below'
  /** Fraction of the content width the rule spans. */
  ruleWidth: number
}

/** Fixed inks. The page is always white paper, so these never vary by app theme. */
export const RESUME_INK = {
  ink: '#111827',
  muted: '#6b7280',
} as const

export const RESUME_THEMES: Record<ResumeThemeId, ResumeThemeSpec> = {
  modern: {
    id: 'modern',
    label: 'Modern',
    headerAlign: 'center',
    nameUppercase: false,
    nameTracking: 0.01,
    sectionInk: 'accent',
    sectionScale: 1,
    sectionTracking: 0.08,
    rulePlacement: 'above',
    ruleWidth: 1,
  },
  classic: {
    id: 'classic',
    label: 'Classic',
    headerAlign: 'center',
    nameUppercase: true,
    nameTracking: 0.06,
    sectionInk: 'ink',
    sectionScale: 1.06,
    sectionTracking: 0.02,
    rulePlacement: 'below',
    ruleWidth: 1,
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    headerAlign: 'left',
    nameUppercase: false,
    nameTracking: -0.01,
    sectionInk: 'muted',
    sectionScale: 0.86,
    sectionTracking: 0.16,
    rulePlacement: 'above',
    ruleWidth: 0.25,
  },
}

export function resumeTheme(theme: ResumeStyle['theme'] | undefined): ResumeThemeSpec {
  return RESUME_THEMES[theme as ResumeThemeId] ?? RESUME_THEMES.modern
}

/** Resolves a theme's section-heading ink against the chosen accent colour. */
export function sectionInkColor(spec: ResumeThemeSpec, accent: string): string {
  if (spec.sectionInk === 'accent') return accent
  return RESUME_INK[spec.sectionInk]
}
