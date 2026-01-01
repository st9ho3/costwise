/**
 * Renders a full-screen overlay for creating a new recipe.
 * This component first checks for an authenticated user session. If no session is found,
 * it redirects the user to the sign-in page. It then fetches all ingredients associated
 * with the authenticated user from the `IngredientService`. These ingredients are
 * formatted and passed to the `RecipeForm` component, which is configured for 'create' mode.
 * An empty array for `recipeIngredients` is also initialized and passed to the form,
 * as a new recipe has no ingredients by default. The component ensures the user is
 * authenticated before rendering the form to prevent unauthorized access.
 */
import React from 'react';
import RecipeForm from '@/app/components/recipes/recipeForm/recipeForm';
import { IngredientService } from '@/app/services/ingredientService';
import { RecipeIngredients } from '@/shemas/recipe';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const Page = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }

    const service = new IngredientService(session?.user?.id);

    const rawIngredients = session.user.id && await service.findAll(session.user.id);

    const ingredients = rawIngredients ? rawIngredients.map((ingredient) => {
        return { ...ingredient, unitPrice: Number(ingredient.unitPrice), quantity: Number(ingredient.quantity) };
    }) : [];
    
    const recipeIngredients: RecipeIngredients[] = [];

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className={`relative w-full max-w-fit p-9 mx-4 transform transition-all duration-300 bg-white rounded-2xl shadow-xl`}>
                {session.user.id && <RecipeForm mode="create" recipeIngredients={recipeIngredients} ingredients={ingredients} userId={session.user.id} />}
            </div>
        </div>
    );
};

export default Page;