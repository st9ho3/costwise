// src/components/ingredients/constants/FormErrors.tsx

import React from 'react';
import { AlertCircle } from 'lucide-react';

type FormErrorsProps = {
  errors: string[];
};

const FormErrors = ({ errors }: FormErrorsProps) => {
  // Return nothing if there are no errors to keep the UI clean
  if (!errors || errors.length === 0) return null;

  return (
    <div className="
      flex items-start gap-3 w-full 
      p-4 rounded-xl mt-4
      bg-red-50 border border-red-100
      animate-in fade-in slide-in-from-top-1 duration-300
    ">
      {/* Icon: Immediate visual cue for 'Error' */}
      <div className="mt-0.5 text-red-600">
        <AlertCircle size={20} strokeWidth={2} />
      </div>
      
      {/* Content Container */}
      <div className="flex flex-col gap-1 w-full">
        <h4 className="text-sm font-bold text-red-900">
          Please fix the following:
        </h4>
        
        {/* Styled List */}
        <ul className="list-disc list-inside text-sm text-red-700/90 space-y-1">
          {errors.map((err, index) => (
            <li key={index} className="leading-snug">
              {err}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormErrors;