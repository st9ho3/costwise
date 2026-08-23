import {
  Recipe,
  Ingredient,
  RecipeIngredients,
  DBRecipe,
  DBIngredient,
  IngredientToDisplay,
  Supplier,
} from "@costwise/shared/recipe";
import { Metadata, RecipeWithQuery } from "@costwise/shared/specialTypes";
import { Database } from "@costwise/db/schema";
import {
  RecipeAnalytics,
  IngredientAnalytics,
  OperationResult,
  CategoryAnalytics,
  MarginHighlights,
  HighImpactIngredient,
} from "./repositories";
import { SupplierUpdatePayload } from "@costwise/shared/uiTypes";

export interface CreateResponse {
  recipe: string | undefined;
}

export interface CreateRequest {
  recipe: Recipe;
  addedIngredients: RecipeIngredients[];
  removedIngredients: RecipeIngredients[];
}

export interface IRecipeService {
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<{ recipes: Recipe[]; count: { count: number } } | undefined>;
  findById(id: string): Promise<RecipeWithQuery | undefined>;
  create(request: CreateRequest): Promise<CreateResponse | undefined>;
  update(
    id: string,
    recipe: Recipe,
    removedIngredients: RecipeIngredients[] | undefined,
    addedIngredients: RecipeIngredients[] | undefined
  ): Promise<OperationResult | undefined>;
  delete(id: string): Promise<OperationResult | undefined>;

  updateRecipeAfterIngredientsChange(
    recipe: DBRecipe,
    dbIngredient: DBIngredient,
    tx?: Database
  ): Promise<void>;
  getRecipesAnalytics(userId: string): Promise<RecipeAnalytics | undefined>;
  getCategoryAnalytics(userId: string): Promise<CategoryAnalytics[]>;
  getMarginHighlights(userId: string): Promise<MarginHighlights>;
}

export interface IIngredientService {
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<
    { ingredients: IngredientToDisplay[]; count: { count: number } } | undefined
  >;
  findById(id: string): Promise<IngredientToDisplay | undefined>;
  create(ingredient: Ingredient): Promise<OperationResult | undefined>;
  update(ingredient: Ingredient): Promise<OperationResult | undefined>;
  delete(id: string): Promise<void>;

  getIngredientAnalytics(
    userId: string
  ): Promise<IngredientAnalytics | undefined>;
  getHighImpactIngredients(
    userId: string,
    limit?: number
  ): Promise<HighImpactIngredient[]>;
}

export interface ISearchService {
  findRecipe(searchTerm: string, userId: string): Promise<Recipe[] | undefined>;
  findIngredient(
    searchTerm: string,
    userId: string
  ): Promise<IngredientToDisplay[] | undefined>;
}

export interface ISupplierService {
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<{ suppliers: Supplier[]; count: { count: number } } | undefined>;
  findById(supplierId: string): Promise<Supplier | undefined>;
  create(supplier: SupplierUpdatePayload): Promise<OperationResult | undefined>;
  update(supplier: SupplierUpdatePayload): Promise<OperationResult | undefined>;
  delete(supplierId: string): Promise<OperationResult | undefined>;
}
