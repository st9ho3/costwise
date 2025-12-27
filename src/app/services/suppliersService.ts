import { ISupplierService } from "@/types/services";
import {  prepareSupplierForDB, transformSupplierFromDB } from "./helpers";
import { db } from "@/db/db";
import { SupplierRepository } from "../repositories/suppliersRepository";
import { IngredientCategory, Supplier } from "@/shemas/recipe";
import { SupplierAddressRepository } from "../repositories/addressesRepository";
import { SupplierFinDataRepository } from "../repositories/supplierFinancialDataRepository";
import { SuppliersCategoryRepository } from "../repositories/suppliersCategory";
import { SupplierUpdatePayload } from "@/types/context";

export class SupplierService implements ISupplierService {

    private supplierRepository: SupplierRepository
    private addressRepository: SupplierAddressRepository
    private financialDataRepository: SupplierFinDataRepository
    private suppliersCategoryRepository: SuppliersCategoryRepository
    private currentUserID: string | undefined

    constructor(currentUserID?: string) {
        this.supplierRepository = new SupplierRepository()
        this.addressRepository = new SupplierAddressRepository()
        this.financialDataRepository = new SupplierFinDataRepository()
        this.suppliersCategoryRepository = new SuppliersCategoryRepository()
        this.currentUserID = currentUserID
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

    async create(supplier: SupplierUpdatePayload): Promise<{ id: string } | undefined> {
        
        const {destructuredSupplier} = prepareSupplierForDB(supplier, 'create')
        if (destructuredSupplier.dbSupplier.userId !== this.currentUserID ) {
            throw new Error('Entity is not owned by user')
        }
        try {
            const transactionResponse = await db.transaction(async (tx) => {
                const supplierId = await this.supplierRepository.create(destructuredSupplier.dbSupplier, tx)
                 await this.addressRepository.create(destructuredSupplier.address, tx, destructuredSupplier.dbSupplier.id)
                 await this.financialDataRepository.create(destructuredSupplier.financialData, tx, destructuredSupplier.dbSupplier.id)
                 await Promise.all(destructuredSupplier.categories.map(async (category: IngredientCategory) => await this.suppliersCategoryRepository.create(category, tx, destructuredSupplier.dbSupplier.id)))
                return {supplierId}
            })
            return transactionResponse.supplierId

        }catch(err) {
            throw new Error(String(err))
        }
        
    }

    async update(supplier: SupplierUpdatePayload): Promise<{ id: string; } | undefined> {
        
        const { validatedAddedItems, validatedRemovedItems, destructuredSupplier } = prepareSupplierForDB(supplier, 'update')
        console.log('service: ', destructuredSupplier)

        try {
            const transactionResponse = await db.transaction(async(tx) => {
                const supplierId = await this.supplierRepository.update(destructuredSupplier.dbSupplier.id, destructuredSupplier.dbSupplier, tx)
                 await this.addressRepository.update(destructuredSupplier.dbSupplier.id, destructuredSupplier.address, tx)
                 await this.financialDataRepository.update(destructuredSupplier.dbSupplier.id, destructuredSupplier.financialData, tx)
                 if (validatedRemovedItems) {
                    await Promise.all(validatedRemovedItems.map(async(item) => {
                        await this.suppliersCategoryRepository.delete(item, tx, destructuredSupplier.dbSupplier.id)
                    }))
                 }
                 if (validatedAddedItems) {
                    await Promise.all(validatedAddedItems.map(async(item) => {
                        await this.suppliersCategoryRepository.create(item, tx, destructuredSupplier.dbSupplier.id)
                    }))
                 }
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

