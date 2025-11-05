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