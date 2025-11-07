/**
 * - Manages form state and submission logic for creating or editing recipe ingredients.
 * - Initializes form fields based on mode (`create` or `edit`) and preloaded ingredient data.
 * - Validates input using Zod schema and displays validation errors.
 * - Normalizes price based on unit and quantity before submission.
 * - Integrates with backend services to create or update ingredients.
 * - Shows user notifications via `useHelpers` and redirects to `/ingredients` on success.
 * - Supports keyboard-driven submission (Enter key) and dynamic price input handling.
 */
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Ingredient, IngredientSchema } from '@/shemas/recipe';
import { createEditIngredientPrototype, createIngredientPrototype } from '@/app/services/helpers';
import { sendIngredient, updateIngredient } from '../services/services';
import useHelpers from './useHelpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

export type IngredientFormFields = z.infer<typeof IngredientSchema>

type UseIngredientFormProps = {
  mode: 'create' | 'edit';
  ingredient: Ingredient | undefined;
  userId: string;
};


export const useIngredientForm = ({ mode, ingredient, userId }: UseIngredientFormProps) => {

  const {register, handleSubmit, reset, formState: {isSubmitting}, watch, setValue} = useForm({
    resolver: zodResolver(IngredientSchema),
    defaultValues: mode === 'edit'
    ? {
      id: ingredient?.id,
      name: ingredient?.name,
      unit: ingredient?.unit,
      unitPrice: ingredient?.unitPrice,
      quantity: 1, // Here I insert manually the 1 value because the quantity on the db is the initial quantity that used to measure. the db ingredient has the unitPrice based on 1 but as quantity has the quantity we used to measure it.
      usage: ingredient?.usage,
      userId: ingredient?.userId,
      icon: ingredient?.icon,
      category: ingredient?.category
      }
    : {
      id: uuidv4(),
      name: '',
      unit: '',
      unitPrice: 0,
      quantity: 0,
      usage: 'low',
      userId: userId,
      icon: '',
      category: 'Other'
    }
  })
  
  const router = useRouter();
  const { raiseNotification } = useHelpers();
  const [errors, setErrors] = useState<string[]>([])

  const price = watch('unitPrice')
  const name = watch('name')
  const unit = watch('unit')
  const quantity = watch('quantity')
  
  


/* const ingredientsToSend = ingredients.map((ing) => createIngredientPrototype(ing, userId))
   ingredientsToSend.forEach(async(ing) => {
    if (!ing) {
      return
    }
    await sendIngredient(ing)
   }) */

  const onSubmit = async (data: IngredientFormFields) => {

    if (mode === 'create') {
      // Create mode logic
      const ingredientPrototype = createIngredientPrototype(data, userId)
      const validatedIngredient = IngredientSchema.safeParse(ingredientPrototype);
      if (!validatedIngredient.success) {
        setErrors([]);
        const zodErrors = validatedIngredient.error.errors;
        zodErrors.forEach(error => setErrors(prev => [...prev, error.message]));
      } else {
        const response = await sendIngredient(validatedIngredient.data);
        
        raiseNotification(response); // Pass the entire response
        reset();
        if (router) {
          router.replace('/ingredients');
        }
      }
    } else if (mode === 'edit' && ingredient) {

      const updatedIngredient = createEditIngredientPrototype(data, ingredient, userId)

      const validatedIngredient = IngredientSchema.safeParse(updatedIngredient);

      if (!validatedIngredient.success) {
        setErrors([]);
        const zodErrors = validatedIngredient.error.errors;
        zodErrors.forEach(error => setErrors(prev => [...prev, error.message]));
      } else {
        const response = await updateIngredient(validatedIngredient.data);
        raiseNotification(response); // Pass the entire response
        reset();
        if (router) {
          router.replace('/ingredients');
        }
      }
    }
  }

  const handleKeyDown = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLSelectElement>,
  ) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit);
    }
  };


  // Return all the state and functions the component will need
  return {
    price,
    quantity,
    unit,
    name,
    errors,
    setErrors,
    register,
    onSubmit,
    handleSubmit,
    handleKeyDown,
    setValue,
    isSubmitting
  
  };
};