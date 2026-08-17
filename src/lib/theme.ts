/**
 * Theme plumbing shared by the blocking init script, the React provider and
 * the toggle. Kept framework free so it can be stringified into the document
 * head and unit tested without a DOM tree.
 */

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'dravvy-theme'
export const THEMES: readonly Theme[] = ['light', 'dark', 'system'] as const

/** Meta theme-color values, matched to the --canvas token in globals.css. */
export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#f8fafc',
  dark: '#0e131c',
}

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/** What the operating system currently prefers. Defaults to light. */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Turns a preference into the concrete palette that should be painted. */
export function resolveTheme(theme: Theme, systemTheme: ResolvedTheme = getSystemTheme()): ResolvedTheme {
  return theme === 'system' ? systemTheme : theme
}

/** Reads the stored preference, falling back to "system". */
export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

/** Persists the preference. Silently no-ops when storage is unavailable. */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* private browsing or storage disabled */
  }
}

/**
 * Paints a resolved theme onto the document: the Tailwind `dark` class, the
 * native `color-scheme` (so scrollbars, date pickers and form controls follow)
 * and the browser chrome colour.
 */
export function applyTheme(resolved: ResolvedTheme, theme: Theme = resolved): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
  root.dataset.theme = theme
  root.dataset.resolvedTheme = resolved

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLORS[resolved])
}

/**
 * Runs before first paint, straight from the document head, so a dark-mode
 * visitor never sees a white flash. Mirrors the helpers above; it cannot
 * import them because it executes before the bundle loads.
 */
export const themeInitScript = `(function(){try{
var k='${THEME_STORAGE_KEY}';
var t=localStorage.getItem(k);
if(t!=='light'&&t!=='dark'&&t!=='system'){t='system'}
var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
var r=document.documentElement;
r.classList.toggle('dark',d);
r.style.colorScheme=d?'dark':'light';
r.dataset.theme=t;
r.dataset.resolvedTheme=d?'dark':'light';
}catch(e){}})()`
