'use client'

import * as React from 'react'

import {
  applyTheme,
  getSystemTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  type ResolvedTheme,
  type Theme,
} from '@/lib/theme'

type ThemeContextValue = {
  /** The user's preference: light, dark, or follow the system. */
  theme: Theme
  /** The palette actually painted right now. */
  resolvedTheme: ResolvedTheme
  /** True once the client has read the stored preference. */
  mounted: boolean
  setTheme: (theme: Theme) => void
  /** Flips between light and dark, leaving "system" behind. */
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('system')
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>('light')
  const [mounted, setMounted] = React.useState(false)

  // Adopt whatever the blocking head script already decided.
  React.useEffect(() => {
    setThemeState(readStoredTheme())
    setSystemTheme(getSystemTheme())
    setMounted(true)
  }, [])

  // Track the OS preference so "system" stays live without a reload.
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'dark' : 'light')

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    }
    query.addListener(onChange)
    return () => query.removeListener(onChange)
  }, [])

  const resolvedTheme = resolveTheme(theme, systemTheme)

  React.useEffect(() => {
    if (!mounted) return
    applyTheme(resolvedTheme, theme)
  }, [mounted, resolvedTheme, theme])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    storeTheme(next)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setThemeState((current) => {
      const next: Theme = resolveTheme(current, getSystemTheme()) === 'dark' ? 'light' : 'dark'
      storeTheme(next)
      return next
    })
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, mounted, setTheme, toggleTheme }),
    [theme, resolvedTheme, mounted, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside a ThemeProvider')
  return context
}
