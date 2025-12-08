import { db } from "@/db/db";
import { Database, supplierCategories, supplierFinancialData, suppliers, suppplierAddresses } from "@/db/schema";
import { ISupplierRepository } from "@/types/repositories";
import { DBSupplier } from "@/types/specialTypes";
import { eq } from "drizzle-orm";
import { transformSupplierFromDB } from "../services/helpers";

export class SupplierRepository implements ISupplierRepository {
    async findById(supplierId: string): Promise<DBSupplier | undefined> {

        try {
            const supplier = await db
            .query.suppliers.findFirst({
                where: eq(suppliers.id, supplierId),
                with: {
                    supplierFinancialData: true,
                    suppplierAddresses: true,
                    supplierCategories: true
                }
            })
            return supplier
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