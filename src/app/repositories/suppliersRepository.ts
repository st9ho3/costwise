import { db } from "@/db/db";
import { Database, suppliers } from "@/db/schema";
import { ISupplierRepository } from "@/types/repositories";
import { DBSupplier } from "@/types/specialTypes";
import { eq } from "drizzle-orm";
import { transformSupplierFromDB } from "../services/helpers";

export class SupplierRepository implements ISupplierRepository {
    async findById(supplierId: string): Promise<DBSupplier | undefined> {

        try {
            const [supplier] = await db
            .select()
            .from(suppliers)
            .where(eq(suppliers.id, supplierId))
            return transformSupplierFromDB(supplier)
        }catch(err){
            throw new Error(`SupplierRepository.findById: ${err}`)
        }
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
    async delete(supplierId: string): Promise<{ id: string; } | undefined> {
        try {
            const [supplier] = await db
            .delete(suppliers)
            .where(eq(suppliers.id, supplierId))
            .returning({
                id: suppliers.id
            })
            return supplier
        }catch(err){
            throw new Error(`SupplierRepository.delete ${err}`)
        }
    }
}