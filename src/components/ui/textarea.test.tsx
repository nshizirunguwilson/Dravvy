import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders with a placeholder', () => {
    render(<Textarea placeholder="Summary" />)
    expect(screen.getByPlaceholderText('Summary')).toBeInTheDocument()
  })

  it('calls onChange as the user types', async () => {
    const onChange = vi.fn()
    render(<Textarea placeholder="s" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('s'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  it('reflects a controlled value', () => {
    render(<Textarea value="bio text" onChange={() => {}} placeholder="c" />)
    expect((screen.getByPlaceholderText('c') as HTMLTextAreaElement).value).toBe('bio text')
  })

  it('can be disabled', () => {
    render(<Textarea placeholder="d" disabled />)
    expect(screen.getByPlaceholderText('d')).toBeDisabled()
  })

  it('forwards a ref to the textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} placeholder="r" />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })
})
