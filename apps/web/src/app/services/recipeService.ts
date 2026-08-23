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
import {
  DBIngredient,
  DBRecipe,
  Recipe,
  RecipeIngredients,
  RecipeIngredientsSchema,
  RecipeSchema,
} from "@costwise/shared/recipe";
import {
  CreateRequest,
  CreateResponse,
  IRecipeService,
} from "@/types/services";
import { db } from "@costwise/db/db";
import {
  RecipeIngredientsRepository,
  RecipeRepository,
} from "../repositories/recipeRepository";
import { IngredientRepository } from "../repositories/ingredientRepository";
import { validateComplexEntity } from "./validationService";
import { Metadata, RecipeWithQuery } from "@/types/specialTypes";
import { calculateProfitMargin, getTotalPrice } from "../utils/pricing";
import {
  transformRecipeFromDB,
  transformRecipeIngredentFromDB,
  transformRecipeToDB,
} from "../utils/transformers";
import { Database } from "@costwise/db/schema";
import {
  RecipeAnalytics,
  CategoryAnalytics,
  MarginHighlights,
} from "@/types/repositories";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/errors";

export class RecipeService implements IRecipeService {
  private recipeRepository: RecipeRepository;
  private recipeIngredientsRepository: RecipeIngredientsRepository;
  private ingredientRepository: IngredientRepository;
  private currentUserID: string | undefined;

  constructor(currentUserID: string) {
    this.recipeRepository = new RecipeRepository();
    this.recipeIngredientsRepository = new RecipeIngredientsRepository();
    this.ingredientRepository = new IngredientRepository();
    this.currentUserID = currentUserID;
  }

  async findAll(
    userId: string,
    metadata: Metadata
  ): Promise<{ recipes: Recipe[]; count: { count: number } } | undefined> {
    if (userId !== this.currentUserID) {
      throw new ForbiddenError("Recipes", "All Recipes", this.currentUserID);
    }
    const result = await this.recipeRepository.findAll(userId, metadata);

    return result;
  }

  async findById(id: string): Promise<RecipeWithQuery | undefined> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new NotFoundError("Recipe", id);
    }
    if (recipe?.userId !== this.currentUserID) {
      throw new ForbiddenError("Recipe", recipe.id, this.currentUserID);
    }
    return recipe;
  }

  async create(
    requestData: CreateRequest
  ): Promise<CreateResponse | undefined> {
    if (requestData.recipe.userId !== this.currentUserID) {
      throw new ForbiddenError(
        "Recipe",
        requestData.recipe.id,
        this.currentUserID
      );
    }

    const exists = await this.recipeRepository.findByName(
      requestData.recipe.title,
      this.currentUserID
    );
    if (exists) {
      throw new ConflictError("Recipe", "name");
    }

    const { validatedEntity, validatedAddedItems } = validateComplexEntity(
      requestData.recipe,
      RecipeSchema,
      RecipeIngredientsSchema,
      "dateCreated",
      requestData.addedIngredients,
      requestData.removedIngredients
    );

    if (!validatedAddedItems || validatedAddedItems.length === 0) {
      throw new ValidationError([
        {
          field: "Recipe Ingredients",
          message: "Please add ingredients",
        },
      ]);
    }

    const transactionResponse = await db.transaction(async (tx) => {
      const transformedRecipe = transformRecipeToDB(validatedEntity);
      const recipeResponse = await this.recipeRepository.create(
        transformedRecipe,
        tx
      );

      await Promise.all(
        validatedAddedItems.map(async (ingredient) => {
          const newIngredient = await this.recipeIngredientsRepository.create(
            ingredient,
            validatedEntity.userId,
            tx
          );
          await this.ingredientRepository.updateUsage(
            ingredient.ingredientId,
            tx,
            "+"
          );
          return newIngredient;
        })
      );

      return {
        recipe: recipeResponse,
      };
    });

    return transactionResponse;
  }

  async update(
    id: string,
    recipe: Recipe,
    removedIngredients: RecipeIngredients[],
    addedIngredients: RecipeIngredients[]
  ): Promise<{ id: string } | undefined> {
    if (recipe.userId !== this.currentUserID) {
      throw new ForbiddenError("Recipe", recipe.id, this.currentUserID);
    }
    const exists = await this.recipeRepository.findByName(
      recipe.title,
      this.currentUserID
    );
    if (exists && exists.id !== recipe.id) {
      throw new ConflictError("Recipe", "name");
    }

    const { validatedEntity, validatedAddedItems, validatedRemovedItems } =
      validateComplexEntity(
        recipe,
        RecipeSchema,
        RecipeIngredientsSchema,
        "dateCreated",
        addedIngredients,
        removedIngredients
      );

    const updateResponse = await db.transaction(async (tx) => {
      const updateRecipeResponse = await this.recipeRepository.update(
        id,
        validatedEntity
      );

      if (validatedRemovedItems && validatedRemovedItems.length > 0) {
        await Promise.all(
          validatedRemovedItems.map(async (ingredient: RecipeIngredients) => {
            await this.recipeIngredientsRepository.delete(
              ingredient.recipeId,
              ingredient.ingredientId,
              tx
            );
            await this.ingredientRepository.updateUsage(
              ingredient.ingredientId,
              tx,
              "-"
            );
          })
        );
      }

      if (validatedAddedItems && validatedAddedItems.length > 0) {
        await Promise.all(
          validatedAddedItems.map(async (ingredient: RecipeIngredients) => {
            await this.recipeIngredientsRepository.create(
              ingredient,
              validatedEntity.userId,
              tx
            );
            await this.ingredientRepository.updateUsage(
              ingredient.ingredientId,
              tx,
              "+"
            );
          })
        );
      }
      return updateRecipeResponse;
    });

    return updateResponse;
  }

  async delete(id: string): Promise<{ id: string } | undefined> {
    const recipe = await this.recipeRepository.findById(id);

    if (!recipe) {
      throw new NotFoundError("Recipe", id);
    }
    if (recipe.userId !== this.currentUserID) {
      throw new ForbiddenError("Recipe", id, this.currentUserID);
    }

    const totalDeletion = await db.transaction(async (tx) => {
      const deleteResponse = await this.recipeRepository.delete(id, tx);
      if (recipe?.recipeIngredients) {
        await Promise.all(
          recipe?.recipeIngredients.map(async (ingredient) => {
            await this.ingredientRepository.updateUsage(
              ingredient.ingredientId,
              tx,
              "-"
            );
          })
        );
      }

      return deleteResponse;
    });

    return totalDeletion;
  }

  async updateRecipeAfterIngredientsChange(
    dbRecipe: DBRecipe,
    dbIngredient: DBIngredient,
    tx: Database
  ): Promise<void> {
    const queredRecipe = await this.recipeRepository.findById(dbRecipe.id);

    const dbIngredients = queredRecipe?.recipeIngredients.map(
      (ingredient) => ingredient
    );
    const ingredients = dbIngredients?.map((ing) =>
      transformRecipeIngredentFromDB(ing)
    );
    const updatedIngredients = ingredients?.map((ingredient) =>
      ingredient.ingredientId === dbIngredient.id
        ? { ...ingredient, unitPrice: Number(dbIngredient.unitPrice) }
        : ingredient
    );

    const recipe = transformRecipeFromDB(dbRecipe);
    const cost = updatedIngredients && getTotalPrice(updatedIngredients);
    const tax = recipe.tax;
    const price = recipe.sellingPrice ? recipe.sellingPrice : 1;
    const margin = cost && calculateProfitMargin(cost, price, tax);

    const updatedRecipe = {
      ...recipe,
      totalCost: cost ? cost : 0,
      profitMargin: margin,
    };

    await this.recipeRepository.update(recipe.id, updatedRecipe, tx);
  }

  async getRecipesAnalytics(
    userId: string
  ): Promise<RecipeAnalytics | undefined> {
    if (userId !== this.currentUserID) {
      throw new ForbiddenError("Recipe", "Analytics", this.currentUserID);
    }
    const recipeAnalytics = await this.recipeRepository.getRecipesAnalytics(userId);
    return recipeAnalytics;
  }

  async getCategoryAnalytics(userId: string): Promise<CategoryAnalytics[]> {
    if (userId !== this.currentUserID) {
      throw new ForbiddenError("Recipe", "CategoryAnalytics", this.currentUserID);
    }
    return this.recipeRepository.getCategoryAnalytics(userId);
  }

  async getMarginHighlights(userId: string): Promise<MarginHighlights> {
    if (userId !== this.currentUserID) {
      throw new ForbiddenError("Recipe", "MarginHighlights", this.currentUserID);
    }
    return this.recipeRepository.getMarginHighlights(userId);
  }
}
