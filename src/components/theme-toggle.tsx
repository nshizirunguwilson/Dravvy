'use client'

import * as React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import type { Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

/**
 * Compact header control: one button that flips light and dark. Renders a
 * neutral placeholder until mounted so the server and client markup agree.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, mounted, toggleTheme } = useTheme()

  const label = mounted
    ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`
    : 'Switch theme'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-slate-9 shadow-xs transition-colors',
        'hover:border-line-strong hover:bg-surface-2 hover:text-slate-12',
        'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_1px_hsl(var(--surface)),0_0_0_3px_hsl(var(--accent)/0.4)]',
        className,
      )}
    >
      {mounted && resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}

/**
 * Full three-way control for the settings page: Light, Dark, System.
 */
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, resolvedTheme, mounted, setTheme } = useTheme()

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="radiogroup"
        aria-label="Colour theme"
        className="inline-flex w-full max-w-md rounded-lg border border-line bg-surface-2 p-1"
      >
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = mounted && theme === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(value)}
              className={cn(
                'flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_1px_hsl(var(--surface)),0_0_0_3px_hsl(var(--accent)/0.4)]',
                active
                  ? 'bg-surface text-slate-12 shadow-xs'
                  : 'text-slate-7 hover:text-slate-12',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <p className="text-[13px] text-slate-7">
        {mounted && theme === 'system'
          ? `Following your device, which is currently ${resolvedTheme}.`
          : 'Your choice is remembered on this device.'}
      </p>
    </div>
  )
}
