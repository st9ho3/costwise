import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { LucideIcon } from 'lucide-react';
import { UseFormRegister, Path } from 'react-hook-form';

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
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
  getValue: (option: T) => string;
  getLabel: (option: T) => string;
}

const FormSelect = <T,>({ 
  fieldName, 
  options, 
  placeholder, 
  icon: Icon, 
  register, 
  onKeyDown,
  getValue,
  getLabel 
}: FormSelectProps<T>) => (
  <div className={`
    flex items-center w-full px-4 h-10
    bg-card border border-primary rounded-md
    brutalist-focus-within relative
  `}>
    
    <Icon 
      size={20} 
      className="text-muted-foreground mr-3 shrink-0" 
      strokeWidth={2}
    />

    <select
      id={fieldName}
      {...register(fieldName)}
      onKeyDown={onKeyDown}
      className="
        w-full h-full bg-transparent border-none outline-none
        text-sm font-medium text-foreground cursor-pointer
        placeholder:text-muted-foreground appearance-none
      "
      defaultValue=""
    >
      <option value="" disabled className="text-muted-foreground">{placeholder}</option>
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
