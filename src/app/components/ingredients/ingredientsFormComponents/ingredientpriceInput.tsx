// src/components/ingredients/constants/IngredientPriceInput.tsx

"use client"
import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { Euro } from 'lucide-react';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type IngredientPriceInputProps = {
  onChange: UseFormSetValue<IngredientFormFields>
  price: number
};

const IngredientPriceInput = ({ onChange, price }: IngredientPriceInputProps) => {
  
  const [isEditing, setIsEditing] = useState(false)

  const handleFocus = () => setIsEditing(true)
  const handleBlur = () => setIsEditing(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // If empty string, default to 0, otherwise parse Number
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    onChange("unitPrice", value);
  }

  // UX Logic: Don't show "0" when the user clicks to edit, shows placeholder instead
  const displayValue = isEditing && price === 0 ? '' : price;

  return (
    // CONTAINER:
    // Matches the height (h-12) and rounded style of Name/Unit inputs.
    // Full width allows it to fill the grid cell perfectly.
    <div className={`
      flex items-center w-full px-4 h-10
      bg-card border border-input rounded-md
      transition-colors
      focus-within:ring-2 focus-within:ring-ring
    `}>
      {/* ICON: Visual Context */}
      <Euro 
        size={20} 
        className="text-muted-foreground mr-3 shrink-0" 
        strokeWidth={2} 
      />

      {/* INPUT: 
          1. Removes default spin buttons in some browsers (optional but cleaner)
          2. Fills container width
      */}
      <input
        type="number"
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className="
          w-full h-full bg-transparent border-none outline-none
          text-sm font-medium text-foreground placeholder:text-muted-foreground
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        "
        placeholder="0.00"
        step="0.01" // Allows decimals
        min="0"
      />
    </div>
  )
};

export default IngredientPriceInput;