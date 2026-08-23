import React from 'react';
import RecipeForm from '@/app/components/recipes/recipeForm/recipeForm';
import { transformRecipeFromDB, transformRecipeIngredentFromDB } from '@costwise/shared/transformers';
import { IngredientService } from '@costwise/domain/services/ingredientService';
import { RecipeService } from '@costwise/domain/services/recipeService';
import { Metadata, RecipeIngredientFromDB } from '@costwise/shared/specialTypes';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: Params) => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const recipeService = new RecipeService(session.user.id);
  const ingredientService = new IngredientService(session.user.id);

  const { id } = await params;

  const dbRecipe = await recipeService.findById(id);

  if (!dbRecipe) {
    notFound();
  }

  const { recipeIngredients, ...rawRecipe } = dbRecipe;
  const recIngredients = recipeIngredients.map((ing: RecipeIngredientFromDB) =>
    transformRecipeIngredentFromDB(ing)
  );
  const recipe = transformRecipeFromDB(rawRecipe);

  // Use a high limit to get all ingredients for dropdown
  const dropdownMetadata: Metadata = {
    page: 1,
    order: 'asc',
    sort: 'name',
    itemsPerPage: 1000,
    offset: 0,
  };

  const result = await ingredientService.findAll(session.user.id, dropdownMetadata);
  const ingredients = result ? result.ingredients : [];

  return (
    <RecipeForm
      mode="edit"
      recipe={recipe}
      recipeIngredients={recIngredients}
      ingredients={ingredients}
      userId={session.user.id}
    />
  );
};

export default EditPage;