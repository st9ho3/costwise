import React from 'react';
import RecipeForm from '@/app/components/recipes/recipeForm/recipeForm';
import { transformRecipeFromDB, transformRecipeIngredentFromDB } from '@costwise/shared/transformers';
import { Metadata, RecipeIngredientFromDB } from '@costwise/shared/specialTypes';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';
import { apiServer } from '@/app/lib/apiServer';

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

  const { id } = await params;
  const api = await apiServer();

  const { data: dbRecipe, error: recipeError } = await api.GET('/v1/recipes/{id}', {
    params: { path: { id } },
  });

  if (recipeError || !dbRecipe) {
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

  const { data: result } = await api.GET('/v1/ingredients', {
    params: {
      query: {
        page: dropdownMetadata.page,
        order: dropdownMetadata.order,
        sort: dropdownMetadata.sort,
        itemsPerPage: dropdownMetadata.itemsPerPage,
        offset: dropdownMetadata.offset,
      },
    },
  });

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