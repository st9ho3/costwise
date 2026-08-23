import { createMiddleware } from "hono/factory";

// INTERIM SEAM — Task 3 (Better Auth) replaces the body; contract stays:
// on success c.set("userId", ...), on failure 401 envelope.
export const requireUser = createMiddleware<{ Variables: { userId: string } }>(
  async (c, next) => {
    const env = process.env.NODE_ENV_OVERRIDE ?? process.env.NODE_ENV;
    const userId = env === "production" ? undefined : c.req.header("x-user-id");
    if (!userId)
      return c.json({ error: { code: "AUTHENTICATION_ERROR", message: "Sign in required" } }, 401);
    c.set("userId", userId);
    await next();
  }
);
