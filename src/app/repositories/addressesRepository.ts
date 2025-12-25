import { Database, supplierAddresses } from "@/db/schema";
import { IAddressesRepository } from "@/types/repositories";
import { DBSupplierAddress } from "@/types/specialTypes";
import { eq } from "drizzle-orm";

export class SupplierAddressRepository implements IAddressesRepository {
    
    async create(address: DBSupplierAddress, tx: Database, suppliersId: string): Promise<{ addressId: string; } | undefined> {
        const addressForDb = {...address, suppliersId}
        try {
            const [addressId] = await tx
            .insert(supplierAddresses)
            .values(addressForDb)
            .returning({
                addressId: supplierAddresses.id
            })
            return addressId
        }catch(err){
            throw new Error(`address repository: ${err}`)
        }
    }
    async update(supplierId: string, addresses: DBSupplierAddress, tx: Database): Promise<{ addressId: string; } | undefined> {
        const address = addresses[0]
        const [addressId] = await tx
        .update(supplierAddresses)
        .set(address)
        .where(eq(supplierAddresses.suppliersId, address.suppliersId))
        .returning(
            {addressId: supplierAddresses.id}
        )
        return addressId
    }
    
}