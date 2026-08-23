/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq } from "drizzle-orm";
import { Database, supplierIngredients } from "@costwise/db/schema";
import { ISupplierIngredientRepository } from "../types/repositories";
import { SupplierIngredientData } from "@costwise/shared/transformers";
import { Unit } from "@costwise/shared/recipe";

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
  async updateByIngredientId(
    tx: Database,
    ingredientId: string,
    data: { unit: Unit; unitPrice: string; quantity: string },
  ): Promise<void> {
    await tx
      .update(supplierIngredients)
      .set(data)
      .where(eq(supplierIngredients.ingredientId, ingredientId));
  }
  async delete(
    tx: Database,
    supplierId: string,
    ingreientId: string,
  ): Promise<void> {}
}
