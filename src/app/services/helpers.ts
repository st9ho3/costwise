/**
 * Utility functions for recipe and ingredient management, pagination, pricing calculations,
 * and data transformation between database and application layers.
 * 
 * This module provides:
 * - Pagination helpers for recipes and ingredients
 * - Core pricing logic including total cost, selling price, and profit margin calculations
 * - Unit-aware price normalization for consistent cost tracking
 * - Data transformation utilities to convert between database (string-based) and application (number/date-based) representations
 * - Recipe data recalculation logic that reconciles form inputs with existing recipe data
 * 
 * These functions are used across the application to ensure consistent data handling,
 * financial calculations, and pagination of recipe and ingredient lists.
 */
import { DBIngredient, DBRecipe, Ingredient, Recipe, RecipeIngredients, Unit } from "@/shemas/recipe";
import { RecipeIngredientFromDB } from "@/types/specialTypes";
import { FormFields } from "../hooks/useRecipeForm";
import { IngredientFormFields } from "../hooks/useIngredientsForm";


export const paginate = <T>(itemsPerPage: number, page: number, items: T[] ): T[]=> {
    if (items.length === 0) {
      console.log('No items to display')
      return []
    }
    const indexOfFirstItem = itemsPerPage * (page - 1) 
    const indexOfLastItem = itemsPerPage * page - 1 
    
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem + 1)
    return currentItems
  } 

  export const paginationPages = (items: Recipe[] | Ingredient[], itemsPerPage: number ) => {
   
  const pages = Math.ceil(items.length / itemsPerPage);
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  return pageNumbers

}

//////////

export const getTotalPrice = (ingredients: RecipeIngredients[]): number => {
  
  return ingredients.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

}

export const normalizePrice = (price: number, unit: Unit, quantity: number): number => {
  

  if (isNaN(price) || quantity === 0) {
    return 0;
  }

  // Calculate the price based on the unit.
  switch (unit) {
    case 'kg':
      // For kilograms, convert to grams (1kg = 1000g) and find the price per gram.
      return price / (quantity * 1000);
    case 'g':
      // For grams, calculate the price per gram directly.
      return price / quantity;
    case 'L':
      // For liters, convert to milliliters (1L = 1000ml) and find the price per ml.
      return price / (quantity * 1000);
    case 'ml':
      // For milliliters, calculate the price per ml directly.
      return price / quantity;
    case 'piece':
      // For pieces, calculate the price per piece.
      return price / quantity;
    default:
      // If the unit is not recognized, return 0.
      return 0;
  }
};

export const calculateSellingPrice = (cost: number, profitMargin: number, tax: number): number | undefined => {
  const denominator = (1 - tax) - (profitMargin / 100);
  if (denominator > 0 && profitMargin > 0) {
    return cost / denominator;
  }
  return undefined;
};

export const calculateProfitMargin = (cost: number, sellingPrice: number, tax: number): number | undefined => {
  if (sellingPrice > 0) {
    return ((sellingPrice - (sellingPrice * tax) - cost) / sellingPrice) * 100;
    
  }
  return undefined;
};

export const calculateRecipeData = (data: FormFields, recipe: Recipe | undefined, tempIngredients: RecipeIngredients[] ) => {
  
  const newCost = getTotalPrice(tempIngredients);
  console.log(newCost)
  const margin = data.profitMargin !== undefined && data.profitMargin !== recipe?.profitMargin
    ? data.profitMargin
    : recipe?.profitMargin;

  const price = data.sellingPrice !== undefined && data.sellingPrice !== recipe?.sellingPrice
    ? data.sellingPrice
    : recipe?.sellingPrice;

  const newTax = data.tax !== undefined
    ? data.tax
    : recipe?.tax || 0;

  const foodCost = price ? (newCost / price)*100 : 0;
console.log(price)
  const newPrice = (data.profitMargin !== undefined && data.profitMargin !== recipe?.profitMargin && margin !== undefined)
    ? calculateSellingPrice(newCost, margin, newTax)
    : price;

  const newMargin = (newPrice !== undefined && newPrice !== null)
    ? calculateProfitMargin(newCost, newPrice, newTax)
    : undefined;

  return {
    margin: margin,
    price: price,
    newCost: newCost,
    newTax: newTax,
    foodCost: foodCost,
    newPrice: newPrice,
    newMargin: newMargin
  };
}



/////////////

export const transformRecipeFromDB = (recipeFromDb: DBRecipe): Recipe => ({
  ...recipeFromDb,
    totalCost: Number(recipeFromDb.totalCost),
    tax: Number(recipeFromDb.tax),
    sellingPrice: Number(recipeFromDb.sellingPrice),
    profitMargin: Number(recipeFromDb.profitMargin),
    foodCost: Number(recipeFromDb.foodCost),
    dateCreated: new Date(recipeFromDb.dateCreated),
    imgPath: recipeFromDb.imgPath,
}) 

export const transformRecipeToDB = (recipe: Recipe): DBRecipe => ({
          ...recipe,
          totalCost: recipe.totalCost.toString(),
          dateCreated: recipe.dateCreated.toISOString().split('T')[0],
          tax: recipe.tax.toString(),
          sellingPrice: recipe.sellingPrice ? recipe.sellingPrice.toString() : "0",
          profitMargin: recipe.profitMargin ? recipe.profitMargin.toString() : "0",
          foodCost: recipe.foodCost ? recipe.foodCost.toString() : "0"
}) 

export const transformIngredientFromDB = (ingredient: DBIngredient): Ingredient => ({
  ...ingredient,
  unitPrice: Number(ingredient.unitPrice),
  quantity: Number(ingredient.quantity)
})

export const transformIngredientToDB = (ingredient: Ingredient): DBIngredient => ({
  ...ingredient,
  unitPrice: ingredient.unitPrice.toString(),
  quantity: ingredient.quantity.toString()
})

export const transformRecipeIngredentFromDB = (
  ingredient: RecipeIngredientFromDB
): RecipeIngredients => {
  return {
    name: ingredient.ingredients.name,
    unit: ingredient.ingredients.unit,
    unitPrice: parseFloat(ingredient.ingredients.unitPrice),
    quantity: parseFloat(ingredient.quantity),
    recipeId: ingredient.recipeId,
    ingredientId: ingredient.ingredientId,
  };
};


////////////////

export const createIngredientPrototype = (data: IngredientFormFields, userId: string) => {

  if (data) {
    const normalizedUnitPrice = normalizePrice(data.unitPrice, data.unit as Unit, data.quantity);

      const ingredientPrototype: Ingredient = {
        id: data.id,
        icon: '🥑',
        name: data.name,
        unit: data.unit === 'g' || data.unit === 'kg' ? 'g' : data.unit === 'L' || data.unit === 'ml' ? 'ml' : 'piece',
        unitPrice: normalizedUnitPrice,
        quantity: data.quantity,
        usage: '0',
        userId: userId,
      };
      return ingredientPrototype
  }
  

      
}

export const createEditIngredientPrototype = (data: IngredientFormFields, ingredient: Ingredient, userId: string) => {

  const normalizedUnitPrice = normalizePrice(data.unitPrice, data.unit as Unit, data.quantity);
      // Edit mode logic
      const updatedIngredient: Ingredient = {
        id: ingredient.id,
        icon: ingredient.icon || '🥑',
        name: data.name,
        unit: data.unit === 'g' || data.unit === 'kg' ? 'g' : data.unit === 'L' || data.unit === 'ml' ? 'ml' : 'piece',
        unitPrice: normalizedUnitPrice,
        quantity: data.quantity,
        usage: ingredient.usage || '0',
        userId: userId,
      };

      return updatedIngredient
}



