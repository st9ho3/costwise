import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Deps } from "../app";
import { SearchQuery, SearchResponse, ErrRes } from "./schemas";
import { defaultHook } from "../middleware/errors";

export const searchRoutes = (deps: Deps) => {
  const router = new OpenAPIHono<{ Variables: { userId: string } }>({ defaultHook });

  const searchRoute = createRoute({
    method: "get",
    path: "/",
    request: { query: SearchQuery },
    responses: {
      200: {
        content: { "application/json": { schema: SearchResponse } },
        description: "Search results",
      },
      400: ErrRes,
      401: ErrRes,
      500: ErrRes,
    },
  });

  router.openapi(searchRoute, async (c) => {
    const { q } = c.req.valid("query");
    const svc = deps.makeSearchService(q, c.var.userId);
    const ingredients = await svc.findIngredient();
    const recipes = await svc.findRecipe();
    return c.json({ ingredients, recipes }, 200);
  });

  return router;
};
