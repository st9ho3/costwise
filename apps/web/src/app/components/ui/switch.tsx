import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, disabled = false, className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer font-body text-[15px] text-ink-700 select-none",
          disabled && "opacity-45 cursor-not-allowed",
          className
        )}
      >
        <div className="relative flex items-center shrink-0 mt-0.5">
          <input
            type="checkbox"
            ref={ref}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div className="w-[44px] h-[26px] rounded-full bg-cream-200 border border-sand-300 transition-colors duration-140 peer-checked:bg-green-700 peer-checked:border-green-700 peer-focus-visible:ring-3 peer-focus-visible:ring-green-500/20">
            <div className="size-[20px] rounded-full bg-white shadow-sm transition-transform duration-140 translate-x-[2px] translate-y-[2px] peer-checked:translate-x-[20px]" />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <strong className="font-semibold text-ink-900 leading-snug">{label}</strong>}
            {description && <span className="text-[12px] text-stone-500">{description}</span>}
          </div>
        )}
      </label>
    )
  }
)
Switch.displayName = 'Switch'
