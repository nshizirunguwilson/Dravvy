import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label sits ABOVE the field. Normal sans, 14px, weight 500, slate-9.
 * Not uppercase, not mono — readability first.
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-[14px] font-medium leading-none text-slate-9', className)}
      {...props}
    />
  ),
)
Label.displayName = 'Label'

export { Label }
