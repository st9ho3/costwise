import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { RecipeService } from "@costwise/domain/services/recipeService";
import { IngredientService } from "@costwise/domain/services/ingredientService";
import { SupplierService } from "@costwise/domain/services/suppliersService";
import { SearchService } from "@costwise/domain/services/searchService";
import { put } from "@vercel/blob";
import { auth } from "./auth";

const deps = {
  makeRecipeService: (userId: string) => new RecipeService(userId),
  makeIngredientService: (userId: string) => new IngredientService(userId),
  makeSupplierService: (userId: string) => new SupplierService(userId),
  makeSearchService: (term: string, userId: string) =>
    new SearchService(term, userId),
  putBlob: (
    name: string,
    body: any,
    opts: { access: "public"; addRandomSuffix?: boolean }
  ) => put(name, body, opts),
  getSessionUserId: async (headers: Headers) =>
    (await auth.api.getSession({ headers }))?.user.id ?? null,
};

serve({ fetch: createApp(deps).fetch, port: 3001 }, (i) =>
  console.log(`api listening on :${i.port}`)
);
