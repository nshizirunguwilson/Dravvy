import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSelector, ThemeToggle } from '@/components/theme-toggle'
import { THEME_STORAGE_KEY } from '@/lib/theme'

const renderWithProvider = (ui: React.ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>)

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
})

describe('ThemeToggle', () => {
  it('turns the dark theme on and stores the choice', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ThemeToggle />)

    await user.click(await screen.findByRole('button', { name: /switch to dark theme/i }))

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('turns it back off on a second press', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ThemeToggle />)

    await user.click(await screen.findByRole('button', { name: /switch to dark theme/i }))
    await user.click(await screen.findByRole('button', { name: /switch to light theme/i }))

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('starts from an already stored preference', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    renderWithProvider(<ThemeToggle />)

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})

describe('ThemeSelector', () => {
  it('offers light, dark and system', async () => {
    renderWithProvider(<ThemeSelector />)
    expect(await screen.findByRole('radio', { name: 'Light' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'System' })).toBeInTheDocument()
  })

  it('marks the chosen option and applies it', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ThemeSelector />)

    await user.click(await screen.findByRole('radio', { name: 'Dark' }))

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true')
    })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('explains what system means when system is selected', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ThemeSelector />)

    await user.click(await screen.findByRole('radio', { name: 'System' }))

    expect(await screen.findByText(/following your device/i)).toBeInTheDocument()
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system')
  })
})
