/**
 * IngredientService - Business logic layer for ingredient management
 *
 * This service class orchestrates ingredient-related operations by coordinating between
 * the IngredientRepository, RecipeRepository, and RecipeService. It enforces business rules
 * such as ingredient uniqueness validation, data integrity through Zod validation, and
 * cascading updates to dependent recipes when an ingredient is modified.
 *
 * Features:
 * - Ingredient creation with duplicate prevention and validation
 * - Ingredient updates with transactional consistency across related recipes
 * - Full CRUD operations delegated to the repository layer
 * - Ingredient analytics aggregation
 * - Automatic recipe recalculation when ingredient data changes
 */
import { IIngredientService } from "@/types/services";
import { IngredientRepository } from "../repositories/ingredientRepository";
import { Ingredient, IngredientToDisplay } from "@/shemas/recipe";
import { checkIfIngredientExists } from "@/db/helpers";
import { zodValidateIngredientBeforeAddItToDatabase } from "./validationService";
import { RecipeRepository } from "../repositories/recipeRepository";
import { transformIngredientToDB } from "../utils/transformers";
import { RecipeService } from "./recipeService";
import { db } from "@/db/db";
import { Database } from "@/db/schema";
import { IngredientAnalytics } from "@/types/repositories";
import { ConflictError } from "../utils/errors";

export class IngredientService implements IIngredientService {
  private ingredientRepository: IngredientRepository;
  private recipeRepository: RecipeRepository;
  private recipeService: RecipeService;

  private currentUserId: string;

  constructor(userId: string) {
    this.ingredientRepository = new IngredientRepository();
    this.recipeRepository = new RecipeRepository();
    this.recipeService = new RecipeService(userId);
    this.currentUserId = userId;
  }

  async findAll(userId: string): Promise<IngredientToDisplay[] | undefined> {
    const ingredients = await this.ingredientRepository.findAll(userId);
    return ingredients;
  }

  async findById(id: string): Promise<IngredientToDisplay | undefined> {
    const ingredient = await this.ingredientRepository.findById(id);

    return ingredient;
  }

  async create(
    ingredient: Ingredient
  ): Promise<{ ingredientId: string } | undefined> {
    const ingredientExists = await checkIfIngredientExists(
      ingredient.name,
      ingredient.userId
    );
    const validatedIngredient =
      zodValidateIngredientBeforeAddItToDatabase(ingredient);
    const DBIngredient = transformIngredientToDB(validatedIngredient);

    if (!ingredientExists && DBIngredient) {
      const ingredientId = await this.ingredientRepository.create(DBIngredient);

      return ingredientId;
    } else {
      if (ingredientExists) {
        throw new ConflictError("Ingredient", "name");
      }
    }
  }

  async update(
    ingredient: Ingredient
  ): Promise<{ ingredientId: string } | undefined> {
    const validatedIngredient =
      zodValidateIngredientBeforeAddItToDatabase(ingredient);
    const DBIngredient = transformIngredientToDB(validatedIngredient);

    const transactionResponse = await db.transaction(async (tx: Database) => {
      const ingredientId = await this.ingredientRepository.update(
        DBIngredient,
        tx
      );

      const recipes = ingredientId
        ? await this.recipeRepository.findAllByIngredientId(
            ingredientId?.ingredientId
          )
        : [];

      if (recipes) {
        for (const dbRecipe of recipes) {
          if (DBIngredient) {
            await this.recipeService.updateRecipeAfterIngredientsChange(
              dbRecipe,
              DBIngredient,
              tx
            );
          }
        }
      }
      return ingredientId;
    });
    return transactionResponse;
  }

  async delete(id: string): Promise<void> {
    await this.ingredientRepository.delete(id);
  }

  async getIngredientAnalytics(
    userId: string
  ): Promise<IngredientAnalytics | undefined> {
    const ingredientAnalytics =
      await this.ingredientRepository.getIngredientAnalytics(userId);

    return ingredientAnalytics;
  }
}
