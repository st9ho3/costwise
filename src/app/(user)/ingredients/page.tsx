import React from 'react';
import IngredientsTable from '@/app/components/ingredients/ingredientsTable';
import Pagination from '@/app/components/recipes/pagination';
import { IngredientService } from '@/app/services/ingredientService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const ingredientsPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/signin');
  }
  
  const service = new IngredientService();
  const rawIngredients = session.user.id && await service.findAll(session.user.id);
  const ingredients = rawIngredients ? rawIngredients.map((ingredient) => {
    return ingredient;
  }) : [];

  
  return (
    <div className="flex flex-col h-full w-full px-2 md:px-5 bg-white">
      <div className="flex-1 overflow-auto">
        <IngredientsTable items={ingredients} />
      </div>
      <div className="mt-auto">
        <Pagination items={ingredients} />
      </div>
    </div>
  );
};

export default ingredientsPage;