/**
 * This custom React hook manages the pricing logic for a recipe form.
 * It provides state and functions for handling user selections of pricing methods (e.g., by
 * selling price or by profit margin), calculating values based on the chosen method, and
 * managing input field states.
 * The `usePricing` hook abstracts the complex logic for calculating and updating recipe
 * pricing, including profit margins and selling prices. It relies on `react-hook-form`
 * to interact with form fields and uses helper functions to perform the core calculations.
 * It also handles UI-related concerns like disabling fields and applying dynamic CSS classes.
 */
import { useCallback, useState } from 'react';
import { UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { FormFields } from '@/app/components/recipes/recipeForm/recipeForm';
import { getTotalPrice, calculateProfitMargin, calculateSellingPrice } from '@costwise/domain/utils/pricing';
import { RecipeIngredients } from '@costwise/shared/recipe';


export type PricingMethod = "price" | "profit" | "";

export const usePricing = (
  setValue: UseFormSetValue<FormFields>,
  getValues: UseFormGetValues<FormFields>,
  ingredients: RecipeIngredients[],
  
) => {
  const [selectedPricingMethod, setSelectedPricingMethod] = useState<PricingMethod>("");

  const handlePricingMethodChange = useCallback((method: PricingMethod) => {
    setSelectedPricingMethod(method);
    setValue("profitMargin", 0);
    setValue("sellingPrice", 0);
  },[setValue]);

  const handleInputFocus = useCallback((fieldName: "sellingPrice" | "profitMargin") => {
    const currentValue = getValues(fieldName);
    if (currentValue === 0) {
      setValue(fieldName, undefined, { shouldValidate: true });
    }
  },[getValues, setValue]);

  const isFieldDisabled = useCallback((fieldType: "price" | "profit"): boolean => {
    if (!selectedPricingMethod) return true;
    return fieldType !== selectedPricingMethod;
  },[selectedPricingMethod]);

  const getFieldClasses = useCallback((fieldType: "price" | "profit"): string => {
    const baseClasses = "px-3 placeholder:text-gray-500 text-md focus:outline-none flex-grow";
    const disabledClasses = "rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200";
    
    return isFieldDisabled(fieldType) ? `${baseClasses} ${disabledClasses}` : baseClasses;
  },[isFieldDisabled]);

  
  const calculate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const tax = getValues('tax');
  const cost = getTotalPrice(ingredients);
  const initialPrice = getValues('sellingPrice');
  const initialProfitMargin = getValues('profitMargin');

  if (selectedPricingMethod === "price" && initialPrice && initialPrice > 0) {
    const profit = calculateProfitMargin(cost, initialPrice, tax);
    setValue('profitMargin', profit ? Number(profit.toFixed(2)) : 0);
  } else if (selectedPricingMethod === "profit" && initialProfitMargin && initialProfitMargin > 0) {
    const price = calculateSellingPrice(cost, initialProfitMargin, tax);
    setValue('sellingPrice', price ? Number(price.toFixed(2)) : 0);
  } else {
    if (initialPrice && initialProfitMargin) {
      const profit = calculateProfitMargin(cost, initialPrice, tax);
      setValue('profitMargin', profit ? Number(profit.toFixed(2)) : 0);
    }
  }
},[selectedPricingMethod, getValues, setValue, ingredients]);

  return {
    selectedPricingMethod,
    handlePricingMethodChange,
    handleInputFocus,
    isFieldDisabled,
    getFieldClasses,
    calculate
  };
};