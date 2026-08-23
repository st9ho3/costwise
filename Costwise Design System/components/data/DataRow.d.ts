import type { ReactNode } from 'react';
export interface DataRowProps {
  /** 40px leading slot — an Icon, an Avatar, or a photo. */
  thumb?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned mono figure. */
  amount?: ReactNode;
  /** Small line under the amount, e.g. "per portion". */
  amountNote?: string;
  /** Trailing slot — Badge, IconButton, chevron. */
  end?: ReactNode;
  /** Standalone card row instead of a divider list row. */
  card?: boolean;
  onClick?: () => void;
}
export declare function DataRow(props: DataRowProps): JSX.Element;
