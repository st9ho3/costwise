/**
 * Recipe Repositories - Data access layer for recipe and recipe-ingredient management
 *
 * This module contains two repository classes that handle database operations for recipes and
 * recipe-ingredient relationships:
 *
 * RecipeRepository:
 * - Provides CRUD operations for recipes
 * - Handles recipe analytics and statistics
 * - Supports user-scoped recipe queries
 * - Manages recipe relationships with ingredients
 *
 * RecipeIngredientsRepository:
 * - Manages many-to-many relationships between recipes and ingredients
 * - Handles ingredient assignment and validation
 * - Supports transactional operations for data consistency
 *
 * Features:
 * - Full CRUD operations with transaction support
 * - Recipe analytics including profit margins and food costs
 * - Ingredient existence validation and assignment
 */

import { DBRecipe, Recipe, RecipeIngredients } from "@/shemas/recipe";
import {
  IRecipeIngredientsRepository,
  IRecipeRepository,
  RecipeAnalytics,
} from "@/types/repositories";
import { db } from "@/db/db";
import { eq, and, avg, countDistinct } from "drizzle-orm";
import { Database, recipesTable, recipeIngredientsTable } from "@/db/schema";
import {
  transformRecipeFromDB,
  transformRecipeToDB,
} from "../utils/transformers";
import { revalidatePath } from "next/cache";
import { checkIfIngredientExists } from "@/db/helpers";
import { RecipeWithQuery } from "@/types/specialTypes";

export class RecipeRepository implements IRecipeRepository {
  async findById(id: string): Promise<RecipeWithQuery | undefined> {
    try {
      const recipe = await db.query.recipesTable.findFirst({
        where: eq(recipesTable.id, id),
        with: {
          recipeIngredients: {
            with: {
              ingredients: true,
            },
          },
        },
      });

      return recipe;
    } catch (err) {
      console.error("Failed to fetch recipe by ID:", err);
      throw new Error(
        `RecipeRepository.findById: Failed to fetch recipe with ID ${id}: ${err}`
      );
    }
  }

  async findAllByIngredientId(id: string): Promise<DBRecipe[] | undefined> {
    try {
      const recipes = await db
        .select()
        .from(recipesTable)
        .innerJoin(
          recipeIngredientsTable,
          eq(recipesTable.id, recipeIngredientsTable.recipeId)
        )
        .where(eq(recipeIngredientsTable.ingredientId, id));

      return recipes.map((recipe) => recipe.recipes);
    } catch (err) {
      console.error("Failed to fetch recipes by ingredient ID:", err);
      throw new Error(
        `RecipeRepository.findAllByIngredientId: Failed to fetch recipes for ingredient ${id}: ${err}`
      );
    }
  }

  async findAll(userId: string): Promise<Recipe[] | undefined> {
    try {
      const dbRecipes = await db
        .select()
        .from(recipesTable)
        .where(eq(recipesTable.userId, userId));

      const recipes = dbRecipes.map((dbRecipe) =>
        transformRecipeFromDB(dbRecipe)
      );
      return recipes;
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      throw new Error(
        `RecipeRepository.findAll: Failed to fetch recipes for user ${userId}: ${err}`
      );
    }
  }

  async create(recipe: DBRecipe, tx: Database): Promise<string | undefined> {
    try {
      const [recipeReceipt] = await tx
        .insert(recipesTable)
        .values(recipe)
        .returning({
          returnedId: recipesTable.id,
        });

      return recipeReceipt.returnedId;
    } catch (err) {
      console.error("Failed to create recipe:", err);
      throw new Error(
        `RecipeRepository.create: Failed to create recipe '${recipe.title}': ${err}`
      );
    }
  }

  async update(
    id: string,
    recipe: Recipe,
    tx?: Database
  ): Promise<{ id: string } | undefined> {
    const dbConnection = tx || db;
    const recipeToDB = transformRecipeToDB(recipe);

    try {
      const [response] = await dbConnection
        .update(recipesTable)
        .set(recipeToDB)
        .where(eq(recipesTable.id, id))
        .returning({
          id: recipesTable.id,
        });

      return response;
    } catch (err) {
      console.error("Failed to update recipe:", err);
      throw new Error(
        `RecipeRepository.update: Failed to update recipe with ID ${id}: ${err}`
      );
    }
  }

  async delete(id: string, tx: Database): Promise<{ id: string } | undefined> {
    try {
      const [deleteReceipt] = await tx
        .delete(recipesTable)
        .where(eq(recipesTable.id, id))
        .returning({
          id: recipesTable.id,
        });

      revalidatePath("/recipes");
      return deleteReceipt;
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      throw new Error(
        `RecipeRepository.delete: Failed to delete recipe with ID ${id}: ${err}`
      );
    }
  }

  async getRecipesAnalytics(
    userId: string
  ): Promise<RecipeAnalytics | undefined> {
    try {
      const [recipeAnalytics] = await db
        .select({
          avgProfitMargin: avg(recipesTable.profitMargin),
          avgFoodCost: avg(recipesTable.foodCost),
          totalRecipes: countDistinct(recipesTable.id),
        })
        .from(recipesTable)
        .where(eq(recipesTable.userId, userId));

      return recipeAnalytics;
    } catch (err) {
      console.error("Failed to get recipe analytics:", err);
      throw new Error(
        `RecipeRepository.getRecipesAnalytics: Failed to get analytics for user ${userId}: ${err}`
      );
    }
  }

  async findByName(
    recipesName: string,
    userId: string
  ): Promise<{ name: string; id: string } | undefined> {
    const [result] = await db
      .select({
        name: recipesTable.title,
        id: recipesTable.id,
      })
      .from(recipesTable)
      .where(
        and(
          eq(recipesTable.userId, userId),
          eq(recipesTable.title, recipesName)
        )
      );

    return result ? result : undefined;
  }
}

export class RecipeIngredientsRepository
  implements IRecipeIngredientsRepository
{
  async create(
    recipeIngredient: RecipeIngredients,
    userId: string,
    tx: Database
  ): Promise<{ id: string | null }> {
    try {
      const foundIngredient = await checkIfIngredientExists(
        recipeIngredient.name,
        userId
      );
      let assignedId;

      if (foundIngredient && foundIngredient.name === recipeIngredient.name) {
        assignedId = foundIngredient.id;
      } else {
        assignedId = recipeIngredient.ingredientId;
      }

      const dbConnection = tx || db;

      const [ingredient] = await dbConnection
        .insert(recipeIngredientsTable)
        .values({
          recipeId: recipeIngredient.recipeId,
          ingredientId: assignedId,
          quantity: recipeIngredient.quantity.toString(),
        })
        .returning({
          ingredientId: recipeIngredientsTable.ingredientId,
        });

      return { id: ingredient.ingredientId };
    } catch (err) {
      console.error("Failed to create recipe-ingredient relationship:", err);
      throw new Error(
        `RecipeIngredientsRepository.create: Failed to create relationship for recipe ${recipeIngredient.recipeId}: ${err}`
      );
    }
  }

  async delete(
    recipeId: string,
    ingredientId: string,
    tx?: Database
  ): Promise<{ ingredientId: string | null } | undefined> {
    const dbConnection = tx || db;

    try {
      const [removedIngredient] = await dbConnection
        .delete(recipeIngredientsTable)
        .where(
          and(
            eq(recipeIngredientsTable.recipeId, recipeId),
            eq(recipeIngredientsTable.ingredientId, ingredientId)
          )
        )
        .returning();

      return {
        ingredientId: removedIngredient.ingredientId,
      };
    } catch (err) {
      console.error("Failed to delete ingredient from recipe:", err);
      throw new Error(
        `RecipeIngredientsRepository.delete: Failed to remove ingredient ${ingredientId} from recipe ${recipeId}: ${err}`
      );
    }
  }
}
