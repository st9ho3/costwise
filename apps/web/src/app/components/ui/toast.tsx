import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  message?: React.ReactNode
  tone?: 'default' | 'good' | 'watch' | 'over'
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function Toast({
  title,
  message,
  tone = 'default',
  icon,
  actionLabel,
  onAction,
  className,
  ...props
}: ToastProps) {
  const toneClasses = {
    default: 'bg-ink-900 text-cream-50',
    good: 'bg-green-800 text-cream-50',
    watch: 'bg-gold-100 text-gold-800 border border-[#F0E3BE]',
    over: 'bg-tomato-600 text-white',
  }[tone]

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 p-3.5 sm:px-4 sm:py-3.5 rounded-[16px] shadow-[0_4px_8px_rgba(27,26,22,0.05),0_20px_40px_-12px_rgba(27,26,22,0.16)] max-w-[440px] font-body transition-all duration-200 select-none animate-in slide-in-from-bottom-3",
        toneClasses,
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="font-bold text-[15px] leading-snug">{title}</span>
        {message && <span className="text-[12px] opacity-85 leading-normal">{message}</span>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 font-bold text-[13px] underline hover:opacity-75 cursor-pointer ml-1"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
