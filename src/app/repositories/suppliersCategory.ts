import { Database, supplierCategories } from "@/db/schema";
import { IngredientCategory } from "@/shemas/recipe";
import { ISuppliersCategoryRepository } from "@/types/repositories";
import { and, eq } from "drizzle-orm";

export class SuppliersCategoryRepository implements ISuppliersCategoryRepository {

    async create(category: IngredientCategory, tx: Database, suppliersId: string): Promise<void> {
        console.log(`Category of Supplier ${suppliersId} is: ${category}`)
        try {
            await tx 
            .insert(supplierCategories)
            .values({categoryId: category, suplierId: suppliersId})
        }catch(err){
            throw new Error(`SupplierCategoryRepository: ${err}`)
        }
        

    }

    async delete(category: string, tx: Database, suppliersId: string): Promise<void> {
        try {
            await tx
            .delete(supplierCategories)
            .where(and(
                eq(supplierCategories.categoryId, category),
                eq(supplierCategories.suplierId, suppliersId)
            ))
        }catch(err){
            throw new Error(`SuppliersCategoryRepository.delete: ${err}`)
        }
    }
}