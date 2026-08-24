import type { Ingredient, IngredientToDisplay } from "@costwise/shared/recipe";
import type { Metadata } from "@costwise/shared/specialTypes";
import type {
  HighImpactIngredient,
  IngredientAnalytics,
} from "@costwise/domain/types/repositories";
import type { Deps, IngredientServiceLike } from "../app";
import { FakeState, getState, requireOwnedIndex } from "./state";

/** Drops the supplier links and pins a category name, as the read model does. */
export const toIngredientDisplay = (
  ingredient: Ingredient,
): IngredientToDisplay => {
  const { suppliers, ...rest } = ingredient;
  return { ...rest, categoryName: "Produce" as const };
};

export const seedIngredient = (
  deps: Deps,
  userId: string,
  ingredient?: Partial<Ingredient>,
) => {
  const ing: Ingredient = {
    id: ingredient?.id ?? "44444444-4444-4444-4444-444444444444",
    icon: ingredient?.icon ?? null,
    name: ingredient?.name ?? "Flour",
    unit: ingredient?.unit ?? "kg",
    unitPrice: ingredient?.unitPrice ?? 1.5,
    quantity: ingredient?.quantity ?? 10,
    usage: ingredient?.usage ?? "0",
    userId,
    suppliers: ingredient?.suppliers ?? [
      {
        suppliersId: "55555555-5555-5555-5555-555555555555",
        unit: "kg",
        quantity: 10,
        price: 15,
        isActive: true,
      },
    ],
    category: ingredient?.category ?? "5dee106a-5050-443e-8368-03397e02af6d",
    ...ingredient,
  };
  getState(deps).ingredients.push(ing);
  return ing;
};

export const makeIngredientServiceFor =
  (state: FakeState) =>
  (userId: string): IngredientServiceLike => ({
    async findAll(uId: string, metadata: Metadata) {
      const display = state.ingredients
        .filter((i) => i.userId === uId)
        .map(toIngredientDisplay);
      return {
        ingredients: display,
        count: { count: display.length },
      };
    },
    async findById(id: string) {
      const ing = state.ingredients.find(
        (i) => i.id === id && i.userId === userId,
      );
      if (!ing) return undefined;
      return toIngredientDisplay(ing);
    },
    async create(ingredient: Ingredient) {
      state.ingredients.push(ingredient);
      return { id: ingredient.id };
    },
    async update(ingredient: Ingredient) {
      const idx = requireOwnedIndex(
        state.ingredients,
        ingredient.id,
        userId,
        "Ingredient",
      );
      state.ingredients[idx] = ingredient;
      return { id: ingredient.id };
    },
    async delete(id: string) {
      const idx = requireOwnedIndex(
        state.ingredients,
        id,
        userId,
        "Ingredient",
      );
      state.ingredients.splice(idx, 1);
    },
    async getIngredientAnalytics(uId: string): Promise<IngredientAnalytics> {
      const userIngredients = state.ingredients.filter((i) => i.userId === uId);
      return {
        totalIngredients: userIngredients.length,
      };
    },
    async getHighImpactIngredients(
      uId: string,
      limit: number = 5,
    ): Promise<HighImpactIngredient[]> {
      const userIngredients = state.ingredients.filter((i) => i.userId === uId);
      return userIngredients.slice(0, limit).map((i) => ({
        id: i.id,
        name: i.name,
        icon: i.icon ?? null,
        usage: Number(i.usage) || 0,
        category: i.category,
      }));
    },
  });
