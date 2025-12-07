import { Database, ingredientCategories } from "@/db/schema";
import { IIngredientCategoryRepository } from "@/types/repositories";

export class IngredientCategoryRepository implements IIngredientCategoryRepository {

    async create(category: string, tx: Database, ingredientId: string): Promise<void> {
        
        try {
            await tx
            .insert(ingredientCategories)
            .values({categoryId: category, ingredientId: ingredientId})
        }catch(err){

            throw new Error(`IngredientCategoryRepository: ${err} `)
        }
    }

    async delete(category: string, tx: Database, ingredientId: string): Promise<void> {
        
    }
} 