import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Deps } from "../app";
import {
  MetadataQuery,
  toMetadata,
  IngredientListResponse,
  IngredientToDisplaySchema,
  MessageResponse,
  DeleteResponse,
  IdParam,
  ErrRes,
} from "./schemas";
import { IngredientSchema } from "@costwise/shared/recipe";
import { NotFoundError } from "@costwise/domain/utils/errors";

export const ingredientsRoutes = (deps: Deps) => {
  const router = new OpenAPIHono<{ Variables: { userId: string } }>();

  // 1. GET /
  const listIngredients = createRoute({
    method: "get",
    path: "/",
    request: { query: MetadataQuery },
    responses: {
      200: {
        content: { "application/json": { schema: IngredientListResponse } },
        description: "List",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(listIngredients, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const q = c.req.valid("query");
    const result = await svc.findAll(c.var.userId, toMetadata(q));
    return c.json(result ?? { ingredients: [], count: { count: 0 } }, 200);
  });

  // 2. POST /
  const createIngredient = createRoute({
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: IngredientSchema } },
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
  router.openapi(createIngredient, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const body = c.req.valid("json");
    await svc.create(body);
    return c.json({ message: "Ingredient created successfully" }, 201);
  });

  // 3. GET /:id
  const getIngredient = createRoute({
    method: "get",
    path: "/{id}",
    request: { params: IdParam },
    responses: {
      200: {
        content: { "application/json": { schema: IngredientToDisplaySchema } },
        description: "Ingredient detail",
      },
      401: ErrRes,
      404: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(getIngredient, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const { id } = c.req.valid("param");
    const ingredient = await svc.findById(id);
    if (!ingredient) {
      throw new NotFoundError("Ingredient", id);
    }
    return c.json(ingredient, 200);
  });

  // 4. PATCH /:id
  const updateIngredient = createRoute({
    method: "patch",
    path: "/{id}",
    request: {
      params: IdParam,
      body: {
        content: { "application/json": { schema: IngredientSchema } },
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
  router.openapi(updateIngredient, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const body = c.req.valid("json");
    await svc.update(body);
    return c.json({ message: "Ingredient updated successfully" }, 200);
  });

  // 5. DELETE /:id
  const deleteIngredient = createRoute({
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
  router.openapi(deleteIngredient, async (c) => {
    const svc = deps.makeIngredientService(c.var.userId);
    const { id } = c.req.valid("param");
    await svc.delete(id);
    return c.json({ id }, 200);
  });

  return router;
};
