import { describe, it, expect } from "vitest";
import { createApp } from "./app";
import { fakeDeps } from "./testing/fakes";

describe("health", () => {
  it("GET /health returns ok without auth", async () => {
    const res = await createApp(fakeDeps()).request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
