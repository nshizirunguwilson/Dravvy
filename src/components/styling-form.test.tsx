import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StylingForm } from './styling-form'
import { useResumeStore } from '@/store/useResumeStore'

beforeEach(() => useResumeStore.getState().resetStore())

const style = () => useResumeStore.getState().style

describe('accent colour', () => {
  it('applies a preset', async () => {
    const user = userEvent.setup()
    render(<StylingForm />)
    await user.click(screen.getByRole('button', { name: /use forest/i }))
    await user.click(screen.getByRole('button', { name: /save styling/i }))
    await waitFor(() => expect(style().color.toLowerCase()).toBe('#15803d'))
  })

  it('offers nine presets and a custom picker', () => {
    render(<StylingForm />)
    expect(screen.getAllByRole('button', { name: /^use /i })).toHaveLength(9)
    expect(screen.getByLabelText(/custom/i)).toHaveAttribute('type', 'color')
  })
})

describe('the two toggles that used to do nothing', () => {
  it('starts with both on', () => {
    render(<StylingForm />)
    expect(screen.getByRole('switch', { name: /show profile links/i })).toBeChecked()
    expect(screen.getByRole('switch', { name: /show language proficiency/i })).toBeChecked()
  })

  it('turns profile links off and saves it', async () => {
    const user = userEvent.setup()
    render(<StylingForm />)
    await user.click(screen.getByRole('switch', { name: /show profile links/i }))
    await user.click(screen.getByRole('button', { name: /save styling/i }))
    await waitFor(() => expect(style().showLinks).toBe(false))
  })

  it('turns language proficiency off and saves it', async () => {
    const user = userEvent.setup()
    render(<StylingForm />)
    await user.click(screen.getByRole('switch', { name: /show language proficiency/i }))
    await user.click(screen.getByRole('button', { name: /save styling/i }))
    await waitFor(() => expect(style().showSkillProficiency).toBe(false))
  })
})

describe('save bar', () => {
  it('is disabled until something actually changes', async () => {
    const user = userEvent.setup()
    render(<StylingForm />)
    expect(screen.getByRole('button', { name: /save styling/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /use teal/i }))
    expect(screen.getByRole('button', { name: /save styling/i })).toBeEnabled()
  })

  it('says what each theme changes', () => {
    render(<StylingForm />)
    expect(screen.getByText(/centred header, accent section headings/i)).toBeInTheDocument()
  })
})
