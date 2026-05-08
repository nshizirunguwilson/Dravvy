import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
}

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap text-[14px] font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-[0.5px]'

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Primary: solid ink with a subtle inner top highlight (1px white at 6%
  // via inset shadow) so it feels like a real, slightly-lit chip.
  default:
    'rounded-md bg-ink-12 text-paper shadow-paper hover:bg-ink-11 ' +
    'shadow-[inset_0_1px_0_0_hsl(var(--paper)/0.07),0_1px_0_0_hsl(var(--ink-12))] ' +
    'focus-visible:[box-shadow:inset_0_1px_0_0_hsl(var(--paper)/0.07),0_0_0_1px_hsl(var(--paper)),0_0_0_3px_hsl(var(--ink-9)/0.5)]',

  // Outline: 1px hairline, paper background, hover deepens the rule.
  outline:
    'rounded-md border border-rule bg-page text-ink-12 hover:border-rule-strong hover:bg-paper-deep ' +
    'focus-visible:[box-shadow:0_0_0_1px_hsl(var(--paper)),0_0_0_3px_hsl(var(--ink-9)/0.4)]',

  // Ghost: no chrome at rest, hover drops a sunken paper tint.
  ghost:
    'rounded-md text-ink-9 hover:text-ink-12 hover:bg-paper-deep ' +
    'focus-visible:[box-shadow:0_0_0_1px_hsl(var(--paper)),0_0_0_3px_hsl(var(--ink-9)/0.4)]',

  // Link: underline-on-hover, never a CTA — used for inline navigation.
  link:
    'rounded-none p-0 text-ink-12 underline-offset-[6px] hover:underline decoration-ink-9 decoration-1',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-[13px]',
  default: 'h-10 px-4',
  lg: 'h-12 px-6 text-[15px]',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        variants[variant],
        variant !== 'link' && sizes[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button }
