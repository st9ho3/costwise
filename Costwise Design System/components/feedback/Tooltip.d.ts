import type { ReactNode } from 'react';
export interface TooltipProps {
  label: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Allow multi-line, 220px wide — for explaining a number. */
  wrap?: boolean;
  children?: ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
