import type { ReactNode } from 'react';
export interface TabItem { value: string; label: string; icon?: ReactNode; count?: number }
/**
 * Segmented view switcher.
 */
export interface TabsProps {
  items: Array<string | TabItem>;
  value: string;
  onChange?: (value: string) => void;
  /** pill = cream capsule track (default). underline = section tabs on a page. */
  variant?: 'pill' | 'underline';
  block?: boolean;
}
export declare function Tabs(props: TabsProps): JSX.Element;
