import { Database } from "@/db/schema";
import { Supplier } from "@/shemas/recipe";
import { ISupplierRepository } from "@/types/repositories";

export class SupplierRepository implements ISupplierRepository {
    async findById(supplierId: string): Promise<Supplier[] | undefined> {
        
    }

    async findAll(userId: string): Promise<Supplier[] | undefined> {
        
    }
    async create(supplier: Supplier, tx: Database): Promise<{ supplierId: string; } | undefined> {
        
    }
    async update(supplierId: string, supplier: Supplier, tx?: Database): Promise<{ supplierId: string; } | undefined> {
        
    }
    async delete(supplierId: string, tx: Database): Promise<{ id: string; } | undefined> {
        
    }
}