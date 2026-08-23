import { describe, test, expect } from "@jest/globals";
import {
  calculateProfitMargin,
  calculateSellingPrice,
  getTotalPrice,
  normalizePrice,
} from "./pricing";
import { paginationPages } from "./pagination";
import {
  transformIngredientFromDB,
  transformIngredientToDB,
  transformRecipeFromDB,
  transformRecipeToDB,
} from "./transformers";
import {
  DBIngredient,
  DBRecipe,
  Ingredient,
  Recipe,
  RecipeIngredients,
} from "@costwise/shared/recipe";

const date = new Date("2025-09-22");

const mockIngredients: RecipeIngredients[] = [
  {
    recipeId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    ingredientId: "12345678-90ab-cdef-1234-567890abcdef",
    name: "Flour",
    iconBgColor: "#f5f5dc",
    unit: "g",
    unitPrice: 1,
    quantity: 500,
  },
  {
    recipeId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    ingredientId: "98765432-10ab-cdef-1234-567890abcdef",
    name: "Sugar",
    iconBgColor: "#ffffff",
    unit: "g",
    unitPrice: 1,
    quantity: 100,
  },
  {
    recipeId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    ingredientId: "567890ab-cdef-1234-5678-90abcdef1234",
    name: "Eggs",
    iconBgColor: "#fdfd96",
    unit: "pcs",
    unitPrice: 1,
    quantity: 300,
  },
  {
    recipeId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    ingredientId: "abcdef12-3456-7890-abcd-ef1234567890",
    name: "Milk",
    iconBgColor: "#add8e6",
    unit: "ml",
    unitPrice: 1,
    quantity: 200,
  },
];

const mockIngredient: Ingredient = {
  id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  icon: "https://example.com/icons/flour.png",
  name: "All-Purpose Flour",
  unit: "kg",
  unitPrice: 1.55,
  quantity: 25,
  usage: "Used in various baked goods like bread and cakes.",
  userId: "user_xyz789",
  category: "ef45178d-e566-4637-b7f9-abcf6d575466",
  categoryName: "Other",
};

const mockDBIngredient: DBIngredient = {
  id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  icon: "https://example.com/icons/flour.png",
  name: "All-Purpose Flour",
  unit: "kg",
  unitPrice: "1.55",
  quantity: "25",
  usage: "Used in various baked goods like bread and cakes.",
  userId: "user_xyz789",
  category: "ef45178d-e566-4637-b7f9-abcf6d575466",
  categoryName: "Other",
};

const mockDbRecipe: DBRecipe = {
  id: "e446554b-d779-45e0-b615-1a89c379a957",
  title: "Spicy Thai Green Curry",
  totalCost: "15.75",
  createdBy: "user_abc123",
  dateCreated: "2025-09-22",
  category: "main",
  tax: "0.08",
  imgPath: "https://example.com/images/green-curry.jpg",
  sellingPrice: "25",
  profitMargin: "9.25",
  foodCost: "13.5",
  userId: "user_abc123",
};
const mockRecipe: Recipe = {
  id: "e446554b-d779-45e0-b615-1a89c379a957",
  title: "Spicy Thai Green Curry",
  totalCost: 15.75,
  createdBy: "user_abc123",
  dateCreated: date,
  category: "main",
  tax: 0.08,
  imgPath: "https://example.com/images/green-curry.jpg",
  sellingPrice: 25.0,
  profitMargin: 9.25,
  foodCost: 13.5,
  userId: "user_abc123",
};

describe("getTotalPrice", () => {
  test("Gets an array of ingredient objects and returns the total cost", () => {
    const totalPrice = getTotalPrice(mockIngredients);

    expect(totalPrice).toBe(1100);
  });
});

describe("normalizePrice", () => {
  test("normalizes the price based on kg", () => {
    const price = 10;
    const unit = "kg";
    const quantity = 4;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(0.0025);
  });

  test("normalizes the price based on g", () => {
    const price = 10;
    const unit = "g";
    const quantity = 4;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(2.5);
  });

  test("normalizes the price based on L", () => {
    const price = 10;
    const unit = "L";
    const quantity = 4;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(0.0025);
  });

  test("normalizes the price based on ml", () => {
    const price = 10;
    const unit = "ml";
    const quantity = 4;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(2.5);
  });

  test("Should return 0 if price not Numeric", () => {
    const price = "not Numeric";
    const unit = "kg";
    const quantity = 4;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(0);
  });

  test("Should return 0 if quantity is 0", () => {
    const price = 10;
    const unit = "kg";
    const quantity = 0;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(0);
  });

  test("Should return 0 if the unit is not recognised", () => {
    const price = 10;
    const unit = "piece";
    const quantity = 0;

    const result = normalizePrice(price, unit, quantity);

    expect(result).toBe(0);
  });
});

describe("calculateSellingPrice", () => {
  test("Should return selling price", () => {
    const cost = 1;
    const profitMargin = 10;
    const tax = 0.1;

    const result = calculateSellingPrice(cost, profitMargin, tax);

    expect(result).toBe(1.25);
  });

  test("Should return undefined if denominator =< 0", () => {
    const cost = 1;
    const profitMargin = 10;
    const tax = 10;

    const result = calculateSellingPrice(cost, profitMargin, tax);

    expect(result).toBe(undefined);
  });

  test("Should return undefined if profitMargin =< 0", () => {
    const cost = 1;
    const profitMargin = 0;
    const tax = 10;

    const result = calculateSellingPrice(cost, profitMargin, tax);

    expect(result).toBe(undefined);
  });
});

describe("calculateProfitMargin", () => {
  test("Should return profit margin", () => {
    const cost = 1;
    const sellingPrice = 1.25;
    const tax = 0.1;

    const result = calculateProfitMargin(cost, sellingPrice, tax);

    // Using toBeCloseTo because of floating-point arithmetic.
    // The expected result is 10.
    expect(result).toBeCloseTo(10);
  });

  test("Should return undefined if sellingPrice is 0", () => {
    const cost = 1;
    const sellingPrice = 0;
    const tax = 0.1;

    const result = calculateProfitMargin(cost, sellingPrice, tax);

    expect(result).toBe(undefined);
  });

  test("Should return undefined if sellingPrice is negative", () => {
    const cost = 1;
    const sellingPrice = -1;
    const tax = 0.1;

    const result = calculateProfitMargin(cost, sellingPrice, tax);

    expect(result).toBe(undefined);
  });

  test("Should return a negative profit margin if cost is greater than net revenue", () => {
    const cost = 2;
    const sellingPrice = 1.25;
    const tax = 0.1;

    const result = calculateProfitMargin(cost, sellingPrice, tax);

    expect(result).toBeCloseTo(-70);
  });
});

//////////

describe("paginationPages", () => {
  test("Should return an array with the pages", () => {
    const totalPages = 1;

    const result = paginationPages(totalPages);

    expect(result).toStrictEqual([1]);
  });
});

/////////

describe("transformRecipeFromDB", () => {
  test("Should return recipe: Recipe with numbered keys", () => {
    const result = transformRecipeFromDB(mockDbRecipe);

    expect(result).toStrictEqual(mockRecipe);
  });
});

describe("transformRecipeToDB", () => {
  test("Should return recipe: DBRecipe with string keys", () => {
    const result = transformRecipeToDB(mockRecipe);

    expect(result).toStrictEqual(mockDbRecipe);
  });
});

describe("transformIngredientFromDB", () => {
  test("Should return ingredient with numbered Keys", () => {
    const result = transformIngredientFromDB(mockDBIngredient);

    expect(result).toStrictEqual(mockIngredient);
  });
});

describe("transformIngredientToDB", () => {
  test("Should return ingredient with string Keys", () => {
    const result = transformIngredientToDB(mockIngredient);

    expect(result).toStrictEqual(mockDBIngredient);
  });
});
