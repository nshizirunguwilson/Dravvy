import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from './progress'

describe('Progress', () => {
  it('renders a progressbar', () => {
    render(<Progress value={40} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('translates the indicator to represent a partial value', () => {
    render(<Progress value={40} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.firstElementChild?.getAttribute('style')).toContain('-60%')
  })

  it('represents 0% when no value is provided', () => {
    render(<Progress />)
    const bar = screen.getByRole('progressbar')
    expect(bar.firstElementChild?.getAttribute('style')).toContain('-100%')
  })

  it('represents 100% when complete', () => {
    render(<Progress value={100} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.firstElementChild?.getAttribute('style')).toContain('-0%')
  })
})
