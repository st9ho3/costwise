"use client"
import { Euro, Percent } from 'lucide-react';
import React, { memo, useCallback } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues, UseFormWatch } from 'react-hook-form';
import { FormFields } from '../recipeForm';
import { usePricing } from '@/app/hooks/usePricing';
import {PricingRadioOption, CalculateButton, ErrorDisplay} from '@/app/constants/components'
import { RecipeIngredients } from '@/shemas/recipe';

// Define props for the component
type PricingCostsProps = {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  children: React.ReactNode;
  setValue: UseFormSetValue<FormFields>;
  getValues: UseFormGetValues<FormFields>;
  ingredients: RecipeIngredients[];
  watch: UseFormWatch<FormFields>
};

const Pricing = memo(({
  children,
  register,
  errors,
  setValue,
  getValues,
  ingredients
}: PricingCostsProps) => {
  const {
    selectedPricingMethod,
    handlePricingMethodChange,
    handleInputFocus,
    isFieldDisabled,
    getFieldClasses,
    calculate
  } = usePricing(setValue, getValues, ingredients);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  },[]);
  
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        <div className="flex flex-col items-center gap-2 w-full flex-grow">
          Choose one:
          
          <PricingRadioOption
            label="My price is:"
            value="price"
            fieldName="sellingPrice"
            placeholder="Selling price"
            icon={Euro}
            isSelected={selectedPricingMethod === "price"}
            isDisabled={isFieldDisabled("price")}
            fieldClasses={getFieldClasses("price")}
            register={register}
            onRadioClick={handlePricingMethodChange}
            onInputFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
          />

          <PricingRadioOption
            label="My profit margin is:"
            value="profit"
            fieldName="profitMargin"
            placeholder="Profit margin"
            icon={Percent}
            isSelected={selectedPricingMethod === "profit"}
            isDisabled={isFieldDisabled("profit")}
            fieldClasses={getFieldClasses("profit")}
            register={register}
            onRadioClick={handlePricingMethodChange}
            onInputFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center justify-between w-full border border-dashed border-gray-300 rounded-lg flex-grow px-1">
            My additional tax is:
            {children}
            <CalculateButton onCalculate={calculate} />
          </div>
        </div>
      </div>
      
      <ErrorDisplay pricingErrors={errors} errors={[]} error=''/>
    </div>
  );
});

Pricing.displayName = "Pricing"

export default Pricing;