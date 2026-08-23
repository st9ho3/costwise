import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  agent?: boolean
  online?: boolean
}

export function Avatar({
  name = '',
  src,
  size = 'md',
  agent = false,
  online = false,
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)

  React.useEffect(() => {
    setImgError(false)
  }, [src])

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] || '')
    .join('')
    .toUpperCase() || 'CW'

  const sizeClasses = {
    sm: 'size-[28px] text-[11px]',
    md: 'size-[36px] text-[13px]',
    lg: 'size-[48px] text-[16px]',
    xl: 'size-[64px] text-[20px]',
  }[size]

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-body font-bold select-none",
        agent ? "bg-green-800 p-1" : "bg-green-100 text-green-800",
        sizeClasses,
        className
      )}
      title={name || undefined}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={cn("w-full h-full", agent ? "object-contain" : "object-cover")}
        />
      ) : (
        <span>{initials}</span>
      )}
      {online && (
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-600 ring-2 ring-white" />
      )}
    </span>
  )
}
