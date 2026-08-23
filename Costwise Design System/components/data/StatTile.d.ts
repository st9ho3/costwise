import type { ReactNode } from 'react';
/**
 * A single number, said plainly.
 */
export interface StatTileProps {
  label: string;
  value: ReactNode;
  /** Trailing unit, e.g. "%", "/ portion". */
  unit?: string;
  /** Change text, e.g. "-2.1 pts". */
  delta?: string;
  /** good = moving the right way for the owner, over = the wrong way. */
  deltaTone?: 'good' | 'over' | 'flat';
  /** Plain-language context after the delta. */
  caption?: string;
  icon?: ReactNode;
  variant?: 'default' | 'sunken' | 'brand';
  size?: 'md' | 'lg';
}
export declare function StatTile(props: StatTileProps): JSX.Element;
