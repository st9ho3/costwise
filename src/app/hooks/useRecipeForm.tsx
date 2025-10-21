/**
 * This custom React hook manages the state and logic for a recipe form.
 * It handles both creating a new recipe and editing an existing one, including form validation
 * with Zod, managing temporary ingredients, calculating pricing details, and handling
 * form submission, including file uploads and API calls.
 * The `useRecipeForm` hook orchestrates the entire lifecycle of a recipe form. It leverages
 * `react-hook-form` for efficient form management and validation. The hook dynamically
 * handles form initialization based on the `mode` prop (create or edit). It also
 * provides functions for adding and removing ingredients, recalculating total costs,
 * and performing complex pricing calculations (profit margin, selling price) before
 * submitting data to the appropriate backend service. It uses a separate `useFileUpload`
 * hook and a context (`useHomeContext`) to manage file upload state and notifications.
 */
"use client"
import { useCallback, useState } from 'react';
import { RecipeIngredients, RecipeSchema } from '@/shemas/recipe';
import { v4 as uuidv4 } from "uuid";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateRecipeData, getTotalPrice } from '@/app/services/helpers';
import { sendRecipe, sendRecipeToUpdate } from '@/app/services/services';
import { useHomeContext } from '../context/homeContext/homeContext';
import { useRouter } from 'next/navigation';
import { useFileUpload } from './useFileUpload';
import useHelpers from './useHelpers';
import { defaultValues } from '../constants/recipeFormDefaultValues';
import { RecipeFormProps } from '../components/recipes/recipeForm/recipeForm';

export type FormFields = z.infer<typeof RecipeSchema>;

const useRecipeForm = ({mode, recipe, recipeIngredients, userId}: RecipeFormProps) => {
  const [newId, setNewId] = useState<string>(() => uuidv4());
  const [tempIngredients, setTempIngredients] = useState<RecipeIngredients[]>(mode === 'edit' && recipeIngredients ? recipeIngredients : []);

  const { state, dispatch } = useHomeContext();
  const router = useRouter();
  const { handleFileUpload, error } = useFileUpload();
  const { raiseNotification } = useHelpers();
  
  const { register, handleSubmit, setValue, reset, formState, getValues, watch } = useForm<FormFields>({
    defaultValues: mode === "create" ? {
      ...defaultValues,
      id: newId
    } : recipe,
    resolver: zodResolver(RecipeSchema)
  });

  const { errors, isSubmitting } = formState;

  const handleAddIngredient = useCallback((ing: RecipeIngredients) => {
    const newIngredients = [...tempIngredients, ing];
    const totalPrice = getTotalPrice(newIngredients);
    setTempIngredients(newIngredients);
    setValue("totalCost", totalPrice);
  },[tempIngredients, setValue]);

  const handleRemoveIngredient = useCallback((id: string) => {
    const newIngredients = tempIngredients.filter((ing) => ing.ingredientId !== id);
    setTempIngredients(newIngredients);
    setValue("totalCost", getTotalPrice(newIngredients));
  },[setValue, tempIngredients]);

  const resetForm = useCallback(() => {
    if (mode === 'create') {
      const nextRecipeId = uuidv4();
      setNewId(nextRecipeId);
      setValue("id", nextRecipeId);
    }
    setTimeout(() => {
      dispatch({ type: "RESET_FILE" });
      reset();
      setTempIngredients([]);
    }, 1000);
    router.replace("/recipes");
  },[mode, setValue, reset, router, dispatch]); 

  const onSubmit = useCallback( async (data: FormFields) => {

    const {newCost, newMargin, newPrice, foodCost} = calculateRecipeData(data, recipe, tempIngredients);
    
    const addedIngredients: RecipeIngredients[] = tempIngredients.filter(
      (tempIngredient) => !recipeIngredients.includes(tempIngredient)
    );
    const removedIngredients: RecipeIngredients[] = recipeIngredients.filter(
      (recipeIngredient) => !tempIngredients.includes(recipeIngredient)
    );

    let submissionSuccessful = false;

    try {
      let url: string | undefined;

      if (state.file) {
        url = await handleFileUpload(state.file);
      }

      if (mode === 'edit') {
        const recipeToUpdate = { 
          ...data, 
          userId: userId,
          totalCost: newCost,
          imgPath: url || data.imgPath,
          profitMargin: newMargin,
          sellingPrice: newPrice,
          foodCost: foodCost
        };
          
        const response = await sendRecipeToUpdate(recipeToUpdate, addedIngredients, removedIngredients);
        raiseNotification(response);
        submissionSuccessful = response.success;
      
      } else {
        
        const updatedData = {
          ...data,
          id: newId,
          userId: userId,
          imgPath: url || data.imgPath,
          profitMargin: data.profitMargin ? data.profitMargin : 0,
          foodCost: foodCost
        };

        const response = await sendRecipe(updatedData, tempIngredients);
        raiseNotification(response);
        submissionSuccessful = response.success;
      }
    } catch (error) {
      raiseNotification({
        success: false,
        message: 'An unexpected error occurred.',
        error: { message: `${error}` },
      });
      submissionSuccessful = false;
    } finally {
      
      if (submissionSuccessful) {
        resetForm();
      }
    }
  }, [mode, tempIngredients, recipeIngredients, handleFileUpload, raiseNotification, state.file, userId, recipe, newId, resetForm]);

  return {
    newId,
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
    getValues,
    watch, 
    errors,
    isSubmitting,
    handleAddIngredient,
    handleRemoveIngredient,
    onSubmit,
    error,
    tempIngredients,
    state
  }
}

export default useRecipeForm;