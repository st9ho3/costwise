/**
 * RecipeService - Business logic layer for recipe management
 * 
 * This service class handles complex recipe operations by coordinating between multiple repositories
 * (RecipeRepository, RecipeIngredientsRepository, and IngredientRepository). It ensures data
 * consistency through database transactions and enforces business rules for recipe creation,
 * updates, and deletion—including cascading effects on ingredient usage counts and automatic
 * recalculation of pricing metrics when underlying ingredient costs change.
 * 
 * Features:
 * - Transactional recipe creation with ingredient assignment and usage tracking
 * - Atomic recipe updates supporting added/removed ingredients with validation
 * - Cascading ingredient usage count adjustments on recipe changes
 * - Automatic profit margin and cost recalculation when ingredient prices are updated
 * - Full CRUD operations with data validation
 * - Recipe analytics aggregation for user dashboards
 */
import { DBIngredient, DBRecipe, Recipe, RecipeIngredients } from "@/shemas/recipe";
import { CreateRequest, CreateResponse, IRecipeService } from "@/types/services";
import { db } from "@/db/db";
import { RecipeIngredientsRepository, RecipeRepository } from "../repositories/recipeRepository";
import { IngredientRepository } from "../repositories/ingredientRepository";
import { zodValidateDataBeforeAddThemToDatabase } from "./services";
import { RecipeUpdatePayload } from "@/types/context";
import { RecipeWithQuery } from "@/types/specialTypes";
import { calculateProfitMargin, getTotalPrice, transformRecipeFromDB, transformRecipeIngredentFromDB, transformRecipeToDB } from "./helpers";
import { Database } from "@/db/schema";
import { RecipeAnalytics } from "@/types/repositories";
import { checkIfRecipeExists } from "@/db/helpers";


export class RecipeService implements IRecipeService {

    private recipeRepository: RecipeRepository
    private recipeIngredientsRepository: RecipeIngredientsRepository
    private ingredientRepository: IngredientRepository
    

    constructor() {
        this.recipeRepository = new RecipeRepository()
        this.recipeIngredientsRepository = new RecipeIngredientsRepository()
        this.ingredientRepository = new IngredientRepository()
        
    }

    async findAll(userId: string): Promise<Recipe[] | undefined> {
        const recipes = await this.recipeRepository.findAll(userId)
        return recipes
    }

    async findById(id: string): Promise< RecipeWithQuery | undefined> {
        
        try {
            const recipe = await this.recipeRepository.findById(id)
            return recipe
        }catch(err) {
            
            throw new Error(`${err}`) 
        }
    }

    async create(requestData: CreateRequest): Promise<CreateResponse | undefined> {
        
        const recipeExists = await checkIfRecipeExists(requestData.recipe.title, requestData.recipe.userId)
        const { validatedRecipe, validatedRecipeAddedIngredients } = zodValidateDataBeforeAddThemToDatabase(requestData)
        
        if (validatedRecipeAddedIngredients.length === 0) {
            throw Error("Ingredients required in order to create a recipe.")
        }
        
        if (recipeExists) {
            throw new Error("Recipe already exists")
        }
        
        try {
            const transactionResponse = await db.transaction(async (tx) => {
                
                const transformedRecipe = transformRecipeToDB(validatedRecipe);
                const recipeResponse = await this.recipeRepository.create(transformedRecipe, tx);

                    await Promise.all(
                    validatedRecipeAddedIngredients.map(async (ingredient) => {
                        console.log("Iteraye ingredients ")
                        const newIngredient = await this.recipeIngredientsRepository.create(ingredient, validatedRecipe.userId, tx);
                        await this.ingredientRepository.updateUsage(ingredient.ingredientId, tx, "+");
                        return newIngredient;
                    })
                );
                

                return {
                    recipe: recipeResponse,
                };
            });
            
            return transactionResponse;

        } catch (err) {
            console.error(`Transaction failed in RecipeService.create: ${err}`);
  
        }
    }

    async update(id: string, recipe: Recipe, removedIngredients: RecipeIngredients[] , addedIngredients: RecipeIngredients[]): Promise<{ id: string; } | undefined> {
        const request: RecipeUpdatePayload = {
            recipe: recipe,
            removedIngredients: removedIngredients,
            addedIngredients: addedIngredients
        }
        const {validatedRecipe, validatedRecipeAddedIngredients, validatedRecipeRemovedIngredients} = zodValidateDataBeforeAddThemToDatabase(request)

            const updateResponse = await db
            .transaction(async (tx) => {
                const updateRecipeResponse = await this.recipeRepository.update(id, validatedRecipe)
        
                    if (validatedRecipeRemovedIngredients && validatedRecipeRemovedIngredients.length > 0) {
                        await Promise.all(validatedRecipeRemovedIngredients.map(async (ingredient: RecipeIngredients) => {
                            await this.recipeIngredientsRepository.delete(ingredient.recipeId, ingredient.ingredientId, tx)
                            await this.ingredientRepository.updateUsage(ingredient.ingredientId, tx, "-");
                    }));
                    }
        
                    if (validatedRecipeAddedIngredients && validatedRecipeAddedIngredients.length > 0) {
                        await Promise.all(validatedRecipeAddedIngredients.map(async (ingredient: RecipeIngredients) => {
                            await this.recipeIngredientsRepository.create(ingredient, validatedRecipe.userId, tx)
                            await this.ingredientRepository.updateUsage(ingredient.ingredientId, tx, "+")
                        }));
                    }
                    return updateRecipeResponse
                    }) 
                    
                    return updateResponse
    }

    async delete(id: string): Promise<{ id: string; } | undefined> {
    
      const recipe = await this.recipeRepository.findById(id) 

      const totalDeletion = await db
      .transaction(async (tx) => {

        const deleteResponse = await this.recipeRepository.delete(id, tx)
        if (recipe?.recipeIngredients) {
            await Promise.all(recipe?.recipeIngredients.map(async(ingredient) => {
                await this.ingredientRepository.updateUsage(ingredient.ingredientId, tx, "-")
            }))
        }
        
        
        return deleteResponse
      })
      
      return totalDeletion


      
    }

    async updateRecipeAfterIngredientsChange(dbRecipe: DBRecipe, dbIngredient: DBIngredient, tx: Database): Promise<void> {
        
        const queredRecipe = await this.recipeRepository.findById(dbRecipe.id)
        
        const dbIngredients = queredRecipe?.recipeIngredients.map((ingredient) => ingredient)
        const ingredients = dbIngredients?.map((ing) => transformRecipeIngredentFromDB(ing))
        const updatedIngredients = ingredients?.map((ingredient) =>  ingredient.ingredientId === dbIngredient.id ? {...ingredient, unitPrice: Number(dbIngredient.unitPrice)} : ingredient)

        const recipe = transformRecipeFromDB(dbRecipe)
        const cost = updatedIngredients && getTotalPrice(updatedIngredients)
        const tax = recipe.tax
        const price =recipe.sellingPrice ? recipe.sellingPrice : 1
        const margin = cost && calculateProfitMargin(cost, price, tax)
        console.log("margin: ", margin)
        const updatedRecipe = 
        {
            ...recipe,
            totalCost: cost ? cost : 0 ,
            profitMargin: margin 
        }

        this.recipeRepository.update(recipe.id, updatedRecipe, tx)
    }

    async getRecipesAnalytics(userId: string): Promise<RecipeAnalytics | undefined> {
        
        try {
            const recipeAnalytics = this.recipeRepository.getRecipesAnalytics(userId)

            return recipeAnalytics
            
        }catch(err) {

            throw new Error(`RecipeService: Something happened on our side. ${err}`)
        }
    }
}




