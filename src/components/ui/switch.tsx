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
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
      'focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-brand',
      'data-[state=unchecked]:bg-surface-2 data-[state=unchecked]:border data-[state=unchecked]:border-line',
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform duration-200 ease-out',
        'data-[state=checked]:translate-x-[22px]',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
