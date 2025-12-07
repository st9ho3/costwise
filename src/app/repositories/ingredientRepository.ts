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
import { IIngredientRepository, IngredientAnalytics } from "@/types/repositories";
import { db } from "@/db/db";
import { categories, Database, ingredientsTable } from "@/db/schema";
import { transformIngredientFromDB } from "../services/helpers";
import { countDistinct, eq, sql } from "drizzle-orm";

export class IngredientRepository implements IIngredientRepository {

    
    async findAll(userId: string): Promise<IngredientToDisplay[] | undefined> {
        try {
            const dbIngredients = await db
                .select({ingredientsTable, categories} )
                .from(ingredientsTable)
                .innerJoin(categories, eq(ingredientsTable.category, categories.id))
                .where(
                    eq(ingredientsTable.userId, userId)
                );
                
            const ingredients = dbIngredients.map((dbIngredient) => transformIngredientFromDB(dbIngredient.ingredientsTable as DBIngredient, dbIngredient.categories.category));
            return ingredients;
        } catch (err) {
            console.error("Failed to fetch ingredients:", err);
            throw new Error(`IngredientRepository.findAll: Failed to fetch ingredients for user ${userId}: ${err}`);
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
            const ingredient = transformIngredientFromDB(dbIngredient.ingredients as DBIngredient, dbIngredient.categories.category);
            return ingredient
        } catch (err) {
            console.error("Failed to fetch ingredient by ID:", err);
            throw new Error(`IngredientRepository.findById: Failed to fetch ingredient with ID ${id}: ${err}`);
        }
    }

  
    async create(ingredient: DBIngredient, tx: Database): Promise<{ ingredientId: string } | undefined> {
        console.log(ingredient)
        try {
            const [ingredientID] = await tx
                .insert(ingredientsTable)
                .values(ingredient)
                .returning({
                    ingredientId: ingredientsTable.id
                });

            return ingredientID;
        } catch (err) {
            console.error("Failed to create ingredient:", err);
            throw new Error(`IngredientRepository.create: Failed to create ingredient: ${err}`);
        }
    }

    async update(ingredient: DBIngredient, tx?: Database): Promise<{ ingredientId: string } | undefined> {
        const dbConnection = tx || db;

        try {
            const [ingredientId] = await dbConnection
                .update(ingredientsTable)
                .set(ingredient)
                .where(eq(ingredientsTable.id, ingredient.id))
                .returning({
                    ingredientId: ingredientsTable.id
                });

            console.log("Updated ingredient ID:", ingredientId);
            return ingredientId;
        } catch (err) {
            console.error("Failed to update ingredient:", err);
            throw new Error(`IngredientRepository.update: Failed to update ingredient with ID ${ingredient.id}: ${err}`);
        }
    }

    async delete(id: string): Promise<{ ingredientId: string } | undefined> {
        try {
            const [ingredientId] = await db
                .delete(ingredientsTable)
                .where(eq(ingredientsTable.id, id))
                .returning({
                    ingredientId: ingredientsTable.id
                });

            return ingredientId;
        } catch (err) {
            console.error("Failed to delete ingredient:", err);
            throw new Error(`IngredientRepository.delete: Failed to delete ingredient with ID ${id}: ${err}`);
        }
    }


    async updateUsage(id: string, tx: Database, action: "+" | "-"): Promise<undefined> {
        try {
            await tx
                .update(ingredientsTable)
                .set({
                    usage: action === "+" ? sql`${ingredientsTable.usage} + 1` : sql`${ingredientsTable.usage} - 1`
                })
                .where(eq(ingredientsTable.id, id));
        } catch (err) {
            console.error("Failed to update ingredient usage:", err);
            throw new Error(`IngredientRepository.updateUsage: Failed to update usage for ingredient ${id}: ${err}`);
        }
    }

    async getIngredientAnalytics(userId: string): Promise<IngredientAnalytics | undefined> {
        try {
            const [ingredientAnalytics] = await db
                .select({
                    totalIngredients: countDistinct(ingredientsTable.id)
                })
                .from(ingredientsTable)
                .where(eq(ingredientsTable.userId, userId));

            return ingredientAnalytics;
        } catch (err) {
            console.error("Failed to get ingredient analytics:", err);
            throw new Error(`IngredientRepository.getIngredientAnalytics: Failed to get analytics for user ${userId}: ${err}`);
        }
    }
}