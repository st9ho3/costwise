// src/components/search/ingredientSearchResult.tsx

import { Ingredient } from '@/shemas/recipe'
import Link from 'next/link'
import React from 'react'

interface IngredientSearchResultProps {
    item: Ingredient
    onClose: () => void
}

const IngredientSearchResult = ({item, onClose}: IngredientSearchResultProps) => {

  return (
    <Link 
      onClick={onClose} 
      href={`/ingredients/${item.id}`}
      className="block mx-2" // Margin for the hover effect containment
    >
      <div className="
        group flex items-center justify-between 
        p-3 rounded-2xl
        transition-all duration-200 ease-in-out
        hover:bg-gray-50 cursor-pointer
      ">
        {/* LEFT: Icon & Main Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Icon Container: Soft Yellow Surface */}
          <div className="
            flex justify-center items-center shrink-0 
            w-10 h-10 rounded-full 
            bg-yellow-100/80 text-xl
            border border-yellow-200/50
          ">
            {item.icon || "🥕"}
          </div>

          {/* Text Info */}
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {item.name}
            </span>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
               {item.category}
            </span>
          </div>
        </div>

        {/* RIGHT: Meta Data (Price & Qty) */}
        <div className="flex flex-col items-end shrink-0 pl-4">
          <span className="text-sm font-bold text-gray-700 tabular-nums">
            {item.unitPrice}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <span>{item.quantity}</span>
            {/* Handle unit if it's an object or string */}
            <span className="text-gray-400">
               {item.unit}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default IngredientSearchResult