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
import { Ingredient, IngredientSchema, IngredientToDisplay } from '@costwise/shared/recipe';
import { createEditIngredientPrototype, createIngredientPrototype } from '@/app/utils/transformers';
import { sendIngredient, updateIngredient } from '../services/services';
import useHelpers from './useHelpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useUIStore } from '../stores/uiStore';
import { SelectableItem } from '../components/shared/SelectStore';

export type IngredientFormFields = z.infer<typeof IngredientSchema>

type UseIngredientFormProps = {
  mode: 'create' | 'edit';
  ingredient: Ingredient | IngredientToDisplay | undefined;
  userId: string;
  supplierOptions: SelectableItem[];
};


export const useIngredientForm = ({ mode, ingredient, userId, supplierOptions }: UseIngredientFormProps) => {

  const {register, handleSubmit, reset, formState: {isSubmitting, errors}, watch, setValue} = useForm({
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
      category: ingredient?.category,
      suppliers: []
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
      category: 'ef45178d-e566-4637-b7f9-abcf6d575466',
      suppliers: [{suppliersId: '', quantity: 1, unit: '', price: 0, isActive: false }]
    }
  })

  
  const router = useRouter();
  const { raiseNotification } = useHelpers({path: null});
  const { isModalOpen, modalType, closeModal } = useUIStore();
  const [error, setErrors] = useState<string[]>([])
  // Supplier selection state - temp for modal selections, confirmed for persisted selections
  const INITIAL_SUPPLIERS =
    mode === 'edit' && ingredient && 'suppliers' in ingredient && Array.isArray((ingredient as { suppliers?: { suppliersId: string }[] }).suppliers)
      ? (ingredient as { suppliers: { suppliersId: string }[] }).suppliers.map((supplier) => supplier.suppliersId)
      : [];
  const [tempSuppliers, setTempSuppliers] = useState(INITIAL_SUPPLIERS);
  const [confirmedSuppliers, setConfirmedSuppliers] = useState<string[]>([]);

  const price = watch('unitPrice')
  const name = watch('name')
  const unit = watch('unit')
  const quantity = watch('quantity')
console.log(tempSuppliers)
  /**
   * Toggle supplier selection in temp state
   */
  const selectSupplier = (id: string) => {
    console.log('selectSupplier',id)
    if (!tempSuppliers.includes(id)) {
      setTempSuppliers([...tempSuppliers, id]);
    } else {
      setTempSuppliers(tempSuppliers.filter((supplierId) => supplierId !== id));
    }
  };

  /**
   * Confirms the current temp suppliers selection.
   * Called when user clicks "Confirm" in the modal.
   */
  const confirmSuppliers = () => {
    setConfirmedSuppliers([...tempSuppliers]);
    const suppliersData = tempSuppliers.map((supplierId) => ({
      suppliersId: supplierId,
      unit: unit || 'g',
      quantity: Number(quantity) || 1,
      price: Number(price) || 0,
      isActive: true,
    }));
    setValue('suppliers', suppliersData, { shouldValidate: true });
    closeModal();
  };

  /**
   * Handles modal close without confirming.
   * Restores temp suppliers from confirmed state.
   */
  const handleCloseModal = () => {
    setTempSuppliers([...confirmedSuppliers]);
    closeModal();
  };

  /**
   * Gets the supplier items that are currently confirmed for display
   */
  const getSelectedSupplierItems = () => {
    return supplierOptions.filter((sup) => confirmedSuppliers.includes(sup.id));
  };


/* const ingredientsToSend = ingredients.map((ing) => createIngredientPrototype(ing, userId))
   ingredientsToSend.forEach(async(ing) => {
    if (!ing) {
      return
    }
    await sendIngredient(ing)
   }) */
  
console.log(errors)
  const onSubmit = async (data: IngredientFormFields) => {

    if (mode === 'create') {
      // Create mode logic
      
      const ingredientPrototype = createIngredientPrototype(data, confirmedSuppliers, userId)
      console.log(ingredientPrototype)
      const validatedIngredient = IngredientSchema.safeParse(ingredientPrototype);
      console.log(validatedIngredient)
      if (!validatedIngredient.success) {
        setErrors([]);
        const zodErrors = validatedIngredient.error.errors;
        zodErrors.forEach(error => setErrors(prev => [...prev, error.message]));
      } else {
        const response = await sendIngredient(validatedIngredient.data);
        
        raiseNotification(response); // Pass the entire response
        reset();
        setTempSuppliers([]);
        setConfirmedSuppliers([]);
        if (router) {
          router.replace('/ingredients');
          router.refresh();
        }
      }
    } else if (mode === 'edit' && ingredient) {

      const updatedIngredient = createEditIngredientPrototype(data, ingredient, confirmedSuppliers, userId)

      const validatedIngredient = IngredientSchema.safeParse(updatedIngredient);

      if (!validatedIngredient.success) {
        setErrors([]);
        const zodErrors = validatedIngredient.error.errors;
        zodErrors.forEach(error => setErrors(prev => [...prev, error.message]));
      } else {
        const response = await updateIngredient(validatedIngredient.data);
        raiseNotification(response); // Pass the entire response
        reset();
        setTempSuppliers([]);
        setConfirmedSuppliers([]);
        if (router) {
          router.replace('/ingredients');
          router.refresh();
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
    error,
    setErrors,
    register,
    onSubmit,
    handleSubmit,
    handleKeyDown,
    setValue,
    isSubmitting,
    // Supplier selection exports
    tempSuppliers,
    confirmedSuppliers,
    selectSupplier,
    confirmSuppliers,
    handleCloseModal,
    getSelectedSupplierItems,
    isModalOpen,
    modalType,
  };
};