import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, seedSupplier } from "../testing/fakes";
import type { Supplier } from "@costwise/shared/recipe";
import type { SupplierUpdatePayload } from "@costwise/shared/uiTypes";

const H = { "x-user-id": "u1" };

const validSupplier: Supplier = {
  id: "66666666-6666-6666-6666-666666666666",
  userId: "u1",
  name: "Acme Supplier",
  icon: null,
  category: ["5dee106a-5050-443e-8368-03397e02af6d"],
  contactPerson: "John Doe",
  email: "acme@example.com",
  phone: "1234567890",
  website: "https://acme.com",
  address: {
    street: "123 Main St",
    city: "City",
    state: "State",
    postalCode: "12345",
    country: "Country",
  },
  financialData: {
    paymentTerms: "Net 30",
    vatNumber: "VAT123",
  },
  notes: "Test notes",
  deliveryTime: "1-2 Days",
  isActive: true,
  dateAdded: new Date("2026-01-01"),
};

const validPayload: SupplierUpdatePayload = {
  supplier: validSupplier,
  addedCategories: [],
  removedCategories: [],
};

describe("/v1/suppliers", () => {
  describe("GET /v1/suppliers", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers");
      expect(res.status).toBe(401);
    });

    it("lists the user's suppliers with count", async () => {
      const deps = fakeDeps();
      seedSupplier(deps, "u1");
      const res = await createApp(deps).request("/v1/suppliers", { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.suppliers).toHaveLength(1);
      expect(body.count.count).toBe(1);
    });

    it("400s on invalid page param", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers?page=zero", { headers: H });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/suppliers", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });
      expect(res.status).toBe(401);
    });

    it("creates supplier and returns 201 with message", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/suppliers", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.message).toBe("Supplier successfully created!");
    });

    it("400s on invalid body", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/suppliers", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ invalid: true }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /v1/suppliers/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers/s1");
      expect(res.status).toBe(401);
    });

    it("200s and returns supplier details for valid id", async () => {
      const deps = fakeDeps();
      const s = seedSupplier(deps, "u1");
      const res = await createApp(deps).request(`/v1/suppliers/${s.id}`, { headers: H });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(s.id);
      expect(body.name).toBe(s.name);
    });

    it("404s on unknown id", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers/nonexistent", { headers: H });
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/suppliers/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers/s1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });
      expect(res.status).toBe(401);
    });

    it("200s and returns message on valid update", async () => {
      const deps = fakeDeps();
      const s = seedSupplier(deps, "u1");
      const updatedPayload: SupplierUpdatePayload = {
        supplier: { ...s, name: "Updated Acme Supplier" },
        addedCategories: [],
        removedCategories: [],
      };
      const res = await createApp(deps).request(`/v1/suppliers/${s.id}`, {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("supplier updated");
    });

    it("400s on invalid body", async () => {
      const deps = fakeDeps();
      const s = seedSupplier(deps, "u1");
      const res = await createApp(deps).request(`/v1/suppliers/${s.id}`, {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ supplier: { name: "" } }),
      });
      expect(res.status).toBe(400);
    });

    it("404s on unknown id", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/suppliers/nonexistent", {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /v1/suppliers/:id", () => {
    it("401s without auth", async () => {
      const res = await createApp(fakeDeps()).request("/v1/suppliers/s1", { method: "DELETE" });
      expect(res.status).toBe(401);
    });

    it("200s and returns deleted id", async () => {
      const deps = fakeDeps();
      const s = seedSupplier(deps, "u1");
      const res = await createApp(deps).request(`/v1/suppliers/${s.id}`, {
        method: "DELETE",
        headers: H,
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(s.id);
    });

    it("404s on unknown id", async () => {
      const deps = fakeDeps();
      const res = await createApp(deps).request("/v1/suppliers/nonexistent", {
        method: "DELETE",
        headers: H,
      });
      expect(res.status).toBe(404);
    });
  });
});
