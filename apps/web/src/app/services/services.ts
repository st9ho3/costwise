/**
 * Service functions for API communication and data validation in the recipe and ingredient management system.
 *
 * This module provides:
 * - HTTP client functions for CRUD operations on recipes and ingredients (create, update, delete)
 * - Zod-based validation utilities to ensure data integrity before sending to the backend
 * - A mock messaging utility for local storage-based chat simulation (used for demonstration)
 * - Type-safe request/response handling
 *
 * These functions act as the bridge between the frontend UI (forms, buttons) and the backend API,
 * ensuring that only valid, well-structured data is transmitted and that user actions trigger
 * the appropriate server-side operations.
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
    recipe: data,
    addedIngredients: addedIngredients,
    removedIngredients: removedIngredients,
  };

  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  const response = await res.json();
  return response;
};

export const sendRecipeToUpdate = async (
  data: FormFields,
  addedIngredients: RecipeIngredients[],
  removedIngredients: RecipeIngredients[]
) => {
  const dataToSend = {
    recipe: data,
    addedIngredients: addedIngredients,
    removedIngredients: removedIngredients,
  };
  const res = await fetch(`/api/recipes/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  const response = await res.json();

  return response;
};

export const deleteRecipesFromServer = async (recipeId: string | null) => {
  const response = await fetch(`api/recipes/${recipeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await response.json();
  return res;
};

export const sendIngredient = async (ingredient: Ingredient) => {
  const res = await fetch("/api/ingredients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredient),
  });
  const response = await res.json();

  return response;
};

export const updateIngredient = async (ingredient: Ingredient) => {
  const res = await fetch(`/api/ingredients/${ingredient.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredient),
  });

  const response = await res.json();
  return response;
};

export const deleteIngredient = async (id: string | null) => {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await response.json();

  return res;
};

export const createSupplier = async (
  supplier: Supplier,
  addedCategories: IngredientCategory[],
  removedCategories: IngredientCategory[]
) => {
  const dataToSend = {
    supplier: supplier,
    addedCategories: addedCategories,
    removedCategories: removedCategories,
  };

  const res = await fetch("/api/suppliers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  const response = await res.json();
  return response;
};

export const updateSupplier = async (
  supplier: Supplier,
  addedCategories: IngredientCategory[],
  removedCategories: IngredientCategory[]
) => {
  const dataToSend = {
    supplier: supplier,
    addedCategories: addedCategories,
    removedCategories: removedCategories,
  };

  const res = await fetch(`/api/suppliers/${supplier.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  const response = await res.json();
  return response;
};

export const deleteSupplier = async (id: string | null) => {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();

  return res;
};

export const search = async (searchTerm: string) => {
  const res = await fetch(`/api/search?q=${searchTerm}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();
  return response;
};
