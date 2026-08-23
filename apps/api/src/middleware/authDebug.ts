import type { MiddlewareHandler } from "hono";

/**
 * Diagnostic tracing for the Better Auth surface, off unless AUTH_DEBUG is set.
 *
 * Better Auth answers a failed OAuth callback with a 302 to its own HTML error
 * page (`<basePath>/error?error=<code>`), so the code that explains a failure
 * is only visible in the Location header of a response we otherwise never see.
 */
export const authDebug: MiddlewareHandler = async (c, next) => {
  if (!process.env.AUTH_DEBUG) return next();

  const started = Date.now();
  const hadSessionCookie = /better-auth\.session/.test(
    c.req.header("cookie") ?? ""
  );

  await next();

  const location = c.res.headers.get("location");
  const setCookie = c.res.headers.get("set-cookie");

  console.log(
    `[auth] ${c.req.method} ${new URL(c.req.url).pathname} -> ${c.res.status}` +
      ` (${Date.now() - started}ms)` +
      ` cookie-in=${hadSessionCookie ? "session" : "none"}` +
      ` set-cookie=${setCookie ? setCookie.split("=")[0] : "none"}` +
      (location ? `\n[auth]   location: ${location}` : "")
  );
};
