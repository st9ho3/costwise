import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, disabled = false, className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer font-body text-[15px] text-ink-700 min-h-[24px] select-none",
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
          <div className="size-[20px] rounded-[6px] border-[1.5px] border-sand-400 bg-white transition-all duration-140 peer-hover:border-green-500 peer-focus-visible:ring-3 peer-focus-visible:ring-green-500/20 peer-checked:bg-green-700 peer-checked:border-green-700 flex items-center justify-center">
            <svg
              className="size-[11px] stroke-cream-50 stroke-[3] fill-none opacity-0 scale-60 transition-all duration-140 peer-checked:opacity-100 peer-checked:scale-100"
              viewBox="0 0 12 12"
            >
              <polyline points="1.5,6.5 4.5,9.5 10.5,2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
Checkbox.displayName = 'Checkbox'
