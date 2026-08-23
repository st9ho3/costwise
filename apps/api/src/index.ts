import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { RecipeService } from "@costwise/domain/services/recipeService";

const deps = {
  makeRecipeService: (userId: string) => new RecipeService(userId),
};

serve({ fetch: createApp(deps).fetch, port: 3001 }, (i) =>
  console.log(`api listening on :${i.port}`)
);
