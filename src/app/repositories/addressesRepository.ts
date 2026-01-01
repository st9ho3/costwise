import { Database, supplierAddresses } from "@/db/schema";
import { IAddressesRepository } from "@/types/repositories";
import { DBSupplierAddress } from "@/types/specialTypes";
import { eq } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class SupplierAddressRepository implements IAddressesRepository {
  async create(
    address: DBSupplierAddress,
    tx: Database,
    suppliersId: string
  ): Promise<{ addressId: string } | undefined> {
    const addressForDb = { ...address, suppliersId };
    try {
      const [addressId] = await tx
        .insert(supplierAddresses)
        .values(addressForDb)
        .returning({
          addressId: supplierAddresses.id,
        });
      return addressId;
    } catch (err) {
      throw new DatabaseError("address repository", err);
    }
  }
  async update(
    supplierId: string,
    address: DBSupplierAddress,
    tx: Database
  ): Promise<{ addressId: string } | undefined> {
    if (!address) {
      return { addressId: "Address dont exist" };
    }
    const [addressId] = await tx
      .update(supplierAddresses)
      .set(address)
      .where(eq(supplierAddresses.suppliersId, supplierId))
      .returning({ addressId: supplierAddresses.id });
    return addressId;
  }
}
