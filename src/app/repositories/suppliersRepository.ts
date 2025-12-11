import { db } from "@/db/db";
import { Database, suppliers} from "@/db/schema";
import { ISupplierRepository } from "@/types/repositories";
import { DBSupplier, DestructuredSupplier, RawDBSupplier } from "@/types/specialTypes";
import { eq } from "drizzle-orm";

export class SupplierRepository implements ISupplierRepository {

    async findById(supplierId: string): Promise<RawDBSupplier | undefined> {

        try {
            const supplier = await db
            .query.suppliers.findFirst({
                where: eq(suppliers.id, supplierId),
                with: {
                    supplierFinancialData: true,
                    supplierAddresses: true,
                    supplierCategories: true
                }
            })
            return supplier
        }catch(err){
            throw new Error(`SupplierRepository.findById: ${err}`)
        }
    }

    async findAll(userId: string): Promise<RawDBSupplier[] | undefined> {

        try {
            const totalSuppliers = await db
            .query.suppliers.findMany({
                where: eq(suppliers.userId, userId),
                with: {
                    supplierAddresses: true,
                    supplierCategories: true,
                    supplierFinancialData: true
                }
            })
            return totalSuppliers
        }catch(err){
            throw new Error(`SupplierRepository: ${err}`)
        }
    }

    async create(supplier: DestructuredSupplier, tx: Database): Promise<{ supplierId: string; } | undefined> {
        console.log('supplier repo', supplier)
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