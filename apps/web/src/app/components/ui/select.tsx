'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/app/utils/cn'

const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'md' | 'lg'
    filled?: boolean
    error?: boolean
  }
>(({ className, children, size = 'md', filled = false, error = false, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-[36px] px-3 text-[13px]',
    md: 'h-[44px] px-3.5 text-[15px]',
    lg: 'h-[52px] px-4 text-[17px]',
  }[size]

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between rounded-[12px] border transition-all duration-140 outline-none text-ink-900 font-body cursor-pointer disabled:cursor-not-allowed disabled:opacity-42 data-[placeholder]:text-stone-400 select-none",
        filled ? "bg-cream-100 border-transparent" : "bg-white border-sand-300 hover:border-sand-400",
        error ? "border-tomato-500 focus:border-tomato-500 focus:ring-3 focus:ring-tomato-500/20" : "focus:border-green-500 focus:ring-3 focus:ring-green-500/20",
        sizeClasses,
        className
      )}
      {...props}
    >
      <div className="truncate text-left flex-1">{children}</div>
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 text-stone-500 shrink-0 ml-2 transition-transform duration-140 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-stone-500", className)}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-stone-500", className)}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        "relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-[16px] border border-[#EFE8DA] bg-white text-ink-900 shadow-[0_8px_16px_rgba(27,26,22,0.06),0_32px_64px_-20px_rgba(18,52,32,0.24)] p-1.5 animate-in fade-in-0 zoom-in-95 duration-140",
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === 'popper' && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] max-h-72 overflow-y-auto"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-[12px] font-bold text-stone-500 uppercase tracking-wider", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-[10px] py-2.5 pl-8 pr-3 text-[14px] font-medium text-ink-900 outline-none transition-colors hover:bg-cream-100 focus:bg-green-50 focus:text-green-900 data-[state=checked]:bg-cream-50 data-[state=checked]:font-semibold data-[state=checked]:text-green-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-42",
      className
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex size-4 items-center justify-center text-green-700">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" strokeWidth={2.2} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#EFE8DA]", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export interface SelectOptionItem {
  value: string
  label: string
  disabled?: boolean
}

export type SelectOption = string | SelectOptionItem

export interface SelectProps {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  options?: SelectOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  name?: string
  size?: 'sm' | 'md' | 'lg'
  filled?: boolean
  className?: string
  triggerClassName?: string
  id?: string
  children?: React.ReactNode
  required?: boolean
}

/**
 * Unified popup Select component for Costwise.
 * Can be used declaratively with `options` or as compound components with `children`.
 */
export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  onChange,
  disabled = false,
  name,
  size = 'md',
  filled = false,
  className,
  triggerClassName,
  id,
  children,
  required,
}: SelectProps) {
  const generatedId = React.useId()
  const selectId = id || (label ? generatedId : undefined)

  // Handle synthetic event for react-hook-form or native-like onChange callbacks
  const handleValueChange = (val: string) => {
    if (onValueChange) {
      onValueChange(val)
    }
    if (onChange) {
      const syntheticEvent = {
        target: { value: val, name: name || '' },
        currentTarget: { value: val, name: name || '' },
        persist: () => {},
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
      } as unknown as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }

  // If options array is provided, parse and filter options
  let resolvedPlaceholder = placeholder
  const validOptions: SelectOptionItem[] = []

  if (options && options.length > 0) {
    options.forEach((opt) => {
      const optVal = typeof opt === 'string' ? opt : opt.value
      const optLabel = typeof opt === 'string' ? opt : opt.label
      const optDisabled = typeof opt === 'object' ? opt.disabled : false

      // If option has an empty string value, treat its label as the placeholder
      if (optVal === '' || optVal === undefined || optVal === null) {
        if (!resolvedPlaceholder) {
          resolvedPlaceholder = optLabel
        }
      } else {
        validOptions.push({
          value: String(optVal),
          label: String(optLabel),
          disabled: optDisabled,
        })
      }
    })
  }

  // Value formatting for Radix (Radix requires controlled value to be non-empty or undefined)
  const normalizedValue = value !== undefined ? (value === '' ? undefined : String(value)) : undefined
  const normalizedDefaultValue = defaultValue !== undefined ? (defaultValue === '' ? undefined : String(defaultValue)) : undefined

  // Compound component mode (if children provided and no options)
  if (!options && children) {
    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <label htmlFor={selectId} className="font-bold text-[13px] text-ink-900 select-none">
            {label}
            {required && <span className="text-tomato-500 ml-0.5">*</span>}
          </label>
        )}
        <SelectPrimitive.Root
          value={normalizedValue}
          defaultValue={normalizedDefaultValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          name={name}
        >
          {children}
        </SelectPrimitive.Root>
        {error && <p className="font-body text-[12px] text-tomato-500 font-medium">{error}</p>}
        {hint && !error && <p className="font-body text-[12px] text-stone-500">{hint}</p>}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label htmlFor={selectId} className="font-bold text-[13px] text-ink-900 select-none">
          {label}
          {required && <span className="text-tomato-500 ml-0.5">*</span>}
        </label>
      )}
      <SelectPrimitive.Root
        value={normalizedValue}
        defaultValue={normalizedDefaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={selectId}
          size={size}
          filled={filled}
          error={!!error}
          className={triggerClassName}
        >
          <SelectValue placeholder={resolvedPlaceholder || 'Select an option...'} />
        </SelectTrigger>
        <SelectContent>
          {validOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>
      {error && <p className="font-body text-[12px] text-tomato-500 font-medium">{error}</p>}
      {hint && !error && <p className="font-body text-[12px] text-stone-500">{hint}</p>}
    </div>
  )
}

/**
 * Backward compatibility alias for NativeSelect.
 * Renders the uniform popup Select component.
 */
export function NativeSelect(props: SelectProps & Record<string, unknown>) {
  return <Select {...props} />
}

export {
  SelectPrimitive,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
