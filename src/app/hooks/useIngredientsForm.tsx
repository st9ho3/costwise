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
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Unit, Ingredient, IngredientSchema } from '@/shemas/recipe';
import { normalizePrice } from '@/app/services/helpers';
import { sendIngredient, updateIngredient } from '../services/services';
import useHelpers from './useHelpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

export type FormFields = z.infer<typeof IngredientSchema>

type UseIngredientFormProps = {
  mode: 'create' | 'edit';
  ingredient: Ingredient | undefined;
  userId: string;
};


export const useIngredientForm = ({ mode, ingredient, userId }: UseIngredientFormProps) => {
  /* const [quantity, setQuantity] = useState<number>(
    mode === 'edit' && ingredient ? ingredient.quantity : 0,
  ); */

  const {register, handleSubmit, formState, watch} = useForm({
    resolver: zodResolver(IngredientSchema),
    defaultValues: mode === 'edit' 
    ? ingredient 
    : {
      id: uuidv4(),
      name: '',
      unit: '',
      unitPrice: 0,
      quantity: 1,
      usage: 'low',
      userId: userId,
      icon: ''
    }
  })
  
  const {isDirty} = formState
  const router = useRouter();
  const { raiseNotification } = useHelpers();

 

  // Logic to show an empty input when editing and the price is "0"
  const displayedPrice = isDirty && price === '0' ? '' : price;
  
  const addIngredient = useCallback(async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLSelectElement>,
  ) => {
    e.preventDefault();
    if (mode === 'create') {
      // Create mode logic
      const id = uuidv4();
      const normalizedUnitPrice = normalizePrice(price, unit, quantity);
      const ingredientPrototype: Ingredient = {
        id: id,
        icon: '🥑',
        name: name,
        unit: unit === 'g' || unit === 'kg' ? 'g' : unit === 'L' || unit === 'ml' ? 'ml' : 'piece',
        unitPrice: normalizedUnitPrice,
        quantity: quantity,
        usage: '0',
        userId: userId,
      };
      const validatedIngredient = IngredientSchema.safeParse(ingredientPrototype);
      console.log(validatedIngredient);
      if (!validatedIngredient.success) {
        setErrors([]);
        const zodErrors = validatedIngredient.error.errors;
        zodErrors.forEach(error => setErrors(prev => [...prev, error.message]));
      } else {
        const response = await sendIngredient(validatedIngredient.data);
        raiseNotification(response); // Pass the entire response
        resetForm();
        if (router) {
          router.replace('/ingredients');
        }
      }
    } else if (mode === 'edit' && ingredient) {
      const normalizedUnitPrice = normalizePrice(price, unit, quantity);
      // Edit mode logic
      const updatedIngredient: Ingredient = {
        id: ingredient.id,
        icon: ingredient.icon || '🥑',
        name: name,
        unit: unit === 'g' || unit === 'kg' ? 'g' : unit === 'L' || unit === 'ml' ? 'ml' : 'piece',
        unitPrice: normalizedUnitPrice,
        quantity: quantity,
        usage: ingredient.usage || '0',
        userId: userId,
      };
      const validatedIngredient = IngredientSchema.safeParse(updatedIngredient);
      console.log('Validated ingredient on the form: ', validatedIngredient);
      if (!validatedIngredient.success) {
        setErrors([]);
        const zodErrors = validatedIngredient.error.errors;
        zodErrors.forEach(error => setErrors(prev => [...prev, error.message]));
      } else {
        const response = await updateIngredient(validatedIngredient.data);
        raiseNotification(response); // Pass the entire response
        resetForm();
        if (router) {
          router.replace('/ingredients');
        }
      }
    }
  }, [ingredient, mode, name, price, quantity, raiseNotification,resetForm, router, unit, userId]);

  const handleKeyDown = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLSelectElement>,
  ) => {
    if (e.key === 'Enter') {
      addIngredient(e);
    }
  };
  // Return all the state and functions the component will need
  return {
    quantity,
    name,
    unit,
    price,
    displayedPrice,
    errors,
    setQuantity,
    setErrors,
    handleName,
    handlePrice,
    handleFocus,
    handleBlur,
    handleUnit,
    addIngredient,
    handleKeyDown,
  };
};