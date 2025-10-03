import React from 'react'
import { NotepadText } from 'lucide-react'
import { UseFormRegister } from 'react-hook-form'
import { FormFields } from '../recipeForm'

interface FormHeaderProps {
    register: UseFormRegister<FormFields>
}

const FormHeader = ({register}: FormHeaderProps) => {
  console.log("formheader")
  return (
    <div className='flex items-center border-1 border-gray-300 border-dashed rounded-lg p-1'>
        <NotepadText color='gray' />
        <input {...register('title')} id='title' type="text" className='p-4 placeholder:text-gray-500 text-2xl focus:outline-none w-full' placeholder="Recipe's name" required />
      </div>
  )
}

export default FormHeader
