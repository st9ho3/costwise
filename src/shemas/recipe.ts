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
  userId: z.string()
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const DBIngredientSchema = z.object({
  id: z.string().uuid(),
  icon: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  unit: UnitSchema,
  unitPrice: z.string().min(0.001, "Unit price can't be zero."),
  quantity: z.string().min(1, "Quantity must be non-negative"),
  usage: z.string(),
  userId: z.string()
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