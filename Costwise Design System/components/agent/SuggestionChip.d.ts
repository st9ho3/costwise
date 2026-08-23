import type { ReactNode, ButtonHTMLAttributes } from 'react';
export interface SuggestionChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
  /** accent = gold, a nudge from Costwise. filter = smaller, for filter rows. */
  variant?: 'default' | 'accent' | 'soft' | 'filter';
  selected?: boolean;
}
export declare function SuggestionChip(props: SuggestionChipProps): JSX.Element;
