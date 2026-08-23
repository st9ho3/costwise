import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/cn'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-[15px] font-bold font-body transition-all duration-140 outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-42 disabled:shadow-none cursor-pointer select-none active:scale-[0.975] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[18px]",
  {
    variants: {
      variant: {
        default: "bg-green-800 text-cream-50 shadow-[0_8px_24px_-10px_rgba(27,74,44,0.5)] hover:bg-green-700 hover:-translate-y-[1px] active:bg-green-900",
        primary: "bg-green-800 text-cream-50 shadow-[0_8px_24px_-10px_rgba(27,74,44,0.5)] hover:bg-green-700 hover:-translate-y-[1px] active:bg-green-900",
        secondary: "bg-white text-ink-900 border border-sand-300 shadow-[0_1px_2px_rgba(27,26,22,0.05)] hover:bg-cream-100 hover:border-sand-400 hover:-translate-y-[1px]",
        accent: "bg-gold-500 text-gold-800 shadow-[0_1px_2px_rgba(27,26,22,0.05)] hover:bg-gold-400 hover:-translate-y-[1px]",
        outline: "bg-white text-ink-900 border border-sand-300 shadow-[0_1px_2px_rgba(27,26,22,0.05)] hover:bg-cream-100 hover:border-sand-400 hover:-translate-y-[1px]",
        ghost: "bg-transparent text-green-700 hover:bg-green-50 active:bg-green-100",
        destructive: "bg-tomato-600 text-white shadow-sm hover:bg-tomato-700 hover:-translate-y-[1px] active:bg-tomato-700",
        danger: "bg-tomato-600 text-white shadow-sm hover:bg-tomato-700 hover:-translate-y-[1px] active:bg-tomato-700",
        link: "text-green-700 underline-offset-4 hover:underline bg-transparent p-0 h-auto font-semibold active:scale-100",
      },
      size: {
        sm: "h-[36px] px-[14px] text-[13px]",
        default: "h-[44px] px-[18px] text-[15px]",
        md: "h-[44px] px-[18px] text-[15px]",
        lg: "h-[52px] px-[24px] text-[17px]",
        icon: "size-[40px] p-0 shrink-0",
      },
      pill: {
        true: "rounded-full",
      },
      block: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pill, block, asChild = false, iconLeft, iconRight, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, pill, block, className }))}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
