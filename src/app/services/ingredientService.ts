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
import { Ingredient } from "@/shemas/recipe";
import { checkIfIngredientExists } from "@/db/helpers";
import { zodValidateIngredientBeforeAddItToDatabase } from "./services";
import { RecipeRepository } from "../repositories/recipeRepository";
import { transformIngredientToDB } from "./helpers";
import { RecipeService } from "./recipeService";
import { db } from "@/db/db";
import { Database } from "@/db/schema";
import { IngredientAnalytics } from "@/types/repositories";


export class IngredientService implements IIngredientService {

    private ingredientRepository: IngredientRepository
    private recipeRepository: RecipeRepository
    private recipeService: RecipeService
    

    constructor() {
        this.ingredientRepository = new IngredientRepository()
        this.recipeRepository = new RecipeRepository()
        this.recipeService = new RecipeService()
    }

    async findAll(userId: string): Promise<Ingredient[] | undefined> {
      
      try {
        const ingredients = await this.ingredientRepository.findAll(userId)
        return ingredients
      }catch (err) {

        throw new Error(`${err}`) 
      }
    }

    async findById(id: string): Promise<Ingredient | undefined> {
      const ingredient = await this.ingredientRepository.findById(id)
     
      return ingredient
    }

    async create(ingredient: Ingredient): Promise<{ ingredientId: string; } | undefined> {
          
          const ingredientExists = await checkIfIngredientExists(ingredient.name, ingredient.userId);
          const validatedIngredient = await zodValidateIngredientBeforeAddItToDatabase(ingredient)
          const DBIngredient = validatedIngredient ? transformIngredientToDB(validatedIngredient) : undefined
          
          if (!ingredientExists && DBIngredient) {
            const ingredientId = this.ingredientRepository.create(DBIngredient)
            return ingredientId
          } else {
            console.log("Ingredient already exists or is not validated")
            throw Error("Ingredient already exists or is not validated")
          }
    }

    async update(ingredient: Ingredient): Promise<{ ingredientId: string; } | undefined> {
  const validatedIngredient = await zodValidateIngredientBeforeAddItToDatabase(ingredient);
  const DBIngredient = validatedIngredient ? transformIngredientToDB(validatedIngredient) : undefined;
      console.log("DBIngredient",DBIngredient)
  try {
    const transactionResponse = await db.transaction(async (tx: Database) => {
      const ingredientId = DBIngredient ? await this.ingredientRepository.update(DBIngredient, tx) : undefined;
      console.log("ingredientID: ", ingredientId)
      const recipes = ingredientId ? await this.recipeRepository.findAllByIngredientId(ingredientId?.ingredientId) : [];
      console.log("recipes: ", recipes)
      if (recipes) {
        for (const dbRecipe of recipes) {
          if (DBIngredient) {
              await this.recipeService.updateRecipeAfterIngredientsChange(dbRecipe, DBIngredient, tx);

          }
        }
      }
      return ingredientId;
    });
    return transactionResponse;
  } catch (err) {
    console.log(err);
  }
    }

    async delete(id: string): Promise<void> {

      await this.ingredientRepository.delete(id)

    }

    async getIngredientAnalytics(userId: string): Promise<IngredientAnalytics | undefined> {
      
      try {

        const ingredientAnalytics = this.ingredientRepository.getIngredientAnalytics(userId)

        return ingredientAnalytics

      }catch(err){
        throw new Error(`Ingredient Service: An error on our side ${err}`)
      }
    }

}