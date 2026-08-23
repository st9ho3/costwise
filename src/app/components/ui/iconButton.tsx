import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  variant?: 'plain' | 'outline' | 'solid' | 'soft' | 'active' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  round?: boolean
  active?: boolean
  label?: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'plain', size = 'md', round = false, active = false, label, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'size-[32px] text-[15px] [&_svg]:size-[16px]',
      md: 'size-[40px] text-[18px] [&_svg]:size-[18px]',
      lg: 'size-[48px] text-[22px] [&_svg]:size-[22px]',
    }[size]

    const variantClasses = {
      plain: 'bg-transparent text-ink-700 hover:bg-cream-100 hover:text-ink-900 border-transparent',
      outline: 'bg-white text-ink-900 border border-sand-300 shadow-[0_1px_2px_rgba(27,26,22,0.05)] hover:border-sand-400 hover:bg-cream-100',
      solid: 'bg-green-800 text-cream-50 hover:bg-green-700 border-transparent',
      soft: 'bg-green-50 text-green-700 hover:bg-green-100 border-transparent',
      active: 'bg-green-50 text-green-700 border-transparent',
      danger: 'bg-transparent text-tomato-600 hover:bg-tomato-100 hover:text-tomato-700 border-transparent',
    }[active ? 'active' : variant]

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center border transition-all duration-140 cursor-pointer disabled:opacity-42 disabled:cursor-not-allowed select-none active:scale-[0.975] [&_svg]:shrink-0",
          round ? "rounded-full" : "rounded-[12px]",
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {icon || children}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'
