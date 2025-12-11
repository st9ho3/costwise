// src/components/search/recipeSearchResult.tsx

import { Recipe } from '@/shemas/recipe'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface RecipeSearchResultProps {
    item: Recipe
    onClose: () => void
}

const RecipeSearchResult = ({item, onClose}: RecipeSearchResultProps) => {

    

    // Calculate Margin Percentage for display if needed
    // (Optional logic: if you have margin data, display it, otherwise calculate)
    const marginPercent = item.profitMargin 
        ? `${item.profitMargin}%` 
        : item.sellingPrice && item.totalCost 
            ? `${Math.round(((item.sellingPrice - item.totalCost) / item.sellingPrice) * 100)}%`
            : null;

    return (
      <Link 
        onClick={onClose} 
        href={`/recipes/${item.id}`}
        className="block mx-2"
      >
        <div className="
          group flex items-center justify-between 
          p-3 rounded-2xl
          transition-all duration-200 ease-in-out
          hover:bg-gray-50 cursor-pointer
        ">
            {/* LEFT: Image & Identity */}
            <div className="flex items-center gap-3 overflow-hidden">
                {/* Image: Rounded Square (Squircle) looks better for photos than circles */}
                <div className="relative w-12 h-12 shrink-0">
                    <Image
                        className="rounded-xl object-cover shadow-sm border border-gray-100"
                        src={item.imgPath || '/images/placeholder-image.png'}
                        alt={item.title}
                        fill
                        sizes="48px"
                    />
                </div>

                <div className="flex flex-col truncate pr-2">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </p>
                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                         <span className={`
                            text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md
                            ${item.category === 'main' ? 'bg-orange-100 text-orange-700' : 
                              item.category === 'starter' ? 'bg-green-100 text-green-700' : 
                              'bg-purple-100 text-purple-700'}
                         `}>
                            {item.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Financial Data */}
            <div className="flex flex-col items-end shrink-0 pl-2">
                {/* Selling Price (Revenue) */}
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                    {item.sellingPrice}€
                </span>
                
                {/* Cost or Margin context */}
                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-400 font-medium">
                        Cost: {item.totalCost}€
                    </span>
                    {marginPercent && (
                        <span className="text-emerald-600 bg-emerald-50 px-1 rounded font-bold text-[10px]">
                           {marginPercent}
                        </span>
                    )}
                </div>
            </div>
        </div>
      </Link>
    )
}

export default RecipeSearchResult