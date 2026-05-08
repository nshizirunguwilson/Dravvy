import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Editorial input.
 *
 * Borderless + bottom hairline. The hairline thickens to ink-12 on focus —
 * a real underline animation, not a ring. Native date/color inputs get
 * their browser chrome trimmed back so they sit on the same baseline.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const isColor = type === 'color'
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full bg-transparent px-0 py-2.5 text-[15px] text-ink-12',
          'placeholder:text-ink-5',
          'border-0 border-b border-rule outline-none',
          'transition-[border-color,padding] duration-150',
          'focus:border-ink-12',
          'disabled:cursor-not-allowed disabled:opacity-60',
          // dates/times: keep the native picker but match our baseline
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
          '[&::-webkit-calendar-picker-indicator]:opacity-60',
          // color: a small rounded swatch instead of the default chrome
          isColor &&
            'h-10 w-12 cursor-pointer border border-rule p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch-wrapper]:p-0 [&::-moz-color-swatch]:rounded-sm',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
