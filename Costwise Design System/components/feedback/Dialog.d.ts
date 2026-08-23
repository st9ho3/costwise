import type { ReactNode } from 'react';
/**
 * Modal for one decision.
 */
export interface DialogProps {
  open?: boolean;
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /** Buttons row, right-aligned. Confirm last. */
  footer?: ReactNode;
  onClose?: () => void;
  /** sheet = bottom sheet on phone widths. */
  size?: 'md' | 'wide' | 'sheet';
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
