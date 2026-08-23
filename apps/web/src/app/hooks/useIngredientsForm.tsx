/**
 * - Manages form state and submission logic for creating or editing recipe ingredients.
 * - Initializes form fields based on mode (`create` or `edit`) and preloaded ingredient data.
 * - Validates input using Zod schema and displays validation errors.
 * - Normalizes price based on unit and quantity before submission.
 * - Integrates with backend services to create or update ingredients.
 * - Shows user notifications via `useHelpers` and redirects to `/ingredients` on success.
 * - Supports keyboard-driven submission (Enter key) and dynamic price input handling.
 */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Ingredient, IngredientSchema, IngredientToDisplay, Unit } from '@costwise/shared/recipe';
import { createEditIngredientPrototype, createIngredientPrototype } from '@costwise/shared/transformers';
import { sendIngredient, updateIngredient } from '../services/services';
import useHelpers from './useHelpers';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useUIStore } from '../stores/uiStore';
import { SelectableItem } from '../components/shared/SelectStore';

export type IngredientFormFields = z.infer<typeof IngredientSchema>;

type UseIngredientFormProps = {
  mode: 'create' | 'edit';
  ingredient: Ingredient | IngredientToDisplay | undefined;
  userId: string;
  supplierOptions: SelectableItem[];
};

export const useIngredientForm = ({ mode, ingredient, userId, supplierOptions }: UseIngredientFormProps) => {
  const ingredientWithSuppliers =
    mode === 'edit' && ingredient && 'suppliers' in ingredient && Array.isArray((ingredient as Ingredient).suppliers)
      ? (ingredient as Ingredient)
      : undefined;
  const initialSupplierId = ingredientWithSuppliers?.suppliers?.[0]?.suppliersId;

  const [confirmedSuppliers, setConfirmedSuppliers] = useState<string[]>(
    initialSupplierId ? [initialSupplierId] : []
  );
  const [tempSuppliers, setTempSuppliers] = useState<string[]>(
    initialSupplierId ? [initialSupplierId] : []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm<IngredientFormFields>({
    defaultValues:
      mode === 'edit'
        ? {
            id: ingredient?.id,
            name: ingredient?.name ?? '',
            unit: ingredient?.unit ?? 'kg',
            unitPrice: ingredient?.unitPrice ?? 0,
            quantity: ingredient?.quantity ? Number(ingredient.quantity) : 1,
            usage: ingredient?.usage ?? '0',
            userId: ingredient?.userId ?? userId,
            icon: ingredient?.icon ?? '',
            category: ingredient?.category ?? 'ef45178d-e566-4637-b7f9-abcf6d575466',
            suppliers: initialSupplierId
              ? [
                  {
                    suppliersId: initialSupplierId,
                    unit: (ingredient?.unit as Unit) ?? 'kg',
                    quantity: ingredient?.quantity ? Number(ingredient.quantity) : 1,
                    price: ingredient?.unitPrice ? Number(ingredient.unitPrice) : 0,
                    isActive: true,
                  },
                ]
              : [],
          }
        : {
            id: uuidv4(),
            name: '',
            unit: 'kg',
            unitPrice: 0,
            quantity: 1,
            usage: '0',
            userId: userId,
            icon: '',
            category: 'ef45178d-e566-4637-b7f9-abcf6d575466',
            suppliers: [],
          },
  });

  const router = useRouter();
  const { raiseNotification } = useHelpers({ path: null });
  const { isModalOpen, modalType, closeModal } = useUIStore();
  const [error, setErrors] = useState<string[]>([]);

  const price = watch('unitPrice');
  const name = watch('name');
  const unit = watch('unit');
  const quantity = watch('quantity');

  const selectSupplier = (id: string) => {
    if (id) {
      setConfirmedSuppliers([id]);
      setTempSuppliers([id]);
      setValue(
        'suppliers',
        [
          {
            suppliersId: id,
            unit: (watch('unit') as Unit) || 'kg',
            quantity: Number(watch('quantity')) || 1,
            price: Number(watch('unitPrice')) || 0,
            isActive: true,
          },
        ],
        { shouldValidate: true }
      );
    } else {
      setConfirmedSuppliers([]);
      setTempSuppliers([]);
      setValue('suppliers', [], { shouldValidate: true });
    }
  };

  const confirmSuppliers = () => {
    setConfirmedSuppliers([...tempSuppliers]);
    const suppliersData = tempSuppliers.map((supplierId) => ({
      suppliersId: supplierId,
      unit: (unit as Unit) || 'g',
      quantity: Number(quantity) || 1,
      price: Number(price) || 0,
      isActive: true,
    }));
    setValue('suppliers', suppliersData, { shouldValidate: true });
    closeModal();
  };

  const handleCloseModal = () => {
    setTempSuppliers([...confirmedSuppliers]);
    closeModal();
  };

  const getSelectedSupplierItems = () => {
    return supplierOptions.filter((sup) => confirmedSuppliers.includes(sup.id));
  };

  const onSubmit = async (data: IngredientFormFields) => {
    setErrors([]);

    const suppliersToUse: string[] = [];
    if (confirmedSuppliers.length > 0) {
      suppliersToUse.push(...confirmedSuppliers);
    } else if (data.suppliers && Array.isArray(data.suppliers) && data.suppliers.length > 0) {
      data.suppliers.forEach((s) => {
        const supId = typeof s === 'string' ? s : s?.suppliersId;
        if (supId) suppliersToUse.push(supId);
      });
    }

    if (mode === 'create') {
      const ingredientPrototype = createIngredientPrototype(data, suppliersToUse, userId);
      const validatedIngredient = IngredientSchema.safeParse(ingredientPrototype);

      if (!validatedIngredient.success) {
        const zodErrors = validatedIngredient.error.errors;
        const messages = zodErrors.map((err) => {
          if (
            err.path.includes('suppliers') ||
            err.message.includes('Array must contain') ||
            err.message.includes('element(s)')
          ) {
            return 'Add at least one supplier';
          }
          return err.message;
        });
        setErrors(Array.from(new Set(messages)));
      } else {
        const response = await sendIngredient(validatedIngredient.data);
        raiseNotification(response);
        if (response.success) {
          reset();
          setTempSuppliers([]);
          setConfirmedSuppliers([]);
          if (router) {
            router.replace('/ingredients');
            router.refresh();
          }
        } else {
          if (response.error?.message) {
            setErrors([response.error.message]);
          }
        }
      }
    } else if (mode === 'edit' && ingredient) {
      const updatedIngredient = createEditIngredientPrototype(data, ingredient, suppliersToUse, userId);
      const validatedIngredient = IngredientSchema.safeParse(updatedIngredient);

      if (!validatedIngredient.success) {
        const zodErrors = validatedIngredient.error.errors;
        const messages = zodErrors.map((err) => {
          if (
            err.path.includes('suppliers') ||
            err.message.includes('Array must contain') ||
            err.message.includes('element(s)')
          ) {
            return 'Add at least one supplier';
          }
          return err.message;
        });
        setErrors(Array.from(new Set(messages)));
      } else {
        const response = await updateIngredient(validatedIngredient.data);
        raiseNotification(response);
        if (response.success) {
          reset();
          setTempSuppliers([]);
          setConfirmedSuppliers([]);
          if (router) {
            router.replace('/ingredients');
            router.refresh();
          }
        } else {
          if (response.error?.message) {
            setErrors([response.error.message]);
          }
        }
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit);
    }
  };

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