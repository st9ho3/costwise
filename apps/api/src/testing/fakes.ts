import type { Recipe, RecipeIngredients } from "@costwise/shared/recipe";
import type { RecipeWithQuery, Metadata } from "@costwise/domain/types/specialTypes";
import type { CreateRequest, CreateResponse } from "@costwise/domain/types/services";
import { NotFoundError } from "@costwise/domain/utils/errors";
import type { Deps, RecipeServiceLike } from "../app";

export interface FakeState {
  recipes: Recipe[];
  recipeDetails: Map<string, RecipeWithQuery>;
}

export const createFakeState = (): FakeState => ({
  recipes: [],
  recipeDetails: new Map(),
});

export const seedRecipe = (
  deps: Deps,
  userId: string,
  recipe?: Partial<Recipe>,
  detail?: Partial<RecipeWithQuery>
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
  const d: RecipeWithQuery = {
    id: r.id,
    title: r.title,
    totalCost: String(r.totalCost),
    createdBy: r.createdBy,
    dateCreated: r.dateCreated.toISOString(),
    category: r.category,
    tax: String(r.tax),
    imgPath: r.imgPath,
    sellingPrice: String(r.sellingPrice ?? 0),
    profitMargin: String(r.profitMargin ?? 0),
    foodCost: String(r.foodCost),
    userId: r.userId,
    recipeIngredients: [],
    ...detail,
  };
  const state = (deps as any)._state as FakeState;
  state.recipes.push(r);
  state.recipeDetails.set(r.id, d);
  return r;
};

export const fakeDeps = (): Deps => {
  const state = createFakeState();

  const makeRecipeService = (userId: string): RecipeServiceLike => ({
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
        id: request.recipe.id,
        title: request.recipe.title,
        totalCost: String(request.recipe.totalCost),
        createdBy: request.recipe.createdBy,
        dateCreated: request.recipe.dateCreated.toISOString(),
        category: request.recipe.category,
        tax: String(request.recipe.tax),
        imgPath: request.recipe.imgPath,
        sellingPrice: String(request.recipe.sellingPrice ?? 0),
        profitMargin: String(request.recipe.profitMargin ?? 0),
        foodCost: String(request.recipe.foodCost),
        userId: request.recipe.userId,
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
      _added: RecipeIngredients[]
    ) {
      const idx = state.recipes.findIndex((r) => r.id === id && r.userId === userId);
      if (idx === -1) {
        throw new NotFoundError("Recipe", id);
      }
      state.recipes[idx] = recipe;
      return { id };
    },
    async delete(id: string) {
      const idx = state.recipes.findIndex((r) => r.id === id && r.userId === userId);
      if (idx === -1) {
        throw new NotFoundError("Recipe", id);
      }
      state.recipes.splice(idx, 1);
      state.recipeDetails.delete(id);
      return { id };
    },
  });

  const deps: Deps = {
    makeRecipeService,
  };
  (deps as any)._state = state;
  return deps;
};
