'use client'
import { IngredientCategory, Supplier, SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSupplierValues } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useState } from 'react';
import { createSupplier, updateSupplier } from '../services/services';
import { redirect } from 'next/navigation';

export type FormFields = z.infer<typeof SupplierSchema>;

interface UseSuppliersFormProps {
  userId: string
  mode: 'create' | 'edit'
  supplier: Supplier | undefined
}

const useSuppliersForm = ({userId, mode, supplier}: UseSuppliersFormProps) => {

    const {register, handleSubmit, reset, formState} = useForm<FormFields>({
        defaultValues: mode === 'create' ? defaultSupplierValues : supplier,
        resolver: zodResolver(SupplierSchema)
    })
    const INITIAL_STATE = mode === 'edit' && supplier ? supplier.category : []
    const [categories, setCategories] = useState<IngredientCategory[]>(INITIAL_STATE)

    const selectCategory = (id: IngredientCategory) => {
      if (!categories.includes(id)) {
        setCategories([...categories, id])
      } else {
        const filteredCategories = categories.filter((category) => category !== id)
        setCategories(filteredCategories)
      }
    } 
    
    const resetForm = () => {
      reset()
      setCategories([])
    }

    const onSubmit = async(data: FormFields) => {

      const supplier = {...data, category: categories, userId: userId}

      if (mode === 'create') {
         await createSupplier(supplier)
        resetForm()
        redirect('/suppliers')
      } else {
        await updateSupplier(supplier)
        redirect('/suppliers')
      }
     
    } 

  return {
    register,
    handleSubmit,
    reset,
    formState,
    onSubmit,
    selectCategory,
    categories
  }
}

export default useSuppliersForm
