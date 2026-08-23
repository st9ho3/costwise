import { describe, it, expect } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { NotFoundError, ValidationError } from "@costwise/domain/utils/errors";
import { errorHandler } from "./errors";

const appWith = (thrower: () => never) => {
  const app = new OpenAPIHono();
  app.onError(errorHandler);
  app.get("/boom", () => thrower());
  return app;
};

describe("errorHandler", () => {
  it("maps AppError statusCode and class name", async () => {
    const res = await appWith(() => { throw new NotFoundError("Recipe", "r1"); }).request("/boom");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("NOT_FOUND_ERROR");
    expect(typeof body.error.message).toBe("string");
  });
  it("carries fieldErrors for ValidationError", async () => {
    const res = await appWith(() => { throw new ValidationError([{ field: "name", message: "required" }]); }).request("/boom");
    expect(res.status).toBe(400);
    expect((await res.json()).error.fieldErrors).toEqual({ name: "required" });
  });
  it("hides internals on unknown errors", async () => {
    const res = await appWith(() => { throw new Error("secret sql detail"); }).request("/boom");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.code).toBe("INTERNAL");
    expect(body.error.message).not.toContain("secret");
  });
});
