import { ingredientsTable, recipesTable, suppliers } from "@costwise/db/schema";
export * from "@costwise/shared/specialTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortColumns: Record<string, any> = {
  title: recipesTable.title,
  tax: recipesTable.tax,
  sellingPrice: recipesTable.sellingPrice,
  profitMargin: recipesTable.profitMargin,
  totalCost: recipesTable.totalCost,
  dateCreated: recipesTable.dateCreated,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supplierSortColumns: Record<string, any> = {
  name: suppliers.name,
  contactPerson: suppliers.contactPerson,
  email: suppliers.email,
  deliveryTime: suppliers.deliveryTime,
  dateAdded: suppliers.dateAdded,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ingredientSortColumns: Record<string, any> = {
  name: ingredientsTable.name,
  usage: ingredientsTable.usage,
  category: ingredientsTable.category,
};
