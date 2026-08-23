/* eslint-disable @typescript-eslint/no-unused-vars */
import { Database, supplierIngredients } from "@costwise/db/schema";
import { ISupplierIngredientRepository } from "../types/repositories";
import { SupplierIngredientData } from "../utils/transformers";

export class SupplierIngredientRepository implements ISupplierIngredientRepository {
  async create(
    tx: Database,
    data: SupplierIngredientData[],
  ): Promise<SupplierIngredientData[]> {
    const response = await tx
      .insert(supplierIngredients)
      .values(data)
      .returning();
    return response;
  }
  async update(
    tx: Database,
    supplierId: string,
    data: SupplierIngredientData[],
  ): Promise<void> {}
  async delete(
    tx: Database,
    supplierId: string,
    ingreientId: string,
  ): Promise<void> {}
}
