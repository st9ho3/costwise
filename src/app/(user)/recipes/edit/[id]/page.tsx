/**
 * Renders a full-screen overlay for editing an existing recipe.
 * This component first verifies user authentication; if no session is found, it redirects
 * the user to the sign-in page. It then retrieves the specific recipe to be edited
 * and all of the user's available ingredients from their respective services.
 * The raw data from the database is transformed into a usable format for the form.
 * The `RecipeForm` component is then rendered in 'edit' mode, pre-populated with the
 * recipe's data, its associated ingredients, and the user's full list of ingredients.
 * The component ensures a user is logged in and the recipe exists before attempting to render the form.
 */
import React from 'react';
import { RecipeForm } from '@/app/constants/components';
import { transformRecipeFromDB, transformRecipeIngredentFromDB } from '@/app/utils/transformers';
import { IngredientService } from '@/app/services/ingredientService';
import { RecipeService } from '@/app/services/recipeService';
import { RecipeIngredientFromDB } from '@/types/specialTypes';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface Params {
    params: Promise<{
        id: string;
    }>;
}

const EditPage = async ({ params }: Params) => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }

    const recipeService = new RecipeService(session.user.id);
    const ingredientService = new IngredientService(session?.user?.id);

    const { id } = await params;

    const dbRecipe = await recipeService.findById(id);

    if (!dbRecipe) {
        throw new Error('recipe not found');
    }

    const { recipeIngredients, ...rawRecipe } = dbRecipe;
    const recIngredients = recipeIngredients.map((ing: RecipeIngredientFromDB) => transformRecipeIngredentFromDB(ing));
    const recipe = transformRecipeFromDB(rawRecipe);

    const rawIngredients = session.user.id && await ingredientService.findAll(session.user.id);
    const ingredients = rawIngredients ? rawIngredients : [];

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className={`relative w-full max-w-fit p-9 mx-4 transform transition-all duration-300 bg-white rounded-2xl shadow-xl`}>
                {session.user.id && <RecipeForm mode="edit" recipe={recipe} recipeIngredients={recIngredients} ingredients={ingredients} userId={session.user.id} />}
            </div>
        </div>
    );
};

export default EditPage;