import type {
  Recipe,
  RecipeIngredients,
  Ingredient,
  IngredientToDisplay,
  Supplier,
} from "@costwise/shared/recipe";
import type {
  RecipeWithQuery,
  Metadata,
} from "@costwise/domain/types/specialTypes";
import type {
  CreateRequest,
  CreateResponse,
} from "@costwise/domain/types/services";
import type { SupplierUpdatePayload } from "@costwise/domain/types/context";
import type {
  RecipeAnalytics,
  CategoryAnalytics,
  MarginHighlights,
  HighImpactIngredient,
  IngredientAnalytics,
} from "@costwise/domain/types/repositories";
import { NotFoundError } from "@costwise/domain/utils/errors";
import type {
  Deps,
  RecipeServiceLike,
  IngredientServiceLike,
  SupplierServiceLike,
  SearchServiceLike,
  PutBlobFn,
} from "../app";

export interface FakeState {
  recipes: Recipe[];
  recipeDetails: Map<string, RecipeWithQuery>;
  ingredients: Ingredient[];
  suppliers: Supplier[];
  uploadedBlobs: Map<string, { name: string; body: any }>;
}

export const createFakeState = (): FakeState => ({
  recipes: [],
  recipeDetails: new Map(),
  ingredients: [],
  suppliers: [],
  uploadedBlobs: new Map(),
});

export const seedRecipe = (
  deps: Deps,
  userId: string,
  recipe?: Partial<Recipe>,
  detail?: Partial<RecipeWithQuery>
) => {
  const r: Recipe = {
    id: recipe?.id ?? "11111111-1111-1111-1111-111111111111",
    title: recipe?.title ?? "Test Recipe",
    totalCost: recipe?.totalCost ?? 10,
    createdBy: recipe?.createdBy ?? userId,
    dateCreated: recipe?.dateCreated ?? new Date(),
    category: recipe?.category ?? "main",
    tax: recipe?.tax ?? 0.1,
    imgPath: recipe?.imgPath ?? "https://example.com/r1.jpg",
    sellingPrice: recipe?.sellingPrice ?? 15,
    profitMargin: recipe?.profitMargin ?? 5,
    foodCost: recipe?.foodCost ?? 8,
    userId,
    ...recipe,
  };
  const d: RecipeWithQuery = {
    id: r.id,
    title: r.title,
    totalCost: String(r.totalCost),
    createdBy: r.createdBy,
    dateCreated: r.dateCreated.toISOString(),
    category: r.category,
    tax: String(r.tax),
    imgPath: r.imgPath,
    sellingPrice: String(r.sellingPrice ?? 0),
    profitMargin: String(r.profitMargin ?? 0),
    foodCost: String(r.foodCost),
    userId: r.userId,
    recipeIngredients: [],
    ...detail,
  };
  const state = (deps as any)._state as FakeState;
  state.recipes.push(r);
  state.recipeDetails.set(r.id, d);
  return r;
};

export const seedIngredient = (
  deps: Deps,
  userId: string,
  ingredient?: Partial<Ingredient>
) => {
  const ing: Ingredient = {
    id: ingredient?.id ?? "44444444-4444-4444-4444-444444444444",
    icon: ingredient?.icon ?? null,
    name: ingredient?.name ?? "Flour",
    unit: ingredient?.unit ?? "kg",
    unitPrice: ingredient?.unitPrice ?? 1.5,
    quantity: ingredient?.quantity ?? 10,
    usage: ingredient?.usage ?? "0",
    userId,
    suppliers: ingredient?.suppliers ?? [
      {
        suppliersId: "55555555-5555-5555-5555-555555555555",
        unit: "kg",
        quantity: 10,
        price: 15,
        isActive: true,
      },
    ],
    category: ingredient?.category ?? "5dee106a-5050-443e-8368-03397e02af6d",
    ...ingredient,
  };
  const state = (deps as any)._state as FakeState;
  state.ingredients.push(ing);
  return ing;
};

export const seedSupplier = (
  deps: Deps,
  userId: string,
  supplier?: Partial<Supplier>
) => {
  const s: Supplier = {
    id: supplier?.id ?? "66666666-6666-6666-6666-666666666666",
    userId,
    name: supplier?.name ?? "Acme Supplier",
    icon: supplier?.icon ?? null,
    category: supplier?.category ?? ["5dee106a-5050-443e-8368-03397e02af6d"],
    contactPerson: supplier?.contactPerson ?? "John Doe",
    email: supplier?.email ?? "acme@example.com",
    phone: supplier?.phone ?? "1234567890",
    website: supplier?.website ?? "https://acme.com",
    address: supplier?.address ?? {
      street: "123 Main St",
      city: "City",
      state: "State",
      postalCode: "12345",
      country: "Country",
    },
    financialData: supplier?.financialData ?? {
      paymentTerms: "Net 30",
      vatNumber: "VAT123",
    },
    notes: supplier?.notes ?? "Test notes",
    deliveryTime: supplier?.deliveryTime ?? "1-2 Days",
    isActive: supplier?.isActive ?? true,
    dateAdded: supplier?.dateAdded ?? new Date(),
    ...supplier,
  };
  const state = (deps as any)._state as FakeState;
  state.suppliers.push(s);
  return s;
};

export const fakeDeps = (): Deps => {
  const state = createFakeState();

  const makeRecipeService = (userId: string): RecipeServiceLike => ({
    async findAll(uId: string, metadata: Metadata) {
      const userRecipes = state.recipes.filter((r) => r.userId === uId);
      return {
        recipes: userRecipes,
        count: { count: userRecipes.length },
      };
    },
    async findById(id: string) {
      const detail = state.recipeDetails.get(id);
      if (!detail || detail.userId !== userId) {
        throw new NotFoundError("Recipe", id);
      }
      return detail;
    },
    async create(request: CreateRequest): Promise<CreateResponse> {
      state.recipes.push(request.recipe);
      state.recipeDetails.set(request.recipe.id, {
        id: request.recipe.id,
        title: request.recipe.title,
        totalCost: String(request.recipe.totalCost),
        createdBy: request.recipe.createdBy,
        dateCreated: request.recipe.dateCreated.toISOString(),
        category: request.recipe.category,
        tax: String(request.recipe.tax),
        imgPath: request.recipe.imgPath,
        sellingPrice: String(request.recipe.sellingPrice ?? 0),
        profitMargin: String(request.recipe.profitMargin ?? 0),
        foodCost: String(request.recipe.foodCost),
        userId: request.recipe.userId,
        recipeIngredients: (request.addedIngredients || []).map((ing, idx) => ({
          id: idx + 1,
          recipeId: request.recipe.id,
          ingredientId: ing.ingredientId,
          quantity: String(ing.quantity),
          ingredients: {
            id: ing.ingredientId,
            name: ing.name,
            unit: ing.unit,
            unitPrice: String(ing.unitPrice),
            quantity: String(ing.quantity),
            icon: null,
            usage: "",
          },
        })),
      });
      return { recipe: request.recipe.id };
    },
    async update(
      id: string,
      recipe: Recipe,
      _removed: RecipeIngredients[],
      _added: RecipeIngredients[]
    ) {
      const idx = state.recipes.findIndex(
        (r) => r.id === id && r.userId === userId
      );
      if (idx === -1) {
        throw new NotFoundError("Recipe", id);
      }
      state.recipes[idx] = recipe;
      return { id };
    },
    async delete(id: string) {
      const idx = state.recipes.findIndex(
        (r) => r.id === id && r.userId === userId
      );
      if (idx === -1) {
        throw new NotFoundError("Recipe", id);
      }
      state.recipes.splice(idx, 1);
      state.recipeDetails.delete(id);
      return { id };
    },
    async getRecipesAnalytics(uId: string): Promise<RecipeAnalytics> {
      const userRecipes = state.recipes.filter((r) => r.userId === uId);
      return {
        avgProfitMargin: "25",
        avgFoodCost: "15",
        totalRecipes: userRecipes.length,
      };
    },
    async getCategoryAnalytics(uId: string): Promise<CategoryAnalytics[]> {
      return [
        { category: "starter", count: 1, avgFoodCost: "10" },
        { category: "main", count: 2, avgFoodCost: "20" },
      ];
    },
    async getMarginHighlights(uId: string): Promise<MarginHighlights> {
      const userRecipes = state.recipes.filter((r) => r.userId === uId);
      return {
        topPerformers: userRecipes,
        attentionNeeded: [],
      };
    },
  });

  const makeIngredientService = (userId: string): IngredientServiceLike => ({
    async findAll(uId: string, metadata: Metadata) {
      const userIngredients = state.ingredients.filter((i) => i.userId === uId);
      const display: IngredientToDisplay[] = userIngredients.map((i) => {
        const { suppliers, ...rest } = i;
        return { ...rest, categoryName: "Produce" as const };
      });
      return {
        ingredients: display,
        count: { count: display.length },
      };
    },
    async findById(id: string) {
      const ing = state.ingredients.find(
        (i) => i.id === id && i.userId === userId
      );
      if (!ing) return undefined;
      const { suppliers, ...rest } = ing;
      return { ...rest, categoryName: "Produce" as const };
    },
    async create(ingredient: Ingredient) {
      state.ingredients.push(ingredient);
      return { id: ingredient.id };
    },
    async update(ingredient: Ingredient) {
      const idx = state.ingredients.findIndex(
        (i) => i.id === ingredient.id && i.userId === userId
      );
      if (idx === -1) throw new NotFoundError("Ingredient", ingredient.id);
      state.ingredients[idx] = ingredient;
      return { id: ingredient.id };
    },
    async delete(id: string) {
      const idx = state.ingredients.findIndex(
        (i) => i.id === id && i.userId === userId
      );
      if (idx === -1) throw new NotFoundError("Ingredient", id);
      state.ingredients.splice(idx, 1);
    },
    async getIngredientAnalytics(uId: string): Promise<IngredientAnalytics> {
      const userIngredients = state.ingredients.filter((i) => i.userId === uId);
      return {
        totalIngredients: userIngredients.length,
      };
    },
    async getHighImpactIngredients(
      uId: string,
      limit: number = 5
    ): Promise<HighImpactIngredient[]> {
      const userIngredients = state.ingredients.filter((i) => i.userId === uId);
      return userIngredients.slice(0, limit).map((i) => ({
        id: i.id,
        name: i.name,
        icon: i.icon ?? null,
        usage: Number(i.usage) || 0,
        category: i.category,
      }));
    },
  });

  const makeSupplierService = (userId: string): SupplierServiceLike => ({
    async findAll(uId: string, metadata: Metadata) {
      const userSuppliers = state.suppliers.filter((s) => s.userId === uId);
      return {
        suppliers: userSuppliers,
        count: { count: userSuppliers.length },
      };
    },
    async findById(id: string) {
      const s = state.suppliers.find((s) => s.id === id && s.userId === userId);
      if (!s) return undefined;
      return s;
    },
    async create(payload: SupplierUpdatePayload) {
      state.suppliers.push(payload.supplier);
      return { id: payload.supplier.id };
    },
    async update(payload: SupplierUpdatePayload) {
      const idx = state.suppliers.findIndex(
        (s) => s.id === payload.supplier.id && s.userId === userId
      );
      if (idx === -1) throw new NotFoundError("Supplier", payload.supplier.id);
      state.suppliers[idx] = payload.supplier;
      return { id: payload.supplier.id };
    },
    async delete(id: string) {
      const idx = state.suppliers.findIndex(
        (s) => s.id === id && s.userId === userId
      );
      if (idx === -1) throw new NotFoundError("Supplier", id);
      state.suppliers.splice(idx, 1);
      return { id };
    },
  });

  const makeSearchService = (
    term: string,
    userId: string
  ): SearchServiceLike => ({
    async findRecipe() {
      return state.recipes.filter(
        (r) =>
          r.userId === userId &&
          r.title.toLowerCase().includes(term.toLowerCase())
      );
    },
    async findIngredient() {
      const matching = state.ingredients.filter(
        (i) =>
          i.userId === userId &&
          i.name.toLowerCase().includes(term.toLowerCase())
      );
      return matching.map((i) => {
        const { suppliers, ...rest } = i;
        return { ...rest, categoryName: "Produce" as const };
      });
    },
  });

  const putBlob: PutBlobFn = async (name, body) => {
    state.uploadedBlobs.set(name, { name, body });
    return { url: `https://blob.test/${name}` };
  };

  const deps: Deps = {
    makeRecipeService,
    makeIngredientService,
    makeSupplierService,
    makeSearchService,
    putBlob,
    getSessionUserId: async (h) => h.get("x-user-id"),
  };
  (deps as any)._state = state;
  return deps;
};
