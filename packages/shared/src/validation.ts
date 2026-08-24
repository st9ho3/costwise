import { z } from "zod";

/**
 * How a validation failure is surfaced. `shared` cannot depend on `domain`, so
 * callers that need a richer error (e.g. `domain`'s `ValidationError`, which the
 * API maps to a 400 with field errors) inject their own factory.
 */
export type ValidationErrorFactory = (error: z.ZodError) => Error;

const defaultErrorFactory: ValidationErrorFactory = (error) =>
  new Error("Validation failed: " + error.message);

const validateItems = <TArrayItem>(
  items: TArrayItem[] | undefined,
  schema: z.ZodType<TArrayItem, z.ZodTypeDef, unknown>,
  onError: ValidationErrorFactory,
): TArrayItem[] | undefined => {
  if (!items || items.length === 0) {
    return undefined;
  }

  return items.map((item) => {
    const result = schema.safeParse(item);

    if (!result.success) {
      throw onError(result.error);
    }
    return result.data;
  });
};

/**
 * Validates an entity plus the items added to / removed from one of its
 * collections. `fieldName` names a date field that arrives as a string over the
 * wire and is revived before parsing.
 *
 * Single home for this logic — `domain` wraps it to throw `ValidationError`,
 * `shared` callers get the default plain `Error`.
 */
export const validateComplexEntity = <T extends object, TArrayItem>(
  entity: Record<string, unknown>,
  entitySchema: z.ZodType<T, z.ZodTypeDef, unknown>,
  arraysSchema: z.ZodType<TArrayItem, z.ZodTypeDef, unknown>,
  fieldName: string,
  addedItems: TArrayItem[],
  removedItems: TArrayItem[],
  onError: ValidationErrorFactory = defaultErrorFactory,
) => {
  if (fieldName in entity && typeof entity[fieldName] === "string") {
    entity[fieldName] = new Date(entity[fieldName] as string);
  }
  const entityResult = entitySchema.safeParse(entity);

  if (!entityResult.success) {
    throw onError(entityResult.error);
  }

  return {
    validatedEntity: entityResult.data,
    validatedAddedItems: validateItems(addedItems, arraysSchema, onError),
    validatedRemovedItems: validateItems(removedItems, arraysSchema, onError),
  };
};
