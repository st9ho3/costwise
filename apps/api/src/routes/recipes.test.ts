import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, seedRecipe } from "../testing/fakes";
import type { Recipe, RecipeIngredients } from "@costwise/shared/recipe";

const H = { "x-user-id": "u1" };

const validRecipe: Recipe = {
  id: "22222222-2222-2222-2222-222222222222",
  title: "New Recipe",
  totalCost: 20,
  createdBy: "u1",
  dateCreated: new Date("2026-01-01"),
  category: "starter",
  tax: 0.1,
  imgPath: "https://example.com/new.jpg",
  sellingPrice: 30,
  profitMargin: 10,
  foodCost: 15,
  userId: "u1",
};

const validIngredient: RecipeIngredients = {
  recipeId: "22222222-2222-2222-2222-222222222222",
  ingredientId: "33333333-3333-3333-3333-333333333333",
  name: "Tomato",
  unit: "kg",
  unitPrice: 2,
  quantity: 5,
};

describe("/v1/recipes", () => {
  describe("GET /v1/recipes", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes");
      expect(res.status).toBe(401);
    });

    it("lists the user's recipes with count", async () => {
      const deps = fakeDeps();
      seedRecipe(deps, "u1");
      const res = await createApp(deps).request("/v1/recipes", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.recipes).toHaveLength(1);
      expect(body.count.count).toBe(1);
    });

    it("400s on invalid page param", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes?page=zero", { headers: H });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/recipes", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: validRecipe, addedIngredients: [validIngredient], removedIngredients: [] }),
      });
      expect(res.status).toBe(401);
    });

    it("returns standard error envelope on validation failure", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: validRecipe,
          addedIngredients: [{ ...validIngredient, recipeId: "not-a-uuid" }],
          removedIngredients: [],
        }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toEqual({
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fieldErrors: expect.objectContaining({
            "addedIngredients.0.recipeId": expect.any(String),
          }),
        },
      });
    });

    it("creates recipe and returns 201 with message", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/recipes", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: validRecipe,
          addedIngredients: [validIngredient],
          removedIngredients: [],
        }),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.message).toBe("Recipe successfully created!");
    });

    it("overwrites forged userId and createdBy with session userId", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/recipes", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: { ...validRecipe, userId: "forged-user", createdBy: "forged-user" },
          addedIngredients: [validIngredient],
          removedIngredients: [],
        }),
      });
      expect(res.status).toBe(201);
      const state = (deps as any)._state;
      expect(state.recipes[0].userId).toBe("u1");
      expect(state.recipes[0].createdBy).toBe("u1");
    });

    it("400s on invalid body", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/recipes", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ invalid: true }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /v1/recipes/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes/r1");
      expect(res.status).toBe(401);
    });

    it("200s and returns recipe details for valid id", async () => {
      const deps = fakeDeps();
      const r = seedRecipe(deps, "u1");
      const res = await createApp(deps).request(`/v1/recipes/${r.id}`, { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(r.id);
      expect(body.title).toBe(r.title);
    });

    it("404s on unknown id", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes/nonexistent", { headers: H });
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/recipes/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes/r1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: validRecipe, addedIngredients: [], removedIngredients: [] }),
      });
      expect(res.status).toBe(401);
    });

    it("200s and returns message on valid update", async () => {
      const deps = fakeDeps();
      const r = seedRecipe(deps, "u1");
      const updated = { ...r, title: "Updated Title" };
      const res = await createApp(deps).request(`/v1/recipes/${r.id}`, {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: updated, addedIngredients: [], removedIngredients: [] }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Recipe updated succesfully");
    });

    it("400s on invalid body", async () => {
      const deps = fakeDeps();
      const r = seedRecipe(deps, "u1");
      const res = await createApp(deps).request(`/v1/recipes/${r.id}`, {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: { title: "too short" } }),
      });
      expect(res.status).toBe(400);
    });

    it("404s on unknown id", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/recipes/nonexistent", {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: validRecipe, addedIngredients: [], removedIngredients: [] }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /v1/recipes/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/recipes/r1", { method: "DELETE" });
      expect(res.status).toBe(401);
    });

    it("200s and returns deleted id", async () => {
      const deps = fakeDeps();
      const r = seedRecipe(deps, "u1");
      const res = await createApp(deps).request(`/v1/recipes/${r.id}`, {
        method: "DELETE",
        headers: H,
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(r.id);
    });

    it("404s on unknown id", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/recipes/nonexistent", {
        method: "DELETE",
        headers: H,
      });
      expect(res.status).toBe(404);
    });
  });
});
