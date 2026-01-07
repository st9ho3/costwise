/**
 * Renders the ingredients page for a logged-in user.
 * This component fetches all ingredients associated with the current user's ID.
 * It first verifies user authentication and redirects to the sign-in page if no session is found.
 * It then uses the `IngredientService` to retrieve the ingredient data and passes it to the `IngredientsTable`
 * and `Pagination` components for display and navigation. The page is set to be dynamically rendered
 * to ensure data is always up-to-date.
 */
import React from 'react';
import IngredientsTable from '@/app/components/ingredients/ingredientsTable';
import Pagination from '@/app/components/recipes/pagination';
import { IngredientService } from '@/app/services/ingredientService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Metadata } from '@/types/specialTypes';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }>;
}

const IngredientsPage = async ({ searchParams }: Props) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { page, order, sort } = await searchParams;
  const numericPage = parseInt(page || '1');
  const itemsPerPage = 9;
  const offset = (numericPage - 1) * itemsPerPage;
  const metadata: Metadata = {
    page: numericPage,
    order,
    sort,
    itemsPerPage,
    offset,
  };

  const service = new IngredientService(session.user.id);
  const rawIngredients = session.user.id && await service.findAll(session.user.id, metadata);
  const totalItems = rawIngredients ? rawIngredients.count.count : 1;
  const pageNumber = Math.ceil(totalItems / itemsPerPage);
  const ingredients = rawIngredients
    ? rawIngredients.ingredients.map((ingredient) => {
        return ingredient;
      })
    : [];

  return (
    <div className="flex flex-col h-full w-full px-2 md:px-5 bg-white">
      <div className="flex-1 overflow-auto">
        <IngredientsTable items={ingredients} />
      </div>
      <div className="mt-auto">
        <Pagination pageNumber={pageNumber} currentPage={page} />
      </div>
    </div>
  );
};

export default IngredientsPage;
