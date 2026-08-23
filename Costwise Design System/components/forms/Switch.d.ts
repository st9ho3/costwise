import type { InputHTMLAttributes } from 'react';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** Label left, switch right (settings-row default). Set false to lead with the switch. */
  reversed?: boolean;
}
export declare function Switch(props: SwitchProps): JSX.Element;
