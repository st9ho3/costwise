import React from 'react'
import Title from '@/app/components/ingredients/ingredientPage/title'
import Icon from '@/app/components/ingredients/ingredientPage/icon'


interface IngredientHeaderProps {
    name: string | undefined
    icon: string | undefined | null
}

const IngredientHeader = ({name, icon}: IngredientHeaderProps) => {

  return (
    <div className='flex items-center gap-3'>
      <Title title={name} />
      <Icon>
        {icon}
      </Icon>
    </div>
  )
}

export default IngredientHeader
