import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, seedRecipe, seedIngredient } from "../testing/fakes";

const H = { "x-user-id": "u1" };

describe("/v1/search", () => {
  it("401s without auth", async () => {
    const res = await createApp(fakeDeps()).request("/v1/search?q=test");
    expect(res.status).toBe(401);
  });

  it("400s on missing q parameter", async () => {
    const res = await createApp(fakeDeps()).request("/v1/search", { headers: H });
    expect(res.status).toBe(400);
  });

  it("400s on empty q parameter", async () => {
    const res = await createApp(fakeDeps()).request("/v1/search?q=", { headers: H });
    expect(res.status).toBe(400);
  });

  it("200s and returns matching recipes and ingredients", async () => {
    const deps = fakeDeps();
    seedRecipe(deps, "u1", { title: "Tomato Soup" });
    seedIngredient(deps, "u1", { name: "Tomato" });
    const res = await createApp(deps).request("/v1/search?q=Tomato", { headers: H });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recipes).toHaveLength(1);
    expect(body.ingredients).toHaveLength(1);
  });
});
