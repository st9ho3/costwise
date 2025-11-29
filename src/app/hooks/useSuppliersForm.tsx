'use client'
import { SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSupplierValues } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';

export type FormFields = z.infer<typeof SupplierSchema>;

const useSuppliersForm = ({}) => {

    const {register, handleSubmit, reset, formState, watch} = useForm<FormFields>({
        defaultValues: defaultSupplierValues,
        resolver: zodResolver(SupplierSchema)
    })

    const onSubmit = (data: FormFields) => {
      console.log(data)
    }
console.log(formState.errors)
const deliverytime = watch('deliveryTime')
const payment = watch('paymentTerms')
console.log(deliverytime, payment)
  return {
    register,
    handleSubmit,
    reset,
    formState,
    onSubmit
  }
}

export default useSuppliersForm
