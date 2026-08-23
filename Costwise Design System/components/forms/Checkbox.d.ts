import type { InputHTMLAttributes, ReactNode } from 'react';
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  /** Second line in muted caption type. */
  description?: string;
  disabled?: boolean;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
