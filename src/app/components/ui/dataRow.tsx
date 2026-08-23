import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface DataRowProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  thumb?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  amount?: React.ReactNode
  amountNote?: React.ReactNode
  end?: React.ReactNode
  card?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
}

export function DataRow({
  thumb,
  title,
  subtitle,
  amount,
  amountNote,
  end,
  card = false,
  onClick,
  className,
  ...props
}: DataRowProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={cn(
        "flex items-center gap-3 w-full text-left transition-all duration-140 select-none",
        card
          ? "p-3.5 sm:p-4 rounded-[18px] bg-white border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)]"
          : "py-3 px-1 border-b border-[#EFE8DA] last:border-b-0 bg-transparent",
        onClick && "cursor-pointer hover:bg-cream-100",
        card && onClick && "hover:bg-white hover:shadow-[0_2px_4px_rgba(27,26,22,0.04),0_8px_20px_-6px_rgba(27,26,22,0.10)] hover:-translate-y-[1px]",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {thumb && (
        <span className="shrink-0 size-[40px] rounded-[12px] bg-green-50 text-green-700 flex items-center justify-center overflow-hidden">
          {thumb}
        </span>
      )}
      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="font-semibold text-[15px] leading-snug text-ink-900 truncate">
          {title}
        </span>
        {subtitle && (
          <span className="text-[12px] text-stone-500 truncate font-body">
            {subtitle}
          </span>
        )}
      </span>
      <span className="shrink-0 flex items-center gap-2.5">
        {amount != null && (
          <span className="font-mono font-bold text-[15px] leading-snug tabular-nums text-ink-900 text-right">
            {amount}
            {amountNote && <small className="block font-body text-[12px] font-normal text-stone-500">{amountNote}</small>}
          </span>
        )}
        {end}
      </span>
    </Tag>
  )
}
