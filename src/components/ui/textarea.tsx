import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[112px] w-full resize-y rounded-md border border-line bg-surface px-3.5 py-3 text-[15px] leading-[1.6] text-slate-12',
        'placeholder:text-slate-5',
        'shadow-xs transition-[border-color,box-shadow] duration-150',
        'hover:border-line-strong',
        'focus:border-brand focus:outline-none focus:[box-shadow:var(--ring-focus)]',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-2',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export { Textarea }
