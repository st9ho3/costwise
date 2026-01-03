import { Ingredient, IngredientSchema } from "@/shemas/recipe";

import { z } from "zod";
import { ValidationError } from "../utils/errors";

export const zodValidateIngredientBeforeAddItToDatabase = (
  request: Ingredient
) => {
  const ingredient = request;

  const validatedIngredient = IngredientSchema.safeParse(ingredient);
  console.log(validatedIngredient);
  if (!validatedIngredient.success) {
    throw new ValidationError(validatedIngredient.error);
  }

  return validatedIngredient.data;
};

export const validateComplexEntity = <T extends object, TArrayItem>(
  entity: T,
  entitySchema: z.ZodSchema<T>,
  arraysSchema: z.ZodSchema<TArrayItem>,
  fieldName: keyof T,
  addedItems: TArrayItem[],
  removedItems: TArrayItem[]
) => {
  if (fieldName in entity && typeof entity[fieldName] === "string") {
    entity[fieldName] = new Date(entity[fieldName] as string) as T[keyof T];
  }
  const entityResult = entitySchema.safeParse(entity);

  if (!entityResult.success) {
    throw new ValidationError(entityResult.error);
  }
  const validatedEntity = entityResult.data;

  let validatedAddedItems;
  let validatedRemovedItems;

  if (addedItems && addedItems.length > 0) {
    validatedAddedItems = addedItems.map((item: TArrayItem) => {
      const arrayItem = arraysSchema.safeParse(item);

      if (!arrayItem.success) {
        throw new ValidationError(arrayItem.error);
      }
      return arrayItem.data;
    });
  }

  if (removedItems && removedItems.length > 0) {
    validatedRemovedItems = removedItems.map((item: TArrayItem) => {
      const arrayItem = arraysSchema.safeParse(item);

      if (!arrayItem.success) {
        throw new ValidationError(arrayItem.error);
      }
      return arrayItem.data;
    });
  }

  return {
    validatedEntity,
    validatedAddedItems,
    validatedRemovedItems,
  };
};
