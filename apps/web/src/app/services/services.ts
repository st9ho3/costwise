/**
 * Service functions for API communication in the recipe and ingredient management system.
 * Uses @costwise/api-client (apiBrowser) to communicate with the Backend API.
 */

import { uid } from "uid";
import { FormFields } from "../components/recipes/recipeForm/recipeForm";
import {
  Ingredient,
  IngredientCategory,
  Recipe,
  RecipeIngredients,
  Supplier,
} from "@costwise/shared/recipe";
import { apiBrowser } from "../lib/api";

export const createMessage = (text: string, user: string) => {
  const message = {
    id: uid(),
    message: text,
    sender: user,
    timestamp: new Date().toISOString(),
  };

  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  messages.push(message);
  localStorage.setItem("messages", JSON.stringify(messages));

  return message;
};

export const sendRecipe = async (
  data: Recipe,
  addedIngredients: RecipeIngredients[],
  removedIngredients: RecipeIngredients[]
) => {
  const dataToSend = {
    recipe: {
      ...data,
      dateCreated: data.dateCreated instanceof Date ? data.dateCreated.toISOString() : (data.dateCreated ?? null),
    },
    addedIngredients,
    removedIngredients,
  };

  const { data: resData, error } = await apiBrowser.POST("/v1/recipes", {
    body: dataToSend as never,
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to create recipe",
      error: { message: error.error?.message || "Failed to create recipe" },
    };
  }

  return {
    success: true,
    message: "Recipe successfully created!",
    data: resData,
  };
};

export const sendRecipeToUpdate = async (
  data: FormFields,
  addedIngredients: RecipeIngredients[],
  removedIngredients: RecipeIngredients[]
) => {
  const dataToSend = {
    recipe: {
      ...data,
      dateCreated: data.dateCreated instanceof Date ? data.dateCreated.toISOString() : (data.dateCreated ?? null),
    },
    addedIngredients,
    removedIngredients,
  };

  const { data: resData, error } = await apiBrowser.PATCH("/v1/recipes/{id}", {
    params: { path: { id: data.id } },
    body: dataToSend as never,
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to update recipe",
      error: { message: error.error?.message || "Failed to update recipe" },
    };
  }

  return {
    success: true,
    message: "Recipe successfully updated!",
    data: resData,
  };
};

export const deleteRecipesFromServer = async (recipeId: string | null) => {
  if (!recipeId) {
    return { success: false, message: "Missing recipe ID", error: { message: "Missing recipe ID" } };
  }

  const { data, error } = await apiBrowser.DELETE("/v1/recipes/{id}", {
    params: { path: { id: recipeId } },
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to delete recipe",
      error: { message: error.error?.message || "Failed to delete recipe" },
    };
  }

  return {
    success: true,
    message: "Recipe successfully deleted!",
    data,
  };
};

export const sendIngredient = async (ingredient: Ingredient) => {
  const { data, error } = await apiBrowser.POST("/v1/ingredients", {
    body: ingredient as never,
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to create ingredient",
      error: { message: error.error?.message || "Failed to create ingredient" },
    };
  }

  return {
    success: true,
    message: "Ingredient successfully created!",
    data,
  };
};

export const updateIngredient = async (ingredient: Ingredient) => {
  const { data, error } = await apiBrowser.PATCH("/v1/ingredients/{id}", {
    params: { path: { id: ingredient.id } },
    body: ingredient as never,
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to update ingredient",
      error: { message: error.error?.message || "Failed to update ingredient" },
    };
  }

  return {
    success: true,
    message: "Ingredient successfully updated!",
    data,
  };
};

export const deleteIngredient = async (id: string | null) => {
  if (!id) {
    return { success: false, message: "Missing ingredient ID", error: { message: "Missing ingredient ID" } };
  }

  const { data, error } = await apiBrowser.DELETE("/v1/ingredients/{id}", {
    params: { path: { id } },
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to delete ingredient",
      error: { message: error.error?.message || "Failed to delete ingredient" },
    };
  }

  return {
    success: true,
    message: "Ingredient successfully deleted!",
    data,
  };
};

export const createSupplier = async (
  supplier: Supplier,
  addedCategories: IngredientCategory[],
  removedCategories: IngredientCategory[]
) => {
  const dataToSend = {
    supplier,
    addedCategories,
    removedCategories,
  };

  const { data, error } = await apiBrowser.POST("/v1/suppliers", {
    body: dataToSend as never,
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to create supplier",
      error: { message: error.error?.message || "Failed to create supplier" },
    };
  }

  return {
    success: true,
    message: "Supplier successfully created!",
    data,
  };
};

export const updateSupplier = async (
  supplier: Supplier,
  addedCategories: IngredientCategory[],
  removedCategories: IngredientCategory[]
) => {
  const dataToSend = {
    supplier,
    addedCategories,
    removedCategories,
  };

  const { data, error } = await apiBrowser.PATCH("/v1/suppliers/{id}", {
    params: { path: { id: supplier.id } },
    body: dataToSend as never,
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to update supplier",
      error: { message: error.error?.message || "Failed to update supplier" },
    };
  }

  return {
    success: true,
    message: "Supplier successfully updated!",
    data,
  };
};

export const deleteSupplier = async (id: string | null) => {
  if (!id) {
    return { success: false, message: "Missing supplier ID", error: { message: "Missing supplier ID" } };
  }

  const { data, error } = await apiBrowser.DELETE("/v1/suppliers/{id}", {
    params: { path: { id } },
  });

  if (error) {
    return {
      success: false,
      message: error.error?.message || "Failed to delete supplier",
      error: { message: error.error?.message || "Failed to delete supplier" },
    };
  }

  return {
    success: true,
    message: "Supplier successfully deleted!",
    data,
  };
};

export const search = async (searchTerm: string) => {
  const { data, error } = await apiBrowser.GET("/v1/search", {
    params: { query: { q: searchTerm } },
  });

  if (error || !data) {
    return {
      success: false,
      message: error?.error?.message || "Failed to search",
      data: undefined,
    };
  }

  const recipes = data.recipes?.map((r) => ({
    ...r,
    dateCreated: new Date(r.dateCreated || Date.now()),
  }));

  return {
    success: true,
    data: {
      ...data,
      recipes,
    },
  };
};
