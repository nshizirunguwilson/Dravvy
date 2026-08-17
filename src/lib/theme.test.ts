import { beforeEach, describe, expect, it } from 'vitest'

import {
  THEMES,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  applyTheme,
  getSystemTheme,
  isTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  themeInitScript,
} from './theme'

const setSystemPrefersDark = (dark: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: dark && query.includes('dark'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.resolvedTheme
  document.head.innerHTML = ''
  setSystemPrefersDark(false)
})

describe('isTheme', () => {
  it('accepts the three supported values', () => {
    for (const theme of THEMES) expect(isTheme(theme)).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isTheme('sepia')).toBe(false)
    expect(isTheme(null)).toBe(false)
    expect(isTheme(undefined)).toBe(false)
    expect(isTheme(3)).toBe(false)
  })
})

describe('getSystemTheme', () => {
  it('reports light when the OS does not prefer dark', () => {
    expect(getSystemTheme()).toBe('light')
  })

  it('reports dark when the OS prefers dark', () => {
    setSystemPrefersDark(true)
    expect(getSystemTheme()).toBe('dark')
  })
})

describe('resolveTheme', () => {
  it('passes explicit choices straight through', () => {
    expect(resolveTheme('light', 'dark')).toBe('light')
    expect(resolveTheme('dark', 'light')).toBe('dark')
  })

  it('defers to the system when set to system', () => {
    expect(resolveTheme('system', 'dark')).toBe('dark')
    expect(resolveTheme('system', 'light')).toBe('light')
  })
})

describe('storeTheme and readStoredTheme', () => {
  it('round-trips a stored preference', () => {
    storeTheme('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('falls back to system when nothing is stored', () => {
    expect(readStoredTheme()).toBe('system')
  })

  it('falls back to system when the stored value is junk', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'banana')
    expect(readStoredTheme()).toBe('system')
  })
})

describe('applyTheme', () => {
  it('adds the dark class and sets the native colour scheme', () => {
    applyTheme('dark', 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.dataset.resolvedTheme).toBe('dark')
  })

  it('removes the dark class when going back to light', () => {
    applyTheme('dark', 'dark')
    applyTheme('light', 'system')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('system')
    expect(document.documentElement.dataset.resolvedTheme).toBe('light')
  })

  it('updates the browser chrome colour when the meta tag exists', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    meta.setAttribute('content', THEME_COLORS.light)
    document.head.appendChild(meta)

    applyTheme('dark')
    expect(meta.getAttribute('content')).toBe(THEME_COLORS.dark)
  })
})

describe('themeInitScript', () => {
  it('reads the same storage key the helpers write to', () => {
    expect(themeInitScript).toContain(THEME_STORAGE_KEY)
  })

  it('paints dark before hydration when dark is stored', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    // eslint-disable-next-line no-eval
    eval(themeInitScript)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('follows the system preference when set to system', () => {
    setSystemPrefersDark(true)
    localStorage.setItem(THEME_STORAGE_KEY, 'system')
    // eslint-disable-next-line no-eval
    eval(themeInitScript)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
