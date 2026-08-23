import { Database, supplierFinancialData } from "@costwise/db/schema";
import {
  ISupplierFinancialDataRepository,
  OperationResult,
} from "../types/repositories";
import { DBSupplierFinancialData } from "@costwise/shared/specialTypes";
import { eq } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class SupplierFinDataRepository
  implements ISupplierFinancialDataRepository
{
  async create(
    finData: DBSupplierFinancialData,
    tx: Database,
    suppliersId: string
  ): Promise<OperationResult | undefined> {
    try {
      if (finData) {
        const [result] = await tx
          .insert(supplierFinancialData)
          .values({ ...finData, supplierId: suppliersId })
          .returning({
            id: supplierFinancialData.supplierId,
          });
        return result;
      }
    } catch (err) {
      throw new DatabaseError("FinData Repository", err);
    }
  }
  async update(
    supplierId: string,
    finData: DBSupplierFinancialData,
    tx: Database
  ): Promise<OperationResult | undefined> {
    const [result] = await tx
      .update(supplierFinancialData)
      .set({ ...finData, supplierId: supplierId })
      .where(eq(supplierFinancialData.supplierId, supplierId))
      .returning({
        id: supplierFinancialData.supplierId,
      });
    return result;
  }
}
