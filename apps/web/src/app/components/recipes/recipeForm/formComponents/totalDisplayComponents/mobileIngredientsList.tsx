import { RecipeIngredients } from '@/shemas/recipe'
import React from 'react'
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FormFields } from '../../recipeForm'
import {OrderTotal, DisplayedIngredientItem} from '@/app/constants/components'

interface Props {
    onToggle: (value: React.SetStateAction<boolean>) => void
    ingredients: RecipeIngredients[]
    getValues: UseFormGetValues<FormFields>
    setValue: UseFormSetValue<FormFields>
    onRemove: (id: string) => void 
    watch: UseFormWatch<FormFields>
}

const MobileIngredientsList = ({onToggle,ingredients, onRemove, setValue, getValues, watch}: Props) => {
  return (
    <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col md:hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <button onClick={() => onToggle(false)} className="text-2xl font-bold">&times;</button>
      </div>

      <div className='flex-grow w-full h-2/3 overflow-auto mb-4'>
        {ingredients.length > 0 ? ingredients.map((ing) =>
          <DisplayedIngredientItem
            key={ing.ingredientId}
            onRemove={onRemove}
            ingredient={ing}
          />
        ) : <h3 className='text-center text-gray-500'>Empty</h3>}
      </div>

      <OrderTotal ingredients={ingredients} getValues={getValues} setValue={setValue} watch={watch} />
    </div>
  )
}

export default MobileIngredientsList
