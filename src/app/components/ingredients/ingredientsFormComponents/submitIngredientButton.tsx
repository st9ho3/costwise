"use client";
import { Plus, Pencil } from 'lucide-react';
import React, { memo } from 'react';

type AddIngredientButtonProps = {
  /* onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; */
  mode: 'create' | 'edit';
};

const AddIngredientButton = memo(({  mode }: AddIngredientButtonProps) => {
  const isEditMode = mode === 'edit';

  return (
    <div className="flex justify-center mt-4">
      <button
        type='submit'
        
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition-colors w-full sm:w-auto flex-shrink-0 ${
          isEditMode
            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
        }`}
      >
        {isEditMode ? <Pencil size={20} /> : <Plus size={20} />}
        {isEditMode ? 'Update' : 'Add'}
      </button>
    </div>
  );
});

AddIngredientButton.displayName = "AddIngredientButton"

export default AddIngredientButton;
