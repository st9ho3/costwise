import { Database, supplierFinancialData } from "@/db/schema";
import { ISupplierFinancialDataRepository } from "@/types/repositories";
import { DBSupplierFinancialData } from "@/types/specialTypes";
import { eq } from "drizzle-orm";

export class SupplierFinDataRepository implements ISupplierFinancialDataRepository {

    async create(finData: DBSupplierFinancialData, tx: Database, suppliersId: string): Promise<{ confirmation: string; } | undefined> {
        try {
            if (finData) {
                console.log('finData repository: ', finData)
            const [supplierId] = await tx 
            .insert(supplierFinancialData)
            .values({...finData, supplierId: suppliersId})
            .returning({
                confirmation: supplierFinancialData.supplierId
            })
            return supplierId ? {confirmation: 'Suppliers Data saved succesfully!'} : undefined
            }
        }catch(err){
            throw new Error(`FinData Repository: ${err}`)
        }
    }
    async update(supplierId: string, finData: DBSupplierFinancialData, tx: Database): Promise<{ confirmation: string; } | undefined> {
        console.log(finData)
        const [id] = await tx
        .update(supplierFinancialData)
        .set({...finData, supplierId: supplierId})
        .where(eq(supplierFinancialData.supplierId, supplierId))
        .returning({
                confirmation: supplierFinancialData.supplierId
            }
        )
        return id
    }
}