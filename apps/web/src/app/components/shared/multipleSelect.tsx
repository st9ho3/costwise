import { useUIStore } from '@/app/stores/uiStore'
import { ChevronDown, LucideIcon } from 'lucide-react'
import React from 'react'

interface MultipleSelectProps<T> {
  /** Array of selected items */
  selectedItems: T[]
  /** Label text for the field */
  label: string
  /** Placeholder text when no items are selected */
  placeholder: string
  /** Modal type identifier to open */
  modalType: string
  /** Icon component to display */
  icon: LucideIcon
  /** Function to get display names from items */
  getDisplayNames: (items: T[]) => string[]
}

/**
 * Reusable component for multi-select fields that open a modal.
 * Displays selected items and opens a modal when clicked.
 */
const MultipleSelect = <T extends Record<string, unknown>>({
  selectedItems,
  label,
  placeholder,
  modalType,
  icon: Icon,
  getDisplayNames
}: MultipleSelectProps<T>) => {
  const { openModal } = useUIStore()
  
  // Get display names for selected items
  const selectedNames = getDisplayNames(selectedItems)
  
  const displayText = selectedNames.length > 0 
    ? selectedNames.slice(0, 2).join(', ') + (selectedNames.length > 2 ? ` +${selectedNames.length - 2}` : '')
    : placeholder

  return (
    <div className='flex flex-col gap-1'>
      <label className="text-sm font-medium text-gray-600 ml-1">{label}</label>
      <div
        onClick={() => openModal(modalType)}
        className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-gray-300 transition-colors h-10"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className={`text-sm truncate ${selectedNames.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
            {displayText}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
      {selectedItems.length > 0 && (
        <span className="text-xs text-emerald-600 ml-1">
          {selectedItems.length} selected
        </span>
      )}
    </div>
  )
}

export default MultipleSelect