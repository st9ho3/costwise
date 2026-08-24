/**
 * Stable entry point for the API test fakes.
 *
 * The per-aggregate detail lives in `recipeFakes.ts`, `ingredientFakes.ts` and
 * `supplierFakes.ts`, so a schema change touches one file instead of rippling
 * through every suite that imports from here. Test files import only from this
 * module.
 */
import type { Deps, SearchServiceLike, PutBlobFn } from "../app";
import { createFakeState } from "./state";
import { makeRecipeServiceFor } from "./recipeFakes";
import {
  makeIngredientServiceFor,
  toIngredientDisplay,
} from "./ingredientFakes";
import { makeSupplierServiceFor } from "./supplierFakes";

export type { FakeState } from "./state";
export { seedRecipe } from "./recipeFakes";
export { seedIngredient } from "./ingredientFakes";
export { seedSupplier } from "./supplierFakes";

export const fakeDeps = (): Deps => {
  const state = createFakeState();

  // Search spans two aggregates, so it stays here rather than in either one.
  const makeSearchService = (
    term: string,
    userId: string,
  ): SearchServiceLike => ({
    async findRecipe() {
      return state.recipes.filter(
        (r) =>
          r.userId === userId &&
          r.title.toLowerCase().includes(term.toLowerCase()),
      );
    },
    async findIngredient() {
      return state.ingredients
        .filter(
          (i) =>
            i.userId === userId &&
            i.name.toLowerCase().includes(term.toLowerCase()),
        )
        .map(toIngredientDisplay);
    },
  });

  const putBlob: PutBlobFn = async (name, body) => {
    state.uploadedBlobs.set(name, { name, body });
    return { url: `https://blob.test/${name}` };
  };

  const deps: Deps = {
    makeRecipeService: makeRecipeServiceFor(state),
    makeIngredientService: makeIngredientServiceFor(state),
    makeSupplierService: makeSupplierServiceFor(state),
    makeSearchService,
    putBlob,
    getSessionUserId: async (h) => h.get("x-user-id"),
  };
  (deps as any)._state = state;
  return deps;
};
