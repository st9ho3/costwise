"use client"

import React from 'react';
import { Ingredient, RecipeIngredients } from '@costwise/shared/recipe';
import Incremental from '../../../shared/incremental';
import { useRecipeIngredientsForm } from '@/app/hooks/useRecipeIngredientsForm';
import { 
    IngredientSelector,
    UnitSelector,
    ErrorDisplay
 } from '@/app/constants/components';


interface FormProps {
  recipeId: string;
  ingredients: Ingredient[];
  onAddIngredient: (ing: RecipeIngredients) => void;
  tempIngredients: RecipeIngredients[];
}

const RecipeIngredientForm = ({
  recipeId,
  ingredients,
  onAddIngredient,
  tempIngredients,
}: FormProps) => {
  const {
    quantity,
    selectedIngredient,
    unit,
    errors,
    availableUnits,
    addIngredient,
    handleIngredientChange,
    handleUnitChange,
    handleQuantityChange,
    handleKeyDown,
  } = useRecipeIngredientsForm({
    recipeId,
    ingredients,
    tempIngredients,
    onAddIngredient,
  });

  return (
    <div className="flex flex-col">
      <div className="flex sm:flex-row gap-3 w-full">
        {/* Input Group */}
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 p-1 w-full flex-grow">
          <IngredientSelector
            ingredients={ingredients}
            selectedIngredient={selectedIngredient}
            onIngredientChange={handleIngredientChange}
            onKeyDown={handleKeyDown}
          />
          
          <UnitSelector
            unit={unit}
            availableUnits={availableUnits}
            selectedIngredient={selectedIngredient}
            onUnitChange={handleUnitChange}
            onKeyDown={handleKeyDown}
          />

          {/* Quantity */}
          <div className="border-l border-dashed border-gray-300 pl-2">
            <Incremental
              onRecipeIngredientChange={handleQuantityChange}
              count={quantity}
              onKeyDown={handleKeyDown}
              setErrors={() => {}}
            />
          </div>
        </div>

        <button
         type='button' 
         className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition-colors w-full sm:w-auto flex-shrink-0 bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50' 
         onClick={addIngredient}
         >
          Add
        </button>
      </div>

      <ErrorDisplay errors={errors} error='' pricingErrors={{}}/>
    </div>
  );
};

export default RecipeIngredientForm;