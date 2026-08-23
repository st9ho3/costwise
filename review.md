# Architecture Review

Scope: current repository state in `/Users/panagiotisstachoulis/Desktop/agent`.
Verified via: `tsc --noEmit` (15 errors, reproduced), direct reads of every layer, git tracking check.

## Summary

The intended architecture — `UI → hooks/stores → services → repositories → database`, layered NextAuth + Drizzle + Zustand — is sound and the folder map in `docs/architecture.md` is genuinely useful. The problems are not in the design; they're in **drift**: a half-finished data-model migration, broken layer boundaries, and security gaps that the type-checker is actively flagging. The integration gate is currently red.

---

## Critical

### 1. Upload endpoint is unauthenticated and writes public blobs
**File:** [src/app/api/upload/route.ts](./src/app/api/upload/route.ts)

No `auth()` call, no file-type check, no size limit, `access: "public"`. Every other route gates on `session.user.id`; this one lets anyone on the internet upload arbitrary public files to your Vercel Blob store. Add the auth check and validation that the rest of the API already uses.

### 2. Tenant isolation is incomplete and inconsistent
- `IngredientService.findById` and `delete` have **no ownership check at all** ([src/app/services/ingredientService.ts:59](./src/app/services/ingredientService.ts) and `:122`) — unlike `RecipeService`/`SupplierService`, which at least check `userId`. Any authenticated user can read or delete any ingredient by id.
- Where checks *do* exist, they trust `userId` from the request body and then the repository writes scope by **record id only** (e.g. `RecipeRepository.update`/`delete`, `IngredientRepository.delete`). The `WHERE` clause never includes `userId`, so a guessed UUID = cross-tenant write. Ownership should be enforced in the SQL predicate, not just in a service-layer `if`.

---

## High

### 3. Ingredient/supplier pricing migration is half-done — root cause of most type errors
The schema moved `unit`/`unitPrice`/`quantity` off `ingredients` into the `supplier_ingredients` join table ([src/db/schema.ts:155](./src/db/schema.ts)), but the rest of the app still treats them as ingredient fields. Concretely:
- [src/types/specialTypes.ts:193](./src/types/specialTypes.ts) reads `ingredientsTable.unitPrice` — **a column that no longer exists** (`TS2339`).
- [src/app/utils/transformers.ts](./src/app/utils/transformers.ts), [src/app/hooks/useIngredientsForm.tsx](./src/app/hooks/useIngredientsForm.tsx), the recipe pages, and [src/app/services/searchService.ts](./src/app/services/searchService.ts) all expect a `suppliers` property / pricing fields that the new types don't provide.

Until the DTOs in [src/shemas/recipe.ts](./src/shemas/recipe.ts) and `transformers.ts` match the Drizzle schema, the codebase stays uncompilable across multiple files.

### 4. Transaction-atomicity bug in `RecipeService.update`
**File:** [src/app/services/recipeService.ts:186](./src/app/services/recipeService.ts)

Inside `db.transaction`, the recipe row update is called as `this.recipeRepository.update(id, validatedEntity)` **without passing `tx`**, so it runs on the global connection. If the subsequent ingredient add/remove fails and the tx rolls back, the recipe edit still persists. The fix is passing `tx` as the third argument.

### 5. `SupplierIngredientRepository.update` and `.delete` are empty stubs
**File:** [src/app/repositories/supplierIngredientsRepository.ts:16-25](./src/app/repositories/supplierIngredientsRepository.ts)

Declared `Promise<void>` with empty bodies, causing `TS2355` errors. Any supplier-ingredient update or delete silently does nothing — data loss without an exception. This is the live feature on the current branch, wired in as a no-op.

---

## Medium — Layer boundary leaks

### 6. DB schema imports a React component
**File:** [src/db/schema.ts:23](./src/db/schema.ts)

```ts
import IngredientsTable from "@/app/components/ingredients/ingredientsTable";
```

Unused (dead import), but it points the dependency arrow exactly backwards: the database layer must never reach into UI. Delete it.

### 7. `services/services.ts` is misfiled
**File:** [src/app/services/services.ts](./src/app/services/services.ts)

This is a **client-side** `fetch`/`localStorage` module sitting in the folder the docs define as "business rules, transactions, permission checks." Two different meanings of "service" collide here, which undermines `docs/where-to-touch.md`. It also still contains `createMessage` localStorage chat scaffolding with no real call site. Move it to e.g. `app/api-client/` and drop the chat leftovers.

### 8. Repository calls `revalidatePath`
**File:** [src/app/repositories/recipeRepository.ts:167](./src/app/repositories/recipeRepository.ts)

A repository shouldn't know about Next.js cache semantics. Move `revalidatePath` up to the route handler or service.

### 9. Dead/leftover artifacts
- [src/types/context.ts:2](./src/types/context.ts) imports `@/app/context/homeContext/homeReducer` — **the module doesn't exist** (`TS2307`).
- [src/shemas/chat.ts](./src/shemas/chat.ts) and `createMessage` in `services.ts` are leftover chat scaffolding.

### 10. Debug logging left in business logic
**Files:** [src/app/services/ingredientService.ts:77-84](./src/app/services/ingredientService.ts), [src/app/services/validationService.ts:12](./src/app/services/validationService.ts)

`console.log("initiate transaction")`, `console.log("ingredient", result)`, etc. left from development. Remove before shipping.

### 11. Test coverage is one file and it doesn't compile
**File:** [src/app/utils/helpers.test.ts:64](./src/app/utils/helpers.test.ts)

The only test file fails the `suppliers`-property type error too. The safety net isn't catching the drift it was meant to catch. `npm test` currently reports 18 passing, 2 failing.

---

## Low — Hygiene, some expensive to fix later

### 12. Typos baked into the persistence layer
`suplierId` is the actual **DB column name** in `supplier_ingredients` and `supplier_categories`. Related: `udersRelations`, the `src/shemas/` folder (correct spelling is `schemas`), `supplierDeafaultValues.ts`, `uathFormdefaultValues.ts`. The identifier typos are cheap renames; the **DB column typos require a migration** — fix them now while the supplier feature is still in flight and no data is in production yet.

### 13. No dependency injection
`IngredientService`'s constructor `new`s up `RecipeService`, which `new`s up three repositories. Hard-wired graphs can't be unit-tested with fakes and make the ingredient→recipe recalculation coupling invisible. Inject repositories/services via constructor parameters.

### 14. Canonical docs are not committed to git
`docs/`, `CLAUDE.md`, `AGENTS.md`, and `review.md` are all untracked (`??`). `CLAUDE.md` declares `docs/` as the authoritative source of truth, but nothing in it is in git — so it can't actually enforce that for collaborators or CI. Commit them.

---

## Verification Notes

- `npx tsc --noEmit` — **15 errors** across `services/ingredientService.ts`, `repositories/supplierIngredientsRepository.ts`, `repositories/recipeRepository.ts`, `utils/transformers.ts`, `types/specialTypes.ts`, `types/context.ts`, and multiple page files.
- `npm test -- --runInBand` — 18 passing, 2 failing in [src/app/utils/helpers.test.ts](./src/app/utils/helpers.test.ts).
- `npm run lint` — fails with unused imports, `any` usage, and hook dependency warnings.
- `npm run build` — compiles but fails during font fetching in [src/app/(user)/layout.tsx](./src/app/(user)/layout.tsx) in network-restricted environments.
- `npm audit --omit=dev` — 7 production vulnerabilities across `next`, `drizzle-orm`, `next-auth`, `@vercel/blob`, `uuid`.

---

## Recommended Order of Attack

1. **Lock down the upload route** — add `auth()`, file-type check, size limit (security).
2. **Add `userId` to repository write predicates** — scope `WHERE` clauses by both `id` and `userId` (security).
3. **Add ownership checks to `IngredientService.findById` and `delete`** (security).
4. **Finish the supplier-ingredient migration** — align DTOs/transformers to the current schema, implement the two stubbed repository methods. This clears most of the 15 `tsc` errors.
5. **Pass `tx` in `RecipeService.update`** — atomicity fix.
6. **Clean boundaries** — remove schema→UI import, move `revalidatePath` to route handler, move `services.ts` to `api-client/`, drop chat scaffolding and debug logs.
7. **Get `tsc`, lint, and tests green** — then commit the docs.
8. **Rename the typo'd DB columns** via migration while the supplier feature is still unreleased.
9. **Upgrade vulnerable runtime dependencies** after the codebase is stable enough to absorb them.
