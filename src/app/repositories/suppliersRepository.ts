import { db } from "@/db/db";
import { Database, suppliers } from "@/db/schema";
import { ISupplierRepository } from "@/types/repositories";
import { DestructuredSupplier, RawDBSupplier } from "@/types/specialTypes";
import { and, eq } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class SupplierRepository implements ISupplierRepository {
  async findById(supplierId: string): Promise<RawDBSupplier | undefined> {
    try {
      const supplier = await db.query.suppliers.findFirst({
        where: eq(suppliers.id, supplierId),
        with: {
          supplierFinancialData: true,
          supplierAddresses: true,
          supplierCategories: true,
        },
      });
      return supplier;
    } catch (err) {
      throw new DatabaseError("Supplier FindById", err);
    }
  }

  async findAll(userId: string): Promise<RawDBSupplier[] | undefined> {
    try {
      const totalSuppliers = await db.query.suppliers.findMany({
        where: eq(suppliers.userId, userId),
        with: {
          supplierAddresses: true,
          supplierCategories: true,
          supplierFinancialData: true,
        },
      });
      return totalSuppliers;
    } catch (err) {
      throw new DatabaseError("Supplier FindAll", err);
    }
  }

  async create(
    supplier: DestructuredSupplier,
    tx: Database
  ): Promise<{ id: string } | undefined> {
    try {
      const [supplierId] = await tx
        .insert(suppliers)
        .values(supplier)
        .returning({
          id: suppliers.id,
        });
      return supplierId;
    } catch (err) {
      throw new DatabaseError("Supplier Create", err);
    }
  }
  async update(
    supplierId: string,
    supplier: DestructuredSupplier,
    tx: Database
  ): Promise<{ id: string } | undefined> {
    try {
      const [id] = await tx
        .update(suppliers)
        .set(supplier)
        .where(eq(suppliers.id, supplierId))
        .returning({ id: suppliers.id });

      return id;
    } catch (err) {
      throw new DatabaseError("Supplier Update", err);
    }
  }
  async delete(supplierId: string): Promise<{ id: string } | undefined> {
    try {
      const [supplier] = await db
        .delete(suppliers)
        .where(eq(suppliers.id, supplierId))
        .returning({
          id: suppliers.id,
        });
      return supplier;
    } catch (err) {
      throw new DatabaseError("Supplier Delete", err);
    }
  }

  async findByName(
    suppliersName: string,
    userId: string
  ): Promise<{ name: string; id: string } | undefined> {
    const [result] = await db
      .select({
        name: suppliers.name,
        id: suppliers.id,
      })
      .from(suppliers)
      .where(
        and(eq(suppliers.userId, userId), eq(suppliers.name, suppliersName))
      );

    return result ? result : undefined;
  }
}
