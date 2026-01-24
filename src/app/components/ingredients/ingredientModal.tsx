"use client"
import React from 'react'
import { Ingredient } from '@/shemas/recipe'
import { ExitButton, IngredientForm } from '@/app/constants/components'
import { SelectOption } from './ingredientsFormComponents/FormSelect'

interface Props {
  mode: 'create' | 'edit'
  ingredient: Ingredient | undefined
  userId: string
  supplierOptions?: SelectOption[]
}

const IngredientModal = ({ingredient, mode, userId, supplierOptions = []}: Props) => {

  return (
    <div>
      <ExitButton />
      <IngredientForm 
        mode={mode} 
        ingredient={ingredient} 
        userId={userId} 
        supplierOptions={supplierOptions}
      />
    </div>
  )
}

export default IngredientModal
