import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodError } from 'zod'

import { DEFAULT_LOCALE, formatResumeDate } from '@/lib/format-date'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Short month and year. Delegates to the shared resume formatter so there is
 * exactly one place that decides how a date is written.
 */
export function formatDate(date: string, locale: string = DEFAULT_LOCALE) {
  return formatResumeDate(date, 'MMM YYYY', locale)
}

export function getZodErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.errors[0]?.message || 'Validation error'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}

export function debounce<T extends (...args: any[]) => void>( // eslint-disable-line @typescript-eslint/no-explicit-any
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return start <= end
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
