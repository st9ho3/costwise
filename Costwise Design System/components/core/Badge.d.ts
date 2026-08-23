import type { ReactNode, HTMLAttributes } from 'react';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** good = on-target margin, watch = drifting, over = above target cost. */
  tone?: 'neutral' | 'good' | 'watch' | 'over' | 'info' | 'agent' | 'brand' | 'outline';
  size?: 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
