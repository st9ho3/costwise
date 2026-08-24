import type { Supplier } from "@costwise/shared/recipe";
import type { Metadata } from "@costwise/shared/specialTypes";
import type { SupplierUpdatePayload } from "@costwise/shared/uiTypes";
import type { Deps, SupplierServiceLike } from "../app";
import { FakeState, getState, requireOwnedIndex } from "./state";

export const seedSupplier = (
  deps: Deps,
  userId: string,
  supplier?: Partial<Supplier>,
) => {
  const s: Supplier = {
    id: supplier?.id ?? "66666666-6666-6666-6666-666666666666",
    userId,
    name: supplier?.name ?? "Acme Supplier",
    icon: supplier?.icon ?? null,
    category: supplier?.category ?? ["5dee106a-5050-443e-8368-03397e02af6d"],
    contactPerson: supplier?.contactPerson ?? "John Doe",
    email: supplier?.email ?? "acme@example.com",
    phone: supplier?.phone ?? "1234567890",
    website: supplier?.website ?? "https://acme.com",
    address: supplier?.address ?? {
      street: "123 Main St",
      city: "City",
      state: "State",
      postalCode: "12345",
      country: "Country",
    },
    financialData: supplier?.financialData ?? {
      paymentTerms: "Net 30",
      vatNumber: "VAT123",
    },
    notes: supplier?.notes ?? "Test notes",
    deliveryTime: supplier?.deliveryTime ?? "1-2 Days",
    isActive: supplier?.isActive ?? true,
    dateAdded: supplier?.dateAdded ?? new Date(),
    ...supplier,
  };
  getState(deps).suppliers.push(s);
  return s;
};

export const makeSupplierServiceFor =
  (state: FakeState) =>
  (userId: string): SupplierServiceLike => ({
    async findAll(uId: string, metadata: Metadata) {
      const userSuppliers = state.suppliers.filter((s) => s.userId === uId);
      return {
        suppliers: userSuppliers,
        count: { count: userSuppliers.length },
      };
    },
    async findById(id: string) {
      return state.suppliers.find((s) => s.id === id && s.userId === userId);
    },
    async create(payload: SupplierUpdatePayload) {
      state.suppliers.push(payload.supplier);
      return { id: payload.supplier.id };
    },
    async update(payload: SupplierUpdatePayload) {
      const idx = requireOwnedIndex(
        state.suppliers,
        payload.supplier.id,
        userId,
        "Supplier",
      );
      state.suppliers[idx] = payload.supplier;
      return { id: payload.supplier.id };
    },
    async delete(id: string) {
      const idx = requireOwnedIndex(state.suppliers, id, userId, "Supplier");
      state.suppliers.splice(idx, 1);
      return { id };
    },
  });
