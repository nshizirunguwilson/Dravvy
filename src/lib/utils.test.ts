import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as z from 'zod'
import {
  cn,
  formatDate,
  getZodErrorMessage,
  debounce,
  generateId,
  validateDateRange,
  sanitizeHtml,
} from './utils'

describe('cn', () => {
  it('joins class names together', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c')
  })

  it('resolves conflicting tailwind utilities, keeping the last', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})

describe('formatDate', () => {
  it('formats an ISO date as "Mon YYYY"', () => {
    expect(formatDate('2020-06-15')).toBe('Jun 2020')
  })

  it('handles a different month and year', () => {
    expect(formatDate('2024-11-15')).toBe('Nov 2024')
  })
})

describe('getZodErrorMessage', () => {
  it('returns the first issue message from a ZodError', () => {
    const result = z.string().min(3, 'too short').safeParse('a')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(getZodErrorMessage(result.error)).toBe('too short')
    }
  })

  it('returns the message from a generic Error', () => {
    expect(getZodErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('falls back for unknown values', () => {
    expect(getZodErrorMessage('something odd')).toBe('An unknown error occurred')
  })
})

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('invokes the function only once after the wait window', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced()
    debounced()
    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('passes the latest arguments through', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('first')
    debounced('second')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('second')
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(generateId()).toBeTypeOf('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('returns different ids on subsequent calls', () => {
    expect(generateId()).not.toBe(generateId())
  })
})

describe('validateDateRange', () => {
  it('accepts a start date before the end date', () => {
    expect(validateDateRange('2020-01-01', '2021-01-01')).toBe(true)
  })

  it('accepts equal dates', () => {
    expect(validateDateRange('2020-01-01', '2020-01-01')).toBe(true)
  })

  it('rejects a start date after the end date', () => {
    expect(validateDateRange('2022-01-01', '2020-01-01')).toBe(false)
  })
})

describe('sanitizeHtml', () => {
  it('escapes HTML-sensitive characters', () => {
    expect(sanitizeHtml('<b>"Tom" & \'Jerry\'</b>')).toBe(
      '&lt;b&gt;&quot;Tom&quot; &amp; &#039;Jerry&#039;&lt;/b&gt;'
    )
  })

  it('leaves plain text untouched', () => {
    expect(sanitizeHtml('hello world')).toBe('hello world')
  })
})
