import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean
  title?: React.ReactNode
  icon?: React.ReactNode
  footer?: React.ReactNode
  onClose?: () => void
  size?: 'md' | 'wide' | 'sheet'
}

export function Dialog({
  open = true,
  title,
  icon,
  children,
  footer,
  onClose,
  size = 'md',
  className,
  ...props
}: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    md: 'max-w-[440px]',
    wide: 'max-w-[640px]',
    sheet: 'max-w-[520px] self-end rounded-b-none sm:self-center sm:rounded-b-[28px]',
  }[size]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-900/40 backdrop-blur-[3px] animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full bg-white rounded-[28px] shadow-[0_8px_16px_rgba(27,26,22,0.06),0_32px_64px_-20px_rgba(18,52,32,0.24)] p-6 animate-in zoom-in-95 duration-200 text-ink-900",
          sizeClasses,
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {(title || icon) && (
          <div className="flex items-start gap-3 mb-3">
            {icon}
            <div className="flex-1 font-display font-bold text-[22px] leading-snug tracking-tight text-ink-900">
              {title}
            </div>
          </div>
        )}
        <div className="font-body text-[15px] text-ink-700 leading-normal">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-2.5 mt-6 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
