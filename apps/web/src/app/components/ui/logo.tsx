import * as React from 'react';
import { cn } from '@/app/utils/cn';

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number | 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
  inverse?: boolean;
  plate?: boolean;
  src?: string;
}

export function Logo({
  size = 'md',
  variant = 'full',
  inverse = false,
  plate = false,
  src = '/images/logo-mark-transparent.png',
  className,
  ...props
}: LogoProps) {
  const numericSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 24
      : size === 'lg'
      ? 40
      : 30;

  const mark = (
    <img
      src={src}
      alt="Costwise"
      width={numericSize}
      height={numericSize}
      className="shrink-0 block"
      style={{ width: `${numericSize}px`, height: `${numericSize}px` }}
    />
  );

  return (
    <span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      {plate ? (
        <span className="inline-flex items-center justify-center bg-green-800 rounded-[12px] p-1.5">
          {mark}
        </span>
      ) : (
        mark
      )}
      {variant === 'full' && (
        <span
          className={cn(
            "font-logotype font-extrabold tracking-[-0.015em] leading-none",
            inverse ? "text-cream-50" : "text-green-800"
          )}
          style={{ fontSize: `${Math.round(numericSize * 0.82)}px` }}
        >
          Costwise
        </span>
      )}
    </span>
  );
}
