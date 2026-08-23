import React from 'react'
import SelectStore, { SelectableItem } from './SelectStore'

interface ItemsStoreProps<T extends SelectableItem> {
  /** All available items to display */
  items: T[]
  /** Currently selected item IDs */
  selected: T['id'][]
  /** Callback when an item is clicked - uses the same ID type as the items */
  onSelect: (id: T['id']) => void
  /** Title for the modal */
  title: string
  /** Description text */
  description: string
  /** Callback to close the modal */
  onClose: () => void
  /** Optional: Custom className for SelectStore */
  className?: string
}

/**
 * Reusable modal content component for selecting items.
 * Works with any entity type that extends SelectableItem.
 */
function ItemsStore<T extends SelectableItem>({
  items,
  selected,
  onSelect,
  title,
  description,
  onClose,
  className = "flex flex-wrap gap-2 justify-center"
}: ItemsStoreProps<T>) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <SelectStore 
        items={items} 
        selected={selected} 
        onSelect={onSelect}
        className={className}
      />
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Επιβεβαίωση
        </button>
      </div>
    </div>
  )
}

export default ItemsStore