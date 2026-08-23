import { OpenAPIHono } from "@hono/zod-openapi";
import { errorHandler } from "./middleware/errors";
import { requireUser } from "./middleware/auth";
import { recipesRoutes } from "./routes/recipes";
import { ingredientsRoutes } from "./routes/ingredients";
import type {
  Recipe,
  RecipeIngredients,
  Ingredient,
  IngredientToDisplay,
} from "@costwise/shared/recipe";
import type {
  RecipeWithQuery,
  Metadata,
} from "@costwise/domain/types/specialTypes";
import type {
  CreateRequest,
  CreateResponse,
} from "@costwise/domain/types/services";

export type RecipeServiceLike = {
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<{ recipes: Recipe[]; count: { count: number } } | undefined>;
  findById(id: string): Promise<RecipeWithQuery | undefined>;
  create(request: CreateRequest): Promise<CreateResponse | undefined>;
  update(
    id: string,
    recipe: Recipe,
    removedIngredients: RecipeIngredients[],
    addedIngredients: RecipeIngredients[]
  ): Promise<{ id: string } | undefined>;
  delete(id: string): Promise<{ id: string } | undefined>;
};

export type IngredientServiceLike = {
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<
    { ingredients: IngredientToDisplay[]; count: { count: number } } | undefined
  >;
  findById(id: string): Promise<IngredientToDisplay | undefined>;
  create(ingredient: Ingredient): Promise<{ id: string } | undefined>;
  update(ingredient: Ingredient): Promise<{ id: string } | undefined>;
  delete(id: string): Promise<void>;
};

export interface Deps {
  makeRecipeService: (userId: string) => RecipeServiceLike;
  makeIngredientService: (userId: string) => IngredientServiceLike;
}

export const createApp = (deps: Deps) => {
  const app = new OpenAPIHono();
  app.onError(errorHandler);

  app.get("/health", (c) => c.json({ status: "ok" }));

  const v1 = new OpenAPIHono<{ Variables: { userId: string } }>();
  v1.use("*", requireUser);
  v1.route("/recipes", recipesRoutes(deps));
  v1.route("/ingredients", ingredientsRoutes(deps));
  app.route("/v1", v1);

  return app;
};
