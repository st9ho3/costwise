import React from 'react';
import RecipeForm from '@/app/components/recipes/recipeForm/recipeForm';
import { RecipeIngredients } from '@costwise/shared/recipe';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect } from 'next/navigation';
import { Metadata } from '@costwise/shared/specialTypes';
import { apiServer } from '@/app/lib/api';

const Page = async () => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  // Use a high limit to get all ingredients for dropdown
  const dropdownMetadata: Metadata = {
    page: 1,
    order: 'asc',
    sort: 'name',
    itemsPerPage: 1000,
    offset: 0,
  };

  const api = await apiServer();
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