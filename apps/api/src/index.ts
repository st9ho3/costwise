import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { RecipeService } from "@costwise/domain/services/recipeService";
import { IngredientService } from "@costwise/domain/services/ingredientService";

const deps = {
  makeRecipeService: (userId: string) => new RecipeService(userId),
  makeIngredientService: (userId: string) => new IngredientService(userId),
};

serve({ fetch: createApp(deps).fetch, port: 3001 }, (i) =>
  console.log(`api listening on :${i.port}`)
);
