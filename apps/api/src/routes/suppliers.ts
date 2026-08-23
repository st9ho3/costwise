import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Deps } from "../app";
import {
  MetadataQuery,
  toMetadata,
  SupplierListResponse,
  SupplierPayloadSchema,
  MessageResponse,
  DeleteResponse,
  IdParam,
  ErrRes,
} from "./schemas";
import { SupplierSchema } from "@costwise/shared/recipe";
import { NotFoundError } from "@costwise/domain/utils/errors";
import { defaultHook } from "../middleware/errors";

export const suppliersRoutes = (deps: Deps) => {
  const router = new OpenAPIHono<{ Variables: { userId: string } }>({ defaultHook });

  // 1. GET /
  const listSuppliers = createRoute({
    method: "get",
    path: "/",
    request: { query: MetadataQuery },
    responses: {
      200: {
        content: { "application/json": { schema: SupplierListResponse } },
        description: "List",
      },
      401: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(listSuppliers, async (c) => {
    const svc = deps.makeSupplierService(c.var.userId);
    const q = c.req.valid("query");
    const result = await svc.findAll(c.var.userId, toMetadata(q));
    return c.json(result ?? { suppliers: [], count: { count: 0 } }, 200);
  });

  // 2. POST /
  const createSupplier = createRoute({
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: SupplierPayloadSchema } },
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
  router.openapi(createSupplier, async (c) => {
    const svc = deps.makeSupplierService(c.var.userId);
    const body = c.req.valid("json");
    body.supplier.userId = c.var.userId;
    await svc.create(body);
    return c.json({ message: "Supplier successfully created!" }, 201);
  });

  // 3. GET /:id
  const getSupplier = createRoute({
    method: "get",
    path: "/{id}",
    request: { params: IdParam },
    responses: {
      200: {
        content: { "application/json": { schema: SupplierSchema } },
        description: "Supplier detail",
      },
      401: ErrRes,
      404: ErrRes,
      500: ErrRes,
    },
  });
  router.openapi(getSupplier, async (c) => {
    const svc = deps.makeSupplierService(c.var.userId);
    const { id } = c.req.valid("param");
    const supplier = await svc.findById(id);
    if (!supplier) {
      throw new NotFoundError("Supplier", id);
    }
    return c.json(supplier, 200);
  });

  // 4. PATCH /:id
  const updateSupplier = createRoute({
    method: "patch",
    path: "/{id}",
    request: {
      params: IdParam,
      body: {
        content: { "application/json": { schema: SupplierPayloadSchema } },
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
  router.openapi(updateSupplier, async (c) => {
    const svc = deps.makeSupplierService(c.var.userId);
    const body = c.req.valid("json");
    body.supplier.userId = c.var.userId;
    await svc.update(body);
    return c.json({ message: "supplier updated" }, 200);
  });

  // 5. DELETE /:id
  const deleteSupplier = createRoute({
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
  router.openapi(deleteSupplier, async (c) => {
    const svc = deps.makeSupplierService(c.var.userId);
    const { id } = c.req.valid("param");
    await svc.delete(id);
    return c.json({ id }, 200);
  });

  return router;
};
