import { Ingredient, IngredientSchema } from "@costwise/shared/recipe";
import { validateComplexEntity as validateComplexEntityWith } from "@costwise/shared/validation";

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

/**
 * Domain-facing `validateComplexEntity`: the single implementation lives in
 * `@costwise/shared/validation`; this wrapper injects `ValidationError` so
 * failures surface as a 400 with field errors instead of a generic 500.
 */
export const validateComplexEntity = <T extends object, TArrayItem>(
  entity: Record<string, unknown>,
  entitySchema: z.ZodType<T, z.ZodTypeDef, unknown>,
  arraysSchema: z.ZodType<TArrayItem, z.ZodTypeDef, unknown>,
  fieldName: string,
  addedItems: TArrayItem[],
  removedItems: TArrayItem[]
) =>
  validateComplexEntityWith(
    entity,
    entitySchema,
    arraysSchema,
    fieldName,
    addedItems,
    removedItems,
    (error) => new ValidationError(error)
  );
