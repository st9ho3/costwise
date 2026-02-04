import { Database, supplierIngredients } from "@/db/schema";
import { ISupplierIngredientRepository } from "@/types/repositories";
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
  update(
    tx: Database,
    supplierId: string,
    data: SupplierIngredientData[],
  ): Promise<void> {}
  delete(
    tx: Database,
    supplierId: string,
    ingreientId: string,
  ): Promise<void> {}
}
