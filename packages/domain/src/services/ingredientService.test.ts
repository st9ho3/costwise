import { describe, test, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  ingredientUpdate: vi.fn(async (ing: { id: string }) => ({ id: ing.id })),
  findAllByIngredientId: vi.fn(async () => []),
  updateByIngredientId: vi.fn(async () => undefined),
}));

vi.mock("../repositories/ingredientRepository", () => ({
  IngredientRepository: vi.fn(() => ({ update: mocks.ingredientUpdate })),
}));
vi.mock("../repositories/recipeRepository", () => ({
  RecipeRepository: vi.fn(() => ({
    findAllByIngredientId: mocks.findAllByIngredientId,
  })),
}));
vi.mock("../repositories/supplierIngredientsRepository", () => ({
  SupplierIngredientRepository: vi.fn(() => ({
    updateByIngredientId: mocks.updateByIngredientId,
  })),
}));
vi.mock("./recipeService", () => ({
  RecipeService: vi.fn(() => ({
    updateRecipeAfterIngredientsChange: vi.fn(),
  })),
}));
vi.mock("@costwise/db/db", () => ({
  db: { transaction: (fn: (tx: object) => unknown) => fn({ __tx: true }) },
}));

import { IngredientService } from "./ingredientService";
import { Ingredient } from "@costwise/shared/recipe";

const ingredient: Ingredient = {
  id: "0b7f43cd-6c9e-4a02-9c1a-6f2b8f9d1e11",
  icon: "Other",
  name: "Feta",
  unit: "g",
  unitPrice: 0.0125,
  quantity: 1,
  usage: "0",
  userId: "user-1",
  category: "ef45178d-e566-4637-b7f9-abcf6d575466",
  suppliers: [
    {
      suppliersId: "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
      unit: "g",
      quantity: 1,
      price: 0.0125,
      isActive: true,
    },
  ],
};

describe("IngredientService.update", () => {
  test("syncs price fields into supplier_ingredients in the same tx", async () => {
    const service = new IngredientService("user-1");
    await service.update(ingredient);

    expect(mocks.updateByIngredientId).toHaveBeenCalledTimes(1);
    expect(mocks.updateByIngredientId).toHaveBeenCalledWith(
      expect.objectContaining({ __tx: true }),
      ingredient.id,
      { unit: "g", unitPrice: "0.0125", quantity: "1" },
    );
  });
});
