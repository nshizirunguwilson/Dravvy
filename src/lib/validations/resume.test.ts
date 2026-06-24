import { describe, it, expect } from 'vitest'
import {
  contactSchema,
  experienceSchema,
  projectSchema,
  languageSchema,
  styleSchema,
} from './resume'

describe('contactSchema', () => {
  const valid = {
    fullName: 'Wilson Nshizirungu',
    email: 'hello@wilsonn.tech',
    phone: '+250000000000',
    location: 'Kigali',
  }

  it('accepts a valid contact', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts an empty string for the optional website', () => {
    expect(contactSchema.safeParse({ ...valid, website: '' }).success).toBe(true)
  })

  it('accepts a valid URL for the website', () => {
    expect(
      contactSchema.safeParse({ ...valid, website: 'https://wilsonn.tech' }).success,
    ).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('rejects a malformed website URL', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'nope' }).success).toBe(false)
  })

  it('rejects a missing full name', () => {
    expect(contactSchema.safeParse({ ...valid, fullName: '' }).success).toBe(false)
  })
})

describe('experienceSchema', () => {
  const base = {
    company: 'WAC TechX',
    position: 'Lead Engineer',
    startDate: '2024-09',
    endDate: '2025-01',
    current: false,
  }

  it('requires between two and four description points', () => {
    expect(experienceSchema.safeParse({ ...base, description: ['only one'] }).success).toBe(false)
    expect(experienceSchema.safeParse({ ...base, description: ['a', 'b'] }).success).toBe(true)
    expect(
      experienceSchema.safeParse({ ...base, description: ['a', 'b', 'c', 'd', 'e'] }).success,
    ).toBe(false)
  })
})

describe('projectSchema', () => {
  it('requires at least one technology', () => {
    const result = projectSchema.safeParse({
      name: 'Dravvy',
      description: ['A resume builder'],
      technologies: [],
    })
    expect(result.success).toBe(false)
  })

  it('accepts a fully formed project', () => {
    expect(
      projectSchema.safeParse({
        name: 'Dravvy',
        description: ['A resume builder'],
        technologies: ['Next.js', 'TypeScript'],
        link: 'https://dravvy.app',
      }).success,
    ).toBe(true)
  })
})

describe('languageSchema', () => {
  it('accepts a known proficiency level', () => {
    expect(languageSchema.safeParse({ language: 'English', proficiency: 'fluent' }).success).toBe(
      true,
    )
  })

  it('rejects an unknown proficiency level', () => {
    expect(languageSchema.safeParse({ language: 'English', proficiency: 'wizard' }).success).toBe(
      false,
    )
  })
})

describe('styleSchema', () => {
  const valid = {
    theme: 'modern',
    fontSize: 'medium',
    spacing: 'medium',
    color: '#2563eb',
    font: 'helvetica',
    separator: 'line',
    dateFormat: 'MM/YYYY',
  }

  it('accepts a valid style configuration', () => {
    expect(styleSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a non-hex color', () => {
    expect(styleSchema.safeParse({ ...valid, color: 'blue' }).success).toBe(false)
  })

  it('rejects a 3-digit hex color (requires full 6 digits)', () => {
    expect(styleSchema.safeParse({ ...valid, color: '#abc' }).success).toBe(false)
  })
})
