import React from 'react'
import Title from '@/app/components/ingredients/ingredientPage/title'


interface IngredientHeaderProps {
    name: string | undefined
    icon: string | undefined | null
}

const IngredientHeader = ({name, icon}: IngredientHeaderProps) => {

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='w-25 h-25 flex justify-center items-center rounded-full bg-amber-100 text-5xl'>
      {icon}
      </div>
      <Title title={name} />
    </div>
  )
}

export default IngredientHeader
