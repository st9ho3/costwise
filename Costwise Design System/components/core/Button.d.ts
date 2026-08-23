import type { ReactNode, ButtonHTMLAttributes } from 'react';
/**
 * The Costwise action button.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = the one green action per view. accent = gold, for "Ask Costwise" moments. */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Fully rounded. Used for conversational / floating actions. */
  pill?: boolean;
  block?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  as?: 'button' | 'a';
}
export declare function Button(props: ButtonProps): JSX.Element;
