// src/components/ingredients/constants/IngredientUnitSelect.tsx

import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Scale } from 'lucide-react';
import { memo } from 'react';
import { UseFormRegister } from 'react-hook-form';

type IngredientUnitSelectProps = {
  register: UseFormRegister<IngredientFormFields>
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
};

const IngredientUnitSelect = memo(({ register, onKeyDown }: IngredientUnitSelectProps) => (
  // CONTAINER: Matches other inputs (rounded-xl, h-12, focus ring)
  <div className={`
    flex items-center w-full px-4 h-12
    bg-white border border-gray-200 rounded-xl
    transition-all duration-200 ease-in-out
    hover:border-gray-300
    focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 
    relative
  `}>
    
    {/* ICON: Visual context for "Measurement/Weight" */}
    <Scale 
        size={20} 
        className="text-gray-400 mr-3 shrink-0" 
        strokeWidth={2}
    />

    {/* SELECT INPUT */}
    <select
      id="unit"
      {...register('unit')}
      onKeyDown={onKeyDown}
      className="
        w-full h-full bg-transparent border-none outline-none
        text-sm font-medium text-gray-900 cursor-pointer
        placeholder:text-gray-400 appearance-none
      "
      defaultValue=""
    >
      <option value="" disabled className="text-gray-400">Unit</option>
      <option value="kg">kg (Kilogram)</option>
      <option value="L">L (Liter)</option>
      <option value="g">g (Gram)</option>
      <option value="ml">ml (Milliliter)</option>
      <option value="piece">Piece / Count</option>
    </select>

    
  </div>
));

IngredientUnitSelect.displayName = "IngredientUnitSelect"

export default IngredientUnitSelect