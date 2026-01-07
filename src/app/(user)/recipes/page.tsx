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
import { Metadata } from '@/types/specialTypes';

export const dynamic = 'force-dynamic';
interface Props {
    searchParams: Promise<{
        page?: string
        sort?: string
        order?: 'asc' | 'desc'
    }>
}
const RecipesPage = async ({searchParams}: Props) => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }
    const {page, order, sort} = await searchParams
    const numericPage = parseInt(page || '1')
    const itemsPerPage = 9
    const offset = (numericPage - 1)*itemsPerPage 
    const metadata: Metadata = {
        page: numericPage, order, sort, itemsPerPage, offset,
    }
    const service = new RecipeService(session?.user?.id);

    const rawRecipes = session.user.id && await service.findAll(session.user.id, metadata);
    const totalItems = rawRecipes ? rawRecipes.count.count : 1
    const pageNumber = Math.ceil(totalItems/itemsPerPage)
    const recipes = rawRecipes ? rawRecipes.recipes.map((recipe) => {
        return recipe;
    }) : [];
    
    

    return (
        <div className="flex flex-col h-full w-full px-2 md:px-5 bg-white">
            <div className="flex-1 overflow-auto">
                <RecipesTable items={recipes} />
            </div>
            <div className="mt-auto">
                <Pagination pageNumber={pageNumber} currentPage={page} />
            </div>
            
        </div>
    );
};

export default RecipesPage;