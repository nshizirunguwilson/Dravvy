import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Mark, Wordmark } from './brand'

describe('Brand', () => {
  it('renders the mark as an svg', () => {
    const { container } = render(<Mark />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('forwards svg props such as className to the mark', () => {
    const { container } = render(<Mark className="h-10" />)
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('h-10')
  })

  it('renders the wordmark text', () => {
    render(<Wordmark />)
    expect(screen.getByText('Dravvy')).toBeInTheDocument()
  })

  it('applies larger sizing for the lg variant', () => {
    render(<Wordmark size="lg" />)
    expect(screen.getByText('Dravvy').className).toContain('text-[24px]')
  })
})
