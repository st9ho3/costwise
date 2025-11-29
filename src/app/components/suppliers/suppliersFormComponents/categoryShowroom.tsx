import React from 'react'
import { INGREDIENT_CATEGORIES as categories } from '@/app/constants/supplierDeafaultValues'
import SelectItem from '../../shared/selectItem'

const CategoryShowroom = () => {

  return (
    <div className='flex flex-wrap w-80 gap-2'>
      {categories.map((category) => <SelectItem key={category.id} id={category.id} icon={category.icon} name={category.name} /> )}
    </div>
  )
}

export default CategoryShowroom