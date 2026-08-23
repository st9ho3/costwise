import { createMiddleware } from "hono/factory";

export const makeRequireUser = (
  getSessionUserId: (headers: Headers) => Promise<string | null>
) =>
  createMiddleware<{ Variables: { userId: string } }>(async (c, next) => {
    const userId = await getSessionUserId(c.req.raw.headers);
    if (!userId)
      return c.json(
        { error: { code: "AUTHENTICATION_ERROR", message: "Sign in required" } },
        401
      );
    c.set("userId", userId);
    await next();
  });
