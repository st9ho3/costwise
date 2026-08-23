import type { ReactNode } from 'react';
export interface SidebarItem { value?: string; label?: string; icon?: ReactNode; badge?: string; group?: string }
export interface SidebarNavProps {
  /** Items in order; an entry with only `group` renders a section heading. */
  items: SidebarItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** Icons only, 64px rail. */
  collapsed?: boolean;
  /** For deep-green sidebars. */
  inverse?: boolean;
}
export declare function SidebarNav(props: SidebarNavProps): JSX.Element;
