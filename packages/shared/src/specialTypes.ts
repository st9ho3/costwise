import { Supplier } from "./recipe";

export type RecipeIngredientFromDB = {
  id: number;
  quantity: string;
  recipeId: string;
  ingredientId: string;
  ingredients: {
    id: string;
    icon: string | null;
    name: string;
    unit: string;
    unitPrice: string;
    quantity: string;
    usage: string;
  };
};

export type RecipeWithQuery = {
  id: string;
  title: string;
  totalCost: string;
  createdBy: string;
  dateCreated: string;
  category: "starter" | "main" | "dessert";
  tax: string;
  imgPath: string;
  sellingPrice: string;
  profitMargin: string;
  foodCost: string;
  userId: string;
  recipeIngredients: {
    id: number;
    recipeId: string;
    ingredientId: string;
    quantity: string;
    ingredients: {
      id: string;
      name: string;
      unit: string;
      unitPrice: string;
      quantity: string;
      icon: string | null;
      usage: string;
    };
  }[];
};

export interface TableHeadColumn {
  header: string;
  accessor: string;
  className?: string | undefined;
}

export interface SortStatus {
  isFiltering: boolean;
  isAscending: boolean;
  value: string;
}

export type LabelType =
  // Profit/Usage types
  | "very_low"
  | "low"
  | "medium"
  | "high"
  // Ingredient Category types (using "pretty" strings)
  | "Produce"
  | "Meat & Poultry"
  | "Fish & Seafood"
  | "Dairy & Alternatives"
  | "Dry Goods"
  | "Spices & Seasonings"
  | "Oils, Vinegars, & Condiments"
  | "Frozen"
  | "Coffee & Tea"
  | "Beverages (Other)"
  | "Bakery"
  | "Other"
  | ""
  | "Same Day"
  | "1-2 Days"
  | "2-3 Days"
  | "Up to 5 days"
  | "Weekly";

export type IngredientCategoryType = Exclude<
  LabelType,
  "very_low" | "low" | "medium" | "high"
>;

export type DestructuredSupplier = Omit<
  Supplier,
  | "category"
  | "address"
  | "paymentTerms"
  | "vatNumber"
  | "notes"
  | "financialData"
  | "deliveryTime"
> & {
  deliveryTime:
    | "Same Day"
    | "1-2 Days"
    | "2-3 Days"
    | "Up to 5 days"
    | "Weekly"
    | undefined
    | null;
};

export type DBSupplierAddress = Supplier["address"];
export type DBSupplierFinancialData = RawDBSupplier["supplierFinancialData"];

export interface RawDBSupplier {
  id: string;
  name: string;
  userId: string;
  icon: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  deliveryTime:
    | "Same Day"
    | "1-2 Days"
    | "2-3 Days"
    | "Up to 5 days"
    | "Weekly"
    | null;
  isActive: boolean;
  dateAdded: Date | null;
  supplierFinancialData: {
    supplierId: string;
    vatNumber: string | null;
    paymentTerms:
      | "Net 30"
      | "Net 60"
      | "Due on Receipt"
      | "COD"
      | "Prepaid"
      | "Net 90"
      | null;
    defaultCurrency: string | null;
  };
  supplierAddresses: {
    id: string;
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    suppliersId: string;
  }[];
  supplierCategories: {
    suplierId: string | null;
    categoryId: string | null;
  }[];
}

export type Metadata = {
  page: number | undefined;
  order: "desc" | "asc" | undefined;
  sort: string | undefined;
  itemsPerPage: number;
  offset: number;
};
