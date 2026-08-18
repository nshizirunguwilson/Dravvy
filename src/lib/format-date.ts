import type { ResumeStyle } from '@/types/resume'

/**
 * Date formatting for the resume, in one place.
 *
 * The preview, the PDF and the DOCX each carried their own copy of this, all
 * three hardcoded to en-US, so a reader in Kigali or Berlin got US month names
 * whatever their machine was set to. Now they share this, and the locale
 * follows the visitor.
 */
export const DEFAULT_LOCALE = 'en-US'

/** The visitor's own locale in a browser, a stable default anywhere else. */
export function runtimeLocale(): string {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  return navigator.language || DEFAULT_LOCALE
}

export function formatResumeDate(
  raw: string,
  format: ResumeStyle['dateFormat'],
  locale: string = DEFAULT_LOCALE,
): string {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw

  switch (format) {
    case 'MM/YYYY':
      // Numeric months are locale independent by design: a resume date should
      // not silently become 2022/04 in one place and 04/2022 in another.
      return `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`
    case 'MMMM YYYY':
      return date.toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
    default:
      return date.toLocaleDateString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
  }
}
