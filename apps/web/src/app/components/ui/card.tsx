import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'sunken' | 'brand' | 'accent' | 'flat'
  padding?: 'md' | 'tight' | 'none'
  interactive?: boolean
  title?: React.ReactNode
  eyebrow?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', interactive = false, title, eyebrow, icon, action, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05),0_2px_6px_rgba(27,26,22,0.04)] text-ink-900',
      sunken: 'bg-cream-100 border-transparent shadow-none text-ink-900',
      brand: 'bg-green-800 border-transparent text-cream-50 shadow-[0_8px_24px_-10px_rgba(27,74,44,0.5)]',
      accent: 'bg-gold-100 border border-[#F0E3BE] shadow-none text-gold-800',
      flat: 'bg-white border border-[#EFE8DA] shadow-none text-ink-900',
    }[variant]

    const paddingClasses = {
      md: 'p-5',
      tight: 'p-3.5',
      none: 'p-0',
    }[padding]

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-[18px] transition-all duration-200',
          variantClasses,
          paddingClasses,
          interactive && 'cursor-pointer hover:shadow-[0_2px_4px_rgba(27,26,22,0.04),0_8px_20px_-6px_rgba(27,26,22,0.10)] hover:-translate-y-[2px] active:scale-[0.995]',
          className
        )}
        {...props}
      >
        {(title || action || eyebrow) && (
          <div className="flex items-center gap-2.5 mb-3.5">
            {icon}
            <div className="flex-1 min-w-0">
              {eyebrow && <span className="block font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500 mb-0.5">{eyebrow}</span>}
              {title && <div className="font-display font-bold text-[20px] leading-snug tracking-[-0.01em]">{title}</div>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-display text-[20px] font-bold tracking-tight text-ink-900', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-[13px] text-stone-500', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4 border-t border-[#EFE8DA]', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
