import { Database, supplierIngredients } from "@/db/schema";
import { ISupplierIngredientRepository } from "@/types/repositories";
import { SupplierIngredientData } from "../utils/transformers";

export class SupplierIngredientRepository implements ISupplierIngredientRepository {
  create(tx: Database, data: SupplierIngredientData[]): Promise<string[]> {
    const response = tx.insert(supplierIngredients).values(data).returning();

    console.log(response);
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
