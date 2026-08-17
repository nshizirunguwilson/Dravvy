import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from './useResumeStore'

const store = () => useResumeStore.getState()

beforeEach(() => {
  store().resetStore()
})

describe('useResumeStore: education CRUD', () => {
  const edu = {
    school: 'ALU',
    degree: 'BSc',
    field: 'Software Engineering',
    startDate: '2025-05',
    endDate: '2028-03',
  }

  it('adds, updates, removes and reorders education', () => {
    store().addEducation({ ...edu, school: 'First' })
    store().addEducation({ ...edu, school: 'Second' })
    expect(store().education).toHaveLength(2)

    const first = store().education[0]
    store().updateEducation({ ...first, degree: 'MSc' })
    expect(store().education[0].degree).toBe('MSc')

    store().reorderEducation(0, 1)
    expect(store().education.map((e) => e.school)).toEqual(['Second', 'First'])

    store().removeEducation(store().education[0].id)
    expect(store().education).toHaveLength(1)
  })
})

describe('useResumeStore: certifications CRUD', () => {
  const cert = { name: 'RWD', issuer: 'freeCodeCamp', date: '2026' }

  it('adds, updates, removes and reorders certifications', () => {
    store().addCertification({ ...cert, name: 'A' })
    store().addCertification({ ...cert, name: 'B' })
    expect(store().certifications).toHaveLength(2)

    const a = store().certifications[0]
    store().updateCertification({ ...a, issuer: 'ALX' })
    expect(store().certifications[0].issuer).toBe('ALX')

    store().reorderCertifications(0, 1)
    expect(store().certifications.map((c) => c.name)).toEqual(['B', 'A'])

    store().removeCertification(store().certifications[0].id)
    expect(store().certifications).toHaveLength(1)
  })
})

describe('useResumeStore: awards CRUD', () => {
  const award = { title: 'Top Performer', issuer: 'WAC TechX', date: '2025', description: 'Recognised' }

  it('adds, updates, removes and reorders awards', () => {
    store().addAward({ ...award, title: 'A' })
    store().addAward({ ...award, title: 'B' })
    expect(store().awards).toHaveLength(2)

    const a = store().awards[0]
    store().updateAward({ ...a, description: 'Updated' })
    expect(store().awards[0].description).toBe('Updated')

    store().reorderAwards(0, 1)
    expect(store().awards.map((x) => x.title)).toEqual(['B', 'A'])

    store().removeAward(store().awards[0].id)
    expect(store().awards).toHaveLength(1)
  })
})

describe('useResumeStore: skills & projects update/reorder', () => {
  it('updates and reorders skills', () => {
    store().addSkill({ category: 'Frontend', skills: ['React'] })
    store().addSkill({ category: 'Backend', skills: ['Node'] })

    const frontend = store().skills[0]
    store().updateSkill({ ...frontend, skills: ['React', 'Next.js'] })
    expect(store().skills[0].skills).toEqual(['React', 'Next.js'])

    store().reorderSkills(0, 1)
    expect(store().skills.map((s) => s.category)).toEqual(['Backend', 'Frontend'])
  })

  it('updates, removes and reorders projects', () => {
    store().addProject({ name: 'A', description: ['x'], technologies: ['Next.js'] })
    store().addProject({ name: 'B', description: ['y'], technologies: ['Nest.js'] })

    const a = store().projects[0]
    store().updateProject({ ...a, name: 'A2' })
    expect(store().projects[0].name).toBe('A2')

    store().reorderProjects(0, 1)
    expect(store().projects.map((p) => p.name)).toEqual(['B', 'A2'])

    store().removeProject(store().projects[0].id)
    expect(store().projects).toHaveLength(1)
  })
})

describe('useResumeStore: languages & references update/remove', () => {
  it('updates and removes languages', () => {
    store().addLanguage({ language: 'English', proficiency: 'fluent' })
    const lang = store().languages[0]
    store().updateLanguage({ ...lang, proficiency: 'native' })
    expect(store().languages[0].proficiency).toBe('native')

    store().removeLanguage(store().languages[0].id)
    expect(store().languages).toHaveLength(0)
  })

  it('updates and removes references', () => {
    store().addReference({ name: 'Ref', relationship: 'Manager', email: 'r@e.com', phone: '1' })
    const ref = store().references[0]
    store().updateReference({ ...ref, relationship: 'Mentor' })
    expect(store().references[0].relationship).toBe('Mentor')

    store().removeReference(store().references[0].id)
    expect(store().references).toHaveLength(0)
  })
})
