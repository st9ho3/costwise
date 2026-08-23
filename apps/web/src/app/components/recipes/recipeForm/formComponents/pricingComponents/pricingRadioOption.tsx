import React, { memo, useCallback } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';
import { FormFields } from '../../recipeForm';
import { PricingMethod } from '@/app/hooks/usePricing';

type PricingRadioOptionProps = {
  label: string;
  value: PricingMethod;
  fieldName: "sellingPrice" | "profitMargin";
  placeholder: string;
  icon: LucideIcon;
  isSelected: boolean;
  isDisabled: boolean;
  fieldClasses: string;
  register: UseFormRegister<FormFields>;
  onRadioClick: (method: PricingMethod) => void;
  onInputFocus: (fieldName: "sellingPrice" | "profitMargin") => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const PricingRadioOption = memo(({
  label,
  value,
  fieldName,
  placeholder,
  icon: Icon,
  isSelected,
  isDisabled,
  fieldClasses,
  register,
  onRadioClick,
  onInputFocus,
  onKeyDown,
}: PricingRadioOptionProps) => {

  const handleRadioClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    onRadioClick(e.currentTarget.value as PricingMethod);
  },[onRadioClick]);

  return (
    <div className="flex items-center justify-start w-full border border-dashed border-gray-300 rounded-2xl flex-grow p-2">
      <input
        type="radio"
        onClick={handleRadioClick}
        value={value}
        name="selected_pricing"
        checked={isSelected}
        className="mx-2"
        readOnly
      />
      <div className="w-fit mx-2">
        {label}
      </div>
      <Icon className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
      <input
        type="number"
        step="0.01"
        disabled={isDisabled}
        {...register(fieldName, { 
          valueAsNumber: true
         })}
       
        onKeyDown={onKeyDown}
        onFocus={() => onInputFocus(fieldName)}
        className={fieldClasses}
        placeholder={placeholder}
      />
    </div>
  );
});

PricingRadioOption.displayName = "PricingRadioOption"
export default PricingRadioOption;