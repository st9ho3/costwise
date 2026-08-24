import type { Recipe, RecipeIngredients } from "@costwise/shared/recipe";
import type {
  RecipeWithQuery,
  Metadata,
} from "@costwise/shared/specialTypes";
import type {
  CreateRequest,
  CreateResponse,
} from "@costwise/domain/types/services";
import type {
  RecipeAnalytics,
  CategoryAnalytics,
  MarginHighlights,
} from "@costwise/domain/types/repositories";
import { NotFoundError } from "@costwise/domain/utils/errors";
import type { Deps, RecipeServiceLike } from "../app";
import { FakeState, getState, requireOwnedIndex } from "./state";

/** The row shape the detail query returns — scalars stringified, no ingredients. */
const toRecipeDetail = (recipe: Recipe): RecipeWithQuery => ({
  id: recipe.id,
  title: recipe.title,
  totalCost: String(recipe.totalCost),
  createdBy: recipe.createdBy,
  dateCreated: recipe.dateCreated.toISOString(),
  category: recipe.category,
  tax: String(recipe.tax),
  imgPath: recipe.imgPath,
  sellingPrice: String(recipe.sellingPrice ?? 0),
  profitMargin: String(recipe.profitMargin ?? 0),
  foodCost: String(recipe.foodCost),
  userId: recipe.userId,
  recipeIngredients: [],
});

export const seedRecipe = (
  deps: Deps,
  userId: string,
  recipe?: Partial<Recipe>,
  detail?: Partial<RecipeWithQuery>,
) => {
  const r: Recipe = {
    id: recipe?.id ?? "11111111-1111-1111-1111-111111111111",
    title: recipe?.title ?? "Test Recipe",
    totalCost: recipe?.totalCost ?? 10,
    createdBy: recipe?.createdBy ?? userId,
    dateCreated: recipe?.dateCreated ?? new Date(),
    category: recipe?.category ?? "main",
    tax: recipe?.tax ?? 0.1,
    imgPath: recipe?.imgPath ?? "https://example.com/r1.jpg",
    sellingPrice: recipe?.sellingPrice ?? 15,
    profitMargin: recipe?.profitMargin ?? 5,
    foodCost: recipe?.foodCost ?? 8,
    userId,
    ...recipe,
  };
  const d: RecipeWithQuery = { ...toRecipeDetail(r), ...detail };
  const state = getState(deps);
  state.recipes.push(r);
  state.recipeDetails.set(r.id, d);
  return r;
};

export const makeRecipeServiceFor =
  (state: FakeState) =>
  (userId: string): RecipeServiceLike => ({
    async findAll(uId: string, metadata: Metadata) {
      const userRecipes = state.recipes.filter((r) => r.userId === uId);
      return {
        recipes: userRecipes,
        count: { count: userRecipes.length },
      };
    },
    async findById(id: string) {
      const detail = state.recipeDetails.get(id);
      if (!detail || detail.userId !== userId) {
        throw new NotFoundError("Recipe", id);
      }
      return detail;
    },
    async create(request: CreateRequest): Promise<CreateResponse> {
      state.recipes.push(request.recipe);
      state.recipeDetails.set(request.recipe.id, {
        ...toRecipeDetail(request.recipe),
        recipeIngredients: (request.addedIngredients || []).map((ing, idx) => ({
          id: idx + 1,
          recipeId: request.recipe.id,
          ingredientId: ing.ingredientId,
          quantity: String(ing.quantity),
          ingredients: {
            id: ing.ingredientId,
            name: ing.name,
            unit: ing.unit,
            unitPrice: String(ing.unitPrice),
            quantity: String(ing.quantity),
            icon: null,
            usage: "",
          },
        })),
      });
      return { recipe: request.recipe.id };
    },
    async update(
      id: string,
      recipe: Recipe,
      _removed: RecipeIngredients[],
      _added: RecipeIngredients[],
    ) {
      const idx = requireOwnedIndex(state.recipes, id, userId, "Recipe");
      state.recipes[idx] = recipe;
      return { id };
    },
    async delete(id: string) {
      const idx = requireOwnedIndex(state.recipes, id, userId, "Recipe");
      state.recipes.splice(idx, 1);
      state.recipeDetails.delete(id);
      return { id };
    },
    async getRecipesAnalytics(uId: string): Promise<RecipeAnalytics> {
      const userRecipes = state.recipes.filter((r) => r.userId === uId);
      return {
        avgProfitMargin: "25",
        avgFoodCost: "15",
        totalRecipes: userRecipes.length,
      };
    },
    async getCategoryAnalytics(uId: string): Promise<CategoryAnalytics[]> {
      return [
        { category: "starter", count: 1, avgFoodCost: "10" },
        { category: "main", count: 2, avgFoodCost: "20" },
      ];
    },
    async getMarginHighlights(uId: string): Promise<MarginHighlights> {
      const userRecipes = state.recipes.filter((r) => r.userId === uId);
      return {
        topPerformers: userRecipes,
        attentionNeeded: [],
      };
    },
  });
