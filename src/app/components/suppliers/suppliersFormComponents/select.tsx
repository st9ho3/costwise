import React from 'react'
import type{ LucideIcon } from 'lucide-react'
import { DeliveryOption, PaymentTermOption } from '@/app/constants/data'
import { FormFields } from '@/app/hooks/useSuppliersForm'
import { Path, UseFormRegister } from 'react-hook-form'

interface SelectProps{
    label: string
    options: DeliveryOption[] | PaymentTermOption[]
    icon: LucideIcon,
    width: number
    name: Path<FormFields>,
    register: UseFormRegister<FormFields>
}

const Select = ({label, register, name, icon: Icon, width, options}: SelectProps) => {
  
  return (
    <div className={`flex flex-grow w-${width} flex-col gap-2`}>
        <div className='flex items-center gap-2'>
             <label htmlFor="select">{label}</label>
             <Icon color='gray' size={18} />
        </div>
   
      <select {...register(name)} className={`border w-${width} border-gray-200 text-gray-600 rounded-lg p-1 focus:outline-none`} id="select">
        {options.map((option) => <option key={option.value} value={option.value}> {option.text} </option> )}
      </select>
    </div>
  )
}

export default Select
