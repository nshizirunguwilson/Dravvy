import { describe, expect, it } from 'vitest'

import { RESUME_INK, RESUME_THEMES, resumeTheme, sectionInkColor } from './resume-theme'

describe('resumeTheme', () => {
  it('returns the spec for each named theme', () => {
    expect(resumeTheme('modern').id).toBe('modern')
    expect(resumeTheme('classic').id).toBe('classic')
    expect(resumeTheme('minimal').id).toBe('minimal')
  })

  it('falls back to modern for anything unknown', () => {
    expect(resumeTheme(undefined).id).toBe('modern')
    expect(resumeTheme('neon' as never).id).toBe('modern')
  })

  it('gives the three themes genuinely different treatments', () => {
    const specs = Object.values(RESUME_THEMES)
    expect(new Set(specs.map((s) => s.headerAlign)).size).toBeGreaterThan(1)
    expect(new Set(specs.map((s) => s.rulePlacement)).size).toBeGreaterThan(1)
    expect(new Set(specs.map((s) => s.sectionInk)).size).toBe(3)
  })

  it('only capitalises the name for classic', () => {
    expect(RESUME_THEMES.classic.nameUppercase).toBe(true)
    expect(RESUME_THEMES.modern.nameUppercase).toBe(false)
    expect(RESUME_THEMES.minimal.nameUppercase).toBe(false)
  })

  it('gives minimal a short rule and the others a full-width one', () => {
    expect(RESUME_THEMES.minimal.ruleWidth).toBeLessThan(0.5)
    expect(RESUME_THEMES.modern.ruleWidth).toBe(1)
    expect(RESUME_THEMES.classic.ruleWidth).toBe(1)
  })
})

describe('sectionInkColor', () => {
  it('uses the accent when the theme asks for it', () => {
    expect(sectionInkColor(RESUME_THEMES.modern, '#2563eb')).toBe('#2563eb')
  })

  it('uses a fixed ink when the theme does not', () => {
    expect(sectionInkColor(RESUME_THEMES.classic, '#2563eb')).toBe(RESUME_INK.ink)
    expect(sectionInkColor(RESUME_THEMES.minimal, '#2563eb')).toBe(RESUME_INK.muted)
  })
})
