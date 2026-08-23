import type { Context } from "hono";
import type { Hook } from "@hono/zod-openapi";
import { AppError, ValidationError } from "@costwise/domain/utils/errors";

const toCode = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      fieldErrors[path] = issue.message;
    }
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fieldErrors,
        },
      },
      400
    );
  }
};

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    const fieldErrors =
      err instanceof ValidationError && Array.isArray((err as any).errors)
        ? Object.fromEntries((err as any).errors.map((e: any) => [e.field, e.message]))
        : undefined;
    return c.json(
      { error: { code: toCode(err.constructor.name), message: err.message, ...(fieldErrors && { fieldErrors }) } },
      err.statusCode as 400
    );
  }
  console.error(err);
  return c.json({ error: { code: "INTERNAL", message: "Internal server error" } }, 500);
};
