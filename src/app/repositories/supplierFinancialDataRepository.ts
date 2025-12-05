import { Database, supplierFinancialData } from "@/db/schema";
import { Supplier } from "@/shemas/recipe";
import { ISupplierFinancialDataRepository } from "@/types/repositories";
import { DBSupplierFinancialData } from "@/types/specialTypes";

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
    async update(supplierId: string, finData: Supplier, tx?: Database): Promise<{ supplierId: string; } | undefined> {
        
    }
}