'use client'

import { Toaster } from 'sonner'

import { useTheme } from '@/components/theme-provider'

/**
 * Sonner styled with our own tokens, and told which palette is live so its
 * internal defaults stop fighting the dark theme.
 */
export function AppToaster() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      position="bottom-right"
      closeButton
      theme={resolvedTheme}
      toastOptions={{
        classNames: {
          toast:
            'bg-surface text-slate-12 border border-line shadow-md rounded-xl font-sans text-[14px]',
          title: 'font-semibold text-slate-12',
          description: 'text-slate-7',
          actionButton: 'bg-brand text-brand-fg rounded-md',
          cancelButton: 'bg-surface-2 text-slate-9 rounded-md',
          closeButton: 'border border-line bg-surface text-slate-7',
          success: '[&_[data-icon]]:text-positive',
          error: '[&_[data-icon]]:text-negative',
        },
      }}
    />
  )
}
