import { Database, supplierAddresses } from "@costwise/db/schema";
import { IAddressesRepository, OperationResult } from "@/types/repositories";
import { DBSupplierAddress } from "@/types/specialTypes";
import { eq } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class SupplierAddressRepository implements IAddressesRepository {
  async create(
    address: DBSupplierAddress,
    tx: Database,
    suppliersId: string
  ): Promise<OperationResult | undefined> {
    const addressForDb = { ...address, suppliersId };
    try {
      const [result] = await tx
        .insert(supplierAddresses)
        .values(addressForDb)
        .returning({
          id: supplierAddresses.id,
        });
      return result;
    } catch (err) {
      throw new DatabaseError("address repository", err);
    }
  }
  async update(
    supplierId: string,
    address: DBSupplierAddress,
    tx: Database
  ): Promise<OperationResult | undefined> {
    if (!address) {
      return undefined;
    }
    const [result] = await tx
      .update(supplierAddresses)
      .set(address)
      .where(eq(supplierAddresses.suppliersId, supplierId))
      .returning({ id: supplierAddresses.id });
    return result;
  }
}
