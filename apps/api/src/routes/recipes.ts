import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Deps } from "../app";
import {
  MetadataQuery,
  toMetadata,
  RecipeListResponse,
  RecipeWithQueryResponse,
  CreateRecipeBody,
  UpdateRecipeBody,
  MessageResponse,
  DeleteResponse,
  IdParam,
  ErrRes,
} from "./schemas";
import { NotFoundError } from "@costwise/domain/utils/errors";

export const recipesRoutes = (deps: Deps) => {
  const router = new OpenAPIHono<{ Variables: { userId: string } }>();

  // 1. GET /
  const listRecipes = createRoute({
    method: "get",
    path: "/",
    request: { query: MetadataQuery },
    responses: {
      200: {
        content: { "application/json": { schema: RecipeListResponse } },
        description: "List",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(listRecipes, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const q = c.req.valid("query");
    const result = await svc.findAll(c.var.userId, toMetadata(q));
    return c.json(result ?? { recipes: [], count: { count: 0 } }, 200);
  });

  // 2. POST /
  const createRecipe = createRoute({
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: CreateRecipeBody } },
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: MessageResponse } },
        description: "Created",
      },
      400: ErrRes,
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(createRecipe, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const body = c.req.valid("json");
    await svc.create(body);
    return c.json({ message: "Recipe successfully created!" }, 201);
  });

  // 3. GET /:id
  const getRecipe = createRoute({
    method: "get",
    path: "/{id}",
    request: { params: IdParam },
    responses: {
      200: {
        content: { "application/json": { schema: RecipeWithQueryResponse } },
        description: "Recipe detail",
      },
      401: ErrRes,
      404: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(getRecipe, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const { id } = c.req.valid("param");
    const recipe = await svc.findById(id);
    if (!recipe) {
      throw new NotFoundError("Recipe", id);
    }
    return c.json(recipe, 200);
  });

  // 4. PATCH /:id
  const updateRecipe = createRoute({
    method: "patch",
    path: "/{id}",
    request: {
      params: IdParam,
      body: {
        content: { "application/json": { schema: UpdateRecipeBody } },
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: MessageResponse } },
        description: "Updated",
      },
      400: ErrRes,
      401: ErrRes,
      404: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(updateRecipe, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    await svc.update(
      id,
      body.recipe,
      body.removedIngredients,
      body.addedIngredients
    );
    return c.json({ message: "Recipe updated succesfully" }, 200);
  });

  // 5. DELETE /:id
  const deleteRecipe = createRoute({
    method: "delete",
    path: "/{id}",
    request: { params: IdParam },
    responses: {
      200: {
        content: { "application/json": { schema: DeleteResponse } },
        description: "Deleted",
      },
      401: ErrRes,
      404: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(deleteRecipe, async (c) => {
    const svc = deps.makeRecipeService(c.var.userId);
    const { id } = c.req.valid("param");
    await svc.delete(id);
    return c.json({ id }, 200);
  });

  return router;
};
