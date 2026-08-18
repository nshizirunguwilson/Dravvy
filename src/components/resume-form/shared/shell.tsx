'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'

export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-xl border border-line bg-surface-2/40 p-4 md:p-6">
      {children}
    </div>
  )
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-line-strong bg-surface-2/40 px-4 py-6 text-center text-[14px] text-slate-7">
      {children}
    </p>
  )
}

export function SaveButton({ pending }: { pending: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <Button type="submit" disabled={pending} variant="default">
        {pending ? 'Saving...' : 'Save section'}
      </Button>
    </div>
  )
}

/** Summary shown above the form when a save attempt found problems. */
export function ErrorSummary({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-negative/40 bg-negative-soft px-4 py-3 text-[13px] font-medium text-negative"
    >
      {count === 1
        ? 'One field needs attention. It is marked below.'
        : `${count} fields need attention. They are marked below.`}
    </p>
  )
}
