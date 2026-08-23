# Task 2 — Stand Up the Hono API (Spec)

**Date:** 2026-08-23
**ClickUp:** [Task 2 — Stand up the Hono API](https://app.clickup.com/t/868kv7taa)
**Parent spec:** `docs/superpowers/specs/2026-08-23-ui-backend-separation-design.md` (Section 7 Task 2; ADRs 2, 3, 5, 6)
**Status:** Ready for planning
**Execution:** by executor models. Fable 5 judged this task large but NOT
super-complex — it is repetitive route-building over an already-layered
service codebase, which a detailed plan makes executor-safe.

## Goal

Create `apps/api` (Hono) exposing every operation the web app performs as a
documented `/v1` endpoint, with the domain layer extracted so both apps can
use it during the transition. The web app keeps working unchanged.

## Current State (verified 2026-08-23, post-Task 1 monorepo)

- Web API routes: recipes (POST, PATCH/:id, DELETE/:id), ingredients (POST,
  PATCH/:id, DELETE/:id), suppliers (POST, PATCH/:id, DELETE/:id), search
  (GET), upload (POST), auth signup (POST), NextAuth handler.
- Server components additionally call services directly for reads:
  `findAll` (paginated lists), `findById`, and dashboard analytics
  (`getRecipesAnalytics`, `getCategoryAnalytics`, `getMarginHighlights`,
  `getIngredientAnalytics`, `getHighImpactIngredients`).
- Class services: `authservice`, `ingredientService`, `recipeService`,
  `searchService`, `suppliersService`, `validationService`. They import
  repositories, `types/*`, `utils/{errors,pricing,transformers}`,
  `@costwise/shared`, `@costwise/db` — and nothing from the UI.
- `services.ts` is a CLIENT-side HTTP helper for the UI (imports a form
  component type). It is NOT a domain service and stays in `apps/web`.
- One Next coupling in the domain layer: `recipeRepository.ts` calls
  `revalidatePath("/recipes")` (`next/cache`) — must not move into a
  package used by a non-Next server.
- Error classes exist in `utils/errors.ts` (`AppError` with `statusCode`,
  `ValidationError`, `ConflictError`, `NotFoundError`, `ForbiddenError`,
  `AuthenticationError`, `DatabaseError`).
- Rich Zod schemas exist in `@costwise/shared` (Recipe, Ingredient,
  IngredientToDisplay, categories, units, …).

## Decisions

1. **Domain layer becomes `packages/domain` (`@costwise/domain`)** — an
   amendment to parent ADR 3, which said services/repositories move into
   `apps/api`. Rationale: during Tasks 2–3 the web app still calls services
   directly (server components) and its `/api` routes must keep working; a
   workspace package lets BOTH apps consume one copy with no duplication
   and no cross-app imports. After Task 4, `apps/web` drops the dependency
   and `apps/api` remains the package's only consumer — satisfying ADR 3's
   intent ("API is the only door"). The package also positions agent tools
   (Task 7) to wrap services cleanly. Contents: the six class services,
   all nine repositories, `types/{auth,context,errors,repositories,services,specialTypes}.ts`,
   `utils/{errors,pricing,transformers}.ts` (+ their tests). Same wildcard
   subpath exports pattern as the other packages.
2. **`revalidatePath` moves up one layer**: deleted from
   `recipeRepository`; the web mutation routes that change recipes call it
   after the service returns. Domain packages must be framework-free.
3. **Stack:** Hono + `@hono/zod-openapi` (routes defined with the shared
   Zod schemas; OpenAPI generated, docs UI at `/docs`) + `@hono/node-server`
   on port 3001. Tests with **Vitest** (native TS/ESM; Jest+next/jest is a
   web-app-specific setup and stays there).
4. **Interim auth seam (until Task 3):** middleware `requireUser` resolves
   the acting user and sets `userId` in context. In Task 2 it reads an
   `x-user-id` header ONLY when `NODE_ENV !== "production"`; in production
   it always returns 401. Task 3 replaces its internals with Better Auth
   session resolution — same contract, routes untouched. The API is not
   deployed until Task 5 (after 3–4), so no insecure surface ever ships.
5. **Auth endpoints are OUT of Task 2.** Signup/signin stay on the web's
   NextAuth until Task 3 replaces the whole mechanism with Better Auth —
   porting signup to `/v1` now would be built-to-throw-away.
6. **Error contract:** services keep throwing `AppError` subclasses; a
   single API error handler maps `statusCode` to HTTP status with envelope
   `{ "error": { "code": string, "message": string, "fieldErrors"?: {...} } }`.
   Zod validation failures → 400 with `fieldErrors`. Unknown errors → 500
   with a generic message, never internals.
7. **Endpoint inventory** (all under `/v1`, all behind `requireUser`):
   - `GET/POST /v1/recipes`, `GET/PATCH/DELETE /v1/recipes/:id`
   - `GET/POST /v1/ingredients`, `GET/PATCH/DELETE /v1/ingredients/:id`
   - `GET/POST /v1/suppliers`, `GET/PATCH/DELETE /v1/suppliers/:id`
   - `GET /v1/search?q=`
   - `POST /v1/uploads` (Vercel Blob, same as today's upload route)
   - `GET /v1/analytics/recipes`, `/v1/analytics/categories`,
     `/v1/analytics/margins`, `/v1/analytics/ingredients`,
     `/v1/analytics/high-impact-ingredients`
   List endpoints carry the same pagination/sort query params the current
   `findAll` signatures accept. Response shapes mirror what services return
   today — the API is behavior-preserving, not a redesign.
8. **Schema honesty is machine-checked:** every response schema declared
   for OpenAPI is bound to the existing TS type with
   `satisfies z.ZodType<T>` so a schema that drifts from the real return
   type fails `tsc`, not code review.
9. **Testing strategy:** routes are TDD'd with Vitest + Hono's
   `testClient`. Services are injected into route factories (simple DI),
   so route tests use in-memory fakes — CI has no Postgres, and route
   tests assert HTTP behavior (auth, validation, status codes, envelope),
   not SQL. The moved domain code is a refactor: its existing tests move
   with it and must stay green; no new domain tests are required by this
   task. This mock boundary is declared per the TDD rule in
   `docs/AGENTS.md`.
10. **Web keeps working throughout** — its imports are rewritten to
    `@costwise/domain/...` but its behavior is untouched. Zero
    visual/functional diff is an acceptance criterion.

## Acceptance Criteria (verification gate)

1. `pnpm build`, `pnpm test`, `pnpm lint` pass across the workspace (CI
   green on the PR).
2. `apps/api` runs locally (`pnpm dev` starts web on 3000 AND api on 3001).
3. Every endpoint in Decision 7 exists, is documented in the OpenAPI spec
   served at `/docs`, returns the envelope on errors, and 401s without a
   valid `requireUser` resolution.
4. Route test suite covers, per endpoint: 401 unauthenticated, 400 invalid
   input (where a body/params exist), success status + response shape.
   Every test was watched failing first (TDD).
5. The web app works unchanged: manual smoke of recipes, ingredients,
   suppliers, search, dashboard, upload — including recipe mutations still
   refreshing the recipes list (revalidatePath relocation verified).
6. `grep -rn "next/cache" packages/` is empty; `apps/web` has no imports
   from `../services/` or `../repositories/` relative paths (only
   `@costwise/domain`).

## Out of Scope

- Auth migration and `/v1/auth/*` (Task 3). Web switching to consume `/v1`
  (Task 4). Deployment (Task 5). Agent endpoints (Task 7).
- Dependency slimming of `apps/web`'s package.json (Task 4, when its
  direct db/domain usage ends).

## Risks & Mitigations

- **Hidden web↔domain entanglement** beyond the two known couplings →
  the extraction is grep-driven with build+test gates; anything unexpected
  is a STOP-and-report, not an improvisation.
- **Schema drift between API docs and reality** → Decision 8 makes drift a
  compile error.
- **Uploads need `BLOB_READ_WRITE_TOKEN`** at runtime → route tests fake
  the blob client; manual upload smoke uses the real token from `.env`.
