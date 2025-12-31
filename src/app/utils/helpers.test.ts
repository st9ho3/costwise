import { describe, test, expect } from "@jest/globals";
import {
  calculateProfitMargin,
  calculateSellingPrice,
  getTotalPrice,
  normalizePrice,
} from "./pricing";
import { paginate, paginationPages } from "./pagination";
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
} from "@/shemas/recipe";

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
};

const mockRecipes: Recipe[] = [
  {
    id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    title: "Grilled Salmon with Asparagus",
    totalCost: 12.5,
    createdBy: "Chef John",
    dateCreated: new Date("2023-10-26T10:00:00.000Z"),
    category: "main",
    tax: 0.08,
    imgPath:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sellingPrice: 25.0,
    profitMargin: 12.5,
    foodCost: 10.0,
    userId: "user_abc123",
  },
  {
    id: "2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b",
    title: "Classic Caesar Salad",
    totalCost: 4.25,
    createdBy: "Salad Master",
    dateCreated: new Date("2023-11-01T15:30:00.000Z"),
    category: "starter",
    tax: 0.07,
    imgPath:
      "https://images.unsplash.com/photo-1628873099951-403429219b7d?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sellingPrice: 9.5,
    profitMargin: 5.25,
    foodCost: 3.75,
    userId: "user_xyz789",
  },
  {
    id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
    title: "Decadent Chocolate Lava Cake",
    totalCost: 3.0,
    createdBy: "Pastry Chef",
    dateCreated: new Date("2023-11-15T19:45:00.000Z"),
    category: "dessert",
    tax: 0.09,
    imgPath:
      "https://images.unsplash.com/photo-1616428587121-654d2458a13a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sellingPrice: 8.0,
    profitMargin: 5.0,
    foodCost: 2.5,
    userId: "user_baker567",
  },
  {
    id: "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
    title: "Spicy Thai Green Curry",
    totalCost: 6.75,
    createdBy: "Thai Chef",
    dateCreated: new Date("2023-11-20T12:00:00.000Z"),
    category: "main",
    tax: 0.08,
    imgPath:
      "https://images.unsplash.com/photo-1549419137-0105316e100f?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sellingPrice: 16.0,
    profitMargin: 9.25,
    foodCost: 5.5,
    userId: "user_foodie007",
  },
  {
    id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    title: "Tomato and Basil Bruschetta",
    totalCost: 2.1,
    createdBy: "Italian Mama",
    dateCreated: new Date("2023-12-05T18:15:00.000Z"),
    category: "starter",
    tax: 0.06,
    imgPath:
      "https://images.unsplash.com/photo-1563606617061-0428f5963960?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sellingPrice: 6.5,
    profitMargin: 4.4,
    foodCost: 1.75,
    userId: "user_foodie007",
  },
];

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

describe("paginate", () => {
  test("Should return empty array [] if no items", () => {
    const items: Recipe[] = [];
    const itemsPerPage = 10;
    const page = 1;

    const result = paginate(itemsPerPage, page, items);

    expect(result).toStrictEqual([]);
  });

  test("Should return the items the specific page contains", () => {
    const items = mockRecipes;
    const itemsPerPage = 10;
    const page = 1;

    const result = paginate(itemsPerPage, page, items);

    expect(result).toStrictEqual(mockRecipes);
  });
});

describe("paginationPages", () => {
  test("Should return an array with the pages", () => {
    const itemsPerPage = 10;
    const items: Recipe[] = mockRecipes;

    const result = paginationPages(items, itemsPerPage);

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
