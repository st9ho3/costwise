import type { ReactNode, HTMLAttributes } from 'react';
/**
 * The Costwise surface container.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sunken' | 'brand' | 'accent' | 'flat';
  padding?: 'md' | 'tight' | 'none';
  interactive?: boolean;
  title?: ReactNode;
  eyebrow?: string;
  icon?: ReactNode;
  /** Top-right slot — usually an IconButton or Badge. */
  action?: ReactNode;
  children?: ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
