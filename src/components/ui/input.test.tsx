import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Input } from './input'

describe('Input', () => {
  it('renders with a placeholder', () => {
    render(<Input placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  })

  it('defaults to type text', () => {
    render(<Input placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveAttribute('type', 'text')
  })

  it('passes the email type through for HTML5 validation', () => {
    render(<Input type="email" placeholder="e" />)
    expect(screen.getByPlaceholderText('e')).toHaveAttribute('type', 'email')
  })

  it('calls onChange as the user types', async () => {
    const onChange = vi.fn()
    render(<Input placeholder="name" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('name'), 'Wilson')
    expect(onChange).toHaveBeenCalled()
  })

  it('reflects a controlled value', () => {
    render(<Input value="hello" onChange={() => {}} placeholder="c" />)
    expect((screen.getByPlaceholderText('c') as HTMLInputElement).value).toBe('hello')
  })

  it('applies color-swatch sizing for type color', () => {
    render(<Input type="color" aria-label="pick a color" />)
    expect(screen.getByLabelText('pick a color').className).toContain('w-14')
  })

  it('can be disabled', () => {
    render(<Input placeholder="d" disabled />)
    expect(screen.getByPlaceholderText('d')).toBeDisabled()
  })

  it('forwards a ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="r" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
