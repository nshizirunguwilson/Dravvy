import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const saveAs = vi.fn()
vi.mock('file-saver', () => ({ saveAs: (...args: unknown[]) => saveAs(...args) }))

import { ExportForm } from './export-form'
import { useResumeStore } from '@/store/useResumeStore'

beforeEach(() => {
  saveAs.mockClear()
  useResumeStore.getState().resetStore()
})

const named = () =>
  useResumeStore
    .getState()
    .updateContact({ fullName: 'Avery Lin', email: 'a@b.com', phone: '1', location: 'Kigali' })

describe('ExportForm', () => {
  it('will not export until there is a name on the resume', async () => {
    render(<ExportForm />)
    expect(await screen.findByRole('button', { name: /download pdf/i })).toBeDisabled()
    expect(screen.getByText(/add your full name/i)).toBeInTheDocument()
  })

  it('suggests a filename from the name', async () => {
    named()
    render(<ExportForm />)
    await waitFor(() =>
      expect(screen.getByLabelText(/file name/i)).toHaveValue('avery-lin-resume'),
    )
  })

  it('offers PDF and DOCX as a radio group', async () => {
    named()
    render(<ExportForm />)
    const group = await screen.findByRole('radiogroup', { name: /export format/i })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /PDF/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /DOCX/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('switches the chosen format', async () => {
    const user = userEvent.setup()
    named()
    render(<ExportForm />)
    await user.click(await screen.findByRole('radio', { name: /DOCX/ }))
    expect(screen.getByRole('radio', { name: /DOCX/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('button', { name: /download docx/i })).toBeInTheDocument()
  })

  it('lets you rename the file', async () => {
    const user = userEvent.setup()
    named()
    render(<ExportForm />)
    const input = await screen.findByLabelText(/file name/i)
    await user.clear(input)
    await user.type(input, 'my-cv')
    expect(input).toHaveValue('my-cv')
  })
})
