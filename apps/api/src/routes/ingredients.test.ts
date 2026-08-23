import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, seedIngredient } from "../testing/fakes";
import type { Ingredient } from "@costwise/shared/recipe";

const H = { "x-user-id": "u1" };

const validIngredient: Ingredient = {
  id: "44444444-4444-4444-4444-444444444444",
  icon: null,
  name: "Flour",
  unit: "kg",
  unitPrice: 1.5,
  quantity: 10,
  usage: "0",
  userId: "u1",
  suppliers: [
    {
      suppliersId: "55555555-5555-5555-5555-555555555555",
      unit: "kg",
      quantity: 10,
      price: 15,
      isActive: true,
    },
  ],
  category: "5dee106a-5050-443e-8368-03397e02af6d",
};

describe("/v1/ingredients", () => {
  describe("GET /v1/ingredients", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients");
      expect(res.status).toBe(401);
    });

    it("lists the user's ingredients with count", async () => {
      const deps = fakeDeps();
      seedIngredient(deps, "u1");
      const res = await createApp(deps).request("/v1/ingredients", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ingredients).toHaveLength(1);
      expect(body.count.count).toBe(1);
    });

    it("400s on invalid page param", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients?page=zero", { headers: H });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/ingredients", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validIngredient),
      });
      expect(res.status).toBe(401);
    });

    it("creates ingredient and returns 201 with message", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/ingredients", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify(validIngredient),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.message).toBe("Ingredient created successfully");
    });

    it("overwrites forged userId with session userId", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/ingredients", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validIngredient,
          userId: "forged-user",
        }),
      });
      expect(res.status).toBe(201);
      const state = (deps as any)._state;
      expect(state.ingredients[0].userId).toBe("u1");
    });

    it("400s on invalid body", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/ingredients", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ invalid: true }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /v1/ingredients/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients/i1");
      expect(res.status).toBe(401);
    });

    it("200s and returns ingredient details for valid id", async () => {
      const deps = fakeDeps();
      const ing = seedIngredient(deps, "u1");
      const res = await createApp(deps).request(`/v1/ingredients/${ing.id}`, { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(ing.id);
      expect(body.name).toBe(ing.name);
    });

    it("404s on unknown id", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients/nonexistent", { headers: H });
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/ingredients/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients/i1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validIngredient),
      });
      expect(res.status).toBe(401);
    });

    it("200s and returns message on valid update", async () => {
      const deps = fakeDeps();
      const ing = seedIngredient(deps, "u1");
      const updated = { ...ing, name: "Updated Flour" };
      const res = await createApp(deps).request(`/v1/ingredients/${ing.id}`, {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Ingredient updated successfully");
    });

    it("400s on invalid body", async () => {
      const deps = fakeDeps();
      const ing = seedIngredient(deps, "u1");
      const res = await createApp(deps).request(`/v1/ingredients/${ing.id}`, {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "" }),
      });
      expect(res.status).toBe(400);
    });

    it("404s on unknown id", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/ingredients/nonexistent", {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify(validIngredient),
      });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /v1/ingredients/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/ingredients/i1", { method: "DELETE" });
      expect(res.status).toBe(401);
    });

    it("200s and returns deleted id", async () => {
      const deps = fakeDeps();
      const ing = seedIngredient(deps, "u1");
      const res = await createApp(deps).request(`/v1/ingredients/${ing.id}`, {
        method: "DELETE",
        headers: H,
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(ing.id);
    });

    it("404s on unknown id", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/ingredients/nonexistent", {
        method: "DELETE",
        headers: H,
      });
      expect(res.status).toBe(404);
    });
  });
});
