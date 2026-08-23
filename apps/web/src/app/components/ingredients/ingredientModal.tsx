"use client"
import React from 'react'
import { Ingredient } from '@costwise/shared/recipe'
import { ExitButton, IngredientForm } from '@/app/constants/components'
import { SelectableItem } from '../shared/SelectStore'

interface Props {
  mode: 'create' | 'edit'
  ingredient: Ingredient | undefined
  userId: string
  supplierOptions?: SelectableItem[]
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
