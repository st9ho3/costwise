import { Database } from "@/db/schema";
import {
  Recipe,
  RecipeIngredients,
  DBIngredient,
  DBRecipe,
  IngredientToDisplay,
} from "@/shemas/recipe";
import {
  DBSupplierAddress,
  DBSupplierFinancialData,
  DestructuredSupplier,
  Metadata,
  RawDBSupplier,
  RecipeWithQuery,
} from "./specialTypes";

export interface RecipeAnalytics {
  avgProfitMargin: string | null;
  avgFoodCost: string | null;
  totalRecipes: number;
}

export interface IngredientAnalytics {
  totalIngredients: number;
}

export interface OperationResult {
  id: string;
}

export interface IRecipeRepository {
  findById(id: string): Promise<RecipeWithQuery | undefined>;
  findAllByIngredientId(id: string): Promise<DBRecipe[] | undefined>;
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<{ recipes: Recipe[]; count: { count: number } } | undefined>;
  create(recipe: DBRecipe, tx: Database): Promise<string | undefined>;
  update(
    id: string,
    recipe: Recipe,
    tx?: Database
  ): Promise<OperationResult | undefined>;
  delete(id: string, tx: Database): Promise<OperationResult | undefined>;

  getRecipesAnalytics(userId: string): Promise<RecipeAnalytics | undefined>;
  findByName(
    recipesName: string,
    userId: string | undefined
  ): Promise<{ name: string; id: string } | undefined>;
}

export interface IRecipeIngredientsRepository {
  create(
    recipeIngredient: RecipeIngredients,
    userId: string,
    tx: Database
  ): Promise<OperationResult | null>;
  delete(
    recipeId: string,
    ingredientId: string,
    tx?: Database
  ): Promise<OperationResult | null>;
}

export interface IIngredientRepository {
  findById(id: string): Promise<IngredientToDisplay | undefined>;
  findByName(
    ingredientsName: string,
    userId: string
  ): Promise<{ name: string; id: string } | undefined>;
  findAll(userId: string): Promise<IngredientToDisplay[] | undefined>;
  create(
    ingredient: DBIngredient,
    tx: Database
  ): Promise<OperationResult | undefined>;
  update(
    ingredient: DBIngredient,
    tx?: Database
  ): Promise<OperationResult | undefined>;
  delete(id: string): Promise<OperationResult | undefined>;

  updateUsage(id: string, tx: Database, action: "+" | "-"): Promise<undefined>;
  getIngredientAnalytics(
    userId: string
  ): Promise<IngredientAnalytics | undefined>;
}

export interface ISupplierRepository {
  findById(supplierId: string): Promise<RawDBSupplier | undefined>;
  findByName(
    suppliersName: string,
    userId: string | undefined
  ): Promise<{ name: string; id: string } | undefined>;
  findAll(userId: string): Promise<RawDBSupplier[] | undefined>;
  create(
    supplier: DestructuredSupplier,
    tx: Database
  ): Promise<OperationResult | undefined>;
  update(
    supplierId: string,
    supplier: DestructuredSupplier,
    tx: Database
  ): Promise<OperationResult | undefined>;
  delete(
    supplierId: string,
    db: Database
  ): Promise<OperationResult | undefined>;
}

export interface IAddressesRepository {
  create(
    address: DBSupplierAddress,
    tx: Database,
    suppliersId: string
  ): Promise<OperationResult | undefined>;
  update(
    supplierId: string,
    address: DBSupplierAddress,
    tx: Database
  ): Promise<OperationResult | undefined>;
}
export interface ISupplierFinancialDataRepository {
  create(
    finData: DBSupplierFinancialData,
    tx: Database,
    suppliersId: string
  ): Promise<OperationResult | undefined>;
  update(
    supplierId: string,
    finData: DBSupplierFinancialData,
    tx: Database
  ): Promise<OperationResult | undefined>;
}

export interface ISuppliersCategoryRepository {
  create(category: string, tx: Database, suppliersId: string): Promise<void>;
  delete(category: string, tx: Database, suppliersId: string): Promise<void>;
}

export interface ISearchRepository {
  findRecipe(): Promise<DBRecipe[] | undefined>;
  findIngredient(): Promise<DBIngredient[] | undefined>;
}
