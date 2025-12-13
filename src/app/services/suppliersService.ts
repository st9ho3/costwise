import { ISupplierService } from "@/types/services";
import {  prepareSupplierForDB, transformSupplierFromDB } from "./helpers";
import { db } from "@/db/db";
import { SupplierRepository } from "../repositories/suppliersRepository";
import { Supplier } from "@/shemas/recipe";
import { SupplierAddressRepository } from "../repositories/addressesRepository";
import { SupplierFinDataRepository } from "../repositories/supplierFinancialDataRepository";
import { SuppliersCategoryRepository } from "../repositories/suppliersCategory";

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

    async create(supplier: Supplier): Promise<{ id: string } | undefined> {
        
        const {categories, address, financialData, dbSupplier} = prepareSupplierForDB(supplier)
        
        try {

            const transactionResponse = await db.transaction(async (tx) => {
                
                const supplierId = await this.supplierRepository.create(dbSupplier, tx)
                 await this.addressRepository.create(address, tx, dbSupplier.id)
                 await this.financialDataRepository.create(financialData, tx, dbSupplier.id)
                 await Promise.all(categories.map(async (category) => await this.suppliersCategoryRepository.create(category, tx, dbSupplier.id)))
                return {supplierId}
            })
            return transactionResponse.supplierId

        }catch(err) {
            throw new Error(String(err))
        }
        
    }

    async update(supplier: Supplier): Promise<{ id: string; } | undefined> {

        const {categories, address, financialData, dbSupplier} = prepareSupplierForDB(supplier)

        try {
            const transactionResponse = await db.transaction(async(tx) => {
                const supplierId = await this.supplierRepository.update(dbSupplier.id, dbSupplier, tx)
                 await this.addressRepository.update(dbSupplier.id, address, tx)
                 await this.financialDataRepository.update(dbSupplier.id, financialData, tx)
                return supplierId
            })
            return transactionResponse
        }catch(err){
            throw new Error(`Supplier Service Update: ${err}`)
        }
    }

    async delete(supplierId: string): Promise<{id: string} | undefined> {
        const response = await this.supplierRepository.delete(supplierId)
        return response
    }
}

