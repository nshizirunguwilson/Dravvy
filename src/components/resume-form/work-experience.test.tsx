import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'sonner'

import { WorkExperienceForm } from './work-experience'
import { useResumeStore } from '@/store/useResumeStore'

const seed = () => {
  const s = useResumeStore.getState()
  s.addExperience({
    company: 'Holloway',
    position: 'Lead Designer',
    startDate: '2022-04-01',
    endDate: '',
    current: true,
    description: ['Raised activation', 'Coached three designers'],
  })
  s.addExperience({
    company: 'Northwind',
    position: 'Senior Designer',
    startDate: '2019-08-01',
    endDate: '2022-03-15',
    current: false,
    description: ['Led the design system', 'Shipped payments'],
  })
}

beforeEach(() => useResumeStore.getState().resetStore())

describe('reordering', () => {
  it('moves a role up, which was impossible before', async () => {
    const user = userEvent.setup()
    seed()
    render(<WorkExperienceForm />)

    expect(useResumeStore.getState().experience[0].company).toBe('Holloway')
    await user.click(screen.getByRole('button', { name: /move role 2 up/i }))
    expect(useResumeStore.getState().experience[0].company).toBe('Northwind')
  })

  it('moves a role down', async () => {
    const user = userEvent.setup()
    seed()
    render(<WorkExperienceForm />)

    await user.click(screen.getByRole('button', { name: /move role 1 down/i }))
    expect(useResumeStore.getState().experience[0].company).toBe('Northwind')
  })

  it('cannot move the first one up or the last one down', () => {
    seed()
    render(<WorkExperienceForm />)
    expect(screen.getByRole('button', { name: /move role 1 up/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /move role 2 down/i })).toBeDisabled()
  })
})

describe('removing', () => {
  it('removes a role', async () => {
    const user = userEvent.setup()
    seed()
    render(<WorkExperienceForm />)

    await user.click(screen.getByRole('button', { name: /remove role 1/i }))
    await waitFor(() => expect(useResumeStore.getState().experience).toHaveLength(1))
    expect(useResumeStore.getState().experience[0].company).toBe('Northwind')
  })

  it('offers an undo that puts it back in the same place', async () => {
    const user = userEvent.setup()
    seed()
    // Undo lives in the toast, so the toast host has to be mounted.
    render(
      <>
        <Toaster />
        <WorkExperienceForm />
      </>,
    )

    await user.click(screen.getByRole('button', { name: /remove role 1/i }))
    await waitFor(() => expect(useResumeStore.getState().experience).toHaveLength(1))

    await user.click(await screen.findByRole('button', { name: /undo/i }))
    await waitFor(() => expect(useResumeStore.getState().experience).toHaveLength(2))
    expect(useResumeStore.getState().experience[0].company).toBe('Holloway')
  })
})

describe('validation', () => {
  it('says nothing until you try to save', () => {
    useResumeStore.getState().addExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['', ''],
    })
    render(<WorkExperienceForm />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('marks the exact fields that are wrong, not just a toast', async () => {
    const user = userEvent.setup()
    useResumeStore.getState().addExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['', ''],
    })
    render(<WorkExperienceForm />)

    await user.click(screen.getByRole('button', { name: /save section/i }))

    const jobTitle = await screen.findByLabelText(/job title/i)
    expect(jobTitle).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^company/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(1)
  })

  it('accepts a complete role', async () => {
    const user = userEvent.setup()
    seed()
    render(<WorkExperienceForm />)

    await user.click(screen.getByRole('button', { name: /save section/i }))
    await waitFor(() => {
      expect(screen.queryByText(/fields need attention/i)).not.toBeInTheDocument()
    })
  })
})

describe('bullet points', () => {
  it('adds and removes them, keeping at least two', async () => {
    const user = userEvent.setup()
    seed()
    render(<WorkExperienceForm />)

    await user.click(screen.getAllByRole('button', { name: /add bullet point/i })[0])
    await waitFor(() => {
      expect(useResumeStore.getState().experience[0].description).toHaveLength(3)
    })

    await user.click(screen.getAllByRole('button', { name: /remove bullet point 3/i })[0])
    await waitFor(() => {
      expect(useResumeStore.getState().experience[0].description).toHaveLength(2)
    })
  })
})
