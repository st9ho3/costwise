import { Recipe, RecipeIngredients, Unit } from "./recipe";

export type FormFields = Recipe;

export const getTotalPrice = (ingredients: RecipeIngredients[]): number => {
  return ingredients.reduce((sum, item) => {
    return item.unit === "kg" || item.unit === "L"
      ? sum + item.unitPrice * item.quantity * 1000
      : sum + item.unitPrice * item.quantity;
  }, 0);
};

export const getProfitMarginType = (
  margin: number | undefined
): "high" | "medium" | "low" | "very_low" => {
  if (margin === undefined || margin <= 40) {
    return "very_low"; // Treat undefined or margin <= 40 as the lowest category
  }

  if (margin > 60) {
    return "high";
  }

  if (margin > 50) {
    return "medium";
  }

  return "low";
};

export const getUsageCategory = (
  usagePercentage: number
): "high" | "medium" | "low" => {
  if (usagePercentage > 15) {
    return "high";
  }

  if (usagePercentage > 8) {
    return "medium";
  }

  return "low";
};

export const formatPrice = (
  priceValue: string | number | undefined
): string => {
  if (!priceValue) {
    return "Unavailable";
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
    return "undefined";
  }
  if (unit === "kg" || unit === "g") return "g";
  if (unit === "ml" || unit === "L") return "ml";
  return "piece";
};

export const normalizePrice = (
  price: number | string,
  unit: Unit,
  quantity: number
): number => {
  if (typeof price === "string" || isNaN(price) || quantity === 0) {
    return 0;
  }

  // Calculate the price based on the unit.
  switch (unit) {
    case "kg":
      // For kilograms, convert to grams (1kg = 1000g) and find the price per gram.
      return price / (quantity * 1000);
    case "g":
      // For grams, calculate the price per gram directly.
      return price / quantity;
    case "L":
      // For liters, convert to milliliters (1L = 1000ml) and find the price per ml.
      return price / (quantity * 1000);
    case "ml":
      // For milliliters, calculate the price per ml directly.
      return price / quantity;
    default:
      // If the unit is not recognized, return 0.
      return price / quantity;
  }
};

export const calculateSellingPrice = (
  cost: number,
  profitMargin: number,
  tax: number
): number | undefined => {
  const denominator = 1 - tax - profitMargin / 100;
  if (denominator > 0 && profitMargin > 0) {
    return cost / denominator;
  }
  return undefined;
};

export const calculateProfitMargin = (
  cost: number,
  sellingPrice: number,
  tax: number
): number | undefined => {
  if (sellingPrice > 0) {
    return ((sellingPrice - sellingPrice * tax - cost) / sellingPrice) * 100;
  }
  return undefined;
};

export const calculateRecipeData = (
  data: FormFields,
  recipe: Recipe | undefined,
  tempIngredients: RecipeIngredients[]
) => {
  const newCost = getTotalPrice(tempIngredients);

  const margin =
    data.profitMargin !== undefined &&
    data.profitMargin !== recipe?.profitMargin
      ? data.profitMargin
      : recipe?.profitMargin;

  const price =
    data.sellingPrice !== undefined &&
    data.sellingPrice !== recipe?.sellingPrice
      ? data.sellingPrice
      : recipe?.sellingPrice;

  const newTax = data.tax !== undefined ? data.tax : recipe?.tax || 0;

  const foodCost = price ? (newCost / price) * 100 : 0;

  const newPrice =
    data.profitMargin !== undefined &&
    data.profitMargin !== recipe?.profitMargin &&
    margin !== undefined
      ? calculateSellingPrice(newCost, margin, newTax)
      : price;

  const newMargin =
    newPrice !== undefined && newPrice !== null
      ? calculateProfitMargin(newCost, newPrice, newTax)
      : undefined;

  return {
    margin: margin,
    price: price,
    newCost: newCost,
    newTax: newTax,
    foodCost: foodCost,
    newPrice: newPrice,
    newMargin: newMargin,
  };
};
