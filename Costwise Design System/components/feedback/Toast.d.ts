import type { ReactNode } from 'react';
export interface ToastProps {
  title: ReactNode;
  message?: ReactNode;
  tone?: 'default' | 'good' | 'watch' | 'over';
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}
export declare function Toast(props: ToastProps): JSX.Element;
