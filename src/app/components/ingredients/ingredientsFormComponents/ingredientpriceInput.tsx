import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Euro } from 'lucide-react';
import {  UseFormRegister } from 'react-hook-form';

type IngredientPriceInputProps = {
  register: UseFormRegister<IngredientFormFields>
 
};

const IngredientPriceInput = ({ register}: IngredientPriceInputProps) => {
  
  return (
  <div className='flex items-center p-1 space-x-3 border-dashed rounded-lg border-1 border-gray-300'>
    <Euro />
    <input
      type='number'
      className="p-1 text-lg placeholder:text-gray-500 w-20 focus:outline-none"
      placeholder="Price"
      {...register('unitPrice', {valueAsNumber: true})}
    />
  </div>
)};


export default IngredientPriceInput