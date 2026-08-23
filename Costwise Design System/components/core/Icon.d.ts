import type { CSSProperties } from 'react';
export interface IconProps {
  /** Lucide icon name in kebab-case, e.g. "carrot", "receipt-text". */
  name: string;
  /** Pixel box. Default 20. */
  size?: number;
  /** Default 1.75 — the Costwise stroke weight. Never below 1.5. */
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
