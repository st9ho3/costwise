import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || (label ? generatedId : undefined)

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="font-bold text-[13px] text-ink-900 select-none">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "flex min-h-[90px] w-full rounded-[12px] border border-sand-300 bg-white p-3 text-[15px] font-body text-ink-900 outline-none transition-all duration-140 placeholder:text-sand-400 hover:border-sand-400 focus:border-green-500 focus:ring-3 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60",
            error && "border-tomato-600 focus:border-tomato-600 focus:ring-tomato-500/20",
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <span className={cn("text-[12px]", error ? "text-tomato-700 font-medium" : "text-stone-500")}>
            {error || hint}
          </span>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
