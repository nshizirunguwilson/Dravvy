import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ResumeForm, type ResumeSection } from './index'
import { useResumeStore } from '@/store/useResumeStore'

beforeEach(() => useResumeStore.getState().resetStore())

/**
 * Types into every editable field of every section and checks the value lands
 * in the store. This is what proves each handler is wired, section by section,
 * rather than trusting that they all look the same.
 */
const SECTIONS: { section: ResumeSection; add?: RegExp; read: () => string }[] = [
  { section: 'work', add: /add role/i, read: () => JSON.stringify(useResumeStore.getState().experience) },
  { section: 'education', add: /add qualification/i, read: () => JSON.stringify(useResumeStore.getState().education) },
  { section: 'skills', add: /add category/i, read: () => JSON.stringify(useResumeStore.getState().skills) },
  { section: 'certifications', add: /add certification/i, read: () => JSON.stringify(useResumeStore.getState().certifications) },
  { section: 'awards', add: /add award/i, read: () => JSON.stringify(useResumeStore.getState().awards) },
  { section: 'projects', add: /add project/i, read: () => JSON.stringify(useResumeStore.getState().projects) },
  { section: 'languages', add: /add language/i, read: () => JSON.stringify(useResumeStore.getState().languages) },
]

describe.each(SECTIONS)('$section fields', ({ section, add, read }) => {
  it('writes every text field through to the store', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section={section} />)
    if (add) await user.click(screen.getByRole('button', { name: add }))

    const typeable = screen
      .getAllByRole('textbox')
      .filter((el) => !(el as HTMLInputElement).disabled)

    expect(typeable.length).toBeGreaterThan(0)
    for (const [index, el] of typeable.entries()) {
      await user.type(el, `v${index}`)
    }

    await waitFor(() => {
      for (const [index] of typeable.entries()) {
        expect(read()).toContain(`v${index}`)
      }
    })
  })

  it('records a date when the section has one', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section={section} />)
    if (add) await user.click(screen.getByRole('button', { name: add }))

    const dates = document.querySelectorAll<HTMLInputElement>('input[type="date"]:not([disabled])')
    if (dates.length === 0) return
    for (const input of Array.from(dates)) {
      await user.type(input, '2022-04-01')
    }
    await waitFor(() => expect(read()).toContain('2022-04-01'))
  })
})

describe('basic information fields', () => {
  it('writes every contact field and the summary', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section="basic" />)

    const values: Record<string, string> = {
      'full name': 'Avery Lin',
      email: 'avery@example.com',
      phone: '0700000000',
      location: 'Kigali',
      'personal website': 'https://avery.dev',
      'linkedin profile': 'https://linkedin.com/in/avery',
      'github profile': 'https://github.com/avery',
      'professional summary': 'Designer of things.',
    }

    for (const [label, value] of Object.entries(values)) {
      await user.type(screen.getByLabelText(new RegExp(label, 'i')), value)
    }

    await waitFor(() => {
      const { contact, summary } = useResumeStore.getState()
      expect(contact.fullName).toBe('Avery Lin')
      expect(contact.email).toBe('avery@example.com')
      expect(contact.phone).toBe('0700000000')
      expect(contact.location).toBe('Kigali')
      expect(contact.website).toBe('https://avery.dev')
      expect(contact.linkedin).toBe('https://linkedin.com/in/avery')
      expect(contact.github).toBe('https://github.com/avery')
      expect(summary).toBe('Designer of things.')
    })
  })

  it('toggles the current role checkbox', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section="work" />)
    await user.click(screen.getByRole('button', { name: /add role/i }))
    await user.click(screen.getByRole('checkbox', { name: /currently work here/i }))
    await waitFor(() => expect(useResumeStore.getState().experience[0].current).toBe(true))
  })
})

describe('references fields', () => {
  it('writes a named reference through to the store', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section="references" />)
    await user.click(screen.getByRole('radio', { name: /named references/i }))
    await user.click(await screen.findByRole('button', { name: /add reference/i }))

    await user.type(screen.getByLabelText(/^name/i), 'Priya Nair')
    await user.type(screen.getByLabelText(/relationship/i), 'Former manager')
    await user.type(screen.getByLabelText(/email/i), 'priya@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+1 555')

    await waitFor(() => {
      const ref = useResumeStore.getState().references[0]
      expect(ref.name).toBe('Priya Nair')
      expect(ref.relationship).toBe('Former manager')
      expect(ref.email).toBe('priya@example.com')
    })
  })
})
