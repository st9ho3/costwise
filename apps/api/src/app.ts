import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { errorHandler } from "./middleware/errors";
import { requireUser } from "./middleware/auth";
import { recipesRoutes } from "./routes/recipes";
import { ingredientsRoutes } from "./routes/ingredients";
import { suppliersRoutes } from "./routes/suppliers";
import { searchRoutes } from "./routes/search";
import { analyticsRoutes } from "./routes/analytics";
import { uploadsRoutes } from "./routes/uploads";
import type {
  Recipe,
  RecipeIngredients,
  Ingredient,
  IngredientToDisplay,
  Supplier,
} from "@costwise/shared/recipe";
import type {
  RecipeWithQuery,
  Metadata,
} from "@costwise/domain/types/specialTypes";
import type {
  CreateRequest,
  CreateResponse,
} from "@costwise/domain/types/services";
import type { SupplierUpdatePayload } from "@costwise/domain/types/context";
import type {
  RecipeAnalytics,
  CategoryAnalytics,
  MarginHighlights,
  HighImpactIngredient,
  IngredientAnalytics,
} from "@costwise/domain/types/repositories";

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
  getRecipesAnalytics(userId: string): Promise<RecipeAnalytics | undefined>;
  getCategoryAnalytics(userId: string): Promise<CategoryAnalytics[]>;
  getMarginHighlights(userId: string): Promise<MarginHighlights>;
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
  getIngredientAnalytics(userId: string): Promise<IngredientAnalytics | undefined>;
  getHighImpactIngredients(
    userId: string,
    limit?: number
  ): Promise<HighImpactIngredient[]>;
};

export type SupplierServiceLike = {
  findAll(
    userId: string,
    metadata: Metadata
  ): Promise<{ suppliers: Supplier[]; count: { count: number } } | undefined>;
  findById(supplierId: string): Promise<Supplier | undefined>;
  create(supplier: SupplierUpdatePayload): Promise<{ id: string } | undefined>;
  update(supplier: SupplierUpdatePayload): Promise<{ id: string } | undefined>;
  delete(supplierId: string): Promise<{ id: string } | undefined>;
};

export type SearchServiceLike = {
  findRecipe(): Promise<Recipe[] | undefined>;
  findIngredient(): Promise<IngredientToDisplay[] | undefined>;
};

export type PutBlobFn = (
  name: string,
  body: any,
  opts: { access: "public"; addRandomSuffix?: boolean }
) => Promise<{ url: string }>;

export interface Deps {
  makeRecipeService: (userId: string) => RecipeServiceLike;
  makeIngredientService: (userId: string) => IngredientServiceLike;
  makeSupplierService: (userId: string) => SupplierServiceLike;
  makeSearchService: (term: string, userId: string) => SearchServiceLike;
  putBlob: PutBlobFn;
}

export const createApp = (deps: Deps) => {
  const app = new OpenAPIHono();
  app.onError(errorHandler);

  app.get("/health", (c) => c.json({ status: "ok" }));

  const v1 = new OpenAPIHono<{ Variables: { userId: string } }>();
  v1.use("*", requireUser);
  v1.route("/recipes", recipesRoutes(deps));
  v1.route("/ingredients", ingredientsRoutes(deps));
  v1.route("/suppliers", suppliersRoutes(deps));
  v1.route("/search", searchRoutes(deps));
  v1.route("/analytics", analyticsRoutes(deps));
  v1.route("/uploads", uploadsRoutes(deps));
  app.route("/v1", v1);

  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: { title: "CostWise API", version: "1" },
  });
  app.get("/docs", Scalar({ url: "/openapi.json" }));

  return app;
};
