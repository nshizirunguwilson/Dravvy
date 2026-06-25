import { describe, it, expect } from 'vitest'
import { buildResumeDocxBlob } from './resume-docx'
import type { ResumeData } from '@/types/resume'

const data: ResumeData & { referencesMode: 'uponRequest' | 'include' } = {
  contact: {
    fullName: 'Wilson Nshizirungu',
    email: 'hello@wilsonn.tech',
    phone: '+250000000000',
    location: 'Kigali, Rwanda',
    website: 'https://wilsonn.tech',
    linkedin: 'https://linkedin.com/in/nshizirunguwilson',
    github: 'https://github.com/nshizirunguwilson',
  },
  summary: 'Full-stack engineer shipping production software end to end.',
  experience: [
    {
      id: '1',
      company: 'WAC TechX',
      position: 'Lead Engineer',
      startDate: '2024-09-01',
      endDate: '',
      current: true,
      description: ['Led engineering and client delivery', 'Shipped production platforms'],
    },
  ],
  education: [
    {
      id: '1',
      school: 'African Leadership University',
      degree: 'BSc',
      field: 'Software Engineering',
      startDate: '2025-05-01',
      endDate: '2028-03-01',
    },
  ],
  skills: [{ id: '1', category: 'Frontend', skills: ['React', 'Next.js', 'TypeScript'] }],
  projects: [
    {
      id: '1',
      name: 'Dravvy',
      description: ['Browser-only resume builder'],
      technologies: ['Next.js', 'TypeScript'],
      link: 'https://dravvy.app',
    },
  ],
  certifications: [
    { id: '1', name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: '2026-06-01' },
  ],
  awards: [
    { id: '1', title: 'Top Performer', issuer: 'WAC TechX', date: '2025-01-01', description: 'Recognised' },
  ],
  languages: [{ id: '1', language: 'English', proficiency: 'fluent' }],
  references: [
    { id: '1', name: 'Reference', relationship: 'Manager', email: 'r@example.com', phone: '123' },
  ],
  style: {
    theme: 'modern',
    fontSize: 'medium',
    spacing: 'medium',
    color: '#2563eb',
    font: 'helvetica',
    separator: 'line',
    dateFormat: 'MM/YYYY',
    showLinks: true,
    showSkillProficiency: true,
  },
  referencesMode: 'include',
}

describe('buildResumeDocxBlob', () => {
  it('produces a non-empty Blob', async () => {
    const blob = await buildResumeDocxBlob(data)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBeGreaterThan(0)
  })

  it('produces a valid Office Open XML (zip) document', async () => {
    const blob = await buildResumeDocxBlob(data)
    const bytes = new Uint8Array(await blob.arrayBuffer())
    // DOCX files are ZIP archives — they start with the "PK" signature.
    expect(bytes[0]).toBe(0x50)
    expect(bytes[1]).toBe(0x4b)
  })

  it('still builds when optional sections are empty', async () => {
    const minimal = {
      ...data,
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      awards: [],
      references: [],
      referencesMode: 'uponRequest' as const,
    }
    const blob = await buildResumeDocxBlob(minimal)
    expect(blob.size).toBeGreaterThan(0)
  })
})
