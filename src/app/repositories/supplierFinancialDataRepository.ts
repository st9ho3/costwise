import { Database, supplierFinancialData } from "@/db/schema";
import { Supplier } from "@/shemas/recipe";
import { ISupplierFinancialDataRepository } from "@/types/repositories";
import { DBSupplierAddress } from "@/types/specialTypes";

export class SupplierFinData implements ISupplierFinancialDataRepository {

    async create(finData: DBSupplierAddress, tx: Database, suppliersId: string): Promise<{ confirmation: string; } | undefined> {
        try {
            const [supplierId] = await tx 
            .insert(supplierFinancialData)
            .values(finData)
            .returning({
                confirmation: supplierFinancialData.supplierId
            })
            return supplierId ? {confirmation: 'Suppliers Data saved succesfully!'} : undefined
        }catch(err){
            throw new Error(`FinData Repository: ${err}`)
        }
    }
    async update(supplierId: string, finData: Supplier, tx?: Database): Promise<{ supplierId: string; } | undefined> {
        
    }
}