import { Supplier } from "@/shemas/recipe";
import { ISupplierService } from "@/types/services";
import { zodValidateSupplierBeforeAddThemToDatabase } from "./services";
import { destructureSupplier } from "./helpers";

export class SupplierService implements ISupplierService {
    async findById(supplierId: string): Promise<Supplier | undefined> {
        
    }

    async findAll(supplierId: string): Promise<Supplier[] | undefined> {
        
    }

    async create(supplier: Supplier): Promise<{ supplierId: string; } | undefined> {
        const validatedSupplier = zodValidateSupplierBeforeAddThemToDatabase(supplier)
        if (!validatedSupplier) {
            throw new Error('Supplier Service, Error with validating supplier')
        }
        const {categories, address, paymentTerms, dbSupplier} = destructureSupplier(validatedSupplier)
        console.log(`cat: ${categories}, address: ${address}, payment: ${paymentTerms}, supplier: ${dbSupplier}`)


        
    }

    async update(supplier: Supplier): Promise<{ supplierId: string; } | undefined> {
        
    }

    async delete(supplierId: string): Promise<void> {
        
    }
}

