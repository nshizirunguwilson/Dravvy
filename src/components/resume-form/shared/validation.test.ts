import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { countErrors, validate, validateAll } from './validation'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  lines: z.array(z.string().min(1, 'Line cannot be empty')).min(2, 'At least two lines'),
})

describe('validate', () => {
  it('returns nothing when the value is fine', () => {
    expect(validate(schema, { name: 'A', email: 'a@b.com', lines: ['x', 'y'] })).toEqual({})
  })

  it('names the field that failed', () => {
    const errors = validate(schema, { name: '', email: 'nope', lines: ['x', 'y'] })
    expect(errors.name).toBe('Name is required')
    expect(errors.email).toBe('Invalid email address')
  })

  it('collapses an indexed path so a group shows one message', () => {
    const errors = validate(schema, { name: 'A', email: 'a@b.com', lines: ['', 'y'] })
    expect(errors.lines).toBe('Line cannot be empty')
    expect(errors['lines.0']).toBeUndefined()
  })

  it('keeps only the first message per field', () => {
    const errors = validate(schema, { name: '', email: '', lines: [] })
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['name', 'email', 'lines']))
    expect(typeof errors.name).toBe('string')
  })
})

describe('validateAll', () => {
  const entrySchema = z.object({ id: z.string(), title: z.string().min(1, 'Title is required') })

  it('keys problems by entry id and skips the valid ones', () => {
    const result = validateAll(entrySchema, [
      { id: 'a', title: 'fine' },
      { id: 'b', title: '' },
    ])
    expect(result.a).toBeUndefined()
    expect(result.b.title).toBe('Title is required')
  })

  it('counts every problem across every entry', () => {
    const result = validateAll(entrySchema, [
      { id: 'a', title: '' },
      { id: 'b', title: '' },
    ])
    expect(countErrors(result)).toBe(2)
    expect(countErrors({})).toBe(0)
  })
})
