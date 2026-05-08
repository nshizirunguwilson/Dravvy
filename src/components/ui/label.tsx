import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Editorial label: small, mono, uppercase, gently tracked.
 * Pairs with our borderless inputs to feel like a printed form field.
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-7',
        className,
      )}
      {...props}
    />
  ),
)
Label.displayName = 'Label'

export { Label }
