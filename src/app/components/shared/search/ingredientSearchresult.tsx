import { Ingredient } from '@/shemas/recipe'
import React from 'react'

interface IngredientSearchResultProps {
    item: Ingredient
}

const IngredientSearchResult = ({item}: IngredientSearchResultProps) => {

  return (
    <div className="flex items-center gap-2 mb-2">
        <div
          className="flex justify-center items-center w-9 h-9 text-xl bg-yellow-100 rounded-full object-cover"
        >{item.icon}</div>
        <p className="text-sm break-words transition-colors duration-300 ease-in-out hover:text-gray-400">
          {item.name ? item.name : "NaN"}
        </p>
    </div>
  )
}

export default IngredientSearchResult
