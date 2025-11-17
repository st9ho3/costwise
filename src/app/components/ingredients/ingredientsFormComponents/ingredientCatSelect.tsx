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
      className="block w-40 p-2 text-md bg-white text-gray-800 focus:outline-none"
      onKeyDown={onKeyDown}
    >
            <option value="">Category</option>
            <option value="5dee106a-5050-443e-8368-03397e02af6d">🥕 Produce</option>
            <option value="a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5">🥩 Meat & Poultry</option>
            <option value="1670a6d4-f212-4770-80c7-0e31c0f4c26b">🐟 Fish & Seafood</option>
            <option value="80662af1-1943-4168-8549-ef721b0e9f54">🧀 Dairy & Alternatives</option>
            <option value="b660f354-a89d-420c-80d1-ba0f16b433ec">🌾 Dry Goods</option>
            <option value="90aae231-631c-4fed-baf0-929be5a26b13">🧂 Spices & Seasonings</option>
            <option value="25f19080-3387-4470-95df-598817d5ccfe">🫙 Oils, Vinegars, & Condiments</option>
            <option value="83602573-0b31-439c-8890-ee084a547c22">❄️ Frozen</option>
            <option value="ad6fbf47-f289-4ffb-b070-a5957330a56b">☕ Coffee & Tea</option>
            <option value="f50e6aea-bb2d-42a1-8778-52cdbfec1540">🧃 Beverages (Other)</option>
            <option value="0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5">🍞 Bakery</option>
            <option value="ef45178d-e566-4637-b7f9-abcf6d575466">📦 Other</option>
    </select>
  </div>
));

IngredientCatSelect.displayName = "IngredientCatSelect"

export default IngredientCatSelect
