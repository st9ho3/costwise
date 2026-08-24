import type { Recipe, Ingredient, Supplier } from "@costwise/shared/recipe";
import type { RecipeWithQuery } from "@costwise/shared/specialTypes";
import { NotFoundError } from "@costwise/domain/utils/errors";
import type { Deps } from "../app";

/**
 * The in-memory store the fake services read and write. Each aggregate owns its
 * own slice; the per-aggregate fake modules take this whole object so the seed
 * helpers and the services share one source of truth.
 */
export interface FakeState {
  recipes: Recipe[];
  recipeDetails: Map<string, RecipeWithQuery>;
  ingredients: Ingredient[];
  suppliers: Supplier[];
  uploadedBlobs: Map<string, { name: string; body: any }>;
}

export const createFakeState = (): FakeState => ({
  recipes: [],
  recipeDetails: new Map(),
  ingredients: [],
  suppliers: [],
  uploadedBlobs: new Map(),
});

/** The seed helpers reach the state that `fakeDeps()` stashed on the deps. */
export const getState = (deps: Deps): FakeState => (deps as any)._state;

/**
 * Locates an owned row or throws the same NotFoundError the real services do.
 * Every update/delete on every aggregate needs exactly this.
 */
export const requireOwnedIndex = <T extends { id: string; userId: string }>(
  items: T[],
  id: string,
  userId: string,
  resource: string,
): number => {
  const idx = items.findIndex(
    (item) => item.id === id && item.userId === userId,
  );
  if (idx === -1) {
    throw new NotFoundError(resource, id);
  }
  return idx;
};
