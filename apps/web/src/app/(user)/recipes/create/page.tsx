import React from 'react';
import RecipeForm from '@/app/components/recipes/recipeForm/recipeForm';
import { IngredientService } from '@/app/services/ingredientService';
import { RecipeIngredients } from '@/shemas/recipe';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Metadata } from '@/types/specialTypes';

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const service = new IngredientService(session.user.id);

  // Use a high limit to get all ingredients for dropdown
  const dropdownMetadata: Metadata = {
    page: 1,
    order: 'asc',
    sort: 'name',
    itemsPerPage: 1000,
    offset: 0,
  };

  const result = await service.findAll(session.user.id, dropdownMetadata);
  const ingredients = result ? result.ingredients : [];
  const recipeIngredients: RecipeIngredients[] = [];

  return (
    <RecipeForm
      mode="create"
      recipeIngredients={recipeIngredients}
      ingredients={ingredients}
      userId={session.user.id}
    />
  );
};

export default Page;