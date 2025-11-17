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
  
  console.log("IngredientNameInput")
  
  return (
  <div className='flex items-center p-1 space-x-3 border-dashed rounded-lg border-1 border-gray-300'>
    <Carrot size={18} />
    <input
      type="text"
      {...register('name')}
      onKeyDown={onKeyDown}
      className="p-1 text-md placeholder:text-gray-500 w-36 focus:outline-none"
      placeholder="Ingredient Name"
    />
  </div>
)};


export default IngredientNameInput