import type { ReactNode, ButtonHTMLAttributes } from 'react';
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'plain' | 'outline' | 'solid' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  round?: boolean;
  active?: boolean;
  /** Required for a11y — also becomes the tooltip. */
  label: string;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
