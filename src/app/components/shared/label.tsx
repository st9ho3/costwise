import { LabelType } from '@/types/specialTypes';
import React from 'react';
import { typeStyles } from '@/app/constants/data';

const Label = ({ text, type }: {text: string, type: LabelType}) => {

 const refinedText = text === 'Oils, Vinegars, & Condiments' ? 'Oils, Vinegars, & Co...'  : text
  return (
    <div className={`
      inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-sm font-medium
      ${typeStyles[type]}
      }`}>
      <span>{refinedText}</span>
    </div>
  );
};

export default Label