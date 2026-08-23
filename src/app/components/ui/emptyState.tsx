import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  illustration?: string
  icon?: React.ReactNode
  title: React.ReactNode
  message?: React.ReactNode
  actions?: React.ReactNode
  compact?: boolean
}

export function EmptyState({
  illustration,
  icon,
  title,
  message,
  actions,
  compact = false,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-3",
        compact ? "p-4 sm:p-5" : "p-8 sm:p-10",
        className
      )}
      {...props}
    >
      {illustration ? (
        <img
          src={illustration}
          alt=""
          className={cn("h-auto object-contain mb-1", compact ? "w-[110px]" : "w-[180px] max-w-[60%]")}
        />
      ) : icon ? (
        <span className="inline-flex items-center justify-center size-[64px] rounded-[26px] bg-green-50 text-green-700 mb-1">
          {icon}
        </span>
      ) : null}
      <div className="font-display font-bold text-[20px] leading-snug text-ink-900">
        {title}
      </div>
      {message && (
        <p className="font-body text-[15px] text-stone-500 max-w-[42ch]">
          {message}
        </p>
      )}
      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap justify-center mt-2">
          {actions}
        </div>
      )}
    </div>
  )
}
