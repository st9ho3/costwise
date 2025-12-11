// src/components/shared/Button.tsx

import React from 'react'
import { Plus, Pencil, Loader2 } from 'lucide-react';

interface ButtonProps {
    isEditMode: boolean
    text: string
    isLoading?: boolean // Added optional loading state for better UX
}

const Button = ({ isEditMode, text, isLoading = false }: ButtonProps) => {
  
  const baseClasses = `
    relative flex items-center justify-center gap-2.5 
    w-full sm:w-auto px-8 h-12 
    rounded-full 
    text-sm font-semibold tracking-wide text-white
    shadow-md hover:shadow-lg hover:-translate-y-0.5
    transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
    active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
  `;

  // Color Logic
  const colorClasses = isEditMode
    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'     
    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'; 

  return (
    <div className="flex justify-center mt-6">
      <button
        type='submit'
        disabled={isLoading}
        className={`${baseClasses} ${colorClasses}`}
      >
        {/* Icon / Loading Logic */}
        {isLoading ? (
           <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
           <>
             {isEditMode 
               ? <Pencil size={18} strokeWidth={2.5} /> 
               : <Plus size={20} strokeWidth={2.5} />
             }
           </>
        )}
        
        <span>{isLoading ? 'Saving...' : text}</span>
      </button>
    </div>
  )
}

export default Button