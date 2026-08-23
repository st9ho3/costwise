import { describe, it, expect, afterEach } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { requireUser } from "./auth";

const app = new OpenAPIHono<{ Variables: { userId: string } }>();
app.use("/p/*", requireUser);
app.get("/p/me", (c) => c.json({ userId: c.var.userId }));

describe("requireUser (interim, pre-Better-Auth)", () => {
  afterEach(() => { delete process.env.NODE_ENV_OVERRIDE; });
  it("401s with no x-user-id", async () => {
    expect((await app.request("/p/me")).status).toBe(401);
  });
  it("sets userId from x-user-id outside production", async () => {
    const res = await app.request("/p/me", { headers: { "x-user-id": "u1" } });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ userId: "u1" });
  });
  it("always 401s in production even with header", async () => {
    process.env.NODE_ENV_OVERRIDE = "production";
    const res = await app.request("/p/me", { headers: { "x-user-id": "u1" } });
    expect(res.status).toBe(401);
  });
});
