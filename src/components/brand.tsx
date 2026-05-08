import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand mark — a rounded blue tile with a confident "D" inside.
 */
export function Mark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--accent))" />
      <path
        d="M9 8h7.6c4.5 0 7.6 3.2 7.6 8s-3.1 8-7.6 8H9V8Zm3.4 2.7v10.6h4c2.9 0 4.7-2 4.7-5.3s-1.8-5.3-4.7-5.3h-4Z"
        fill="white"
      />
    </svg>
  )
}

/**
 * Wordmark — Mark + the typeset name in the same sans the rest of the
 * UI uses. Slight negative tracking on the name for a confident lockup.
 */
export function Wordmark({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const text =
    size === 'lg'
      ? 'text-[24px] leading-none'
      : size === 'sm'
        ? 'text-[16px] leading-none'
        : 'text-[19px] leading-none'
  const mark = size === 'lg' ? 'h-9 w-9' : size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'

  return (
    <span className={cn('inline-flex items-center gap-2.5 text-slate-12', className)}>
      <Mark className={mark} />
      <span className={cn('font-bold tracking-[-0.02em]', text)}>Dravvy</span>
    </span>
  )
}
