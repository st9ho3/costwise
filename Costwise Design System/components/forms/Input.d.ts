import type { ReactNode, InputHTMLAttributes } from 'react';
/**
 * Labelled text field.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Helper line under the field — plain-language, never a spec. */
  hint?: string;
  /** Replaces hint and turns the field tomato. */
  error?: string;
  icon?: ReactNode;
  /** Trailing unit or affix, e.g. "kg", "per litre". */
  suffix?: ReactNode;
  size?: 'md' | 'lg';
  /** Cream fill, no border — for fields inside a white card stack. */
  filled?: boolean;
}
export declare function Input(props: InputProps): JSX.Element;
