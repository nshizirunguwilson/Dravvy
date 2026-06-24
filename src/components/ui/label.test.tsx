import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Label } from './label'

describe('Label', () => {
  it('renders its text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('associates with a field via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    )
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email')
  })

  it('merges a custom className', () => {
    render(<Label className="mb-2">L</Label>)
    expect(screen.getByText('L').className).toContain('mb-2')
  })

  it('forwards a ref to the label element', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Label ref={ref}>L</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })
})
