import React, { memo } from 'react'
import { RecipeIngredients } from '@/shemas/recipe'
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FormFields } from '../../recipeForm'
import {OrderTotal, DisplayedIngredientItem} from '@/app/constants/components'

interface Props {
    ingredients: RecipeIngredients[]
    onRemove: (id: string) => void
    getValues: UseFormGetValues<FormFields>
    setValue: UseFormSetValue<FormFields>
    watch: UseFormWatch<FormFields>
}

const RecipeIngredientsDisplay = memo(({ingredients, onRemove, getValues, setValue, watch}: Props) => {

  return (
    <div className='hidden md:flex flex-col items-center border-1 border-gray-300 border-dashed rounded-lg w-full p-2 md:ml-1 mt-4 md:mt-0'>
      <div className='w-full h-2/3 overflow-auto'>
        {ingredients.length > 0 ? ingredients.map((ing) =>
          <DisplayedIngredientItem
            key={ing.ingredientId}
            onRemove={onRemove}
            ingredient={ing}
          />
        ) : <h3 className='text-center text-gray-500'>Empty</h3>}
      </div>
      <OrderTotal 
       ingredients={ingredients} 
       getValues={getValues} 
       setValue={setValue}
       watch={watch}
       />
    </div>
  )
})

RecipeIngredientsDisplay.displayName = "RecipeIngredientsDisplay"

export default RecipeIngredientsDisplay
