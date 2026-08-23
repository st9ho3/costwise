import React from 'react'
import Title from '@/app/components/ingredients/ingredientPage/title'
import { IngredientCategoryName } from '@/shemas/recipe'


interface IngredientHeaderProps {
    name: string | undefined
    icon: string | undefined | null
    type: IngredientCategoryName
}

const IngredientHeader = ({name, icon, type}: IngredientHeaderProps) => {

  const typeStyles = {
  'Produce': 'bg-green-300/30 text-green-500',
  'Meat & Poultry': 'bg-red-300/30 text-red-500',
  'Fish & Seafood': 'bg-blue-300/30',
  'Dairy & Alternatives': 'bg-yellow-300/30 text-yellow-500',
  'Dry Goods': 'bg-orange-300/30 text-orange-500',
  'Spices & Seasonings': 'bg-amber-300/30 text-amber-500',
  'Oils, Vinegars, & Condiments': 'bg-indigo-300/30 text-indigo-500',
  'Frozen': 'bg-sky-300/30 text-sky-500',
  'Coffee & Tea': 'bg-stone-300/30 text-stone-500',
  'Beverages (Other)': 'bg-cyan-300/30 text-cyan-500',
  'Bakery': 'bg-rose-300/30 text-rose-500',
  'Other': 'bg-muted/30 text-muted-foreground',
  '': 'bg-muted/30 text-muted-foreground', // Fallback for empty string
};

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className={`w-25 h-25 flex justify-center items-center text-7xl rounded-full ${typeStyles[type]}`}>
      {icon}
      </div>
      <Title title={name} />
    </div>
  )
}

export default IngredientHeader
