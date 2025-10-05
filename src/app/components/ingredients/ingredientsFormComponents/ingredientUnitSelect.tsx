import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Scale } from 'lucide-react';
import { memo } from 'react';
import { UseFormRegister } from 'react-hook-form';

type IngredientUnitSelectProps = {
  register: UseFormRegister<IngredientFormFields>
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
};

const IngredientUnitSelect = memo(({ register, onKeyDown }: IngredientUnitSelectProps) => (
  <div className='flex items-center p-1 space-x-3 border-dashed rounded-lg border-1 border-gray-300'>
    <Scale />
    <select
      id="unit"
      {...register('unit')}
      className="block w-20 p-2 text-lg bg-white text-gray-800 focus:outline-none"
      onKeyDown={onKeyDown}
    >
      <option value="">Unit</option>
      <option value="kg">kg</option>
      <option value="L">L</option>
      <option value="g">g</option>
      <option value="ml">ml</option>
      <option value="piece">piece</option>
    </select>
  </div>
));

IngredientUnitSelect.displayName = "IngredientUnitSelect"

export default IngredientUnitSelect