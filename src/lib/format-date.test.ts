import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_LOCALE, formatResumeDate, runtimeLocale } from './format-date'

describe('formatResumeDate', () => {
  it('returns nothing for an empty value', () => {
    expect(formatResumeDate('', 'MM/YYYY')).toBe('')
  })

  it('passes an unparseable value straight through', () => {
    expect(formatResumeDate('Present', 'MMM YYYY')).toBe('Present')
  })

  it('writes numeric months the same way in every locale', () => {
    expect(formatResumeDate('2022-04-01', 'MM/YYYY', 'en-US')).toBe('04/2022')
    expect(formatResumeDate('2022-04-01', 'MM/YYYY', 'de-DE')).toBe('04/2022')
    expect(formatResumeDate('2022-04-01', 'MM/YYYY', 'rw-RW')).toBe('04/2022')
  })

  it('writes short month names', () => {
    expect(formatResumeDate('2022-04-01', 'MMM YYYY', 'en-US')).toBe('Apr 2022')
  })

  it('writes long month names', () => {
    expect(formatResumeDate('2022-04-01', 'MMMM YYYY', 'en-US')).toBe('April 2022')
  })

  it('follows the locale it is given for month names', () => {
    const french = formatResumeDate('2022-04-01', 'MMMM YYYY', 'fr-FR')
    expect(french.toLowerCase()).toContain('avril')
    expect(french).not.toBe(formatResumeDate('2022-04-01', 'MMMM YYYY', 'en-US'))
  })

  it('does not drift across a timezone boundary', () => {
    // A naive parse turns the first of the month into the last of the previous
    // one west of UTC, which would silently change the year in January.
    expect(formatResumeDate('2022-01-01', 'MMMM YYYY', 'en-US')).toBe('January 2022')
  })
})

describe('runtimeLocale', () => {
  it('falls back to the default when there is no browser', () => {
    const original = globalThis.navigator
    // @ts-expect-error deliberately removing navigator
    delete globalThis.navigator
    expect(runtimeLocale()).toBe(DEFAULT_LOCALE)
    globalThis.navigator = original
  })

  it('uses the browser language when there is one', () => {
    const spy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    expect(runtimeLocale()).toBe('fr-FR')
    spy.mockRestore()
  })
})
