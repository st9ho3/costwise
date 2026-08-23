import { OpenAPIHono } from "@hono/zod-openapi";
import { errorHandler } from "./middleware/errors";

export type Deps = Record<string, never>; // widened by later tasks

export const createApp = (deps: Deps) => {
  const app = new OpenAPIHono();
  app.onError(errorHandler);
  app.get("/health", (c) => c.json({ status: "ok" }));
  return app;
};
