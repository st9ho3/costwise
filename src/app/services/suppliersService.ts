import { ISupplierService } from "@/types/services";
import {
  prepareSupplierForDB,
  transformSupplierFromDB,
} from "../utils/transformers";
import { db } from "@/db/db";
import { SupplierRepository } from "../repositories/suppliersRepository";
import { IngredientCategory, Supplier } from "@/shemas/recipe";
import { SupplierAddressRepository } from "../repositories/addressesRepository";
import { SupplierFinDataRepository } from "../repositories/supplierFinancialDataRepository";
import { SuppliersCategoryRepository } from "../repositories/suppliersCategory";
import { SupplierUpdatePayload } from "@/types/context";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

export class SupplierService implements ISupplierService {
  private supplierRepository: SupplierRepository;
  private addressRepository: SupplierAddressRepository;
  private financialDataRepository: SupplierFinDataRepository;
  private suppliersCategoryRepository: SuppliersCategoryRepository;
  private currentUserID: string | undefined;

  constructor(currentUserID: string) {
    this.supplierRepository = new SupplierRepository();
    this.addressRepository = new SupplierAddressRepository();
    this.financialDataRepository = new SupplierFinDataRepository();
    this.suppliersCategoryRepository = new SuppliersCategoryRepository();
    this.currentUserID = currentUserID;
  }

  async findById(supplierId: string): Promise<Supplier | undefined> {
    const supplier = await this.supplierRepository.findById(supplierId);
    if (!supplier) {
      throw new NotFoundError("Supplier", supplierId);
    }
    if (supplier?.userId !== this.currentUserID) {
      throw new ForbiddenError("Supplier", supplier.id, this.currentUserID);
    }

    return transformSupplierFromDB(supplier);
  }

  async findAll(userId: string): Promise<Supplier[] | undefined> {
    if (userId !== this.currentUserID) {
      throw new ForbiddenError(
        "Suppliers",
        "All suppliers",
        this.currentUserID
      );
    }
    const suppliers = await this.supplierRepository.findAll(userId);

    return suppliers?.map((supplier) => transformSupplierFromDB(supplier));
  }

  async create(
    supplier: SupplierUpdatePayload
  ): Promise<{ id: string } | undefined> {
    if (supplier.supplier.userId !== this.currentUserID) {
      throw new ForbiddenError(
        "Supplier",
        supplier.supplier.id,
        this.currentUserID
      );
    }
    const exists = await this.supplierRepository.findByName(
      supplier.supplier.name,
      this.currentUserID
    );
    if (exists) {
      throw new ConflictError("Supplier", "name");
    }

    const { destructuredSupplier } = prepareSupplierForDB(supplier, "create");

    const transactionResponse = await db.transaction(async (tx) => {
      const supplierId = await this.supplierRepository.create(
        destructuredSupplier.dbSupplier,
        tx
      );
      await this.addressRepository.create(
        destructuredSupplier.address,
        tx,
        destructuredSupplier.dbSupplier.id
      );
      await this.financialDataRepository.create(
        destructuredSupplier.financialData,
        tx,
        destructuredSupplier.dbSupplier.id
      );
      await Promise.all(
        destructuredSupplier.categories.map(
          async (category: IngredientCategory) =>
            await this.suppliersCategoryRepository.create(
              category,
              tx,
              destructuredSupplier.dbSupplier.id
            )
        )
      );
      return { supplierId };
    });
    return transactionResponse.supplierId;
  }

  async update(
    supplier: SupplierUpdatePayload
  ): Promise<{ id: string } | undefined> {
    if (supplier.supplier.userId !== this.currentUserID) {
      throw new ForbiddenError(
        "Supplier",
        supplier.supplier.id,
        this.currentUserID
      );
    }

    const existResult = await this.supplierRepository.findByName(
      supplier.supplier.name,
      this.currentUserID
    );
    if (existResult && existResult.id !== supplier.supplier.id) {
      throw new ConflictError("Supplier", "name");
    }

    const { validatedAddedItems, validatedRemovedItems, destructuredSupplier } =
      prepareSupplierForDB(supplier, "update");

    const transactionResponse = await db.transaction(async (tx) => {
      const supplierId = await this.supplierRepository.update(
        destructuredSupplier.dbSupplier.id,
        destructuredSupplier.dbSupplier,
        tx
      );
      await this.addressRepository.update(
        destructuredSupplier.dbSupplier.id,
        destructuredSupplier.address,
        tx
      );
      await this.financialDataRepository.update(
        destructuredSupplier.dbSupplier.id,
        destructuredSupplier.financialData,
        tx
      );
      if (validatedRemovedItems) {
        await Promise.all(
          validatedRemovedItems.map(async (item) => {
            await this.suppliersCategoryRepository.delete(
              item,
              tx,
              destructuredSupplier.dbSupplier.id
            );
          })
        );
      }
      if (validatedAddedItems) {
        await Promise.all(
          validatedAddedItems.map(async (item) => {
            await this.suppliersCategoryRepository.create(
              item,
              tx,
              destructuredSupplier.dbSupplier.id
            );
          })
        );
      }
      return supplierId;
    });
    return transactionResponse;
  }

  async delete(supplierId: string): Promise<{ id: string } | undefined> {
    const exists = await this.supplierRepository.findById(supplierId);

    if (!exists) {
      throw new NotFoundError("Supplier", supplierId);
    }
    if (exists.userId !== this.currentUserID) {
      throw new ForbiddenError("Supplier", exists.id, this.currentUserID);
    }
    const response = await this.supplierRepository.delete(supplierId);
    return response;
  }
}
