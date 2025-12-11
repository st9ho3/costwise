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
import { Ingredient, IngredientSchema, Recipe, RecipeIngredients, RecipeIngredientsSchema, RecipeSchema, Supplier, SupplierSchema } from "@/shemas/recipe";
import { RecipeUpdatePayload } from "@/types/context";



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


export const sendRecipe = async (data: Recipe, ing: RecipeIngredients[]) => {
  const dataToSend = { recipe: data, addedIngredients: ing };
  
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  });

  if (!res.ok) {
    return await res.json()
  }

  const response = await res.json();
  return response;
};

export const sendRecipeToUpdate = async (data: FormFields, addedIngredients: RecipeIngredients[], removedIngredients: RecipeIngredients[] ) => {
  const dataToSend = { recipe: data, addedIngredients: addedIngredients, removedIngredients: removedIngredients};
  const res = await fetch(`/api/recipes/${data.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  });

  if (!res.ok) {
    const response = await res.json();
     console.log(response)
  }

  const response = await res.json();
    console.log(response)

  return response;
};

export const deleteRecipesFromServer = async (recipeId: string | null) => {
  const response = await fetch(`api/recipes/${recipeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const error = await response.json(); 
    return error
  } else {
    const res = await response.json()
    return res
  }
};

export const sendIngredient = async (ingredient: Ingredient) => {
  const res = await fetch("/api/ingredients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ingredient)
  })
  const response = await res.json()
  
  return response
}

export const updateIngredient = async (ingredient: Ingredient) => {
  const res = await fetch(`/api/ingredients/${ingredient.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ingredient)
  })

  if (!res.ok) {
    console.log("An error occured, ", res.status, res.statusText);
    const response = await res.json()
    return response
    
  } else {
    const response = await res.json()
    return response
  }
}


export const deleteIngredient = async (id: string | null)  => {
  console.log('deleteIngredient: ',id)
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  
  if (!response.ok) {
    const error = await response.json(); 
    return error
  } else {
    const res = await response.json()
    console.log(res)
    return res
  }
  
}

export const createSupplier = async (supplier: Supplier) => {
  const res = await fetch('/api/suppliers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(supplier)
  })
  if (!res.ok) {
    return await res.json()
  }

  const response = await res.json();
  return response;
}

export const updateSupplier = async (supplier: Supplier) => {
  const res = await fetch(`/api/suppliers/${supplier.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(supplier)
  })
  if (!res.ok) {
    return await res.json()
  }

  const response = await res.json();
  return response;
}

export const zodValidateDataBeforeAddThemToDatabase = (request: RecipeUpdatePayload) => {
  const {recipe, addedIngredients, removedIngredients} = request;
  if (typeof recipe.dateCreated === 'string') {
    recipe.dateCreated = new Date(recipe.dateCreated);
  }

  const validatedRecipe = RecipeSchema.parse(recipe);

  let validatedAddedIngredients;
  let validatedRemovedIngredients;

  if (addedIngredients && addedIngredients.length > 0) {
    const validatedRecipeAddedIngredients = addedIngredients.map((ingredient: RecipeIngredients) => {
      const validatedIngredient = RecipeIngredientsSchema.parse(ingredient);
      return validatedIngredient;
    });
    validatedAddedIngredients = validatedRecipeAddedIngredients;
  }
  if (removedIngredients && removedIngredients.length > 0) {
    const validatedRecipeRemovedIngredients = removedIngredients.map((ingredient: RecipeIngredients) => {
      const validatedIngredient = RecipeIngredientsSchema.parse(ingredient);
      return validatedIngredient;
    });
    validatedRemovedIngredients = validatedRecipeRemovedIngredients;
  }

  return {
    validatedRecipe: validatedRecipe,
    validatedRecipeAddedIngredients: validatedAddedIngredients ? validatedAddedIngredients : [],
    validatedRecipeRemovedIngredients: validatedRemovedIngredients ? validatedRemovedIngredients : []
  };
};

export const zodValidateIngredientBeforeAddItToDatabase =  (request: Ingredient) => {
  const ingredient = request

  if (ingredient) {
      const validatedIngredient = IngredientSchema.parse(ingredient)
      console.log("Zod validated ingredient: ",validatedIngredient)
      return validatedIngredient;
    }
};

export const zodValidateSupplierBeforeAddThemToDatabase = (request: Supplier) => {
  const supplier = request

  if (supplier) {
    if (typeof supplier.dateAdded === 'string') {
    supplier.dateAdded = new Date(supplier.dateAdded)
  }
    const validatedSupplier = SupplierSchema.parse(supplier)
    console.log("Zod validated supplier: ",validatedSupplier)
    return validatedSupplier
  }
}

export const search = async(searchTerm: string) => {

    const res = await fetch(`/api/search?q=${searchTerm}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!res) {
    throw new Error('Something happened on searching...')
  }
  const response = await res.json()
  return response  
}