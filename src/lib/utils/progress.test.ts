import { describe, it, expect } from 'vitest'
import type { ResumeData } from '@/types/resume'
import { calculateProgress, getProgressMessage } from './progress'

const completeContact: ResumeData['contact'] = {
  fullName: 'Wilson Nshizirungu',
  email: 'hello@wilsonn.tech',
  phone: '+250000000000',
  location: 'Kigali, Rwanda',
}

describe('calculateProgress', () => {
  it('returns 0 for an empty resume', () => {
    expect(calculateProgress({})).toBe(0)
  })

  it('counts the contact section only when all four core fields exist', () => {
    expect(calculateProgress({ contact: completeContact })).toBe(13) // 1/8 rounded
  })

  it('does not count an incomplete contact section', () => {
    expect(
      calculateProgress({
        contact: { ...completeContact, location: '' },
      }),
    ).toBe(0)
  })

  it('counts list-based sections when they have at least one entry', () => {
    expect(
      calculateProgress({
        skills: [{ id: '1', category: 'Frontend', skills: ['React'] }],
      }),
    ).toBe(13)
  })

  it('reaches 50% with four of eight sections complete', () => {
    expect(
      calculateProgress({
        contact: completeContact,
        experience: [
          {
            id: '1',
            company: 'WAC TechX',
            position: 'Lead Engineer',
            startDate: '2024-09',
            endDate: '',
            current: true,
            description: ['Led delivery', 'Shipped platforms'],
          },
        ],
        education: [
          {
            id: '1',
            school: 'ALU',
            degree: 'BSc',
            field: 'Software Engineering',
            startDate: '2025-05',
            endDate: '2028-03',
          },
        ],
        skills: [{ id: '1', category: 'Frontend', skills: ['React'] }],
      }),
    ).toBe(50)
  })

  it('reaches 100% when every section is complete', () => {
    expect(
      calculateProgress({
        contact: completeContact,
        experience: [
          {
            id: '1',
            company: 'WAC TechX',
            position: 'Lead Engineer',
            startDate: '2024-09',
            endDate: '',
            current: true,
            description: ['a', 'b'],
          },
        ],
        education: [
          { id: '1', school: 'ALU', degree: 'BSc', field: 'SE', startDate: '2025', endDate: '2028' },
        ],
        skills: [{ id: '1', category: 'Frontend', skills: ['React'] }],
        certifications: [{ id: '1', name: 'RWD', issuer: 'freeCodeCamp', date: '2026' }],
        projects: [{ id: '1', name: 'Dravvy', description: ['x'], technologies: ['Next.js'] }],
        languages: [{ id: '1', language: 'English', proficiency: 'fluent' }],
        references: [
          { id: '1', name: 'Ref', relationship: 'Manager', email: 'r@e.com', phone: '123' },
        ],
      }),
    ).toBe(100)
  })
})

describe('getProgressMessage', () => {
  it.each([
    [0, 'Start building your resume!'],
    [13, "Keep going! You're just getting started."],
    [25, 'Making good progress!'],
    [40, 'Making good progress!'],
    [50, 'Almost there!'],
    [74, 'Almost there!'],
    [75, 'Just a few more details needed!'],
    [90, 'Just a few more details needed!'],
    [100, 'Perfect! Your resume is complete!'],
  ])('maps %i%% to the right message', (progress, message) => {
    expect(getProgressMessage(progress)).toBe(message)
  })
})
