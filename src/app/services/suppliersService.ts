import { ISupplierService } from "@/types/services";
import { zodValidateSupplierBeforeAddThemToDatabase } from "./services";
import { destructureSupplier, transformSupplierFromDB } from "./helpers";
import { db } from "@/db/db";
import { SupplierRepository } from "../repositories/suppliersRepository";
import { Supplier } from "@/shemas/recipe";
import { SupplierAddressRepository } from "../repositories/addressesRepository";
import { SupplierFinDataRepository } from "../repositories/supplierFinancialDataRepository";
import { SuppliersCategoryRepository } from "../repositories/suppliersCategory";
import { RawDBSupplier } from "@/types/specialTypes";

export class SupplierService implements ISupplierService {

    private supplierRepository: SupplierRepository
    private addressRepository: SupplierAddressRepository
    private financialDataRepository: SupplierFinDataRepository
    private suppliersCategoryRepository: SuppliersCategoryRepository

    constructor() {
        this.supplierRepository = new SupplierRepository()
        this.addressRepository = new SupplierAddressRepository()
        this.financialDataRepository = new SupplierFinDataRepository()
        this.suppliersCategoryRepository = new SuppliersCategoryRepository()
        
    }

    async findById(supplierId: string): Promise<Supplier | undefined> {
        const supplier = await this.supplierRepository.findById(supplierId)
            if (!supplier) {
                throw new Error('SupplierService: Something happened')
            }
            return transformSupplierFromDB(supplier)
        
        
    }

    async findAll(userId: string): Promise<Supplier[] | undefined> {
        const suppliers = await this.supplierRepository.findAll(userId)

        return suppliers?.map((supplier) => transformSupplierFromDB(supplier))
    }

    async create(supplier: Supplier): Promise<{ supplierId: string } | undefined> {
        const validatedSupplier = zodValidateSupplierBeforeAddThemToDatabase(supplier)
        if (!validatedSupplier) {
            throw new Error('Supplier Service, Error with validating supplier')
        }
        const {categories, address, financialData, dbSupplier} = destructureSupplier(validatedSupplier)
        console.log('Supplier Service: ', financialData)
        try {

            const transactionResponse = await db.transaction(async (tx) => {
                
                const supplierId = await this.supplierRepository.create(dbSupplier, tx)
                 await this.addressRepository.create(address, tx, dbSupplier.id)
                 await this.financialDataRepository.create(financialData, tx, dbSupplier.id)
                 await Promise.all(categories.map(async (category) => await this.suppliersCategoryRepository.create(category, tx, dbSupplier.id)))
                return {supplierId}
            })
            return transactionResponse

        }catch(err) {
            throw new Error(String(err))
        }
        
    }

    async update(supplier: Supplier): Promise<{ supplierId: string; } | undefined> {
        
    }

    async delete(supplierId: string): Promise<void> {
        const response = await this.supplierRepository.delete(supplierId)
        return response
    }
}

