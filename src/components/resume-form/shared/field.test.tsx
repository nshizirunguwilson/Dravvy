import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Input } from '@/components/ui/input'
import { Field, FieldGroup } from './field'

describe('Field', () => {
  it('binds the label to the control it names', () => {
    render(
      <Field label="Job title">{(props) => <Input {...props} defaultValue="Designer" />}</Field>,
    )
    expect(screen.getByLabelText('Job title')).toHaveValue('Designer')
  })

  it('marks a required field for sighted and screen reader users alike', () => {
    render(<Field label="Email" required>{(props) => <Input {...props} />}</Field>)
    expect(screen.getByText('(required)')).toBeInTheDocument()
  })

  it('announces an error and ties it to the input', () => {
    render(
      <Field label="Email" error="Invalid email address">
        {(props) => <Input {...props} />}
      </Field>,
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Invalid email address')
    expect(input.getAttribute('aria-describedby')).toContain(alert.id)
  })

  it('leaves a healthy field unmarked', () => {
    render(<Field label="Email">{(props) => <Input {...props} />}</Field>)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('gives every instance its own id, so repeated entries never collide', () => {
    render(
      <>
        <Field label="Job title">{(props) => <Input {...props} />}</Field>
        <Field label="Job title">{(props) => <Input {...props} />}</Field>
      </>,
    )
    const [first, second] = screen.getAllByLabelText('Job title')
    expect(first.id).not.toBe(second.id)
  })
})

describe('FieldGroup', () => {
  it('names the group that wraps several inputs', () => {
    render(
      <FieldGroup label="What you did">
        <Input aria-label="Bullet point 1" />
      </FieldGroup>,
    )
    expect(screen.getByRole('group', { name: 'What you did' })).toBeInTheDocument()
  })

  it('announces a group level error', () => {
    render(
      <FieldGroup label="What you did" error="At least two lines">
        <Input aria-label="Bullet point 1" />
      </FieldGroup>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('At least two lines')
  })
})
