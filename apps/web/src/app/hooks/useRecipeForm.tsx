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
import { FormFields, RecipeIngredients, RecipeSchema } from '@costwise/shared/recipe';
import { v4 as uuidv4 } from "uuid";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateRecipeData, getTotalPrice } from '@costwise/shared/pricing';
import { getArrayChanges } from '@costwise/shared/transformers';
import { sendRecipe, sendRecipeToUpdate } from '@/app/services/services';
import { useRouter } from 'next/navigation';
import { useFileUpload } from './useFileUpload';
import useHelpers from './useHelpers';
import { defaultValues } from '../constants/recipeFormDefaultValues';
import { RecipeFormProps } from '../components/recipes/recipeForm/recipeForm';
import { useFileStore } from '../stores/fileStore';
import { useNotificationStore } from '../stores/notificationStore';


const useRecipeForm = ({mode, recipe, recipeIngredients, userId}: RecipeFormProps) => {
  const [newId, setNewId] = useState<string>(() => uuidv4());
  const [tempIngredients, setTempIngredients] = useState<RecipeIngredients[]>(mode === 'edit' && recipeIngredients ? recipeIngredients : []);
  const resetFile = useFileStore((state) => state.reset)
  const file = useFileStore((state) => state.file)
  const notification = useNotificationStore((state) => state.notification)
  const router = useRouter();
  const { handleFileUpload, error } = useFileUpload();
  const { raiseNotification } = useHelpers({path: null});
  
  const { register, handleSubmit, setValue, reset, formState, getValues, watch } = useForm<FormFields>({
    defaultValues: mode === "create" ? {
      ...defaultValues,
      id: newId
    } : recipe,
    resolver: zodResolver(RecipeSchema)
  });

  const { errors, isSubmitting } = formState;

  const handleAddIngredient = useCallback((ing: RecipeIngredients) => {
    setTempIngredients((prev) => {
      const newIngredients = [...prev, ing];
      const totalPrice = getTotalPrice(newIngredients);
      setValue("totalCost", totalPrice);
      return newIngredients;
    });
  }, [setValue]);

  const handleRemoveIngredient = useCallback((id: string) => {
    setTempIngredients((prev) => {
      const newIngredients = prev.filter((ing) => ing.ingredientId !== id);
      const totalPrice = getTotalPrice(newIngredients);
      setValue("totalCost", totalPrice);
      return newIngredients;
    });
  }, [setValue]);

  const resetForm = useCallback(() => {
    if (mode === 'create') {
      const nextRecipeId = uuidv4();
      setNewId(nextRecipeId);
      setValue("id", nextRecipeId);
    }
    setTimeout(() => {
      resetFile()
      reset();
      setTempIngredients([]);
    }, 1000);
    router.replace("/recipes");
    router.refresh();
  },[mode, setValue, reset, router, resetFile]); 

  const onSubmit = useCallback( async (data: FormFields) => {

    const { newCost, newMargin, newPrice, foodCost, newTax } = calculateRecipeData(data, recipe, tempIngredients);
    
    const {added, removed} = getArrayChanges(recipeIngredients, tempIngredients)

    let submissionSuccessful = false;

    try {
      let url: string | undefined;

      if (file) {
        url = await handleFileUpload(file);
      }

      if (mode === 'edit') {
        const recipeToUpdate = { 
          ...data, 
          userId: userId,
          totalCost: newCost,
          tax: newTax,
          imgPath: url || data.imgPath,
          profitMargin: newMargin !== undefined ? newMargin : (data.profitMargin ? Number(data.profitMargin) : 0),
          sellingPrice: newPrice !== undefined ? newPrice : (data.sellingPrice ? Number(data.sellingPrice) : 0),
          foodCost: foodCost
        };
          
        const response = await sendRecipeToUpdate(recipeToUpdate, added, removed);
        raiseNotification(response);
        submissionSuccessful = response.success;
      
      } else {
        
        const updatedData = {
          ...data,
          id: newId,
          userId: userId,
          totalCost: newCost,
          tax: newTax,
          imgPath: url || data.imgPath,
          profitMargin: newMargin !== undefined ? newMargin : (data.profitMargin ? Number(data.profitMargin) : 0),
          sellingPrice: newPrice !== undefined ? newPrice : (data.sellingPrice ? Number(data.sellingPrice) : 0),
          foodCost: foodCost
        };

        const response = await sendRecipe(updatedData, tempIngredients, []);
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
  }, [mode, tempIngredients, recipeIngredients, handleFileUpload, raiseNotification,file, userId, recipe, newId, resetForm]);

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
    file,
    notification
  }
}

export default useRecipeForm;