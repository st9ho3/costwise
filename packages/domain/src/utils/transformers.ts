import {
  DBIngredient,
  DBRecipe,
  Ingredient,
  IngredientCategory,
  IngredientCategoryName,
  IngredientCategorySchema,
  IngredientToDisplay,
  Recipe,
  RecipeIngredients,
  Supplier,
  SupplierSchema,
  Unit,
} from "@costwise/shared/recipe";
import { SupplierUpdatePayload } from "../types/context";
import {
  DestructuredSupplier,
  RawDBSupplier,
  RecipeIngredientFromDB,
} from "../types/specialTypes";
import { validateComplexEntity } from "../services/validationService";
import { normalizePrice } from "./pricing";

export type IngredientFormFields = Ingredient;

const CATEGORY_ID_TO_NAME: Record<string, string> = {
  "5dee106a-5050-443e-8368-03397e02af6d": "Produce",
  "a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5": "Meat & Poultry",
  "1670a6d4-f212-4770-80c7-0e31c0f4c26b": "Fish & Seafood",
  "80662af1-1943-4168-8549-ef721b0e9f54": "Dairy & Alternatives",
  "b660f354-a89d-420c-80d1-ba0f16b433ec": "Dry Goods",
  "90aae231-631c-4fed-baf0-929be5a26b13": "Spices & Seasonings",
  "25f19080-3387-4470-95df-598817d5ccfe": "Oils, Vinegars, & Condiments",
  "83602573-0b31-439c-8890-ee084a547c22": "Frozen",
  "ad6fbf47-f289-4ffb-b070-a5957330a56b": "Coffee & Tea",
  "f50e6aea-bb2d-42a1-8778-52cdbfec1540": "Beverages (Other)",
  "0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5": "Bakery",
  "ef45178d-e566-4637-b7f9-abcf6d575466": "Other",
};

const createIngredientIcon = (category: string | undefined): string => {
  return (category && CATEGORY_ID_TO_NAME[category]) || category || "Other";
};

export const transformRecipeFromDB = (recipeFromDb: DBRecipe): Recipe => ({
  ...recipeFromDb,
  totalCost: Number(recipeFromDb.totalCost),
  tax: Number(recipeFromDb.tax),
  sellingPrice: Number(recipeFromDb.sellingPrice),
  profitMargin: Number(recipeFromDb.profitMargin),
  foodCost: Number(recipeFromDb.foodCost),
  dateCreated: new Date(recipeFromDb.dateCreated),
  imgPath: recipeFromDb.imgPath,
});

export const transformRecipeToDB = (recipe: Recipe): DBRecipe => ({
  ...recipe,
  totalCost: recipe.totalCost.toString(),
  dateCreated: recipe.dateCreated.toISOString().split("T")[0],
  tax: recipe.tax.toString(),
  sellingPrice: recipe.sellingPrice ? recipe.sellingPrice.toString() : "0",
  profitMargin: recipe.profitMargin ? recipe.profitMargin.toString() : "0",
  foodCost: recipe.foodCost ? recipe.foodCost.toString() : "0",
});

export const transformIngredientFromDB = (
  ingredient: DBIngredient,
  category?: IngredientCategoryName,
): IngredientToDisplay => ({
  ...ingredient,
  categoryName: category ? category : "Other",
  unitPrice: Number(ingredient.unitPrice),
  quantity: Number(ingredient.quantity),
});

export const transformIngredientToDB = (
  ingredient: Ingredient,
): DBIngredient => ({
  ...ingredient,
  unitPrice: ingredient.unitPrice.toString(),
  quantity: ingredient.quantity.toString(),
});

export const transformRecipeIngredentFromDB = (
  ingredient: RecipeIngredientFromDB,
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

export const transformSupplierFromDB = (raw: RawDBSupplier): Supplier => {
  return {
    // 1. Direct Copy of Scalar Fields
    id: raw.id,
    userId: raw.userId,
    name: raw.name,
    contactPerson: raw.contactPerson || undefined,
    email: raw.email || undefined,
    phone: raw.phone || undefined,
    website: raw.website || undefined,
    deliveryTime: raw.deliveryTime || undefined,
    isActive: raw.isActive,
    dateAdded: raw.dateAdded ? new Date(raw.dateAdded) : undefined,
    notes: "", // 'notes' exists in Supplier but is missing from RawDBSupplier interface

    // 2. Transform Address (Take first element)
    address: raw.supplierAddresses[0]
      ? {
          street: raw.supplierAddresses[0].street || undefined,
          city: raw.supplierAddresses[0].city || undefined,
          state: raw.supplierAddresses[0].state || undefined,
          postalCode: raw.supplierAddresses[0].postalCode || undefined,
          country: raw.supplierAddresses[0].country || undefined,
        }
      : undefined,

    // 3. Transform Financial Data (Rename and extract)
    financialData: {
      paymentTerms: raw.supplierFinancialData?.paymentTerms || undefined,
      vatNumber: raw.supplierFinancialData?.vatNumber || undefined,
    },

    // 4. Transform Categories (Map objects to strings)
    category: raw.supplierCategories.map(
      (c) => c.categoryId,
    ) as IngredientCategory[],
  };
};

export const createIngredientPrototype = (
  data: IngredientFormFields,
  confirmedSuppliers: string[],
  userId: string,
) => {
  if (data) {
    const normalizedUnitPrice = normalizePrice(
      data.unitPrice,
      data.unit as Unit,
      data.quantity,
    );

    const supplierItems = confirmedSuppliers.map((supId) => ({
      suppliersId: supId,
      unit: (data.unit as Unit) || "g",
      quantity: Number(data.quantity) || 1,
      price: Number(data.unitPrice) || 0,
      isActive: true,
    }));

    const ingredientPrototype: Ingredient = {
      id: data.id,
      icon: createIngredientIcon(data.category),
      name: data.name,
      unit:
        data.unit === "g" || data.unit === "kg"
          ? "g"
          : data.unit === "L" || data.unit === "ml"
            ? "ml"
            : "piece",
      unitPrice: normalizedUnitPrice,
      quantity: data.quantity,
      usage: "0",
      userId: userId,
      category: data.category,
      suppliers: supplierItems,
    };
    return ingredientPrototype;
  }
};

export const createEditIngredientPrototype = (
  data: IngredientFormFields,
  ingredient: Ingredient | IngredientToDisplay,
  confirmedSuppliers: string[],
  userId: string,
) => {
  const normalizedUnitPrice = normalizePrice(
    data.unitPrice,
    data.unit as Unit,
    data.quantity,
  );

  const supplierItems = confirmedSuppliers.map((supId) => ({
    suppliersId: supId,
    unit: (data.unit as Unit) || "g",
    quantity: Number(data.quantity) || 1,
    price: Number(data.unitPrice) || 0,
    isActive: true,
  }));

  // Edit mode logic
  const updatedIngredient: Ingredient = {
    id: ingredient.id,
    icon: ingredient.icon,
    name: data.name,
    unit:
      data.unit === "g" || data.unit === "kg"
        ? "g"
        : data.unit === "L" || data.unit === "ml"
          ? "ml"
          : "piece",
    unitPrice: normalizedUnitPrice,
    quantity: data.quantity,
    usage: ingredient.usage || "0",
    userId: userId,
    category: data.category,
    suppliers: supplierItems,
  };

  return updatedIngredient;
};

export const destructureSupplier = (supplier: Supplier) => {
  const dbSupplier: DestructuredSupplier = {
    id: supplier.id,
    userId: supplier.userId,
    name: supplier.name,
    contactPerson: supplier.contactPerson,
    email: supplier.email,
    phone: supplier.phone,
    website: supplier.website,
    isActive: supplier.isActive,
    dateAdded: supplier.dateAdded,
    deliveryTime:
      supplier.deliveryTime === "" || !supplier.deliveryTime
        ? null
        : supplier.deliveryTime,
  };
  const categories = supplier.category;
  // In the address table will propably have options in order to add multiple addresses after. So maybe we will iterate on the address service through the addresses array. Hoever now we will use an object so a simple address.
  const address = {
    street: !supplier.address?.street ? null : supplier.address.street,
    city: !supplier.address?.city ? null : supplier.address.city,
    state: !supplier.address?.state ? null : supplier.address.state,
    postalCode: !supplier.address?.postalCode
      ? null
      : supplier.address.postalCode,
    country: !supplier.address?.country ? null : supplier.address.country,
  };
  const financialData = {
    vatNumber: !supplier.financialData.vatNumber
      ? null
      : supplier.financialData.vatNumber,
    paymentTerms:
      supplier.financialData.paymentTerms === "" ||
      !supplier.financialData.paymentTerms
        ? null
        : supplier.financialData.paymentTerms,
    supplierId: supplier.id,
    defaultCurrency: "EUR",
  };
  return { categories, address, financialData, dbSupplier };
};

export const prepareSupplierForDB = (
  supplier: SupplierUpdatePayload,
  mode: "create" | "update",
) => {
  const { validatedEntity, validatedAddedItems, validatedRemovedItems } =
    validateComplexEntity(
      supplier.supplier,
      SupplierSchema,
      IngredientCategorySchema,
      "dateAdded",
      supplier.addedCategories,
      supplier.removedCategories,
    );
  const destructuredSupplier = destructureSupplier(validatedEntity);

  if (!validatedEntity) {
    throw new Error("Supplier Service, Error with validating supplier");
  }
  if (mode === "create") {
    return {
      destructuredSupplier,
      validatedAddedItems: undefined,
      validatedRemovedItems: undefined,
    };
  } else {
    return { destructuredSupplier, validatedAddedItems, validatedRemovedItems };
  }
};

export const getArrayChanges = <T>(originalArray: T[], newArray: T[]) => {
  const added = newArray.filter((item) => !originalArray.includes(item));
  const removed = originalArray.filter((item) => !newArray.includes(item));
  return { added, removed };
};

// Type for the ingredients table (without unit, unitPrice, quantity - those are in supplier_ingredients)
export type DBIngredientForTable = {
  id: string;
  icon?: string | null;
  name: string;
  usage: string;
  userId: string;
  category: IngredientCategory;
};

// Type for the supplier_ingredients join table
export type SupplierIngredientData = {
  suplierId: string;
  ingredientId: string;
  unit: Unit;
  unitPrice: string;
  quantity: string;
  isActive: boolean;
};

/**
 * Destructures an Ingredient into two objects:
 * 1. dbIngredient - for the ingredients table
 * 2. supplierIngredients - array for the supplier_ingredients table (one entry per supplier)
 */
export const destructureIngredient = (
  ingredient: Ingredient,
): {
  dbIngredient: DBIngredientForTable;
  supplierIngredients: SupplierIngredientData[];
} => {
  const { suppliers, unit, unitPrice, quantity, ...rest } = ingredient;

  const dbIngredient: DBIngredientForTable = {
    id: rest.id,
    icon: rest.icon,
    name: rest.name,
    usage: rest.usage,
    userId: rest.userId,
    category: rest.category,
  };

  const supplierIngredients: SupplierIngredientData[] = suppliers.map(
    (sup) => ({
      suplierId: typeof sup === 'string' ? sup : (sup as { suppliersId: string }).suppliersId,
      ingredientId: ingredient.id,
      unit: unit,
      unitPrice: unitPrice.toString(),
      quantity: quantity.toString(),
      isActive: true,
    }),
  );

  return { dbIngredient, supplierIngredients };
};
