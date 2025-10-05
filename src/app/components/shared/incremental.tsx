"use client"
import React, { useCallback, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { UseFormSetValue } from 'react-hook-form'
import { IngredientFormFields } from '@/app/hooks/useIngredientsForm'

type IncrementalProps = {
  onIngredientChange?: UseFormSetValue<IngredientFormFields>
  onRecipeIngredientChange?: ((value: number) => void)
  count: number,
  onKeyDown: (value: React.KeyboardEvent<HTMLInputElement>) => void,
  setErrors:  (value: React.SetStateAction<string[]>) => void
}

const Incremental = ({onIngredientChange, onRecipeIngredientChange, count, onKeyDown, setErrors}: IncrementalProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  
  const handleClick = useCallback((action: 'minus' | 'plus') => {
    setIsEditing(false)  
    if (onIngredientChange) {
      if (action === 'plus') {
      onIngredientChange("quantity", count + 1)
    } else if (count > 0) {
      onIngredientChange("quantity", count - 1)
    }
    setErrors([])
    } 
    if (onRecipeIngredientChange) {
      
      if (action === 'plus') {
      onRecipeIngredientChange(count + 1)
    } else if (count > 0) {
      onRecipeIngredientChange( count - 1)
    }
    setErrors([])
    }             
  },[count, onRecipeIngredientChange, onIngredientChange, setErrors])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value === '' ? 0 : Number(e.target.value)
    if (onIngredientChange) {
      onIngredientChange("quantity", value)
      setErrors([])
    }
    if (onRecipeIngredientChange) {
      onRecipeIngredientChange(value)
      setErrors([])
    }
    
  },[ onIngredientChange,onRecipeIngredientChange,setErrors])

  const handleFocus = useCallback(() => {
    setIsEditing(true)
  },[])

  const handleBlur = useCallback(() => {
    if (count === 0) {
      setIsEditing(false)
    }
  },[count])

  
  const displayValue = isEditing && count === 0
    ? ''
    : count

  return (
    <div className="flex items-center ">
      <button
        type="button"
        className="w-6 h-6 flex justify-center items-center bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
        aria-label="Decrement count"
        onClick={() => handleClick('minus')}
      >
        <Minus color="gray" size={16} />
      </button>

      <input
        type="number"
        className="focus:outline-none px-2 w-18 text-center font-semibold text-2xl text-gray-800"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <button
        type="button"
        className="w-6 h-6 flex justify-center items-center bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
        aria-label="Increment count"
        onClick={() => handleClick('plus')}
      >
        <Plus color="gray" size={16} />
      </button>
    </div>
  )
}

export default Incremental
