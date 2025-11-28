'use client'
import { SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSupplierValues } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';

export type FormFields = z.infer<typeof SupplierSchema>;

const useSuppliersForm = ({}) => {

    const {register, handleSubmit, reset, formState} = useForm<FormFields>({
        defaultValues: defaultSupplierValues,
        resolver: zodResolver(SupplierSchema)
    })
  return {
    register,
    handleSubmit,
    reset,
    formState
  }
}

export default useSuppliersForm
