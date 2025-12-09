import { typeStyles, unselectedTypeStyles } from '@/app/constants/data'
import { IngredientCategory, IngredientCategoryName } from '@/shemas/recipe'
import React from 'react'

interface SelectItemProps {
    icon?: string
    name: IngredientCategoryName
    id: IngredientCategory
    onSelect: (id: IngredientCategory) => void
    selected: string[]
}

const SelectItem = ({icon, name, onSelect, id, selected}: SelectItemProps) => {

  return (
    <div onClick={() => onSelect(id)} className={`px-2 gap-1 cursor-pointer flex justify-center items-center border-1 ${!selected.includes(id) ? unselectedTypeStyles[name] : typeStyles[name]} h-6 rounded-full w-fit`}>
     <span>{icon}</span>
     <span>{name}</span>
    </div>
  )
}

export default SelectItem
