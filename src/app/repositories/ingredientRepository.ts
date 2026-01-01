/**
 * IngredientRepository - Data access layer for ingredient management
 *
 * This repository class provides CRUD operations and analytics for ingredients in the recipe system.
 * It implements the IIngredientRepository interface and handles all database interactions
 * for ingredient-related operations including creation, retrieval, updates, deletion,
 * usage tracking, and analytics generation.
 *
 * Features:
 * - Full CRUD operations for ingredients
 * - User-scoped ingredient queries
 * - Usage tracking with increment/decrement operations
 * - Ingredient analytics and statistics
 * - Transaction support for atomic operations
 */

import { DBIngredient, IngredientToDisplay } from "@/shemas/recipe";
import {
  IIngredientRepository,
  IngredientAnalytics,
} from "@/types/repositories";
import { db } from "@/db/db";
import { categories, Database, ingredientsTable } from "@/db/schema";
import { transformIngredientFromDB } from "../utils/transformers";
import { and, countDistinct, eq, sql } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class IngredientRepository implements IIngredientRepository {
  async findAll(userId: string): Promise<IngredientToDisplay[] | undefined> {
    try {
      const dbIngredients = await db
        .select({ ingredientsTable, categories })
        .from(ingredientsTable)
        .innerJoin(categories, eq(ingredientsTable.category, categories.id))
        .where(eq(ingredientsTable.userId, userId));

      const ingredients = dbIngredients.map((dbIngredient) =>
        transformIngredientFromDB(
          dbIngredient.ingredientsTable as DBIngredient,
          dbIngredient.categories.category
        )
      );
      return ingredients;
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
      throw new DatabaseError("IngredientRepository.findAll", err);
    }
  }

  async findById(id: string): Promise<IngredientToDisplay | undefined> {
    try {
      const [dbIngredient] = await db
        .select()
        .from(ingredientsTable)
        .innerJoin(categories, eq(ingredientsTable.category, categories.id))
        .where(eq(ingredientsTable.id, id));

      if (!dbIngredient) {
        return undefined;
      }
      const ingredient = transformIngredientFromDB(
        dbIngredient.ingredients as DBIngredient,
        dbIngredient.categories.category
      );
      return ingredient;
    } catch (err) {
      console.error("Failed to fetch ingredient by ID:", err);
      throw new DatabaseError("IngredientRepository.findById", err);
    }
  }

  async create(
    ingredient: DBIngredient
  ): Promise<{ ingredientId: string } | undefined> {
    try {
      const [ingredientID] = await db
        .insert(ingredientsTable)
        .values(ingredient)
        .returning({
          ingredientId: ingredientsTable.id,
        });

      return ingredientID;
    } catch (err) {
      console.error("Failed to create ingredient:", err);
      throw new DatabaseError("IngredientRepository.create", err);
    }
  }

  async update(
    ingredient: DBIngredient,
    tx?: Database
  ): Promise<{ ingredientId: string } | undefined> {
    const dbConnection = tx || db;

    try {
      const [ingredientId] = await dbConnection
        .update(ingredientsTable)
        .set(ingredient)
        .where(eq(ingredientsTable.id, ingredient.id))
        .returning({
          ingredientId: ingredientsTable.id,
        });

      return ingredientId;
    } catch (err) {
      console.error("Failed to update ingredient:", err);
      throw new DatabaseError("IngredientRepository.update", err);
    }
  }

  async delete(id: string): Promise<{ ingredientId: string } | undefined> {
    try {
      const [ingredientId] = await db
        .delete(ingredientsTable)
        .where(eq(ingredientsTable.id, id))
        .returning({
          ingredientId: ingredientsTable.id,
        });

      return ingredientId;
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
      throw new DatabaseError("IngredientRepository.delete", err);
    }
  }

  async updateUsage(
    id: string,
    tx: Database,
    action: "+" | "-"
  ): Promise<undefined> {
    try {
      await tx
        .update(ingredientsTable)
        .set({
          usage:
            action === "+"
              ? sql`${ingredientsTable.usage} + 1`
              : sql`${ingredientsTable.usage} - 1`,
        })
        .where(eq(ingredientsTable.id, id));
    } catch (err) {
      console.error("Failed to update ingredient usage:", err);
      throw new DatabaseError("IngredientRepository.updateUsage", err);
    }
  }

  async getIngredientAnalytics(
    userId: string
  ): Promise<IngredientAnalytics | undefined> {
    try {
      const [ingredientAnalytics] = await db
        .select({
          totalIngredients: countDistinct(ingredientsTable.id),
        })
        .from(ingredientsTable)
        .where(eq(ingredientsTable.userId, userId));

      return ingredientAnalytics;
    } catch (err) {
      console.error("Failed to get ingredient analytics:", err);
      throw new DatabaseError(
        "IngredientRepository.getIngredientAnalytics",
        err
      );
    }
  }

  async findByName(
    ingredientsName: string,
    userId: string
  ): Promise<{ name: string; id: string } | undefined> {
    const [result] = await db
      .select({
        name: ingredientsTable.name,
        id: ingredientsTable.id,
      })
      .from(ingredientsTable)
      .where(
        and(
          eq(ingredientsTable.userId, userId),
          eq(ingredientsTable.name, ingredientsName)
        )
      );

    return result ? result : undefined;
  }
}
