// src/components/ingredients/IngredientNameInput.tsx

import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Carrot } from 'lucide-react';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

type IngredientNameInputProps = {
  register: UseFormRegister<IngredientFormFields>
  onKeyDown: (e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLSelectElement> ) => void
};

const IngredientNameInput = ({ register, onKeyDown }: IngredientNameInputProps) => {
  
  return (
    // CONTAINER:
    // 1. w-full: Fills the grid column from the parent form
    // 2. focus-within: Handles the active state (Blue border + Ring)
    <div className={`
      flex items-center w-full px-4 h-12
      bg-white border border-gray-200 rounded-xl
      transition-all duration-200 ease-in-out
      hover:border-gray-300
      focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10
    `}>
      {/* ICON:
          Visual cue for the input type. 
          text-gray-400 is subtle enough not to distract.
      */}
      <Carrot 
        size={20} 
        className="text-gray-400 mr-3 shrink-0" 
        strokeWidth={2}
      />

      {/* INPUT:
          1. bg-transparent: Shows the container background
          2. w-full: Takes remaining space
          3. outline-none: We handle focus on the parent div instead
      */}
      <input
        type="text"
        {...register('name')}
        onKeyDown={onKeyDown}
        className="
          w-full h-full bg-transparent border-none outline-none
          text-sm font-medium text-gray-900 placeholder:text-gray-400
        "
        placeholder="e.g. Organic Carrots"
        autoComplete="off"
      />
    </div>
  )
};

export default IngredientNameInput