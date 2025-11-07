import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { memo } from 'react';
import { UseFormRegister } from 'react-hook-form';

type IngredientCatSelectProps = {
  register: UseFormRegister<IngredientFormFields>
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
};

const IngredientCatSelect = memo(({ register, onKeyDown }: IngredientCatSelectProps) => (
  <div className='flex items-center p-1 space-x-3 border-dashed rounded-lg border-1 border-gray-300'>
    
    <select
      id="category"
      {...register('category')}
      className="block w-40 p-2 text-lg bg-white text-gray-800 focus:outline-none"
      onKeyDown={onKeyDown}
    >
            <option value="">Category</option>
            <option value="Produce">🥕 Produce</option>
            <option value="Meat & Poultry">🥩 Meat & Poultry</option>
            <option value="Fish & Seafood">🐟 Fish & Seafood</option>
            <option value="Dairy & Alternatives">🧀 Dairy & Alternatives</option>
            <option value="Dry Goods">🌾 Dry Goods</option>
            <option value="Spices & Seasonings">🧂 Spices & Seasonings</option>
            <option value="Oils, Vinegars, & Condiments">🫙 Oils, Vinegars, & Condiments</option>
            <option value="Frozen">❄️ Frozen</option>
            <option value="Coffee & Tea">☕ Coffee & Tea</option>
            <option value="Beverages (Other)">🧃 Beverages (Other)</option>
            <option value="Bakery">🍞 Bakery</option>
            <option value="Other">📦 Other</option>
    </select>
  </div>
));

IngredientCatSelect.displayName = "IngredientCatSelect"

export default IngredientCatSelect
