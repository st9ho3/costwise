"use client"
import React from 'react';
import { BanknoteX } from "lucide-react";
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormFields } from '../recipeForm'; // Import your FormFields type

import { Select } from '@/app/components/ui/select';

// Define props for the component
type AdditionalCostsProps = {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
}

const AdditionalCosts: React.FC<AdditionalCostsProps> = ({ register, errors }) => {
  return (
    <div>
      <div className="flex flex-col justify-evenly md:flex-row items-center rounded-lg space-x-2 p-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <BanknoteX className="size-5 text-stone-500" />
            <Select
              placeholder="ΦΠΑ"
              defaultValue="0"
              options={[
                { value: '0', label: 'ΦΠΑ (0%)' },
                { value: '0.13', label: '13%' },
                { value: '0.24', label: '24%' },
              ]}
              {...register('tax', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>
      {errors.tax && <p className="text-red-500 ml-3">{errors.tax.message}</p>}
    </div>
  );
};

export default AdditionalCosts;