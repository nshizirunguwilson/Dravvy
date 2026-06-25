import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProgressTracker } from './progress-tracker'
import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'

beforeEach(() => {
  useResumeStore.getState().resetStore()
  useUIStore.setState({
    activeSection: 0,
    activeSettingsSection: 0,
    isLoading: false,
    error: null,
  })
})

describe('ProgressTracker', () => {
  it('renders the section list', () => {
    render(<ProgressTracker />)
    expect(screen.getAllByText('Basic information').length).toBeGreaterThan(0)
    expect(screen.getAllByText('References').length).toBeGreaterThan(0)
  })

  it('updates the active section in the UI store when a section is clicked', async () => {
    render(<ProgressTracker />)
    const educationButtons = screen.getAllByRole('button', { name: /education/i })
    await userEvent.click(educationButtons[0])
    expect(useUIStore.getState().activeSection).toBe(2)
  })

  it('shows a completion marker for references by default (upon request)', () => {
    const { container } = render(<ProgressTracker />)
    expect(container.querySelectorAll('.lucide-check').length).toBeGreaterThan(0)
  })

  it('adds completion markers as sections are filled in', () => {
    const { container, rerender } = render(<ProgressTracker />)
    const before = container.querySelectorAll('.lucide-check').length

    act(() => {
      useResumeStore.getState().addSkill({ category: 'Frontend', skills: ['React'] })
    })
    rerender(<ProgressTracker />)

    const after = container.querySelectorAll('.lucide-check').length
    expect(after).toBeGreaterThan(before)
  })
})
