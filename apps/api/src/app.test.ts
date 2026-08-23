import { describe, it, expect } from "vitest";
import { createApp } from "./app";
import { fakeDeps } from "./testing/fakes";

describe("app root endpoints", () => {
  it("GET /health returns ok without auth", async () => {
    const res = await createApp(fakeDeps()).request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("GET /openapi.json returns OpenAPI spec without auth", async () => {
    const res = await createApp(fakeDeps()).request("/openapi.json");
    expect(res.status).toBe(200);
    const spec = await res.json();
    expect(spec.openapi).toBeDefined();
    expect(spec.paths["/v1/recipes"]).toBeDefined();
  });

  it("GET /docs returns HTML documentation UI without auth", async () => {
    const res = await createApp(fakeDeps()).request("/docs");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("<html");
  });

  it("does not gate /v1/auth/* behind requireUser", async () => {
    const res = await createApp(fakeDeps()).request("/v1/auth/get-session");
    const body = await res.json().catch(() => null);
    // Better Auth answers (null session), not our auth envelope:
    expect(body?.error?.code).not.toBe("AUTHENTICATION_ERROR");
  });
});
