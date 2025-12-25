import { Ingredient, IngredientCategory, IngredientCategorySchema, IngredientSchema, RecipeIngredients, RecipeIngredientsSchema, RecipeSchema, SupplierSchema } from "@/shemas/recipe";
import { RecipeUpdatePayload, SupplierUpdatePayload } from "@/types/context";
import { z } from "zod";

export const zodValidateDataBeforeAddThemToDatabase = (request: RecipeUpdatePayload) => {
  const {recipe, addedIngredients, removedIngredients} = request;
  if (typeof recipe.dateCreated === 'string') {
    recipe.dateCreated = new Date(recipe.dateCreated);
  }

  const validatedRecipe = RecipeSchema.parse(recipe);

  let validatedAddedIngredients;
  let validatedRemovedIngredients;

  if (addedIngredients && addedIngredients.length > 0) {
    validatedAddedIngredients = addedIngredients.map((ingredient: RecipeIngredients) => {
      return RecipeIngredientsSchema.parse(ingredient);
    });
  }
  if (removedIngredients && removedIngredients.length > 0) {
    validatedRemovedIngredients = removedIngredients.map((ingredient: RecipeIngredients) => {
      return RecipeIngredientsSchema.parse(ingredient);
    });
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

export const zodValidateSupplierBeforeAddThemToDatabase =(request: SupplierUpdatePayload) => {
  
  const {supplier, addedCategories, removedCategories} = request

  if (supplier) {
    if (typeof supplier.dateAdded === 'string') {
    supplier.dateAdded = new Date(supplier.dateAdded)
  }
}
    const validatedSupplier = SupplierSchema.parse(supplier)

    let validatedAddedCategories
    let validatedRemovedCategories

    if (addedCategories && addedCategories.length > 0) {
     validatedAddedCategories = addedCategories.map((category: IngredientCategory) => {
      return IngredientCategorySchema.parse(category);
    });
  }
  if (removedCategories && removedCategories.length > 0) {
     validatedRemovedCategories = removedCategories.map((category: IngredientCategory) => {
      return IngredientCategorySchema.parse(category);
      
    });
    }
  
  return {
    validatedSupplier: validatedSupplier,
    validatedAddedCategories: validatedAddedCategories ? validatedAddedCategories : [],
    validatedRemovedCategories: validatedRemovedCategories ? validatedRemovedCategories : []
  };
}

export const validateComplexEntity = <T extends object, TArrayItem>(
  entity: T, 
  entitySchema: z.ZodSchema<T>, 
  arraysSchema: z.ZodSchema<TArrayItem>, 
  fieldName: keyof T, 
  addedItems: TArrayItem[], 
  removedItems: TArrayItem[] ) => {

    if (fieldName in entity && typeof entity[fieldName] === 'string') {
    entity[fieldName] = new Date(entity[fieldName] as string) as T[keyof T]
  }
  const validatedEntity = entitySchema.parse(entity)

  let validatedAddedItems
  let validatedRemovedItems

  if (addedItems && addedItems.length > 0) {
     validatedAddedItems = addedItems.map((item: TArrayItem) => {
      return arraysSchema.parse(item);
    })
  }

  if (removedItems && removedItems.length > 0) {
     validatedRemovedItems = removedItems.map((item: TArrayItem) => {
      return arraysSchema.parse(item);
    })
  }

    return {
      validatedEntity,
      validatedAddedItems,
      validatedRemovedItems
    }
}