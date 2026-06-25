import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResumePreview } from './resume-preview'
import { useResumeStore } from '@/store/useResumeStore'

beforeEach(() => {
  const s = useResumeStore.getState()
  s.resetStore()
  s.updateContact({
    fullName: 'Wilson Nshizirungu',
    email: 'hello@wilsonn.tech',
    phone: '+250000000000',
    location: 'Kigali',
  })
  s.updateSummary('Full-stack engineer shipping production software end to end.')
  s.addExperience({
    company: 'WAC TechX',
    position: 'Lead Engineer',
    startDate: '2024-09-01',
    endDate: '',
    current: true,
    description: ['Led engineering and delivery', 'Shipped platforms'],
  })
  s.addSkill({ category: 'Frontend', skills: ['React', 'Next.js'] })
})

describe('ResumePreview', () => {
  it('renders the name and summary from the store', () => {
    render(<ResumePreview />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Wilson Nshizirungu' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/shipping production software/i)).toBeInTheDocument()
  })

  it('renders experience entered into the store', () => {
    render(<ResumePreview />)
    expect(screen.getByText('Lead Engineer')).toBeInTheDocument()
    expect(screen.getByText('WAC TechX')).toBeInTheDocument()
    expect(screen.getByText('Led engineering and delivery')).toBeInTheDocument()
  })

  it('shows the email as a mailto link', () => {
    render(<ResumePreview />)
    const link = screen.getByRole('link', { name: 'hello@wilsonn.tech' })
    expect(link).toHaveAttribute('href', 'mailto:hello@wilsonn.tech')
  })

  it('falls back to a placeholder name when contact is empty', () => {
    useResumeStore.getState().resetStore()
    render(<ResumePreview />)
    expect(screen.getByRole('heading', { level: 1, name: 'Your Name' })).toBeInTheDocument()
  })
})
