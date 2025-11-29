import { typeStyles } from '@/app/constants/data'
import { IngredientCategory, IngredientCategoryName } from '@/shemas/recipe'
import React from 'react'

interface SelectItemProps {
    icon?: string
    name: IngredientCategoryName
    id: IngredientCategory
}

const SelectItem = ({icon, name}: SelectItemProps) => {

  return (
    <div className={`px-2 gap-1 cursor-pointer flex justify-center items-center border ${typeStyles[name]} h-6 rounded-full w-fit`}>
     <span>{icon}</span>
     <span>{name}</span>
    </div>
  )
}

export default SelectItem
