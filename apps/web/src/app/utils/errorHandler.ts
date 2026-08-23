import { sendError } from "../api/utils/responses";
import {
  AuthenticationError,
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@costwise/domain/utils/errors";

export const errorHandler = (err: unknown) => {
  if (err instanceof ValidationError) {
    return sendError({ message: err.message, errors: err.errors }, 400);
  }
  if (err instanceof ConflictError) {
    return sendError({ message: err.message, field: err.field }, 409);
  }
  if (err instanceof NotFoundError) {
    return sendError({ message: err.message }, 404);
  }
  if (err instanceof ForbiddenError) {
    console.warn("Unauthorized access attempt:", {
      resource: err.resource,
      identifier: err.identifier,
      userId: err.userId,
    });
    return sendError({ message: "Not found" }, 404);
  }
  if (err instanceof AuthenticationError) {
    return sendError({ message: err.message }, 401);
  }
  if (err instanceof DatabaseError) {
    console.error("Database error:", {
      operation: err.operation,
      originalError: err.originalError,
    });
    return sendError(
      { message: "Something went wrong. Please try again." },
      500
    );
  }
  return sendError({ message: "Something went wrong" }, 500);
};
