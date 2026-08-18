'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/** Props a control must spread to be announced correctly when it is invalid. */
export type ControlProps = {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

/**
 * A labelled control with its own error message.
 *
 * The id is generated per instance, so repeated entries never collide, and the
 * error is bound with aria-describedby and announced through role="alert".
 * Errors used to arrive as a toast that named no field at all.
 */
export function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: React.ReactNode
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: (props: ControlProps) => React.ReactNode
}) {
  const id = React.useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <>
            <span aria-hidden className="ml-1 text-negative">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </Label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {hint && (
        <p id={hintId} className="text-[12px] leading-[1.5] text-slate-7">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-negative">
          {error}
        </p>
      )}
    </div>
  )
}

/** A label naming a group of inputs, such as a list of bullet points. */
export function FieldGroup({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: React.ReactNode
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  const id = React.useId()
  return (
    <div className="space-y-2">
      <Label id={id}>
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-negative">
            *
          </span>
        )}
        {hint && <span className="ml-2 text-[12px] font-normal text-slate-7">{hint}</span>}
      </Label>
      <div role="group" aria-labelledby={id} className="space-y-2">
        {children}
      </div>
      {error && (
        <p role="alert" className="text-[13px] font-medium text-negative">
          {error}
        </p>
      )}
    </div>
  )
}
