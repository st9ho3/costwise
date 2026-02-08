// src/components/ingredients/ingredientsFormComponents/FormSelect.tsx

import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { UseFormRegister, Path } from 'react-hook-form';
import { SelectableItem } from '../../shared/SelectStore';

export type SelectOption = {
  name: string;
  value: string;
};

interface FormSelectProps <T extends Record<string, any>> {
  fieldName: Path<IngredientFormFields>;
  options: T[];
  placeholder: string;
  icon: LucideIcon;
  register: UseFormRegister<IngredientFormFields>;
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
  value: string[] | number[]
};

const FormSelect = <T extends Record<string, any>>({ 
  fieldName, 
  options, 
  placeholder, 
  icon: Icon, 
  register, 
  onKeyDown ,
  value
}: FormSelectProps<T>) => (
  <div className={`
    flex items-center w-full px-4 h-12
    bg-white border border-gray-200 rounded-xl
    transition-all duration-200 ease-in-out
    hover:border-gray-300
    focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 
    relative
  `}>
    
    <Icon 
      size={20} 
      className="text-gray-400 mr-3 shrink-0" 
      strokeWidth={2}
    />

    <select
      id={fieldName}
      {...register(fieldName)}
      onKeyDown={onKeyDown}
      className="
        w-full h-full bg-transparent border-none outline-none
        text-sm font-medium text-gray-900 cursor-pointer
        placeholder:text-gray-400 appearance-none
      "
      defaultValue=""
    >
      <option value="" disabled className="text-gray-400">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);



export default FormSelect;
