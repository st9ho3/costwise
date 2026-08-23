import { z } from "@hono/zod-openapi";
import {
  RecipeSchema,
  type Recipe,
  RecipeIngredientsSchema,
  IngredientSchema,
  IngredientCategoryNameSchema,
  IngredientCategorySchema,
  type Ingredient,
  type IngredientToDisplay,
  SupplierSchema,
  type Supplier,
} from "@costwise/shared/recipe";
import type { Metadata, RecipeWithQuery } from "@costwise/domain/types/specialTypes";
import type { CreateRequest } from "@costwise/domain/types/services";
import type {
  RecipeUpdatePayload,
  SupplierUpdatePayload,
} from "@costwise/domain/types/context";
import type {
  RecipeAnalytics,
  CategoryAnalytics,
  MarginHighlights,
  HighImpactIngredient,
  IngredientAnalytics,
} from "@costwise/domain/types/repositories";

export const ErrorEnvelope = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fieldErrors: z.record(z.string()).optional(),
  }),
});
export const ErrRes = {
  content: { "application/json": { schema: ErrorEnvelope } },
  description: "Error",
};

export const MetadataQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  sort: z.string().optional(),
  itemsPerPage: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});
export const toMetadata = (q: z.infer<typeof MetadataQuery>): Metadata => ({
  page: q.page,
  order: q.order,
  sort: q.sort,
  itemsPerPage: q.itemsPerPage,
  offset: q.offset,
});

export const IdParam = z.object({ id: z.string() });

export const CountSchema = z.object({ count: z.object({ count: z.number() }) });

export const RecipeListResponse = z
  .object({ recipes: z.array(RecipeSchema) })
  .merge(CountSchema) satisfies z.ZodType<{
  recipes: Recipe[];
  count: { count: number };
}>;

export const RecipeWithQueryResponse = z.object({
  id: z.string(),
  title: z.string(),
  totalCost: z.string(),
  createdBy: z.string(),
  dateCreated: z.string(),
  category: z.enum(["starter", "main", "dessert"]),
  tax: z.string(),
  imgPath: z.string(),
  sellingPrice: z.string(),
  profitMargin: z.string(),
  foodCost: z.string(),
  userId: z.string(),
  recipeIngredients: z.array(
    z.object({
      id: z.number(),
      recipeId: z.string(),
      ingredientId: z.string(),
      quantity: z.string(),
      ingredients: z.object({
        id: z.string(),
        name: z.string(),
        unit: z.string(),
        unitPrice: z.string(),
        quantity: z.string(),
        icon: z.string().nullable(),
        usage: z.string(),
      }),
    })
  ),
}) satisfies z.ZodType<RecipeWithQuery>;

export const CreateRecipeBody = z.object({
  recipe: RecipeSchema,
  addedIngredients: z.array(RecipeIngredientsSchema),
  removedIngredients: z.array(RecipeIngredientsSchema),
}) satisfies z.ZodType<CreateRequest>;

export const UpdateRecipeBody = z.object({
  recipe: RecipeSchema,
  addedIngredients: z.array(RecipeIngredientsSchema),
  removedIngredients: z.array(RecipeIngredientsSchema),
}) satisfies z.ZodType<RecipeUpdatePayload>;

export const MessageResponse = z.object({
  message: z.string(),
}) satisfies z.ZodType<{ message: string }>;

export const DeleteResponse = z.object({
  id: z.string(),
}) satisfies z.ZodType<{ id: string }>;

export const IngredientToDisplaySchema = IngredientSchema.omit({
  suppliers: true,
}).extend({
  categoryName: IngredientCategoryNameSchema,
}) satisfies z.ZodType<IngredientToDisplay>;

export const IngredientListResponse = z
  .object({ ingredients: z.array(IngredientToDisplaySchema) })
  .merge(CountSchema) satisfies z.ZodType<{
  ingredients: IngredientToDisplay[];
  count: { count: number };
}>;

export const SupplierPayloadSchema = z.object({
  supplier: SupplierSchema,
  addedCategories: z.array(IngredientCategorySchema),
  removedCategories: z.array(IngredientCategorySchema),
}) satisfies z.ZodType<SupplierUpdatePayload, z.ZodTypeDef, any>;

export const SupplierListResponse = z
  .object({ suppliers: z.array(SupplierSchema) })
  .merge(CountSchema) satisfies z.ZodType<
  { suppliers: Supplier[]; count: { count: number } },
  z.ZodTypeDef,
  any
>;

export const SearchQuery = z.object({
  q: z.string().min(1),
});

export const SearchResponse = z.object({
  ingredients: z.array(IngredientToDisplaySchema).optional(),
  recipes: z.array(RecipeSchema).optional(),
}) satisfies z.ZodType<{
  ingredients?: IngredientToDisplay[];
  recipes?: Recipe[];
}>;

export const RecipeAnalyticsResponse = z.object({
  avgProfitMargin: z.string().nullable(),
  avgFoodCost: z.string().nullable(),
  totalRecipes: z.number(),
}) satisfies z.ZodType<RecipeAnalytics>;

export const CategoryAnalyticsResponse = z.array(
  z.object({
    category: z.enum(["starter", "main", "dessert"]),
    count: z.number(),
    avgFoodCost: z.string().nullable(),
  })
) satisfies z.ZodType<CategoryAnalytics[]>;

export const MarginHighlightsResponse = z.object({
  topPerformers: z.array(RecipeSchema),
  attentionNeeded: z.array(RecipeSchema),
}) satisfies z.ZodType<MarginHighlights>;

export const IngredientAnalyticsResponse = z.object({
  totalIngredients: z.number(),
}) satisfies z.ZodType<IngredientAnalytics>;

export const HighImpactQuery = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export const HighImpactIngredientsResponse = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string().nullable(),
    usage: z.number(),
    category: z.string(),
  })
) satisfies z.ZodType<HighImpactIngredient[]>;

