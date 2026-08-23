import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  delta?: React.ReactNode
  deltaTone?: 'good' | 'over' | 'flat'
  caption?: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'sunken' | 'brand'
  size?: 'md' | 'lg'
}

export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaTone = 'flat',
  caption,
  icon,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: StatTileProps) {
  const variantClasses = {
    default: 'bg-white border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)] text-ink-900',
    sunken: 'bg-cream-100 border-transparent shadow-none text-ink-900',
    brand: 'bg-green-800 border-transparent text-cream-50 shadow-[0_8px_24px_-10px_rgba(27,74,44,0.5)]',
  }[variant]

  const deltaToneClasses = {
    good: 'text-green-600',
    over: 'text-tomato-600',
    flat: 'text-stone-500',
  }[deltaTone]

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-3.5 sm:p-4 rounded-[20px] transition-all min-w-0",
        variantClasses,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-[0.08em]",
          variant === 'brand' ? 'text-cream-50/75' : 'text-stone-500'
        )}
      >
        {icon}
        {label}
      </span>
      <span className="flex items-baseline gap-1.5 flex-wrap">
        <span
          className={cn(
            "font-display font-bold tracking-tight tabular-nums",
            size === 'lg' ? 'text-[30px] sm:text-[38px]' : 'text-[24px] sm:text-[30px]',
            variant === 'brand' ? 'text-cream-50' : 'text-ink-900'
          )}
        >
          {value}
        </span>
        {unit && (
          <span
            className={cn(
              "font-body font-semibold text-[15px]",
              variant === 'brand' ? 'text-cream-50/80' : 'text-stone-500'
            )}
          >
            {unit}
          </span>
        )}
      </span>
      {(delta || caption) && (
        <span
          className={cn(
            "flex items-center gap-1.5 text-[12px] font-body",
            variant === 'brand' ? 'text-cream-50/80' : 'text-stone-500'
          )}
        >
          {delta && (
            <span className={cn("font-bold", deltaToneClasses)}>
              {delta}
            </span>
          )}
          {caption}
        </span>
      )}
    </div>
  )
}
