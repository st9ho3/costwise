import { ISupplierService } from "@/types/services";
import { zodValidateSupplierBeforeAddThemToDatabase } from "./services";
import { destructureSupplier } from "./helpers";
import { db } from "@/db/db";
import { SupplierRepository } from "../repositories/suppliersRepository";
import { Supplier } from "@/shemas/recipe";

export class SupplierService implements ISupplierService {

    private supplierRepository: SupplierRepository

    constructor() {
        this.supplierRepository = new SupplierRepository()
    }

    async findById(supplierId: string): Promise<Supplier | undefined> {
        
    }

    async findAll(supplierId: string): Promise<Supplier[] | undefined> {
        
    }

    async create(supplier: Supplier): Promise<{ supplierId: string } | undefined> {
        const validatedSupplier = zodValidateSupplierBeforeAddThemToDatabase(supplier)
        if (!validatedSupplier) {
            throw new Error('Supplier Service, Error with validating supplier')
        }
        const {categories, address, paymentTerms, dbSupplier} = destructureSupplier(validatedSupplier)

        try {

            const transactionResponse = await db.transaction(async (tx) => {
                const supplierId = await this.supplierRepository.create(dbSupplier, tx)
                return supplierId
            })
            return transactionResponse

        }catch(err) {
            throw new Error(String(err))
        }
        
    }

    async update(supplier: Supplier): Promise<{ supplierId: string; } | undefined> {
        
    }

    async delete(supplierId: string): Promise<void> {
        
    }
}

