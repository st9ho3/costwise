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

import { DBRecipe, Recipe, RecipeIngredients } from "@costwise/shared/recipe";
import {
  IRecipeIngredientsRepository,
  IRecipeRepository,
  OperationResult,
  RecipeAnalytics,
  CategoryAnalytics,
  MarginHighlights,
} from "@/types/repositories";
import { db } from "@costwise/db/db";
import { eq, and, avg, countDistinct, asc, desc } from "drizzle-orm";
import { Database, recipesTable, recipeIngredientsTable } from "@costwise/db/schema";
import {
  transformRecipeFromDB,
  transformRecipeToDB,
} from "../utils/transformers";
import { revalidatePath } from "next/cache";
import { checkIfIngredientExists } from "@costwise/db/helpers";
import { Metadata, RecipeWithQuery, sortColumns } from "@/types/specialTypes";
import { DatabaseError } from "../utils/errors";

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

      return recipe as unknown as RecipeWithQuery | undefined;
    } catch (err) {
      console.error("Failed to fetch recipe by ID:", err);
      throw new DatabaseError("RecipeRepository.findById", err);
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
      throw new DatabaseError("RecipeRepository.findAllByIngredientId", err);
    }
  }

  async findAll(
    userId: string,
    { itemsPerPage, order, sort, offset }: Metadata
  ): Promise<{ recipes: Recipe[]; count: { count: number } } | undefined> {
    try {
      const sorting = sort ? sortColumns[sort] : recipesTable.dateCreated;
      const orderfn = order === "desc" ? desc : asc;
      const sortClause = sorting
        ? orderfn(sorting)
        : desc(recipesTable.dateCreated);

      const [dbRecipes, [count]] = await Promise.all([
        db
          .select()
          .from(recipesTable)
          .where(eq(recipesTable.userId, userId))
          .limit(itemsPerPage)
          .offset(offset)
          .orderBy(sortClause),

        db
          .select({ count: countDistinct(recipesTable.id) })
          .from(recipesTable)
          .where(eq(recipesTable.userId, userId)),
      ]);

      const recipes = dbRecipes.map((dbRecipe) =>
        transformRecipeFromDB(dbRecipe)
      );
      return { recipes, count };
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      throw new DatabaseError("RecipeRepository.findAll", err);
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
      throw new DatabaseError("RecipeRepository.create", err);
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
      throw new DatabaseError("RecipeRepository.update", err);
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
      throw new DatabaseError("RecipeRepository.delete", err);
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
      throw new DatabaseError("RecipeRepository.getRecipesAnalytics", err);
    }
  }

  async getCategoryAnalytics(userId: string): Promise<CategoryAnalytics[]> {
    try {
      const rawCategories = await db
        .select({
          category: recipesTable.category,
          count: countDistinct(recipesTable.id),
          avgFoodCost: avg(recipesTable.foodCost),
        })
        .from(recipesTable)
        .where(eq(recipesTable.userId, userId))
        .groupBy(recipesTable.category);

      return rawCategories.map((c) => ({
        category: c.category as "starter" | "main" | "dessert",
        count: Number(c.count),
        avgFoodCost: c.avgFoodCost,
      }));
    } catch (err) {
      console.error("Failed to get category analytics:", err);
      throw new DatabaseError("RecipeRepository.getCategoryAnalytics", err);
    }
  }

  async getMarginHighlights(userId: string): Promise<MarginHighlights> {
    try {
      const [topPerformersDB, attentionNeededDB] = await Promise.all([
        db
          .select()
          .from(recipesTable)
          .where(eq(recipesTable.userId, userId))
          .orderBy(desc(recipesTable.profitMargin))
          .limit(4),
        db
          .select()
          .from(recipesTable)
          .where(eq(recipesTable.userId, userId))
          .orderBy(desc(recipesTable.foodCost))
          .limit(4),
      ]);

      return {
        topPerformers: topPerformersDB.map((r) => transformRecipeFromDB(r)),
        attentionNeeded: attentionNeededDB.map((r) => transformRecipeFromDB(r)),
      };
    } catch (err) {
      console.error("Failed to get margin highlights:", err);
      throw new DatabaseError("RecipeRepository.getMarginHighlights", err);
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
  ): Promise<OperationResult | null> {
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
          id: recipeIngredientsTable.ingredientId,
        });

      return ingredient;
    } catch (err) {
      console.error("Failed to create recipe-ingredient relationship:", err);
      throw new DatabaseError("RecipeIngredientsRepository.create", err);
    }
  }

  async delete(
    recipeId: string,
    ingredientId: string,
    tx?: Database
  ): Promise<OperationResult | null> {
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
        .returning({
          id: recipeIngredientsTable.ingredientId,
        });

      return removedIngredient;
    } catch (err) {
      console.error("Failed to delete ingredient from recipe:", err);
      throw new DatabaseError("RecipeIngredientsRepository.delete", err);
    }
  }
}
