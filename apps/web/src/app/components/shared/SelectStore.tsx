/**
 * Base interface for selectable items.
 * Any item passed to SelectStore must have at least these fields.
 */
export interface SelectableItem {
  id: string;
  name: string;
  icon?: string;
}
