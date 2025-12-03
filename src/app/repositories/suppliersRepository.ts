import { Database, suppliers } from "@/db/schema";
import { ISupplierRepository } from "@/types/repositories";
import { DBSupplier } from "@/types/specialTypes";

export class SupplierRepository implements ISupplierRepository {
    async findById(supplierId: string): Promise<DBSupplier[] | undefined> {
        
    }

    async findAll(userId: string): Promise<DBSupplier[] | undefined> {
        
    }
    async create(supplier: DBSupplier, tx: Database): Promise<{ supplierId: string; } | undefined> {
        console.log('create repository:', supplier)
        try {
           const [supplierId] =  await tx
            .insert(suppliers)
            .values(supplier)
            .returning({
                supplierId: suppliers.id
            })
            return supplierId
            
        }catch(err) {
            throw new Error(`Supplier Repository: ${err}`)
        }
        
    }
    async update(supplierId: string, supplier: DBSupplier, tx?: Database): Promise<{ supplierId: string; } | undefined> {
        
    }
    async delete(supplierId: string, tx: Database): Promise<{ id: string; } | undefined> {
        
    }
}