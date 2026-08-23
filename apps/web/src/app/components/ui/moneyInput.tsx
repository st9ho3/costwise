import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode
  currency?: string
  per?: string
  size?: 'md' | 'lg'
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, label, currency = '€', per, size = 'md', id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || (label ? generatedId : undefined)

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-bold text-[13px] text-ink-900 select-none">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center rounded-[12px] bg-white border border-sand-300 hover:border-sand-400 focus-within:border-green-500 focus-within:ring-3 focus-within:ring-green-500/20 transition-all duration-140",
            size === 'lg' ? 'h-[56px] px-4' : 'h-[44px] px-3.5',
            disabled && 'bg-cream-100 opacity-60 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              "font-display font-bold text-stone-500 select-none mr-2",
              size === 'lg' ? 'text-[24px]' : 'text-[17px]'
            )}
          >
            {currency}
          </span>
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent border-0 outline-none text-ink-900 font-mono font-semibold tabular-nums placeholder:text-sand-400 disabled:cursor-not-allowed",
              size === 'lg' ? 'text-[24px] font-display font-bold' : 'text-[17px]',
              className
            )}
            {...props}
          />
          {per && (
            <span className="text-[12px] text-stone-500 font-body select-none ml-2 whitespace-nowrap">
              / {per}
            </span>
          )}
        </div>
      </div>
    )
  }
)
MoneyInput.displayName = 'MoneyInput'

export { MoneyInput }
