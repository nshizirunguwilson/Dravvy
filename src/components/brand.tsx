import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand mark — a serif "D" with a vertical hairline that nods to a
 * column rule. Used in the header and as the favicon source.
 */
export function Mark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden
      {...props}
    >
      <rect x="0.5" y="0.5" width="27" height="27" rx="6" stroke="currentColor" strokeOpacity="0.16" />
      {/* Serif D — drawn as a path so the bowl is real, not a font */}
      <path
        d="M9 7.5h5.4c4.05 0 6.6 2.55 6.6 6.5s-2.55 6.5-6.6 6.5H9V7.5Zm2.5 2.05v8.9h2.7c2.7 0 4.4-1.7 4.4-4.45s-1.7-4.45-4.4-4.45H11.5Z"
        fill="currentColor"
      />
      {/* The "column rule" hairline — half-height tick at the right edge */}
      <line x1="22.5" y1="9.5" x2="22.5" y2="18.5" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.55" />
    </svg>
  )
}

/**
 * Wordmark — Mark + the typeset name. Uses the display serif and a
 * touch of negative letterspacing to feel kerned by hand. The dot on
 * the second `v` is omitted (italic-style ligature feel) — we get this
 * for free by using Fraunces with a -0.04em tracking.
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
      ? 'text-[28px] leading-[28px]'
      : size === 'sm'
        ? 'text-[16px] leading-[16px]'
        : 'text-[20px] leading-[20px]'
  const mark =
    size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'

  return (
    <span className={cn('inline-flex items-center gap-2 text-ink-12', className)}>
      <Mark className={mark} />
      <span
        className={cn(
          'font-display font-medium tracking-[-0.022em]',
          text,
        )}
      >
        Dravvy
      </span>
    </span>
  )
}
