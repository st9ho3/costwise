import { OpenAPIHono } from "@hono/zod-openapi";

export type Deps = Record<string, never>; // widened by later tasks

export const createApp = (deps: Deps) => {
  const app = new OpenAPIHono();
  app.get("/health", (c) => c.json({ status: "ok" }));
  return app;
};
