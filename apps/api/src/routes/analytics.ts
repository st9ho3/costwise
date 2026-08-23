import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Deps } from "../app";
import {
  RecipeAnalyticsResponse,
  CategoryAnalyticsResponse,
  MarginHighlightsResponse,
  IngredientAnalyticsResponse,
  HighImpactIngredientsResponse,
  HighImpactQuery,
  ErrRes,
} from "./schemas";

export const analyticsRoutes = (deps: Deps) => {
  const router = new OpenAPIHono<{ Variables: { userId: string } }>();

  // 1. GET /recipes
  const recipesAnalytics = createRoute({
    method: "get",
    path: "/recipes",
    responses: {
      200: {
        content: { "application/json": { schema: RecipeAnalyticsResponse } },
        description: "Recipe analytics",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(recipesAnalytics, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const result = await svc.getRecipesAnalytics(c.var.userId);
    return c.json(
      result ?? { avgProfitMargin: null, avgFoodCost: null, totalRecipes: 0 },
      200
    );
  });

  // 2. GET /categories
  const categoriesAnalytics = createRoute({
    method: "get",
    path: "/categories",
    responses: {
      200: {
        content: { "application/json": { schema: CategoryAnalyticsResponse } },
        description: "Category analytics",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(categoriesAnalytics, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const result = await svc.getCategoryAnalytics(c.var.userId);
    return c.json(result, 200);
  });

  // 3. GET /margins
  const marginHighlights = createRoute({
    method: "get",
    path: "/margins",
    responses: {
      200: {
        content: { "application/json": { schema: MarginHighlightsResponse } },
        description: "Margin highlights",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(marginHighlights, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const result = await svc.getMarginHighlights(c.var.userId);
    return c.json(result, 200);
  });

  // 4. GET /ingredients
  const ingredientsAnalytics = createRoute({
    method: "get",
    path: "/ingredients",
    responses: {
      200: {
        content: {
          "application/json": { schema: IngredientAnalyticsResponse },
        },
        description: "Ingredient analytics",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(ingredientsAnalytics, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const result = await svc.getIngredientAnalytics(c.var.userId);
    return c.json(result ?? { totalIngredients: 0 }, 200);
  });

  // 5. GET /high-impact-ingredients
  const highImpactIngredients = createRoute({
    method: "get",
    path: "/high-impact-ingredients",
    request: { query: HighImpactQuery },
    responses: {
      200: {
        content: {
          "application/json": { schema: HighImpactIngredientsResponse },
        },
        description: "High-impact ingredients",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(highImpactIngredients, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const q = c.req.valid("query");
    const result = await svc.getHighImpactIngredients(c.var.userId, q.limit);
    return c.json(result, 200);
  });

  return router;
};
