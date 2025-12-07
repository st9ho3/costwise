import React from 'react';
import IngredientsTable from '@/app/components/ingredients/ingredientsTable';
import Pagination from '@/app/components/recipes/pagination';
import { IngredientService } from '@/app/services/ingredientService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { categorySeedData } from '@/app/constants/data';
import { categories } from '@/db/schema';
import { db } from '@/db/db';

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

 async function seedCategories() {
  console.log('🌱 Seeding categories...');

  // Using for...of loop to ensure we can 'await' each insert
  for (const item of categorySeedData) {
    await db.insert(categories)
      .values({
        id: item.id,
        category: item.category as any, 
      })
      .onConflictDoNothing(); // Skips if ID already exists
  }

  console.log('✅ Categories seeded.');
}

await seedCategories()
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