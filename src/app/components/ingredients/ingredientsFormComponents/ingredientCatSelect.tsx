// src/components/ingredients/ingredientsFormComponents/ingredientCatSelect.tsx

import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Tag } from 'lucide-react'; // Added an icon for consistency
import { memo } from 'react';
import { UseFormRegister } from 'react-hook-form';

type IngredientCatSelectProps = {
  register: UseFormRegister<IngredientFormFields>
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
};

const IngredientCatSelect = memo(({ register, onKeyDown }: IngredientCatSelectProps) => (
  // CONTAINER: Matches IngredientNameInput style exactly
  <div className={`
    flex items-center w-full px-4 h-12
    bg-white border border-gray-200 rounded-xl
    transition-all duration-200 ease-in-out
    hover:border-gray-300
    focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 relative
  `}>
    
    {/* ICON: Adds context */}
    <Tag 
        size={20} 
        className="text-gray-400 mr-3 shrink-0" 
        strokeWidth={2}
    />

    {/* SELECT:
        1. appearance-none: Removes default browser arrow (we can add a custom one if needed, but standard is okay for now)
        2. bg-transparent: Blends with container
        3. w-full: Fills space
    */}
    <select
      id="category"
      {...register('category')}
      onKeyDown={onKeyDown}
      className="
        w-full h-full bg-transparent border-none outline-none
        text-sm font-medium text-gray-900 cursor-pointer
        placeholder:text-gray-400 appearance-none
      "
      defaultValue=""
    >
        {/* Placeholder Option (Grayed out) */}
        <option value="" disabled className="text-gray-400">Select a Category</option>
        
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

export default IngredientCatSelect;