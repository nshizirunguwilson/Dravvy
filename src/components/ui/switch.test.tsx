import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './switch'

describe('Switch', () => {
  it('renders with the switch role, unchecked by default', () => {
    render(<Switch aria-label="toggle" />)
    const sw = screen.getByRole('switch')
    expect(sw).toBeInTheDocument()
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles and fires onCheckedChange when clicked', async () => {
    const onChange = vi.fn()
    render(<Switch aria-label="toggle" onCheckedChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn()
    render(<Switch aria-label="toggle" disabled onCheckedChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
