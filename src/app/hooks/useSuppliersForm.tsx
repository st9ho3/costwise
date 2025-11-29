'use client'
import { SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSupplierValues } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';

export type FormFields = z.infer<typeof SupplierSchema>;

interface UseSuppliersFormProps {
  userId: string
}

const useSuppliersForm = ({userId}: UseSuppliersFormProps) => {

    const {register, handleSubmit, reset, formState} = useForm<FormFields>({
        defaultValues: defaultSupplierValues,
        resolver: zodResolver(SupplierSchema)
    })

    const onSubmit = (data: FormFields) => {
      const supplier = {...data, userId: userId}
      console.log(supplier)
    }

  return {
    register,
    handleSubmit,
    reset,
    formState,
    onSubmit
  }
}

export default useSuppliersForm
