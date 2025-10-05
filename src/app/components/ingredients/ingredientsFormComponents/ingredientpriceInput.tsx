"use client"
import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Euro } from 'lucide-react';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type IngredientPriceInputProps = {
  onChange: UseFormSetValue<IngredientFormFields>
  price: number
 
};

const IngredientPriceInput = ({ onChange, price}: IngredientPriceInputProps) => {
  
  const [isEditing, setIsEditing] = useState(false)

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value === '' ? 0 : Number(e.target.value)
    onChange("unitPrice", value)
  }

  const displayValue = isEditing && price === 0 ? '' : price

  return (
  <div className='flex items-center p-1 space-x-3 border-dashed rounded-lg border-1 border-gray-300'>
    <Euro />
    <input
      type='number'
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      className="p-1 text-lg placeholder:text-gray-500 w-20 focus:outline-none"
      placeholder="Price"
      
    />
  </div>
)};


export default IngredientPriceInput