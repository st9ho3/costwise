/**
 * This custom React hook manages the state and logic for an ingredient form,
 * specifically for adding ingredients to a recipe.
 * The `useRecipeIngredientsForm` hook handles user input for selecting an ingredient,
 * specifying its quantity and unit, and validating the data before adding it to a temporary
 * list. It also dynamically determines compatible units based on the selected ingredient's
 * base unit, enhancing the user experience. The hook interacts with a parent component
 * through the `onAddIngredient` callback to update the main recipe form's state.
 */
import { useState, useEffect } from 'react';
import { Ingredient, RecipeIngredients, RecipeIngredientsSchema, Unit } from '@/shemas/recipe';

type IngredientErrors = string[];

interface UseRecipeIngredientsFormProps {
  recipeId: string;
  ingredients: Ingredient[];
  tempIngredients: RecipeIngredients[];
  onAddIngredient: (ing: RecipeIngredients) => void;
}

export const useRecipeIngredientsForm = ({
  recipeId,
  ingredients,
  tempIngredients,
  onAddIngredient,
}: UseRecipeIngredientsFormProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('');
  const [errors, setErrors] = useState<IngredientErrors>([]);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);

  // Update available units when the selected ingredient changes
  useEffect(() => {
    const ingredient: Ingredient | undefined = ingredients.find(
      (ing) => ing.name === selectedIngredient
    );

    if (ingredient) {
      const baseUnit = ingredient.unit;
      let compatibleUnits: Unit[] = [];

      if (baseUnit === 'g' || baseUnit === 'kg') {
        compatibleUnits = ['g', 'kg'];
      } else if (baseUnit === 'ml' || baseUnit === 'L') {
        compatibleUnits = ['ml', 'L'];
      } else if (baseUnit === 'piece') {
        compatibleUnits = ['piece'];
      }

      setAvailableUnits(compatibleUnits);
      
      if (baseUnit === 'g' || baseUnit === 'kg' || baseUnit === 'L' || baseUnit === 'ml' || baseUnit === 'piece') {
        setUnit(baseUnit);
      }
    } else {

      setAvailableUnits([]);
      setUnit('');
    }
  }, [selectedIngredient, ingredients]);

  const resetForm = () => {
    setErrors([]);
    setSelectedIngredient('');
    setUnit('');
    setQuantity(0);
  };

  const addIngredient = () => {
    const ingredient = ingredients.find((ing) => ing.name === selectedIngredient);
    const foundIngredient = tempIngredients.find((ing) => ing.name === selectedIngredient);

    if (!ingredient) {
      setErrors(['Could not find the selected ingredient.']);
      return;
    }

    const recipeIngredient: RecipeIngredients = {
      name: selectedIngredient,
      unit: unit,
      unitPrice: ingredient.unitPrice,
      quantity: quantity,
      recipeId: recipeId,
      ingredientId: ingredient.id,
      iconBgColor: 'bg-yellow-100',
    };

    const validationResult = RecipeIngredientsSchema.safeParse(recipeIngredient);

    if (!validationResult.success) {
      const zodErrors = validationResult.error.errors.map((err) => err.message);
      setErrors(zodErrors);
    } else {
      if (!foundIngredient) {
        onAddIngredient(validationResult.data);
        resetForm();
      } else {
        setErrors(["Can't add duplicate ingredients"]);
      }
    }
  };

  const handleIngredientChange = (value: string) => {
    setSelectedIngredient(value);
    setErrors([]);
  };

  const handleUnitChange = (value: Unit) => {
    setUnit(value);
    setErrors([]);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    setErrors([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return {
    // State
    quantity,
    selectedIngredient,
    unit,
    errors,
    availableUnits,
    
    // Actions
    addIngredient,
    resetForm,
    handleIngredientChange,
    handleUnitChange,
    handleQuantityChange,
    handleKeyDown,
  };
};