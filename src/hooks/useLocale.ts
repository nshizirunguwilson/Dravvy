'use client'

import { useEffect, useState } from 'react'

import { DEFAULT_LOCALE, runtimeLocale } from '@/lib/format-date'

/**
 * The visitor's locale, resolved after mount.
 *
 * Reading `navigator` during render would make the server and client disagree,
 * so this starts at the default and switches once the browser is available.
 */
export function useLocale(): string {
  const [locale, setLocale] = useState(DEFAULT_LOCALE)
  useEffect(() => setLocale(runtimeLocale()), [])
  return locale
}
