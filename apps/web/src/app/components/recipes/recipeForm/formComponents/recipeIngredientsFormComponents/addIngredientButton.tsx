import React from 'react';
import { PlusCircle } from 'lucide-react';

interface AddIngredientButtonProps {
  onClick: () => void;
}

export const AddRecipeIngredientButton: React.FC<AddIngredientButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors w-full sm:w-auto flex-shrink-0"
    >
      <PlusCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Add</span>
    </button>
  );
};