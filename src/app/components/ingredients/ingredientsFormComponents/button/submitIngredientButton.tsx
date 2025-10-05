"use client";
import React,{ memo } from 'react';
import Button from './button';

type AddIngredientButtonProps = {
  mode: 'create' | 'edit';
  isSubmitting: boolean
};

const AddIngredientButton = memo(({  mode, isSubmitting }: AddIngredientButtonProps) => {

  const isEditMode = mode === 'edit';

  if (isEditMode) {
     if (isSubmitting) {
      return <Button isEditMode={isEditMode} text='Updating' />
     } else {
      return <Button isEditMode={isEditMode} text='Update' />
     }
  } else {
    if (isSubmitting) {
      return <Button isEditMode={isEditMode} text='Adding' />
    } else {
      return <Button isEditMode={isEditMode} text='Add' />
    }
  }

});

AddIngredientButton.displayName = "AddIngredientButton"

export default AddIngredientButton;
