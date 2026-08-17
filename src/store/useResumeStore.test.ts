import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from './useResumeStore'

const reset = () => useResumeStore.getState().resetStore()

beforeEach(() => {
  reset()
})

describe('useResumeStore: contact & summary', () => {
  it('starts from an empty initial state', () => {
    const state = useResumeStore.getState()
    expect(state.contact.fullName).toBe('')
    expect(state.experience).toEqual([])
    expect(state.activeSection).toBe(0)
  })

  it('updates the contact block', () => {
    useResumeStore.getState().updateContact({
      fullName: 'Wilson',
      email: 'hello@wilsonn.tech',
      phone: '123',
      location: 'Kigali',
    })
    expect(useResumeStore.getState().contact.fullName).toBe('Wilson')
  })

  it('updates the summary', () => {
    useResumeStore.getState().updateSummary('Full-stack engineer')
    expect(useResumeStore.getState().summary).toBe('Full-stack engineer')
  })

  it('tracks the active section', () => {
    useResumeStore.getState().setActiveSection(4)
    expect(useResumeStore.getState().activeSection).toBe(4)
  })
})

describe('useResumeStore: experience CRUD', () => {
  const exp = {
    company: 'WAC TechX',
    position: 'Lead Engineer',
    startDate: '2024-09',
    endDate: '',
    current: true,
    description: ['Led delivery', 'Shipped platforms'],
  }

  it('adds an experience and assigns it an id', () => {
    useResumeStore.getState().addExperience(exp)
    const list = useResumeStore.getState().experience
    expect(list).toHaveLength(1)
    expect(list[0].id).toBeTruthy()
    expect(list[0].company).toBe('WAC TechX')
  })

  it('updates an existing experience by id', () => {
    useResumeStore.getState().addExperience(exp)
    const created = useResumeStore.getState().experience[0]
    useResumeStore.getState().updateExperience({ ...created, position: 'CTO' })
    expect(useResumeStore.getState().experience[0].position).toBe('CTO')
  })

  it('removes an experience by id', () => {
    useResumeStore.getState().addExperience(exp)
    const created = useResumeStore.getState().experience[0]
    useResumeStore.getState().removeExperience(created.id)
    expect(useResumeStore.getState().experience).toHaveLength(0)
  })

  it('reorders experiences', () => {
    useResumeStore.getState().addExperience({ ...exp, company: 'First' })
    useResumeStore.getState().addExperience({ ...exp, company: 'Second' })
    useResumeStore.getState().addExperience({ ...exp, company: 'Third' })

    useResumeStore.getState().reorderExperience(0, 2)
    const order = useResumeStore.getState().experience.map((e) => e.company)
    expect(order).toEqual(['Second', 'Third', 'First'])
  })
})

describe('useResumeStore: other collections', () => {
  it('adds and removes skills', () => {
    useResumeStore.getState().addSkill({ category: 'Frontend', skills: ['React', 'Next.js'] })
    expect(useResumeStore.getState().skills).toHaveLength(1)
    const id = useResumeStore.getState().skills[0].id
    useResumeStore.getState().removeSkill(id)
    expect(useResumeStore.getState().skills).toHaveLength(0)
  })

  it('adds a project with a generated id', () => {
    useResumeStore
      .getState()
      .addProject({ name: 'Dravvy', description: ['Resume builder'], technologies: ['Next.js'] })
    expect(useResumeStore.getState().projects[0].name).toBe('Dravvy')
    expect(useResumeStore.getState().projects[0].id).toBeTruthy()
  })

  it('manages languages and references', () => {
    useResumeStore.getState().addLanguage({ language: 'English', proficiency: 'fluent' })
    useResumeStore
      .getState()
      .addReference({ name: 'Ref', relationship: 'Manager', email: 'r@e.com', phone: '1' })
    expect(useResumeStore.getState().languages).toHaveLength(1)
    expect(useResumeStore.getState().references).toHaveLength(1)
  })

  it('toggles references mode', () => {
    useResumeStore.getState().setReferencesMode('include')
    expect(useResumeStore.getState().referencesMode).toBe('include')
  })
})

describe('useResumeStore: resetStore', () => {
  it('wipes all entered data back to initial', () => {
    const s = useResumeStore.getState()
    s.updateSummary('something')
    s.addSkill({ category: 'Frontend', skills: ['React'] })
    s.setActiveSection(3)

    s.resetStore()

    const after = useResumeStore.getState()
    expect(after.summary).toBe('')
    expect(after.skills).toHaveLength(0)
    expect(after.activeSection).toBe(0)
  })
})
