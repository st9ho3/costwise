/**
 * Renders the recipes page for a logged-in user.
 * This component fetches all recipes associated with the current user's ID.
 * It first verifies user authentication and redirects to the sign-in page if no session is found.
 * It then uses the `RecipeService` to retrieve the recipe data and passes it to the `RecipesTable`
 * and `Pagination` components for display and navigation. The page is set to be dynamically rendered
 * to ensure data is always up-to-date.
 */
import React from 'react';
import Pagination from '@/app/components/recipes/pagination';
import RecipesTable from '@/app/components/recipes/recipestable';
import { RecipeService } from '@/app/services/recipeService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const RecipesPage = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect('/signin');
    }
    

    const service = new RecipeService();

    const rawRecipes = session.user.id && await service.findAll(session.user.id);
    const recipes = rawRecipes ? rawRecipes.map((recipe) => {
        return recipe;
    }) : [];

    return (
        <div className="relative w-full h-full px px-2 md:px-5 bg-white">
            <RecipesTable items={recipes} />
            <Pagination items={recipes} />
        </div>
    );
};

export default RecipesPage;