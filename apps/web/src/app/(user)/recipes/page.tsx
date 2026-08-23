import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Pagination from '@/app/components/recipes/pagination';
import RecipesTable from '@/app/components/recipes/recipestable';
import { RecipeService } from '@costwise/domain/services/recipeService';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect } from 'next/navigation';
import { Metadata } from '@costwise/domain/types/specialTypes';
import { Button } from '@/app/components/ui/button';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }>;
}

const RecipesPage = async ({ searchParams }: Props) => {
  const session = await getServerSession();

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
  const service = new RecipeService(session.user.id);

  const rawRecipes = await service.findAll(session.user.id, metadata);
  const totalItems = rawRecipes ? rawRecipes.count.count : 0;
  const pageNumber = Math.ceil(totalItems / itemsPerPage);
  const recipes = rawRecipes ? rawRecipes.recipes : [];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[30px] leading-tight text-ink-900 tracking-[-0.02em]">
            Your dishes
          </h1>
          <p className="font-body text-[15px] text-stone-500 mt-1">
            {totalItems} {totalItems === 1 ? 'dish' : 'dishes'}, priced and costed
          </p>
        </div>

        <Link href="/recipes/create">
          <Button iconLeft={<Plus className="size-4" strokeWidth={2.5} />}>
            Add a dish
          </Button>
        </Link>
      </div>

      {/* Recipes List / Table */}
      <div className="w-full">
        <RecipesTable items={recipes} />
      </div>

      {/* Pagination */}
      {pageNumber > 1 && (
        <div className="mt-auto">
          <Pagination pageNumber={pageNumber} currentPage={page} />
        </div>
      )}
    </div>
  );
};

export default RecipesPage;