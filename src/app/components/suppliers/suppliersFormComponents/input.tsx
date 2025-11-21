import type{ LucideIcon } from 'lucide-react'
import React from 'react'

interface InputProps{
    label: string
    placeholder: string
    type: string
    icon?: LucideIcon,
    width: number
}

const Input = ({label, placeholder, type, icon: Icon, width}: InputProps) => {
  return (
    <div className={`flex flex-grow flex-col gap-2`}>
        <div className='flex items-center gap-2'>
            <label className='text-gray-500' htmlFor="name">{label}</label>
            {Icon && <Icon size={16} color='gray' />}
        </div>
     
     <input className={`outline w-${width} outline-gray-200 rounded-lg px-3 py-2 focus:outline-blue-600`} id='name' placeholder={placeholder} type={type} />
    </div>
  )
}

export default Input
