import { db } from './db';
import { and, eq } from 'drizzle-orm';
import { ingredientsTable, recipesTable } from './schema';


export const checkIfRecipeExists = async (title: string, userId: string) => {
  const [recipe] = await db
    .select()
    .from(recipesTable)
    .where(and(eq(recipesTable.title, title), eq(recipesTable.userId, userId)));

  return recipe;
};

export const checkIfIngredientExists = async (title: string, userId: string) => {
  const [ingredient] = await db
    .select()
    .from(ingredientsTable)
    .where(and(eq(ingredientsTable.name, title), eq(ingredientsTable.userId, userId)))
    

  return ingredient;
};




