import React from 'react'

interface IngredientDataProps {
    children: React.ReactNode
}

const IngredientData = ({children}: IngredientDataProps) => {

  return (
    <div className=' flex flex-col pt-5'>
      {children}
    </div>
  )
}

export default IngredientData
