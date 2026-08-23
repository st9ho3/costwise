import { RecipeIngredients } from '@/shemas/recipe'
import React, { memo } from 'react'

interface Props {
    onToggleList: (value: React.SetStateAction<boolean>) => void
    ingredients: RecipeIngredients[]
}

const ViewIngredientsButtonMobile = memo(({onToggleList, ingredients}: Props) => {
  return (
    <button
        type='button'
        onClick={() => onToggleList(true)}
        className='md:hidden border border-gray-400 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors duration-200'
      >
        View Ingredients ({ingredients.length})
      </button>
  )
});

ViewIngredientsButtonMobile.displayName = "ViewIngredientsButtonMobile"
export default ViewIngredientsButtonMobile
