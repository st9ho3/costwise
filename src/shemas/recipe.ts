// src/schemas/appSchemas.ts
import { z } from 'zod';

// Schema for defining a valid unit of measurement (e.g., 'g', 'ml', 'kg', 'L')
export const UnitSchema = z.union([
  z.literal('g'),
  z.literal('ml'),
  z.literal('kg'),
  z.literal('L'),
  z.literal('piece'),
  z.literal('')
], {
  errorMap: (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_union) {
      return { message: "Invalid unit. Must be 'g', 'ml', 'kg', or 'L'." };
    }
    return { message: ctx.defaultError };
  }
});

export type Unit = z.infer<typeof UnitSchema>;

// Schema for defining allowed ingredient categories
export const IngredientCategorySchema = z.union([
  z.literal('5dee106a-5050-443e-8368-03397e02af6d'),
  z.literal('a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5'),
  z.literal('1670a6d4-f212-4770-80c7-0e31c0f4c26b'),
  z.literal('80662af1-1943-4168-8549-ef721b0e9f54'),
  z.literal('b660f354-a89d-420c-80d1-ba0f16b433ec'),
  z.literal('90aae231-631c-4fed-baf0-929be5a26b13'),
  z.literal('25f19080-3387-4470-95df-598817d5ccfe'),
  z.literal('83602573-0b31-439c-8890-ee084a547c22'),
  z.literal('ad6fbf47-f289-4ffb-b070-a5957330a56b'),
  z.literal('f50e6aea-bb2d-42a1-8778-52cdbfec1540'),
  z.literal('0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5'),
  z.literal('ef45178d-e566-4637-b7f9-abcf6d575466'),
  z.literal(''), // Added an empty string for default/unset
], {
  errorMap: () => ({ message: "Invalid ingredient category." })
});

// Inferred TypeScript type for an ingredient category
export type IngredientCategory = z.infer<typeof IngredientCategorySchema>;

// Schema for defining the allowed ingredient category *names*
export const IngredientCategoryNameSchema = z.union([
  z.literal('Produce'),
  z.literal('Meat & Poultry'),
  z.literal('Fish & Seafood'),
  z.literal('Dairy & Alternatives'),
  z.literal('Dry Goods'),
  z.literal('Spices & Seasonings'),
  z.literal('Oils, Vinegars, & Condiments'),
  z.literal('Frozen'),
  z.literal('Coffee & Tea'),
  z.literal('Beverages (Other)'),
  z.literal('Bakery'),
  z.literal('Other'),
  z.literal(''), // Fallback for empty/unset
], {
  // Add a custom error message for clarity
  errorMap: () => ({ message: "Invalid ingredient category name." })
});

// Inferred TypeScript type
export type IngredientCategoryName = z.infer<typeof IngredientCategoryNameSchema>;

// Schema for defining a table column's properties
export const ColumnSchema = z.object({
  header: z.string().min(1, "Column header is required"),
  accessor: z.string().min(1, "Column accessor is required"),
  className: z.string().optional(),
});

export type Column = z.infer<typeof ColumnSchema>;


// Schema for defining allowed recipe categories (e.g., 'starter', 'main', 'dessert')
export const RecipeCategorySchema = z.union([
  z.literal('starter'),
  z.literal('main'),
  z.literal('dessert')
], {
  errorMap: () => ({ message: "Invalid category. Must be 'starter', 'main', or 'dessert'." })
});

export type RecipeCategory = z.infer<typeof RecipeCategorySchema>;


// Schema for the core recipe object
export const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Recipe title must be at least 3 characters").max(200, "Title cannot exceed 200 characters"),
  totalCost: z.number().min(0, "Total cost cannot be negative"),
  createdBy: z.string().min(1, "Creator ID is required"),
  dateCreated: z.date(),
  category: RecipeCategorySchema,
  tax: z.number().min(0, "Tax cannot be negative").max(1, "Tax cannot exceed 100%"),
  imgPath: z.string().url("Image path must be a valid URL"),
  sellingPrice: z.number().min(0, "Selling price can't be negative").optional(),
  profitMargin: z.number().optional(),
  foodCost: z.number().min(0, "Food cost can't be negative" ),
  userId: z.string()
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Schema for the db recipe object
export const DBRecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Recipe title must be at least 3 characters").max(200, "Title cannot exceed 200 characters"),
  totalCost: z.string().min(0, "Total cost cannot be negative"),
  createdBy: z.string().min(1, "Creator ID is required"),
  dateCreated: z.string(),
  category: RecipeCategorySchema,
  tax: z.string().min(0, "Tax cannot be negative").max(1, "Tax cannot exceed 100%"),
  imgPath: z.string().url("Image path must be a valid URL"),
  sellingPrice: z.string().min(0, "Selling price can't be negative"),
  profitMargin: z.string(),
  foodCost: z.string().min(0, "Food cost can't be negative"),
  userId: z.string()
});

export type DBRecipe = z.infer<typeof DBRecipeSchema>;


// Schema for an ingredient item with UI-specific properties
export const IngredientSchema = z.object({
  id: z.string().uuid(),
  icon: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  unit: UnitSchema,
  unitPrice: z.number().min(0.001, "Unit price can't be zero."),
  quantity: z.number().min(1, "Quantity must be non-negative"),
  usage: z.string(),
  userId: z.string(),

  category: IngredientCategorySchema
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export type IngredientToDisplay = Ingredient & {
  categoryName: IngredientCategoryName
}

export const DBIngredientSchema = z.object({
  id: z.string().uuid(),
  icon: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  unit: UnitSchema,
  unitPrice: z.string().min(0.001, "Unit price can't be zero."),
  quantity: z.string().min(1, "Quantity must be non-negative"),
  usage: z.string(),
  userId: z.string(),
  category: IngredientCategorySchema
});

export type DBIngredient = z.infer<typeof DBIngredientSchema>;


// Schema for the join table linking recipes to ingredients with specific quantities and units
export const RecipeIngredientsSchema = z.object({
  recipeId: z.string().uuid(),
  ingredientId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  iconBgColor: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  quantity: z.number().min(1, "Quantity must be non-negative"),
});

export type RecipeIngredients = z.infer<typeof RecipeIngredientsSchema>;

export const DBRecipeIngredientsSchema = z.object({
  id: z.number(),
  recipeId: z.string().uuid(),
  ingredientId: z.string().uuid(),
  quantity: z.string().min(1, "Quantity must be non-negative"),
});

export type DBRecipeIngredients = z.infer<typeof DBRecipeIngredientsSchema>;

// Schema for defining a supplier
export const SupplierSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(), 
  name: z.string().min(1, "Supplier name is required"),
  
  // What they sell
  category: z.array(z.string()),

  // Contact Info
  contactPerson: z.string().optional().transform(val => val === '' ? undefined : val),
  email: z.string().email("Invalid email address").optional().transform(val => val === '' ? undefined : val),
  phone: z.string().optional().transform(val => val === '' ? undefined : val),
  website: z.string().optional().transform(val => val === '' ? undefined : val),

  // Structured Address
  address: z.object({
    street: z.string().optional().transform(val => val === '' ? undefined : val),
    city: z.string().optional().transform(val => val === '' ? undefined : val),
    state: z.string().optional().transform(val => val === '' ? undefined : val), 
    postalCode: z.string().optional().transform(val => val === '' ? undefined : val),
    country: z.string().optional().transform(val => val === '' ? undefined : val),
  }).optional(),

  // Financial & Admin
  financialData: z.object({
    paymentTerms: z.union([
    z.literal(''),
    z.literal('Net 30'),
    z.literal('Net 60'),
    z.literal('Due on Receipt'),
    z.literal('COD'),
    z.literal('Prepaid'),
  ]).optional(),
    vatNumber: z.string().optional(), 
    
  })
  .optional(),
  notes: z.string().optional(),

  // Logistics
  deliveryTime: z.union([ 
    z.literal(''),
    z.literal('Same Day'),
    z.literal('1-2 Days'),
    z.literal('2-3 Days'),
    z.literal('Up to 5 days'),
    z.literal('Weekly'),
  ])
  .optional()
  ,

  // Status & Metadata
  isActive: z.boolean(),
  
  dateAdded: z.date(),
});

export type Supplier = z.infer<typeof SupplierSchema>;