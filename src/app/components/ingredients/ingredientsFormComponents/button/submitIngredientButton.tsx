"use client";
import React, { memo } from 'react';
import { Pencil, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type AddIngredientButtonProps = {
  mode: 'create' | 'edit';
  isSubmitting: boolean;
};

const AddIngredientButton = memo(({ mode, isSubmitting }: AddIngredientButtonProps) => {
  const isEditMode = mode === 'edit';
  const label = isEditMode
    ? (isSubmitting ? 'Updating' : 'Update')
    : (isSubmitting ? 'Adding' : 'Add');

  return (
    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
      {isSubmitting ? (
        <Loader2 className="animate-spin" />
      ) : isEditMode ? (
        <Pencil />
      ) : (
        <Plus />
      )}
      <span>{label}</span>
    </Button>
  );
});

AddIngredientButton.displayName = 'AddIngredientButton';

export default AddIngredientButton;
