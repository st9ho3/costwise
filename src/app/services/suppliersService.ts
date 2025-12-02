import { Supplier } from "@/shemas/recipe";
import { ISupplierService } from "@/types/services";
import { zodValidateSupplierBeforeAddThemToDatabase } from "./services";

export class SupplierService implements ISupplierService {
    async findById(supplierId: string): Promise<Supplier | undefined> {
        
    }

    async findAll(supplierId: string): Promise<Supplier[] | undefined> {
        
    }

    async create(supplier: Supplier): Promise<{ supplierId: string; } | undefined> {
        const validatedSupplier = zodValidateSupplierBeforeAddThemToDatabase(supplier)
        console.log('create service: ', validatedSupplier)
        
    }

    async update(supplier: Supplier): Promise<{ supplierId: string; } | undefined> {
        
    }

    async delete(supplierId: string): Promise<void> {
        
    }
}

