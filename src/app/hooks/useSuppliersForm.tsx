'use client'
import { SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSupplierValues } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useState } from 'react';

export type FormFields = z.infer<typeof SupplierSchema>;

interface UseSuppliersFormProps {
  userId: string
}

const useSuppliersForm = ({userId}: UseSuppliersFormProps) => {

    const {register, handleSubmit, reset, formState} = useForm<FormFields>({
        defaultValues: defaultSupplierValues,
        resolver: zodResolver(SupplierSchema)
    })
    const [categories, setCategories] = useState<string[]>([])
    const selectCategory = (id: string) => {
      if (!categories.includes(id)) {
        setCategories([...categories, id])
      } else {
        const filteredCategories = categories.filter((category) => category !== id)
        setCategories(filteredCategories)
      }
    } 
    

    const onSubmit = (data: FormFields) => {
      const supplier = {...data, userId: userId}
      console.log(supplier)
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
