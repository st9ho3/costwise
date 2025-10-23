/**
 * Renders the ingredients page for a logged-in user.
 * This component fetches all ingredients associated with the current user's ID.
 * It first verifies user authentication and redirects to the sign-in page if no session is found.
 * It then uses the `IngredientService` to retrieve the ingredient data and passes it to the `IngredientsTable`
 * and `Pagination` components for display and navigation. The page is set to be dynamically rendered to ensure data is always up-to-date.
 */
import React from 'react';
import IngredientsTable from '@/app/components/ingredients/ingredientsTable';
import Pagination from '@/app/components/recipes/pagination';
import { IngredientService } from '@/app/services/ingredientService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Header from '@/app/components/layout/header';

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
        <div className="relative w-full h-screen px-2 md:px-5 bg-white">
            <Header session={session} />
            <IngredientsTable items={ingredients} />
            <Pagination items={ingredients} />
        </div>
    );
};

export default ingredientsPage;