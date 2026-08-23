import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Deps } from "../app";
import { UploadQuery, UploadResponse, ErrRes } from "./schemas";

export const uploadsRoutes = (deps: Deps) => {
  const router = new OpenAPIHono<{ Variables: { userId: string } }>();

  const uploadRoute = createRoute({
    method: "post",
    path: "/",
    request: {
      query: UploadQuery,
    },
    responses: {
      200: {
        content: { "application/json": { schema: UploadResponse } },
        description: "Uploaded blob details",
      },
      400: ErrRes,
      401: ErrRes,
      500: ErrRes,
    },
  });

  router.openapi(uploadRoute, async (c) => {
    const { filename } = c.req.valid("query");
    const rawBody = await c.req.arrayBuffer();

    if (!rawBody || rawBody.byteLength === 0) {
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing filename or file body.",
          },
        },
        400
      );
    }

    const blob = await deps.putBlob(filename, rawBody, {
      access: "public",
      addRandomSuffix: true,
    });

    return c.json({ url: blob.url }, 200);
  });

  return router;
};
