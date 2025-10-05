"use client"
import React, { useState } from 'react';
import { RecipeSchema, Ingredient, Recipe, RecipeIngredients } from '@/shemas/recipe';
import { z } from 'zod';
import {
  AdditionalCosts,
  UploadFiles,

  Pricing,
  ExitButton,
  FormHeader,
  ErrorDisplay,
  ViewIngredientsButtonMobile,
  SelectedFileBadge,
  SubmitButton,
  RecipeIngredientsDisplay,
  MobileIngredientsList,
  RecipeIngredientForm
} from '@/app/constants/components';
import useRecipeForm from '@/app/hooks/useRecipeForm';
import Notification from '../../shared/notification';

// Use the Zod schema as the single source of truth for the form's type
export type FormFields = z.infer<typeof RecipeSchema>;

export interface RecipeFormProps {
  mode: "create" | "edit"
  ingredients: Ingredient[]
  recipe?: Recipe
  recipeIngredients: RecipeIngredients[]
  userId: string
}


const RecipeForm = ({ingredients, recipe, recipeIngredients, mode, userId}: RecipeFormProps) => {
  
  const [isListVisible, setIsListVisible] = useState(false);
  const { 
    newId, 
    register, 
    handleSubmit, 
    setValue, 
    getValues, 
    errors, 
    isSubmitting, 
    handleAddIngredient, 
    handleRemoveIngredient, 
    onSubmit, 
    tempIngredients, 
    error, 
    state,
    watch
   } = useRecipeForm({ingredients, recipe, recipeIngredients, mode, userId});

    
  return (
    <>
      {/* Main container */}
      <div className='w-full md:w-250 md:h-130 md:flex'>

        <ExitButton />

        {/* Form Section (Left) */}
        <form onSubmit={handleSubmit(onSubmit)} className='border-1 border-gray-300 border-dashed p-2 rounded-lg flex flex-col gap-y-2'>

          <FormHeader register={register} /> 

          {errors.title && <ErrorDisplay error={errors.title?.message} errors={[]} pricingErrors={{}} />}

          <UploadFiles />
          
          <RecipeIngredientForm ingredients={ingredients} recipeId={mode === 'edit' && recipe ? recipe.id : newId} onAddIngredient={handleAddIngredient} tempIngredients={tempIngredients}  />

          {/* The Pricing component now handles its own inputs */}
          <Pricing register={register} errors={errors} setValue={setValue} getValues={getValues} ingredients={tempIngredients} watch={watch}>
            <AdditionalCosts register={register} errors={errors} />
          </Pricing>

          {error && <ErrorDisplay error={error} errors={[]} pricingErrors={{}} />}

          {/* --- Button to show ingredients on mobile --- */}
          <ViewIngredientsButtonMobile onToggleList={setIsListVisible} ingredients={tempIngredients} /> 

          {state.file && <SelectedFileBadge /> }

          <SubmitButton isSubmitting={isSubmitting} mode={mode} />

        </form>

        {/* Displayed Ingredients Section (Right side, hidden on mobile) */}
        <RecipeIngredientsDisplay
          ingredients={tempIngredients}
          getValues={getValues}
          setValue={setValue}
          onRemove={handleRemoveIngredient}
          watch={watch} 
        />
      </div>

      {/* --- Full-screen ingredient list for mobile --- */}
      {isListVisible &&
        <MobileIngredientsList
          ingredients={tempIngredients}
          getValues={getValues}
          setValue={setValue}
          onRemove={handleRemoveIngredient}
          onToggle={setIsListVisible}
          watch ={watch} 
        />}
        {state.notification.isOpen && <Notification />}
    </>
  );
};

export default RecipeForm;