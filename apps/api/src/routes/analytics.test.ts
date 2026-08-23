import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, seedRecipe, seedIngredient } from "../testing/fakes";

const H = { "x-user-id": "u1" };

describe("/v1/analytics", () => {
  describe("GET /v1/analytics/recipes", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/analytics/recipes");
      expect(res.status).toBe(401);
    });

    it("200s and returns recipe analytics", async () => {
      const deps = fakeDeps();
      seedRecipe(deps, "u1");
      const res = await createApp(deps).request("/v1/analytics/recipes", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.totalRecipes).toBe(1);
      expect(body.avgProfitMargin).toBe("25");
    });
  });

  describe("GET /v1/analytics/categories", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/analytics/categories");
      expect(res.status).toBe(401);
    });

    it("200s and returns category analytics", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/analytics/categories", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /v1/analytics/margins", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/analytics/margins");
      expect(res.status).toBe(401);
    });

    it("200s and returns margin highlights", async () => {
      const deps = fakeDeps();
      seedRecipe(deps, "u1");
      const res = await createApp(deps).request("/v1/analytics/margins", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.topPerformers).toBeDefined();
      expect(body.attentionNeeded).toBeDefined();
    });
  });

  describe("GET /v1/analytics/ingredients", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/analytics/ingredients");
      expect(res.status).toBe(401);
    });

    it("200s and returns ingredient analytics", async () => {
      const deps = fakeDeps();
      seedIngredient(deps, "u1");
      const res = await createApp(deps).request("/v1/analytics/ingredients", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.totalIngredients).toBe(1);
    });
  });

  describe("GET /v1/analytics/high-impact-ingredients", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/analytics/high-impact-ingredients");
      expect(res.status).toBe(401);
    });

    it("200s and returns high-impact ingredients", async () => {
      const deps = fakeDeps();
      seedIngredient(deps, "u1");
      const res = await createApp(deps).request("/v1/analytics/high-impact-ingredients", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(1);
    });
  });
});
