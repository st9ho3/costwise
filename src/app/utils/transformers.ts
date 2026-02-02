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
} from "@/shemas/recipe";
import { SupplierUpdatePayload } from "@/types/context";
import {
  DestructuredSupplier,
  RawDBSupplier,
  RecipeIngredientFromDB,
} from "@/types/specialTypes";
import { validateComplexEntity } from "../services/validationService";
import { normalizePrice } from "./pricing";
import { IngredientFormFields } from "../hooks/useIngredientsForm";
import { createIngredientIcon } from "./uiHelpers";

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
      suppliers: confirmedSuppliers,
    };
    return ingredientPrototype;
  }
};

export const createEditIngredientPrototype = (
  data: IngredientFormFields,
  ingredient: Ingredient,
  confirmedSuppliers: string[],
  userId: string,
) => {
  const normalizedUnitPrice = normalizePrice(
    data.unitPrice,
    data.unit as Unit,
    data.quantity,
  );
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
    suppliers: confirmedSuppliers,
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
    (supplierId) => ({
      suplierId: supplierId,
      ingredientId: ingredient.id,
      unit: unit,
      unitPrice: unitPrice.toString(),
      quantity: quantity.toString(),
      isActive: true,
    }),
  );

  return { dbIngredient, supplierIngredients };
};
