import { describe, it, expect, vi } from "vitest";
import { createApiClient } from "./index";

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("createApiClient", () => {
  it("returns typed data on 200", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(200, { recipes: [], count: { count: 0 } }));
    const client = createApiClient({ baseUrl: "http://x", fetch: fetchMock });
    const { data, error } = await client.GET("/v1/recipes");
    expect(error).toBeUndefined();
    expect(data?.count.count).toBe(0);
  });
  it("surfaces the error envelope on 401", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(401, { error: { code: "AUTHENTICATION_ERROR", message: "Sign in required" } }));
    const client = createApiClient({ baseUrl: "http://x", fetch: fetchMock });
    const { data, error } = await client.GET("/v1/recipes");
    expect(data).toBeUndefined();
    expect(error?.error.code).toBe("AUTHENTICATION_ERROR");
  });
  it("passes credentials and headers through to fetch", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(200, { recipes: [], count: { count: 0 } }));
    const client = createApiClient({ baseUrl: "http://x", fetch: fetchMock, credentials: "include", headers: { cookie: "s=1" } });
    await client.GET("/v1/recipes");
    const req = (fetchMock.mock.calls[0] as any)[0] as Request;
    expect(req.credentials).toBe("include");
    expect(req.headers.get("cookie")).toBe("s=1");
  });
});
