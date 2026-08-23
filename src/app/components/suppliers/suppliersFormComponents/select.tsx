import React from 'react'
import type{ LucideIcon } from 'lucide-react'
import { DeliveryOption, PaymentTermOption } from '@/app/constants/data'
import { FormFields } from '@/app/hooks/useSuppliersForm'
import { Path, UseFormRegister } from 'react-hook-form'

import { Select as UISelect } from '@/app/components/ui/select'

interface SelectProps{
    label: string
    options: DeliveryOption[] | PaymentTermOption[]
    icon: LucideIcon,
    width?: number
    name: Path<FormFields>,
    register: UseFormRegister<FormFields>
}

const Select = ({label, register, name, icon: Icon, options}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-2">
        <label className="font-bold text-[13px] text-ink-900">{label}</label>
        <Icon className="size-4 text-stone-500" />
      </div>
      <UISelect
        options={options.map((o) => ({ value: o.value, label: o.text }))}
        {...register(name)}
      />
    </div>
  )
}

export default Select
