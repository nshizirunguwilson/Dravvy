'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-rule transition-colors duration-200',
      'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_1px_hsl(var(--paper)),0_0_0_3px_hsl(var(--ink-9)/0.4)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-ink-12 data-[state=checked]:border-ink-12',
      'data-[state=unchecked]:bg-paper-deep',
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-page shadow-paper transition-transform duration-200 ease-out',
        'data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-paper',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
