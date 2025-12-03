import { Database, suppplierAddresses } from "@/db/schema";
import { Supplier } from "@/shemas/recipe";
import { IAddressesRepository } from "@/types/repositories";
import { DBSupplierAddress } from "@/types/specialTypes";

export class SupplierAddressRepository implements IAddressesRepository {
    async findById(adresssId: string): Promise<[] | undefined> {
        
    }
    async findAll(userId: string): Promise<Supplier[] | undefined> {
        
    }
    async create(address: DBSupplierAddress, tx: Database, suppliersId: string): Promise<{ addressId: string; } | undefined> {
        const addressForDb = {...address, suppliersId}
        console.log(addressForDb)
        try {
            const [addressId] = await tx
            .insert(suppplierAddresses)
            .values(addressForDb)
            .returning({
                addressId: suppplierAddresses.id
            })
            return addressId
        }catch(err){
            throw new Error(`address repository: ${err}`)
        }
    }
    async update(supplierId: string, supplier: Supplier, tx?: Database): Promise<{ supplierId: string; } | undefined> {
        
    }
    async delete(supplierId: string, tx: Database): Promise<{ id: string; } | undefined> {
        
    }
}