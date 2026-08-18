import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ResumeForm, type ResumeSection } from './index'
import { useResumeStore } from '@/store/useResumeStore'

beforeEach(() => useResumeStore.getState().resetStore())

/** Every list section: the add button, its empty state, and its entry count. */
const LIST_SECTIONS: {
  section: ResumeSection
  addLabel: RegExp
  emptyHint: RegExp
  count: () => number
}[] = [
  { section: 'work', addLabel: /add role/i, emptyHint: /Add your first role to begin/i, count: () => useResumeStore.getState().experience.length },
  { section: 'education', addLabel: /add qualification/i, emptyHint: /Add an institution to begin/i, count: () => useResumeStore.getState().education.length },
  { section: 'skills', addLabel: /add category/i, emptyHint: /Group your skills by category/i, count: () => useResumeStore.getState().skills.length },
  { section: 'certifications', addLabel: /add certification/i, emptyHint: /Add a certification to begin/i, count: () => useResumeStore.getState().certifications.length },
  { section: 'awards', addLabel: /add award/i, emptyHint: /Add an award or honour to begin/i, count: () => useResumeStore.getState().awards.length },
  { section: 'projects', addLabel: /add project/i, emptyHint: /project worth highlighting/i, count: () => useResumeStore.getState().projects.length },
  { section: 'languages', addLabel: /add language/i, emptyHint: /Add a language you speak/i, count: () => useResumeStore.getState().languages.length },
]

describe.each(LIST_SECTIONS)('$section section', ({ section, addLabel, emptyHint, count }) => {
  it('tells you it is empty before you add anything', () => {
    render(<ResumeForm section={section} />)
    expect(screen.getByText(emptyHint)).toBeInTheDocument()
  })

  it('adds an entry', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section={section} />)
    await user.click(screen.getByRole('button', { name: addLabel }))
    await waitFor(() => expect(count()).toBe(1))
  })

  it('marks the empty required fields when you try to save', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section={section} />)
    await user.click(screen.getByRole('button', { name: addLabel }))
    await user.click(screen.getByRole('button', { name: /save section/i }))
    await waitFor(() => {
      expect(screen.getByText(/needs attention|need attention/i)).toBeInTheDocument()
    })
  })

  it('offers reorder controls once there are two entries', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section={section} />)
    await user.click(screen.getByRole('button', { name: addLabel }))
    await user.click(screen.getByRole('button', { name: addLabel }))
    await waitFor(() => expect(count()).toBe(2))
    expect(screen.getByRole('button', { name: /move .* 2 up/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /move .* 1 down/i })).toBeEnabled()
  })
})

describe('basic information', () => {
  it('writes straight through to the store', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section="basic" />)
    await user.type(screen.getByLabelText(/full name/i), 'Avery Lin')
    await waitFor(() => expect(useResumeStore.getState().contact.fullName).toBe('Avery Lin'))
  })

  it('names the fields that are wrong rather than only warning', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section="basic" />)
    await user.click(screen.getByRole('button', { name: /save section/i }))

    expect(await screen.findByText(/need attention/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/professional summary/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('stops complaining once everything is filled in', async () => {
    const user = userEvent.setup()
    const s = useResumeStore.getState()
    s.updateContact({ fullName: 'A', email: 'a@b.com', phone: '1', location: 'Kigali' })
    s.updateSummary('A short summary.')

    render(<ResumeForm section="basic" />)
    await user.click(screen.getByRole('button', { name: /save section/i }))
    await waitFor(() => {
      expect(screen.queryByText(/need attention/i)).not.toBeInTheDocument()
    })
  })
})

describe('references', () => {
  it('starts on the upon request option and needs no entries', () => {
    render(<ResumeForm section="references" />)
    expect(screen.getByRole('radio', { name: /available upon request/i })).toBeChecked()
    expect(screen.getByRole('button', { name: /save section/i })).toBeInTheDocument()
  })

  it('asks for named references only when you choose them', async () => {
    const user = userEvent.setup()
    render(<ResumeForm section="references" />)
    await user.click(screen.getByRole('radio', { name: /named references/i }))
    expect(await screen.findByRole('button', { name: /add reference/i })).toBeInTheDocument()
    expect(useResumeStore.getState().referencesMode).toBe('include')
  })
})
