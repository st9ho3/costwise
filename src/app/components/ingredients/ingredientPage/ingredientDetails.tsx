import React from 'react'

interface IngredientDetailsProps {
    children: React.ReactNode
}

const IngredientDetails = ({children}: IngredientDetailsProps) => {
  return (
    <div className='flex flex-col gap-4 border w-60 p-5 border-border rounded-lg'>
      {children}
    </div>
  )
}

export default IngredientDetails
