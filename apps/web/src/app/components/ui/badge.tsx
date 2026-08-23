import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/utils/cn';

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-bold font-body tracking-[-0.01em] whitespace-nowrap transition-colors select-none",
  {
    variants: {
      tone: {
        neutral: "bg-cream-200 text-ink-700",
        secondary: "bg-cream-200 text-ink-700",
        default: "bg-cream-200 text-ink-700",
        good: "bg-green-100 text-green-800",
        success: "bg-green-100 text-green-800",
        watch: "bg-gold-100 text-gold-800",
        warning: "bg-gold-100 text-gold-800",
        over: "bg-tomato-100 text-tomato-700",
        danger: "bg-tomato-100 text-tomato-700",
        destructive: "bg-tomato-100 text-tomato-700",
        info: "bg-blueberry-100 text-blueberry-600",
        agent: "bg-berry-100 text-berry-600",
        brand: "bg-green-800 text-cream-50",
        outline: "bg-transparent border border-sand-300 text-ink-700",
      },
      size: {
        sm: "h-[20px] px-2 text-[11px]",
        md: "h-[24px] px-2.5 text-[12px]",
        lg: "h-[28px] px-3 text-[13px]",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, 'tone'> {
  tone?: VariantProps<typeof badgeVariants>['tone'];
  variant?: VariantProps<typeof badgeVariants>['tone'];
  dot?: boolean;
  icon?: React.ReactNode;
}

function Badge({
  className,
  tone,
  variant,
  size,
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const resolvedTone = tone || variant || 'neutral';

  return (
    <span
      className={cn(badgeVariants({ tone: resolvedTone, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            resolvedTone === 'good' || resolvedTone === 'success'
              ? "bg-green-700"
              : resolvedTone === 'watch' || resolvedTone === 'warning'
              ? "bg-gold-700"
              : resolvedTone === 'over' || resolvedTone === 'danger' || resolvedTone === 'destructive'
              ? "bg-tomato-600"
              : resolvedTone === 'info'
              ? "bg-blueberry-600"
              : "bg-stone-500"
          )}
        />
      )}
      {icon}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
