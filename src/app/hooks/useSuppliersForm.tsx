'use client'
import { IngredientCategory, Supplier, SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaultSupplierValues } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useState } from 'react';
import { createSupplier, updateSupplier } from '../services/services';
import { redirect } from 'next/navigation';
import { getArrayChanges } from '../services/helpers';

export type FormFields = z.infer<typeof SupplierSchema>;

interface UseSuppliersFormProps {
  userId: string
  mode: 'create' | 'edit'
  supplier: Supplier | undefined
}

const useSuppliersForm = ({userId, mode, supplier}: UseSuppliersFormProps) => {

    const {register, handleSubmit, reset, formState} = useForm<FormFields>({
        defaultValues: mode === 'create' ? getDefaultSupplierValues() : supplier,
        resolver: zodResolver(SupplierSchema)
    })
    const INITIAL_STATE = mode === 'edit' && supplier ? supplier.category : []
    const [existingCategories] = useState<IngredientCategory[] | undefined>(supplier?.category)
    const [tempCategories, setTempCategories] = useState<IngredientCategory[]>(INITIAL_STATE)
    console.log(formState.errors)
    const selectCategory = (id: IngredientCategory) => {
      if (!tempCategories.includes(id)) {
        setTempCategories([...tempCategories, id])
      } else {
        const filteredCategories = tempCategories.filter((category) => category !== id)
        setTempCategories(filteredCategories)
      }
    } 
    
    const resetForm = () => {
      reset()
      setTempCategories([])
    }

    const onSubmit = async(data: FormFields) => {

      const supplier = {...data, category: tempCategories, userId: userId}


      if (mode === 'create') {

         await createSupplier(supplier, tempCategories, [])
        resetForm()
        redirect('/suppliers')
      } else {

        if (!existingCategories) {
          return {added: [''], removed: ['']}
        }
        
        const {added, removed} = getArrayChanges(existingCategories, tempCategories)
        console.log('client: ', supplier)
        await updateSupplier(supplier, added, removed)
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
    tempCategories
  }
}

export default useSuppliersForm
