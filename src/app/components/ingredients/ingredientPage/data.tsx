import { IngredientCategoryType } from '@/types/specialTypes'
import React from 'react'
import { typeStyles } from '@/app/constants/data'

interface DataProps {
    label: string
    text: string | number | undefined
    category: IngredientCategoryType
}

const Data = ({label, text, category }: DataProps) => {
  return (
    <div className='mb-5'>
      <p className='text-gray-400 text-sm font-bold'>{label}</p>
      <div className={label === 'Usage' 
        ? `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-sm font-medium ${ Number(text) > 3 
        ? typeStyles.high : typeStyles.low}` 
        : label === 'Category' ? `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-sm font-medium ${typeStyles[category]}` : undefined}>
        <p>{label === 'Usage' ? Number(text) > 3 ? 'High' : 'Low' : text}{label === 'Price per Unit' ? ' €' : null}</p>
      </div>
    </div>
  )
}

export default Data
