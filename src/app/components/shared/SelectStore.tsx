'use client'

import { IngredientCategory } from '@/shemas/recipe';
import React from 'react'

/**
 * Base interface for selectable items.
 * Any item passed to SelectStore must have at least these fields.
 */
export interface SelectableItem {
  id: IngredientCategory;
  name: string;
  icon?: string;
}

interface SelectStoreProps<T extends SelectableItem> {
  /** All available items to display as pills */
  items: T[];
  /** Currently selected item IDs */
  selected: string[];
  /** Callback when an item is clicked */
  onSelect: (item: IngredientCategory ) => void;
  /** Optional: Custom container className */
  className?: string;
}

/**
 * A generic, reusable selection component that displays items as pills.
 * Works with any entity type that extends SelectableItem (Suppliers, Categories, etc).
 * 
 * State is managed by the parent - this is a pure presentational component.
 * 
 * @example
 * // For Categories (on SupplierForm)
 * <SelectStore
 *   items={categories}
 *   selected={selectedCategoryIds}
 *   onSelect={(category) => toggleCategory(category.id)}
 * />
 * 
 * // For Suppliers (on IngredientForm)
 * <SelectStore
 *   items={suppliers}
 *   selected={selectedSupplierIds}
 *   onSelect={(supplier) => toggleSupplier(supplier.id)}
 * />
 */
function SelectStore<T extends SelectableItem>({
  items,
  selected,
  onSelect,
  className = 'flex flex-wrap w-80 gap-2',
}: SelectStoreProps<T>) {
  return (
    <div className={className}>
      {items.map((item) => {
        const isSelected = selected.includes(item.id);
        return (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`px-2 gap-1 cursor-pointer flex justify-center items-center border h-6 rounded-full w-fit transition-all duration-150
              ${isSelected 
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700' 
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SelectStore;
