import { describe, it, expect } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { makeRequireUser } from "./auth";

const appWith = (resolver: (h: Headers) => Promise<string | null>) => {
  const app = new OpenAPIHono<{ Variables: { userId: string } }>();
  app.use("/p/*", makeRequireUser(resolver));
  app.get("/p/me", (c) => c.json({ userId: c.var.userId }));
  return app;
};

describe("requireUser (session-backed)", () => {
  it("401s when the resolver finds no session", async () => {
    expect((await appWith(async () => null).request("/p/me")).status).toBe(401);
  });
  it("sets userId from the resolved session", async () => {
    const res = await appWith(async () => "u1").request("/p/me");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ userId: "u1" });
  });
  it("passes the request headers to the resolver", async () => {
    let seen: string | null = null;
    await appWith(async (h) => { seen = h.get("cookie"); return "u1"; })
      .request("/p/me", { headers: { cookie: "s=abc" } });
    expect(seen).toBe("s=abc");
  });
});
