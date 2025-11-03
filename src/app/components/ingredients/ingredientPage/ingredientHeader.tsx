import React from 'react'
import Title from '@/app/components/ingredients/ingredientPage/title'


interface IngredientHeaderProps {
    name: string | undefined
    icon: string | undefined | null
}

const IngredientHeader = ({name, icon}: IngredientHeaderProps) => {

  return (
    <div className='flex items-center gap-3'>
      <Title title={name} />
      <div className='w-15 h-15 flex justify-center items-center rounded-full bg-amber-100 text-3xl'>
      {icon}
      </div>
    </div>
  )
}

export default IngredientHeader
