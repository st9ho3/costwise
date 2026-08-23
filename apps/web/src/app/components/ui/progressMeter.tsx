import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface ProgressMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  label?: React.ReactNode
  valueLabel?: React.ReactNode
  tone?: 'good' | 'watch' | 'over' | 'brand' | 'default'
  height?: number
}

export function ProgressMeter({
  value,
  max = 100,
  label,
  valueLabel,
  tone = 'good',
  height = 8,
  className,
  ...props
}: ProgressMeterProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const toneClasses = {
    good: 'bg-green-500',
    watch: 'bg-gold-500',
    over: 'bg-tomato-600',
    brand: 'bg-green-800',
    default: 'bg-green-600',
  }[tone]

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between text-[13px] font-body">
          {label && <span className="font-semibold text-ink-900">{label}</span>}
          {valueLabel && <span className="font-mono font-medium text-stone-500 tabular-nums">{valueLabel}</span>}
        </div>
      )}
      <div
        className="w-full rounded-full bg-cream-200 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-200", toneClasses)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
