import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
}

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-[14px] font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-[0.5px]'

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Primary: brand blue, white text. Subtle 1px inner top highlight.
  default:
    'bg-brand text-white shadow-sm ' +
    'hover:bg-brand-hover hover:shadow-md ' +
    'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_0_hsl(220_88%_30%/0.25)] ' +
    'focus-visible:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.18),0_0_0_1px_hsl(var(--surface)),0_0_0_3px_hsl(var(--accent)/0.45)]',

  // Outline: white surface, slate border, slate text.
  outline:
    'border border-line bg-surface text-slate-12 shadow-xs ' +
    'hover:border-line-strong hover:bg-surface-2 ' +
    'focus-visible:[box-shadow:0_0_0_1px_hsl(var(--surface)),0_0_0_3px_hsl(var(--accent)/0.4)]',

  // Ghost: transparent at rest, soft tint on hover.
  ghost:
    'text-slate-9 hover:bg-surface-2 hover:text-slate-12 ' +
    'focus-visible:[box-shadow:0_0_0_1px_hsl(var(--surface)),0_0_0_3px_hsl(var(--accent)/0.4)]',

  // Link: text only with underline-on-hover. Used for inline navigation.
  link: 'rounded-none p-0 text-brand underline-offset-4 hover:underline',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  default: 'h-11 px-5',
  lg: 'h-12 px-6 text-[15px]',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button }
