# Task 2 — Hono API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Authority (docs/AGENTS.md):** authored by Fable 5; executors implement as written, STOP-and-report on anything uncovered. **Execution: executor models** — Fable 5 judged this task not super-complex.
>
> **TDD:** Tasks 3–10 are behavioral — strict red-green per `superpowers:test-driven-development`; every test is watched failing first. Task 2 (domain extraction) is a **declared refactor exception**: no new tests; gate = existing suite + build green, zero behavior diff.
>
> **Executor mode:** may be run supervised OR external (docs/AGENTS.md, "Executor modes"). External executors: push every task-boundary commit with gate output in the commit body, tick the checkboxes in the same commit, and STOP at each `⛔ CHECKPOINT` below until Panos or Fable 5 reviews the pushed work.

**Goal:** `apps/api` (Hono, port 3001) exposes every web-app operation as a documented `/v1` endpoint; domain layer extracted to `@costwise/domain`; web app unchanged.

**Architecture:** Domain classes move to `packages/domain` consumed by both apps during transition. `apps/api` = OpenAPIHono app; routes are thin factories taking injected service-makers (real services in `src/index.ts`, fakes in tests). Interim `requireUser` reads `x-user-id` in non-production only. Errors map `AppError.statusCode` → HTTP with envelope `{error:{code,message,fieldErrors?}}`.

**Tech Stack:** Hono, `@hono/zod-openapi`, `@hono/node-server`, `@scalar/hono-api-reference` (docs UI), Vitest, tsx (dev), zod (^3.25.75 — match workspace).

**Spec:** `docs/superpowers/specs/2026-08-23-task2-hono-api-design.md`
**ClickUp:** https://app.clickup.com/t/868kv7taa

## Global Constraints

- Package names: `@costwise/domain`; api app package name `api`. All API routes under `/v1`, port `3001`.
- Response shapes mirror today's service returns — behavior-preserving, no redesign.
- Every OpenAPI response schema is bound `satisfies z.ZodType<T>` to the existing TS type.
- Web app behavior: zero visual/functional diff (acceptance criterion).
- No `next/*` import anywhere under `packages/` (grep-gated).
- Use `git mv` for moves. Commit per plan task minimum; per endpoint-group encouraged.
- Zod stays on the workspace's 3.x line in all new package.jsons.

---

### Task 1: Preflight

- [x] **Step 1:** `git fetch origin && git merge-base --is-ancestor origin/chore/monorepo-scaffold origin/main && echo OK1; git merge-base --is-ancestor origin/chore/ci-pipeline origin/main && echo OK2` — expect `OK1` and `OK2` (scaffold AND ci merged). Otherwise STOP and report.
- [x] **Step 2:** `git status --porcelain | wc -l` → `0` (else STOP); then `git checkout main && git pull origin main && git checkout -b feature/hono-api`.

---

### Task 2: Extract `@costwise/domain` (refactor — declared TDD exception)

**Files:**
- Create: `packages/domain/package.json`, `packages/domain/tsconfig.json`
- Move (git mv, preserving filenames) from `apps/web/src/`:
  - `app/services/{authservice,ingredientService,recipeService,searchService,suppliersService,validationService}.ts` → `packages/domain/src/services/` (**NOT `services.ts`** — that is a client-side HTTP helper and stays in web)
  - `app/repositories/*.ts` (all 9) → `packages/domain/src/repositories/`
  - `types/{auth,context,errors,repositories,services,specialTypes}.ts` → `packages/domain/src/types/` (**NOT `pg.d.ts`**)
  - `app/utils/{errors,pricing,transformers}.ts` and `app/utils/helpers.test.ts` → `packages/domain/src/utils/`
- Modify: `apps/web` files importing moved modules; `packages/domain/src/repositories/recipeRepository.ts`; `apps/web/src/app/api/recipes/route.ts` and `apps/web/src/app/api/recipes/[id]/route.ts`; `apps/web/next.config.ts`; `apps/web/package.json`

**Interfaces produced:** `@costwise/domain/services/<name>`, `@costwise/domain/repositories/<name>`, `@costwise/domain/types/<name>`, `@costwise/domain/utils/<name>` — wildcard exports, filenames unrenamed. Later tasks import e.g. `RecipeService` from `@costwise/domain/services/recipeService`, `AppError`/`ValidationError`/`AuthenticationError` from `@costwise/domain/utils/errors`, `Metadata` from `@costwise/domain/types/specialTypes`.

- [x] **Step 1:** Create `packages/domain/package.json`:

```json
{
  "name": "@costwise/domain",
  "version": "0.0.0",
  "private": true,
  "exports": { "./*": "./src/*.ts" },
  "scripts": { "build": "tsc --noEmit", "test": "vitest run" },
  "dependencies": {
    "@costwise/db": "workspace:*",
    "@costwise/shared": "workspace:*",
    "bcrypt": "^6.0.0",
    "drizzle-orm": "^0.44.5",
    "uid": "^2.0.2",
    "zod": "^3.25.75"
  },
  "devDependencies": { "@types/bcrypt": "^6.0.0", "typescript": "^5", "@types/node": "^20" }
}
```

and `packages/domain/tsconfig.json` — copy `packages/db/tsconfig.json` exactly, but `"include": ["src"]` and add `"types": ["node"]` if not present.

- [x] **Step 2:** Perform the moves listed under **Files** with `git mv` (create the target dirs first).
- [x] **Step 3:** Fix intra-package imports: within `packages/domain/src`, rewrite `@/types/` → relative `../types/`, `../utils/` stays relative (verify), `@/app/...` aliases → relative paths. Command aid: `grep -rn "@/" packages/domain/src` must end empty.
- [x] **Step 4:** Remove the Next coupling: in `packages/domain/src/repositories/recipeRepository.ts` delete the `import { revalidatePath } from "next/cache";` line and the `revalidatePath("/recipes");` call (line ~169). Then add to BOTH `apps/web/src/app/api/recipes/route.ts` and `apps/web/src/app/api/recipes/[id]/route.ts`, after each successful service mutation call and before the success return: `revalidatePath("/recipes");` with `import { revalidatePath } from "next/cache";` at top.
- [x] **Step 5:** Wire web: `pnpm --filter web add "@costwise/domain@workspace:*"`; add `"@costwise/domain"` to `transpilePackages` in `apps/web/next.config.ts`. Rewrite web imports of the moved modules — every `@/app/services/X` → `@costwise/domain/services/X` (except `services` itself), `@/app/repositories/X` → `@costwise/domain/repositories/X`, `@/types/X` → `@costwise/domain/types/X` (except `pg`), `@/app/utils/{errors,pricing,transformers}` → `@costwise/domain/utils/...`. Relative-path variants (`../../utils/errors` etc.) too — find with `grep -rn "utils/errors\|utils/pricing\|utils/transformers\|/services/\|/repositories/\|types/specialTypes\|types/repositories\|types/services\|types/context" apps/web/src | grep -v "@costwise" | grep -v "components/"` and iterate until only legitimate hits remain (UI files like `services.ts`, `utils/{cn,formatters,pagination,errorHandler,uiHelpers}` stay web-local).
- [x] **Step 6:** Gates: `pnpm install && pnpm build && pnpm test && pnpm lint` all green; `grep -rn "next/" packages/` empty; web dev smoke: recipes/ingredients/suppliers/dashboard pages render, create+delete a recipe works and the list refreshes (revalidatePath relocation proof). Anything failing that Steps 1–5 don't explain: STOP and report.
- [x] **Step 7:** Commit: `git add -A && git commit -m "refactor: extract domain layer into @costwise/domain"`.
- [x] **Step 8: ⛔ CHECKPOINT — push `feature/hono-api` and stop.** This task rewired the entire web app's imports; it gets reviewed before anything is built on top. Report the gate outputs and wait for Panos/Fable 5 sign-off (external mode) or Fable 5's between-task review (supervised).
- [x] **Step 9 (added at checkpoint-1 review, Fable 5):** the original Step 1 package.json gave `@costwise/domain` no test runner, orphaning the 19 tests in `src/utils/helpers.test.ts` (workspace total fell 47→28). Remediation: add `"test": "vitest run"` to `packages/domain/package.json` scripts, add devDependency `"vitest": "^3.1.0"`, create `packages/domain/vitest.config.ts` with `import { defineConfig } from "vitest/config"; export default defineConfig({ test: { environment: "node" } });`, run `pnpm install`, then verify `pnpm test` reports **47 total tests across web+domain**, all green. Commit `fix(domain): run the moved transformer tests under vitest` with the test-count evidence in the body, push, and proceed to Task 3.

---

### Task 3: Scaffold `apps/api` with a TDD'd health route

**Files:** Create `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/vitest.config.ts`, `apps/api/src/app.ts`, `apps/api/src/index.ts`, `apps/api/src/app.test.ts`. Modify `turbo.json` (nothing needed — `dev`/`build`/`test` tasks already exist and pick up the new package's scripts).

**Interfaces produced:** `createApp(deps: Deps): OpenAPIHono` (all later route tasks register into it); `Deps` type; dev server on `:3001`.

- [x] **Step 1:** `apps/api/package.json`:

```json
{
  "name": "api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@costwise/domain": "workspace:*",
    "@costwise/shared": "workspace:*",
    "@hono/node-server": "^1.14.0",
    "@hono/zod-openapi": "^0.19.0",
    "@scalar/hono-api-reference": "^0.9.0",
    "@vercel/blob": "^1.1.1",
    "hono": "^4.7.0",
    "zod": "^3.25.75"
  },
  "devDependencies": { "@types/node": "^20", "tsx": "^4.20.3", "typescript": "^5", "vitest": "^3.1.0" }
}
```

`apps/api/tsconfig.json`: copy `packages/db/tsconfig.json`, `"include": ["src"]`. `apps/api/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node" } });
```

- [x] **Step 2 (RED):** `apps/api/src/app.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { createApp } from "./app";

describe("health", () => {
  it("GET /health returns ok without auth", async () => {
    const res = await createApp({} as never).request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
```

Run `pnpm --filter api test` → expect FAIL: cannot resolve `./app`.

- [x] **Step 3 (GREEN):** `apps/api/src/app.ts`:

```ts
import { OpenAPIHono } from "@hono/zod-openapi";

export type Deps = Record<string, never>; // widened by later tasks

export const createApp = (deps: Deps) => {
  const app = new OpenAPIHono();
  app.get("/health", (c) => c.json({ status: "ok" }));
  return app;
};
```

`apps/api/src/index.ts`:

```ts
import { serve } from "@hono/node-server";
import { createApp } from "./app";

serve({ fetch: createApp({}).fetch, port: 3001 }, (i) =>
  console.log(`api listening on :${i.port}`)
);
```

- [x] **Step 4:** `pnpm install`; `pnpm --filter api test` → PASS. `pnpm dev` starts web (3000) AND api (3001); `curl localhost:3001/health` → `{"status":"ok"}`. Stop dev.
- [x] **Step 5:** `pnpm build && pnpm test && pnpm lint` green (workspace). Commit `feat(api): scaffold hono app with health route`.

---

### Task 4: Error envelope + `requireUser` middleware (TDD)

**Files:** Create `apps/api/src/middleware/errors.ts`, `apps/api/src/middleware/auth.ts`, tests beside each.

**Interfaces produced:** `errorHandler` (registered via `app.onError`); `requireUser` middleware setting `c.var.userId: string`; envelope type `{error:{code:string,message:string,fieldErrors?:Record<string,string>}}`. Error-code mapping: class name → SCREAMING_SNAKE (`ValidationError`→`VALIDATION_ERROR`, unknown→`INTERNAL`).

- [x] **Step 1 (RED):** `apps/api/src/middleware/errors.test.ts`:

```ts
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
```

Run → FAIL (`./errors` unresolved). NOTE: open `@costwise/domain/utils/errors.ts` first and mirror the REAL constructor signatures in these tests (e.g. `ValidationError` takes the field array, `NotFoundError(resource, id)`); if they differ from shown, adjust the test calls — the assertions stay.

- [x] **Step 2 (GREEN):** `apps/api/src/middleware/errors.ts`:

```ts
import type { Context } from "hono";
import { AppError, ValidationError } from "@costwise/domain/utils/errors";

const toCode = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

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
```

(Adjust the `ValidationError` field-list property name to the real one after reading the class.) Verify GREEN.

- [x] **Step 3 (RED):** `apps/api/src/middleware/auth.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { requireUser } from "./auth";

const app = new OpenAPIHono<{ Variables: { userId: string } }>();
app.use("/p/*", requireUser);
app.get("/p/me", (c) => c.json({ userId: c.var.userId }));

describe("requireUser (interim, pre-Better-Auth)", () => {
  afterEach(() => { delete process.env.NODE_ENV_OVERRIDE; });
  it("401s with no x-user-id", async () => {
    expect((await app.request("/p/me")).status).toBe(401);
  });
  it("sets userId from x-user-id outside production", async () => {
    const res = await app.request("/p/me", { headers: { "x-user-id": "u1" } });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ userId: "u1" });
  });
  it("always 401s in production even with header", async () => {
    process.env.NODE_ENV_OVERRIDE = "production";
    const res = await app.request("/p/me", { headers: { "x-user-id": "u1" } });
    expect(res.status).toBe(401);
  });
});
```

Run → FAIL.

- [x] **Step 4 (GREEN):** `apps/api/src/middleware/auth.ts`:

```ts
import { createMiddleware } from "hono/factory";

// INTERIM SEAM — Task 3 (Better Auth) replaces the body; contract stays:
// on success c.set("userId", ...), on failure 401 envelope.
export const requireUser = createMiddleware<{ Variables: { userId: string } }>(
  async (c, next) => {
    const env = process.env.NODE_ENV_OVERRIDE ?? process.env.NODE_ENV;
    const userId = env === "production" ? undefined : c.req.header("x-user-id");
    if (!userId)
      return c.json({ error: { code: "AUTHENTICATION_ERROR", message: "Sign in required" } }, 401);
    c.set("userId", userId);
    await next();
  }
);
```

Verify GREEN, workspace suite green. Wire `app.onError(errorHandler)` into `createApp`. Commit `feat(api): error envelope and interim auth middleware`.

---

### Task 5: Route plumbing + recipes endpoints (TDD — this task defines THE TEMPLATE)

**Files:** Create `apps/api/src/routes/schemas.ts`, `apps/api/src/routes/recipes.ts`, `apps/api/src/routes/recipes.test.ts`, `apps/api/src/testing/fakes.ts`. Modify `apps/api/src/app.ts` (Deps grows; mount), `apps/api/src/index.ts` (real wiring).

**Interfaces produced (later tasks consume verbatim):**
- `Deps` gains `makeRecipeService: (userId: string) => RecipeServiceLike` (and analogues per domain in their tasks).
- `RecipeServiceLike = Pick<RecipeService, "findAll" | "findById" | "create" | "update" | "delete">` — structural, so fakes need no class.
- `apps/api/src/routes/schemas.ts` exports: `ErrorEnvelope`, `MetadataQuery` (zod for `Metadata` — `page`/`order`/`sort` optional coerced, `itemsPerPage`/`offset` coerced numbers with defaults matching current web usage — read `apps/web/src/app/utils/pagination.ts` for the default `itemsPerPage` and mirror it), `IdParam = z.object({ id: z.string() })`.
- **The route-definition template** every domain task instantiates:

```ts
// TEMPLATE — one createRoute + one openapi() registration per endpoint:
const listRecipes = createRoute({
  method: "get", path: "/", request: { query: MetadataQuery },
  responses: {
    200: { content: { "application/json": { schema: RecipeListResponse } }, description: "List" },
    401: ErrRes, 500: ErrRes,
  },
});
router.openapi(listRecipes, async (c) => {
  const svc = deps.makeRecipeService(c.var.userId);
  const q = c.req.valid("query");
  const result = await svc.findAll(c.var.userId, toMetadata(q));
  return c.json(result ?? { recipes: [], count: { count: 0 } }, 200);
});
```

- [ ] **Step 1:** Write `schemas.ts` with, binding response schemas to real types:

```ts
import { z } from "@hono/zod-openapi";
import { RecipeSchema, type Recipe } from "@costwise/shared/recipe";
import type { Metadata } from "@costwise/domain/types/specialTypes";

export const ErrorEnvelope = z.object({
  error: z.object({ code: z.string(), message: z.string(), fieldErrors: z.record(z.string()).optional() }),
});
export const ErrRes = { content: { "application/json": { schema: ErrorEnvelope } }, description: "Error" };

export const MetadataQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  sort: z.string().optional(),
  itemsPerPage: z.coerce.number().int().positive().default(10 /* mirror pagination.ts */),
  offset: z.coerce.number().int().min(0).default(0),
});
export const toMetadata = (q: z.infer<typeof MetadataQuery>): Metadata => q;

export const IdParam = z.object({ id: z.string() });

export const CountSchema = z.object({ count: z.object({ count: z.number() }) });
export const RecipeListResponse = z.object({ recipes: z.array(RecipeSchema) }).merge(CountSchema)
  satisfies z.ZodType<{ recipes: Recipe[]; count: { count: number } }>;
```

If `tsc` rejects a `satisfies` binding, the schema is wrong — fix the schema to match the type, never cast. `RecipeWithQuery` (findById) and mutation responses: read the service return types and bind the same way (`GET /:id` → schema for `RecipeWithQuery`; `POST`/`PATCH` mirror today's web behavior — POST returns 201 with `{message: string}`, PATCH 200 `{message: string}`, DELETE 200 `{id: string}` — confirm against `sendSuccess` usage in the current web routes and the service return types; mirror exactly).

- [ ] **Step 2 (RED):** `apps/api/src/testing/fakes.ts` + `recipes.test.ts`. Fakes: plain objects implementing the `*ServiceLike` picks over an in-memory array keyed by userId; throwing `NotFoundError` where the real service does. Tests — for EVERY recipes endpoint the trio, e.g.:

```ts
import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, seedRecipe } from "../testing/fakes";

const H = { "x-user-id": "u1" };

describe("/v1/recipes", () => {
  it("401s without auth", async () =>
    expect((await createApp(fakeDeps()).request("/v1/recipes")).status).toBe(401));
  it("lists the user's recipes with count", async () => {
    const deps = fakeDeps(); seedRecipe(deps, "u1");
    const res = await createApp(deps).request("/v1/recipes", { headers: H });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recipes).toHaveLength(1);
    expect(body.count.count).toBe(1);
  });
  it("400s on invalid page param", async () =>
    expect((await createApp(fakeDeps()).request("/v1/recipes?page=zero", { headers: H })).status).toBe(400));
  it("404s unknown id", async () =>
    expect((await createApp(fakeDeps()).request("/v1/recipes/nope", { headers: H })).status).toBe(404));
  // + POST 201 happy / POST 400 invalid body / PATCH 200 / DELETE 200 — same style,
  // request bodies built from @costwise/shared RecipeSchema fixtures.
});
```

Write ALL of them now; run → FAIL (module missing).

- [ ] **Step 3 (GREEN):** `routes/recipes.ts` — `export const recipesRoutes = (deps: Deps) => {...}` returning an `OpenAPIHono` with the five endpoints via the TEMPLATE; mount in `app.ts`:

```ts
const v1 = new OpenAPIHono<{ Variables: { userId: string } }>();
v1.use("*", requireUser);
v1.route("/recipes", recipesRoutes(deps));
app.route("/v1", v1);
```

`index.ts` wires real services: `makeRecipeService: (userId) => new RecipeService(userId)` (import from `@costwise/domain/services/recipeService`). Verify GREEN; workspace gates green. Commit `feat(api): /v1/recipes endpoints`.

- [ ] **⛔ CHECKPOINT — push and stop.** This task established THE TEMPLATE that Tasks 6–9 mass-produce. A flaw here multiplies by four domains; it gets reviewed before replication.

---

### Task 6: Ingredients endpoints (TDD)

**Files:** Create `routes/ingredients.ts`, `routes/ingredients.test.ts`; extend `schemas.ts`, `fakes.ts`, `Deps` (`makeIngredientService`), mount `/ingredients`.

Instantiate the Task 5 TEMPLATE with these exact values — everything else identical in structure:

| Endpoint | Request schema | Service call | Success |
|---|---|---|---|
| GET `/` | `MetadataQuery` | `findAll(userId, toMetadata(q))` | 200 `IngredientListResponse` |
| POST `/` | body: `IngredientSchema` (shared) | `create(body)` | 201 `{message: string}` |
| GET `/:id` | `IdParam` | `findById(id)`; undefined → throw `NotFoundError` | 200 `IngredientToDisplayResponse` |
| PATCH `/:id` | `IdParam` + body `IngredientSchema` | `update(body)` | 200 `{message: string}` |
| DELETE `/:id` | `IdParam` | `delete(id)` | 200 `{id: string}` |

`IngredientToDisplaySchema = IngredientSchema.omit({ suppliers: true }).extend({ categoryName: IngredientCategoryNameSchema }) satisfies z.ZodType<IngredientToDisplay>` — list response wraps `{ ingredients: [...] }.merge(CountSchema)`. `IngredientServiceLike = Pick<IngredientService, "findAll"|"findById"|"create"|"update"|"delete">`.

- [ ] **Step 1 (RED):** full test file — the same trio set as recipes (401 / list / 400 query / 404 / POST 201 / POST 400 / PATCH 200 / DELETE 200), fixtures from `IngredientSchema`. Watch FAIL.
- [ ] **Step 2 (GREEN):** implement, mount, watch PASS; workspace gates. Commit `feat(api): /v1/ingredients endpoints`.

---

### Task 7: Suppliers endpoints (TDD)

Same shape as Task 6 with `SupplierSchema` (shared), `SuppliersService` (`makeSuppliersService`), paths `/v1/suppliers…`, list response `{ suppliers: [...] }.merge(CountSchema) satisfies z.ZodType<{suppliers: Supplier[]; count: {count: number}}>`; DELETE returns `{id: string}`, POST 201/PATCH 200 `{message: string}` (confirm against current web routes' `sendSuccess` payloads and mirror). RED (full trio suite watched failing) → GREEN → gates → commit `feat(api): /v1/suppliers endpoints`.

---

### Task 8: Search + analytics endpoints (TDD)

**Files:** `routes/search.ts(+test)`, `routes/analytics.ts(+test)`; `Deps` gains `makeSearchService: (term: string, userId: string) => SearchServiceLike` and reuses recipe/ingredient service makers for analytics.

- `GET /v1/search?q=` — missing/empty `q` → 400 envelope (schema `z.object({ q: z.string().min(1) })`); success 200 `{ ingredients: IngredientToDisplay[] | undefined, recipes: Recipe[] | undefined }` mirroring today's search route (`findIngredient()` + `findRecipe()`).
- Analytics (all GET, no params beyond auth):
  `/v1/analytics/recipes` → `recipeService.getRecipesAnalytics(userId)`;
  `/v1/analytics/categories` → `getCategoryAnalytics(userId)`;
  `/v1/analytics/margins` → `getMarginHighlights(userId)`;
  `/v1/analytics/ingredients` → `ingredientService.getIngredientAnalytics(userId)`;
  `/v1/analytics/high-impact-ingredients` → `getHighImpactIngredients(userId)`.
  Read each method's return type in `@costwise/domain` and bind response schemas with `satisfies` (types `CategoryAnalytics`, `MarginHighlights`, etc. — they live in domain types; if a method takes extra args beyond `userId`, mirror them as query params the same way `MetadataQuery` works). Extend `RecipeServiceLike`/`IngredientServiceLike` picks with these methods.

RED first for every endpoint (401 + success shape + 400 for search), watch fail → GREEN → gates → commit `feat(api): /v1/search and /v1/analytics endpoints`.

---

### Task 9: Uploads endpoint (TDD)

**Files:** `routes/uploads.ts(+test)`; `Deps` gains `putBlob: (name: string, body: Blob | ArrayBuffer, opts: { access: "public" }) => Promise<{ url: string }>`.

- [ ] **Step 1:** Read `apps/web/src/app/api/upload/route.ts` and mirror its contract exactly (field name of the multipart file, response payload, validation such as file presence/size). 
- [ ] **Step 2 (RED):** tests: 401 no auth; 400 no file; 201/200 (mirror current status) happy path returns the blob URL — `putBlob` fake returns `{url: "https://blob.test/x"}` and the test asserts it was called with the uploaded filename. Watch FAIL.
- [ ] **Step 3 (GREEN):** `POST /v1/uploads` (multipart via `c.req.parseBody()`), wired in `index.ts` to `@vercel/blob`'s `put`. Gates. Commit `feat(api): /v1/uploads endpoint`.

---

### Task 10: OpenAPI docs at `/docs`

- [ ] **Step 1 (RED):** test in `app.test.ts`: `GET /openapi.json` → 200, body has `openapi` field and `paths["/v1/recipes"]`; `GET /docs` → 200 html. Watch FAIL.
- [ ] **Step 2 (GREEN):** in `app.ts`:

```ts
app.doc("/openapi.json", { openapi: "3.0.0", info: { title: "CostWise API", version: "1" } });
app.get("/docs", Scalar({ url: "/openapi.json" }));
```

(`import { Scalar } from "@scalar/hono-api-reference"` — if the package's current export differs, use its README's Hono snippet verbatim.) Docs must NOT require auth. Verify GREEN. Commit `feat(api): serve OpenAPI spec and docs UI`.

---

### Task 11: Full acceptance gate + report

- [ ] **Step 1:** Workspace gates: `pnpm build && pnpm test && pnpm lint` green.
- [ ] **Step 2:** Greps: `grep -rn "next/" packages/` → empty; `grep -rn "from \"\.\./services/\|from \"\.\./repositories/" apps/web/src` → empty (module-local UI helpers excepted); every `/v1` path from the spec's Decision 7 appears in `curl -s localhost:3001/openapi.json`.
- [ ] **Step 3:** Manual: `pnpm dev`; `curl localhost:3001/v1/recipes` → 401; `curl -H "x-user-id: <real user id from your db>" localhost:3001/v1/recipes` → 200 with real data; `/docs` renders in a browser. Web smoke unchanged (spec criterion 5) including a real upload and recipe create/delete with list refresh.
- [ ] **Step 4:** Push `feature/hono-api`, open PR to `main` (CI must go green), report to Panos: gates, any STOP-and-report items resolved, PR URL, reminder that ClickUp 868kv7taa moves through Panos/Fable 5. Do NOT merge.
