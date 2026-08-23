import type { ReactNode } from 'react';
export interface EmptyStateProps {
  /** Path to a brand illustration, e.g. assets/brand-illustration-cast-transparent.png. Preferred over icon. */
  illustration?: string;
  icon?: ReactNode;
  title: ReactNode;
  message?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
