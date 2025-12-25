import { Ingredient, IngredientSchema} from "@/shemas/recipe";

import { z } from "zod";

export const zodValidateIngredientBeforeAddItToDatabase =  (request: Ingredient) => {
  const ingredient = request

  if (ingredient) {
      const validatedIngredient = IngredientSchema.parse(ingredient)
      console.log("Zod validated ingredient: ",validatedIngredient)
      return validatedIngredient;
    }
};

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