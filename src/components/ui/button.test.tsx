import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Button } from './button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Nope' })
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies size classes for non-link variants', () => {
    render(<Button>Sized</Button>)
    expect(screen.getByRole('button', { name: 'Sized' }).className).toContain('h-11')
  })

  it('omits size classes for the link variant', () => {
    render(<Button variant="link">Linky</Button>)
    const btn = screen.getByRole('button', { name: 'Linky' })
    expect(btn.className).not.toContain('h-11')
    expect(btn.className).toContain('text-brand')
  })

  it('merges a custom className', () => {
    render(<Button className="custom-marker">X</Button>)
    expect(screen.getByRole('button', { name: 'X' }).className).toContain('custom-marker')
  })

  it('forwards a ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
