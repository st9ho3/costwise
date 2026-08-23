// src/components/shared/sharedButton.tsx

import React from 'react';
import { ButtonProps } from '@costwise/shared/uiTypes';

const Button = ({ text, action }: ButtonProps) => {
  return (
    <button
      onClick={action}
      type="button"
      className={`
        inline-flex items-center justify-center
        px-6 h-10
        rounded-full
        text-sm font-medium text-gray-600 tracking-wide
        transition-all duration-200 ease-out
        
        /* Interactive States */
        hover:bg-gray-100 hover:text-gray-900
        active:scale-[0.96] active:bg-gray-200
        
        /* Focus Accessibility */
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1
      `}
    >
      {text}
    </button>
  );
};

export default Button;