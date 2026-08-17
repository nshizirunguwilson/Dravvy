import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Bordered input. Visible boundary on all four sides, white background,
 * comfortable height (44px), brand-coloured focus ring. Label sits above
 * via the Label primitive, not on top of the field.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const isColor = type === 'color'
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full rounded-md border border-line bg-surface px-3.5 text-[15px] text-slate-12',
          'placeholder:text-slate-7',
          'shadow-xs transition-[border-color,box-shadow] duration-150',
          'hover:border-line-strong',
          'focus:border-brand focus:outline-none focus:[box-shadow:var(--ring-focus)]',
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-2',
          // Native pickers
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
          '[&::-webkit-calendar-picker-indicator]:opacity-60',
          // Color swatch sizing
          isColor &&
            'h-11 w-14 cursor-pointer p-1 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch-wrapper]:p-0 [&::-moz-color-swatch]:rounded-sm',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
