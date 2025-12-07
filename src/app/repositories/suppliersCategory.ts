import { Database, supplierCategories } from "@/db/schema";
import { IngredientCategory } from "@/shemas/recipe";
import { ISuppliersCategoryRepository } from "@/types/repositories";

export class SuppliersCategoryRepository implements ISuppliersCategoryRepository {

    async create(category: IngredientCategory, tx: Database, suppliersId: string): Promise<void> {
        console.log(category, suppliersId)
        try {
            await tx 
            .insert(supplierCategories)
            .values({categoryId: category, suplierId: suppliersId})
        }catch(err){
            throw new Error(`SupplierCategoryRepository: ${err}`)
        }
        

    }
    async update(category: string, tx: Database, suppliersId: string): Promise<void> {
        
    }
    async delete(category: string, tx: Database, suppliersId: string): Promise<void> {
        
    }
}