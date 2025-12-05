import { Supplier } from "@/shemas/recipe";

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
  | 'very_low'
  | 'low'
  | 'medium'
  | 'high'
  // Ingredient Category types (using "pretty" strings)
  | 'Produce'
  | 'Meat & Poultry'
  | 'Fish & Seafood'
  | 'Dairy & Alternatives'
  | 'Dry Goods'
  | 'Spices & Seasonings'
  | 'Oils, Vinegars, & Condiments'
  | 'Frozen'
  | 'Coffee & Tea'
  | 'Beverages (Other)'
  | 'Bakery'
  | 'Other'
  | ''; // Default/unset

  export type IngredientCategoryType = Exclude<LabelType, 'very_low' | 'low' | 'medium' | 'high'>;

  export type DBSupplier = Omit<
  Supplier,
  | 'category'
  | 'address'
  | 'paymentTerms'
  | 'vatNumber'
  | 'notes'
  >

  export type DBSupplierAddress = Supplier['address'];
  export type DBSupplierFinancialData = Supplier['financialData']

