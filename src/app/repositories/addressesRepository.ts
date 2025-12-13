import { Database, supplierAddresses } from "@/db/schema";
import { IAddressesRepository } from "@/types/repositories";
import { DBSupplierAddress } from "@/types/specialTypes";

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
    async update(supplierId: string, address: DBSupplierAddress, tx: Database): Promise<{ addressId: string; } | undefined> {
        const addressForDb = {...address, supplierId}
        const [addressId] = await tx
        .update(supplierAddresses)
        .set(addressForDb)
        .returning(
            {addressId: supplierAddresses.id}
        )
        return addressId
    }
    
}