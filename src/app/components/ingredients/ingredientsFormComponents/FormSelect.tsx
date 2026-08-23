import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { LucideIcon } from 'lucide-react';
import { UseFormRegister, Path } from 'react-hook-form';

import { Select } from '@/app/components/ui/select';

export type SelectOption = {
  name: string;
  value: string;
};

interface FormSelectProps <T> {
  fieldName: Path<IngredientFormFields>;
  options: T[];
  placeholder: string;
  icon: LucideIcon;
  register: UseFormRegister<IngredientFormFields>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  getValue: (option: T) => string;
  getLabel: (option: T) => string;
}

const FormSelect = <T,>({ 
  fieldName, 
  options, 
  placeholder, 
  register, 
  getValue, 
  getLabel 
}: FormSelectProps<T>) => (
  <div className="w-full">
    <Select
      placeholder={placeholder}
      options={options.map((option) => ({
        value: getValue(option),
        label: getLabel(option),
      }))}
      {...register(fieldName)}
    />
  </div>
);

export default FormSelect;
