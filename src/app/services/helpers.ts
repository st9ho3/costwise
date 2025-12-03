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
import { DBIngredient, DBRecipe, Ingredient, IngredientCategoryName, IngredientToDisplay, Recipe, RecipeIngredients, Supplier, Unit } from "@/shemas/recipe";
import {  RecipeIngredientFromDB } from "@/types/specialTypes";
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

/////////////////////////////////////////////////

export const getTotalPrice = (ingredients: RecipeIngredients[]): number => {
  
  return ingredients.reduce((sum, item) => {
    return item.unit === "kg" || item.unit === "L" ? sum + item.unitPrice * item.quantity*1000 : sum + item.unitPrice* item.quantity
  }, 0);

}


export const getProfitMarginType = (margin: number | undefined): 'high' | 'medium' | 'low' | 'very_low' => {
  if (margin === undefined || margin <= 40) {
    return 'very_low'; // Treat undefined or margin <= 40 as the lowest category
  }

  if (margin > 60) {
    return 'high';
  }

  if (margin > 50) {
    return 'medium';
  }
  
  return 'low';
};

export const getUsageCategory = (usagePercentage: number): 'high' | 'medium' | 'low' => {

  if (usagePercentage > 15) {
    return 'high';
  }

  if (usagePercentage > 8) {
    return 'medium';
  }

  return 'low'
};

export const formatPrice = (priceValue: string | number | undefined): string => {
  if (!priceValue) {
    return 'Unavailable'
  }
  const unitPrice = Number(priceValue) || 0; 
 
  if (unitPrice < 1) {
    return unitPrice.toFixed(3);
  } else {
    return unitPrice.toFixed(1);
  }
};

export const getDisplayUnit = (unit: string | undefined): string => {
  if (!unit) {
    return 'undefined'
  }
  if (unit === 'kg' || unit === 'g') return 'g';
  if (unit === 'ml' || unit === 'L') return 'ml';
  return 'piece';
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
  /*   case 'piece':
      // For pieces, calculate the price per piece.
      return price / quantity; */
    default:
      // If the unit is not recognized, return 0.
      return price/quantity;
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

export const transformIngredientFromDB = (ingredient: DBIngredient, category?: IngredientCategoryName): IngredientToDisplay => ({
  ...ingredient,
  categoryName: category ? category : 'Other',
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
const createIngredientIcon = (category: string | undefined): string => {
  switch (category) {
    case '5dee106a-5050-443e-8368-03397e02af6d': // Produce
      return '🥕';
    case 'a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5': // Meat & Poultry
      return '🥩';
    case '1670a6d4-f212-4770-80c7-0e31c0f4c26b': // Fish & Seafood
      return '🐟';
    case '80662af1-1943-4168-8549-ef721b0e9f54': // Dairy & Alternatives
      return '🧀';
    case 'b660f354-a89d-420c-80d1-ba0f16b433ec': // Dry Goods
      return '🌾';
    case '90aae231-631c-4fed-baf0-929be5a26b13': // Spices & Seasonings
      return '🧂';
    case '25f19080-3387-4470-95df-598817d5ccfe': // Oils, Vinegars, & Condiments
      return '🫙';
    case '83602573-0b31-439c-8890-ee084a547c22': // Frozen
      return '❄️';
    case 'ad6fbf47-f289-4ffb-b070-a5957330a56b': // Coffee & Tea
      return '☕';
    case 'f50e6aea-bb2d-42a1-8778-52cdbfec1540': // Beverages (Other)
      return '🧃';
    case '0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5': // Bakery
      return '🍞';
    case 'ef45178d-e566-4637-b7f9-abcf6d575466': // Other
      return '📦';
    default:
      return '🧾'; // A generic receipt/item icon as a fallback
  }
};

export const getIconColor = (category: string | undefined): string => {
  switch (category) {
    case '5dee106a-5050-443e-8368-03397e02af6d': // Produce
      return 'bg-green-200';
    case 'a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5': // Meat & Poultry
      return 'bg-red-200';
    case '1670a6d4-f212-4770-80c7-0e31c0f4c26b': // Fish & Seafood
      return 'bg-blue-200';
    case '80662af1-1943-4168-8549-ef721b0e9f54': // Dairy & Alternatives
      return 'bg-yellow-200';
    case 'b660f354-a89d-420c-80d1-ba0f16b433ec': // Dry Goods
      return 'bg-orange-200';
    case '90aae231-631c-4fed-baf0-929be5a26b13': // Spices & Seasonings
      return 'bg-amber-200';
    case '25f19080-3387-4470-95df-598817d5ccfe': // Oils, Vinegars, & Condiments
      return 'bg-indigo-200';
    case '83602573-0b31-439c-8890-ee084a547c22': // Frozen
      return 'bg-sky-200';
    case 'ad6fbf47-f289-4ffb-b070-a5957330a56b': // Coffee & Tea
      return 'bg-stone-200';
    case 'f50e6aea-bb2d-42a1-8778-52cdbfec1540': // Beverages (Other)
      return 'bg-cyan-200';
    case '0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5': // Bakery
      return 'bg-rose-200';
    case 'ef45178d-e566-4637-b7f9-abcf6d575466': // Other
    default:
      return 'bg-gray-200';
  }
};
export const createIngredientPrototype = (data: IngredientFormFields, userId: string) => {

  if (data) {
    const normalizedUnitPrice = normalizePrice(data.unitPrice, data.unit as Unit, data.quantity);

      const ingredientPrototype: Ingredient = {
        id: data.id,
        icon: createIngredientIcon(data.category),
        name: data.name,
        unit: data.unit === 'g' || data.unit === 'kg' ? 'g' : data.unit === 'L' || data.unit === 'ml' ? 'ml' : 'piece',
        unitPrice: normalizedUnitPrice,
        quantity: data.quantity,
        usage: '0',
        userId: userId,
        category: data.category
      };
      return ingredientPrototype
  }
  

      
}

export const createEditIngredientPrototype = (data: IngredientFormFields, ingredient: Ingredient, userId: string) => {

  const normalizedUnitPrice = normalizePrice(data.unitPrice, data.unit as Unit, data.quantity);
      // Edit mode logic
      const updatedIngredient: Ingredient = {
        id: ingredient.id,
        icon: ingredient.icon,
        name: data.name,
        unit: data.unit === 'g' || data.unit === 'kg' ? 'g' : data.unit === 'L' || data.unit === 'ml' ? 'ml' : 'piece',
        unitPrice: normalizedUnitPrice,
        quantity: data.quantity,
        usage: ingredient.usage || '0',
        userId: userId,
        category: data.category
      };

      return updatedIngredient
}

export const destructureSupplier = (supplier: Supplier) => {
        const dbSupplier = {
          id: supplier.id,
          userId: supplier.userId,
          name: supplier.name,
          ContactPerson: supplier.contactPerson,
          email: supplier.email,
          phone: supplier.phone,
          website: supplier.website,
          deliveryTime: supplier.deliveryTime,
          isActive: supplier.isActive,
          dateAdded: supplier.dateAdded
        }
        const categories = supplier.category
        // In the address table will propably have options in order to add multiple addresses after. So maybe we will iterate on the address service through the addresses array. Hoever now we will use an object so a simple address.
        const address = supplier.address
        const paymentTerms = {
            paymentTerms: supplier.paymentTerms,
            vatNumber: supplier.vatNumber,
            defaultCurrency: 'euro'
        }
        return {categories, address, paymentTerms, dbSupplier}
}


