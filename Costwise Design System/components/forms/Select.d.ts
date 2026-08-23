import type { ReactNode, SelectHTMLAttributes } from 'react';
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Array<string | { value: string; label: string }>;
  filled?: boolean;
  /** Pass <Icon name="chevron-down" size={16}/> for the Lucide chevron. */
  chevron?: ReactNode;
}
export declare function Select(props: SelectProps): JSX.Element;
