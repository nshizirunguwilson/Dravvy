import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioGroupItem } from './radio-group'

function Example({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <RadioGroup defaultValue="one" onValueChange={onValueChange} aria-label="numbers">
      <RadioGroupItem value="one" aria-label="one" />
      <RadioGroupItem value="two" aria-label="two" />
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  it('renders radio items with the default one selected', () => {
    render(<Example />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
    expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveAttribute('aria-checked', 'false')
  })

  it('selects another item and fires onValueChange', async () => {
    const onValueChange = vi.fn()
    render(<Example onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'two' }))
    expect(onValueChange).toHaveBeenCalledWith('two')
    expect(screen.getByRole('radio', { name: 'two' })).toHaveAttribute('aria-checked', 'true')
  })
})
