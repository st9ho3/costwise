import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/cn'

const labelVariants = cva(
  "font-body leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
  {
    variants: {
      variant: {
        default: "text-[13px] font-bold text-ink-900",
        overline: "text-[11px] font-bold uppercase tracking-[0.08em] text-stone-500",
        caption: "text-[12px] font-normal text-stone-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  overline?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, overline, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants({ variant: overline ? 'overline' : variant }),
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
