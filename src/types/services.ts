import { Recipe, Ingredient, RecipeIngredients, DBRecipe, DBIngredient, IngredientToDisplay, Supplier } from '@/shemas/recipe';
import { RecipeWithQuery } from './specialTypes';
import { Database } from '@/db/schema';
import { RecipeAnalytics, IngredientAnalytics } from './repositories';

export interface CreateResponse {
    recipe: string | undefined;
    }

export interface CreateRequest {
    recipe: Recipe,
    addedIngredients: RecipeIngredients[]
}

export interface IRecipeService {
    findAll(userId: string): Promise<Recipe[] | undefined>
    findById(id: string): Promise< RecipeWithQuery | undefined>
    create(request: CreateRequest): Promise<CreateResponse | undefined>
    update(id: string, recipe: Recipe, removedIngredients: RecipeIngredients[] | undefined, addedIngredients: RecipeIngredients[] | undefined): Promise<{id: string} | undefined>
    delete(id: string): Promise<{id: string} | undefined>

    updateRecipeAfterIngredientsChange(recipe: DBRecipe, dbIngredient: DBIngredient, tx?: Database): Promise<void>
    getRecipesAnalytics(userId: string): Promise<RecipeAnalytics | undefined>;
}

export interface IIngredientService {
    findAll(userId: string): Promise<IngredientToDisplay[] | undefined>
    findById(id: string): Promise<IngredientToDisplay | undefined>
    create(ingredient: Ingredient): Promise<{ingredientId: string} | undefined>
    update(ingredient: Ingredient): Promise<{ingredientId: string} | undefined>
    delete(id: string): Promise<void>

    getIngredientAnalytics(userId: string): Promise<IngredientAnalytics | undefined>;
}

export interface ISearchService {
  findRecipe(searchTerm: string, userId: string) : Promise<Recipe[] | undefined>;
  findIngredient(searchTerm: string, userId: string) : Promise<Ingredient[] | undefined>;
}

export interface ISupplierService {
    findAll(supplierId: string): Promise<Supplier[] | undefined>
    findById(supplierId: string): Promise<Supplier | undefined>
    create(supplier: Supplier): Promise<{supplierId: string} | undefined>
    update(supplier: Supplier): Promise<{supplierId: string} | undefined>
    delete(supplierId: string): Promise<void>
}