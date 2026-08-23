import { describe, it, expect } from "vitest";
import { createApp } from "./app";

describe("health", () => {
  it("GET /health returns ok without auth", async () => {
    const res = await createApp({} as never).request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
