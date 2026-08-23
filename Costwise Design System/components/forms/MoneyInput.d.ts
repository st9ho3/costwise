import type { InputHTMLAttributes } from 'react';
export interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'size'> {
  label?: string;
  /** Currency glyph. Default "€". */
  currency?: string;
  /** Unit the amount is per, e.g. "kg", "portion". */
  per?: string;
  /** lg = the hero amount on a pricing screen. */
  size?: 'md' | 'lg';
}
export declare function MoneyInput(props: MoneyInputProps): JSX.Element;
