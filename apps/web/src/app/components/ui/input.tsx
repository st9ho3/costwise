import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  icon?: React.ReactNode
  suffix?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  filled?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, hint, error, icon, suffix, size = 'md', filled = false, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || (label ? generatedId : undefined)

    const sizeClasses = {
      sm: 'h-[36px] px-3 text-[13px]',
      md: 'h-[44px] px-3.5 text-[15px]',
      lg: 'h-[52px] px-4 text-[17px]',
    }[size]

    const safeDefaultValue =
      typeof props.defaultValue === 'number' && isNaN(props.defaultValue)
        ? ''
        : props.defaultValue
    const safeValue =
      typeof props.value === 'number' && isNaN(props.value)
        ? ''
        : props.value

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-bold text-[13px] text-ink-900 select-none">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-[12px] transition-all duration-140 border",
            filled ? "bg-cream-100 border-transparent" : "bg-white border-sand-300 hover:border-sand-400",
            "focus-within:border-green-500 focus-within:ring-3 focus-within:ring-green-500/20",
            error && "border-tomato-600 focus-within:border-tomato-600 focus-within:ring-tomato-500/20",
            disabled && "bg-cream-100 opacity-60 cursor-not-allowed",
            sizeClasses
          )}
        >
          {icon && <span className="inline-flex items-center text-stone-500 shrink-0">{icon}</span>}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent border-0 outline-none text-ink-900 placeholder:text-sand-400 font-body disabled:cursor-not-allowed",
              className
            )}
            {...props}
            defaultValue={safeDefaultValue}
            value={safeValue}
          />
          {suffix && <span className="font-semibold text-[13px] text-stone-500 shrink-0 select-none">{suffix}</span>}
        </div>
        {(error || hint) && (
          <span className={cn("text-[12px]", error ? "text-tomato-700 font-medium" : "text-stone-500")}>
            {error || hint}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
