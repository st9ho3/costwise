
import { Database } from '@/db/schema';
import { Recipe, RecipeIngredients, DBIngredient, DBRecipe, IngredientToDisplay, Supplier } from '@/shemas/recipe';
import { DBSupplier, DBSupplierAddress, DBSupplierFinancialData, RecipeWithQuery } from './specialTypes';

export interface RecipeAnalytics {
  avgProfitMargin: string | null
  avgFoodCost: string | null
  totalRecipes: number
}

export interface IngredientAnalytics {
  totalIngredients: number
}

export interface IRecipeRepository {
  findById(id: string): Promise<RecipeWithQuery | undefined>;
  findAllByIngredientId(id: string): Promise<DBRecipe[] | undefined>;
  findAll(userId: string): Promise<Recipe[] | undefined>;
  create(recipe: DBRecipe, tx: Database): Promise<string | undefined>;
  update(id: string, recipe: Recipe, tx?: Database): Promise<{id: string} | undefined>;
  delete(id: string, tx: Database): Promise<{id: string} | undefined>;

  getRecipesAnalytics(userId: string): Promise<RecipeAnalytics | undefined>;
  
}

export interface IRecipeIngredientsRepository {

  create(recipeIngredient: RecipeIngredients, userId: string, tx: Database): Promise<{id: string | null} >;
  delete(recipeId: string, ingredientId: string, tx?: Database): Promise<{ingredientId: string | null} | undefined>  
}

export interface IIngredientRepository {
  findById(id: string): Promise<IngredientToDisplay | undefined>;
  findAll(userId: string): Promise<IngredientToDisplay[] | undefined>;
  create(ingredient: DBIngredient, tx: Database): Promise<{ingredientId: string} | undefined>;
  update(ingredient: DBIngredient, tx?: Database): Promise<{ingredientId: string} | undefined>;
  delete(id: string): Promise<{ingredientId: string} | undefined>;


  updateUsage(id: string, tx: Database, action: "+" | "-"): Promise<undefined>
  getIngredientAnalytics(userId: string): Promise<IngredientAnalytics | undefined>;

}

export interface ISupplierRepository {
  findById(supplierId: string): Promise<Supplier[] | undefined>;
  findAll(userId: string): Promise<Supplier[] | undefined>;
  create(supplier: DBSupplier, tx: Database): Promise<{supplierId: string} | undefined>;
  update(supplierId: string, supplier: Supplier, tx?: Database): Promise<{supplierId: string} | undefined>;
  delete(supplierId: string, db: Database): Promise<{id: string} | undefined>;
}

export interface IAddressesRepository {
  create(address: DBSupplierAddress, tx: Database, suppliersId: string): Promise<{addressId: string} | undefined>;
  update(supplierId: string, supplier: Supplier, tx?: Database): Promise<{supplierId: string} | undefined>;
}
export interface ISupplierFinancialDataRepository {
  create(finData: DBSupplierFinancialData, tx: Database, suppliersId: string): Promise<{confirmation: string} | undefined>;
  update(supplierId: string, finData: Supplier, tx?: Database): Promise<{supplierId: string} | undefined>;
}

export interface ISuppliersCategoryRepository {
  create(category: string, tx: Database, suppliersId: string): Promise<void>
  delete(category: string, tx: Database, suppliersId: string): Promise<void>
}

export interface IIngredientCategoryRepository {
  create(category: string, tx: Database, ingredientId: string): Promise<void>
  delete(ingredientId: string, tx: Database): Promise<void>
}

export interface ISearchRepository {
  findRecipe() : Promise<DBRecipe[] | undefined>;
  findIngredient() : Promise<DBIngredient[] | undefined>;
}