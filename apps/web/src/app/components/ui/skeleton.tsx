import * as React from 'react'
import { cn } from '@/app/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean
}

export function Skeleton({ className, circle = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#EFE8DA]',
        circle ? 'rounded-full' : 'rounded-[8px]',
        className
      )}
      {...props}
    />
  )
}
