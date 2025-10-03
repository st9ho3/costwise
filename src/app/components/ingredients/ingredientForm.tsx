"use client"
import React from 'react';
import { IngredientNameInput, IngredientPriceInput, IngredientSummary, IngredientUnitSelect, AddIngredientButton, FormErrors } from '../../constants/components';
import Incremental from '../shared/incremental';
import { Ingredient } from '@/shemas/recipe';
import { useIngredientForm } from '../../hooks/useIngredientsForm'; // Adjust path


type AddIngredientProps = {
  ingredient: Ingredient | undefined
  mode: 'create' | 'edit'
  userId: string
  
};

const IngredientForm = ({ ingredient, mode, userId }: AddIngredientProps) => {
  const {
     price, displayedPrice, errors, register, quantity, unit, name,
     setErrors, isDirty, handleKeyDown, handleSubmit, onSubmit, setQuantity
  } = useIngredientForm({ ingredient, mode, userId });

  return (
    <form className="p-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg">
        <IngredientNameInput register={register} onKeyDown={handleKeyDown} />
        <IngredientPriceInput
          register={register}
          
        />
        <Incremental onChange={setQuantity} count={quantity} onKeyDown={handleKeyDown} setErrors={setErrors} />
        <IngredientUnitSelect register={register}  onKeyDown={handleKeyDown}  />
      </div>

      <AddIngredientButton /* onClick={addIngredient} */ mode={mode} />
      <IngredientSummary quantity={quantity} unit={unit} name={name} price={price} />
      <FormErrors errors={errors} />
    </form>
  );
};

export default IngredientForm;
