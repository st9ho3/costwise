# Decisions & Invariants

The **why** layer. Architecture (`architecture.md`) says what exists; routing
(`where-to-touch.md`) says where to start. This file says what you must not
break and why — the things an agent cannot re-derive by reading code.

Each entry is true, non-obvious, and expensive to violate. If a rule here goes
stale, fix it here. Do not restate architecture or routing in this file.

## Read this before you...

- Touch pricing, ingredient cost, or recipe recalculation → "Ingredient cost
  changes must recalculate dependent recipes".
- Add or remove a recipe ingredient → "Recipe ingredient changes must adjust
  usage counts".
- Add any multi-step write → "Multi-step writes go in a single transaction".
- Add a service method that reads or writes user data → "Ownership is enforced
  in services".
- Rename, move, or "fix the spelling of" a folder → "`src/shemas` is spelled
  this way on purpose".

---

## `src/shemas` is spelled this way on purpose

**Why:** Historical typo that is now load-bearing. The folder is imported as
`@/shemas/...` in **58 files** (`@/*` maps to `./src/*` in `tsconfig.json`).

**Do NOT** rename it to `src/schemas`. It looks like a one-line cleanup and is
not — a rename is a separate, deliberate migration that must update every
import in lockstep. Leave it alone unless that migration is the explicit task.

---

## Ownership is enforced in services, never in routes

**Why:** API routes are thin, untrusted transport. Authorization is a business
rule, so it lives in the service layer.

**Invariant:** A service receives the authenticated `userId` in its constructor
(`new RecipeService(userId)`) and stores it as `currentUserID`. Every method
that touches user-scoped data compares the resource's `userId` against
`currentUserID` and throws `ForbiddenError` on mismatch. See
`recipeService.ts` and `suppliersService.ts` for the canonical pattern
(`findById`, `findAll`, `create`, `update`, `delete` all check).

**When adding a service method:** pass `userId` from the route, compare it in
the service, throw `ForbiddenError`. Do not check ownership in the route.

> Known gap: `ingredientService.ts` does not yet apply these checks on all
> methods. That is a deviation from the rule, not the rule.

---

## Multi-step writes go in a single transaction

**Why:** Domain writes span several tables (recipe + recipe_ingredients +
ingredient usage; supplier + address + financial data + categories). A partial
write corrupts derived data.

**Invariant:** Any operation that writes to more than one table wraps the work
in `db.transaction(async (tx) => { ... })` and threads the same `tx` into every
repository call inside it. Repositories accept `tx` as a parameter — never open
their own transaction. See `suppliersService.create` and `recipeService.create`.

---

## Ingredient cost changes must recalculate dependent recipes

**Why:** Recipe cost and profit margin are **denormalized** onto the recipe row
for fast reads. They are not computed at query time, so they go stale the moment
an ingredient's `unitPrice` changes unless something recomputes them.

**Invariant:** When `ingredientService.update` changes an ingredient, it must,
**inside the same transaction**, find every recipe using that ingredient
(`recipeRepository.findAllByIngredientId`) and call
`recipeService.updateRecipeAfterIngredientsChange` for each. That method
recomputes `totalCost` and `profitMargin` via `utils/pricing.ts`.

**When changing ingredient pricing logic:** the recalculation cascade is not
optional. Skipping it leaves recipes showing wrong prices.

---

## Recipe ingredient changes must adjust usage counts

**Why:** Each ingredient tracks a `usage` count (how many recipes use it) for
analytics. It is denormalized, so it only stays correct if every add/remove
adjusts it.

**Invariant:** Inside the recipe create/update/delete transactions, every added
recipe-ingredient calls `ingredientRepository.updateUsage(id, tx, "+")` and
every removed one calls `updateUsage(id, tx, "-")`. See `recipeService.create`,
`update`, and `delete`.

---

## Validation happens in the service before any DB write

**Why:** Repositories trust their inputs. The service is the boundary where
untrusted request data becomes a valid domain object.

**Invariant:** Services validate through `validationService.ts`
(`zodValidateIngredientBeforeAddItToDatabase`, `validateComplexEntity`) against
the Zod schemas in `@/shemas` *before* calling repositories. A `safeParse`
failure throws `ValidationError`. Do not push raw request data into a repository.

---

## All UI must follow the Costwise Design System ("Paper and Produce")

**Why:** The interface is custom-designed for chefs and kitchen owners with a warm, tactile companion feel (warm cream surfaces `--cream-50`, broccoli green `--green-800`, warm gold `--gold-500`, Bricolage Grotesque, Nunito Sans, and IBM Plex Mono tabular money figures). Old styles with cold grey backgrounds, generic UI kits, or hard black shadows are completely removed.

**Invariant:** All screens must use the primitives in `src/app/components/ui/` and tokens defined in `src/app/globals.css` as documented in `docs/ui.md`. Do not introduce ad-hoc styles or cold grey palettes.
