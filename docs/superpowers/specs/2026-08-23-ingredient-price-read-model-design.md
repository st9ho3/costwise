# Ingredient Price Read Model (Spec)

**Date:** 2026-08-23
**ClickUp:** [868kv85nv — numeric field shapes](https://app.clickup.com/t/868kv85nv) (root cause of residual items 3 & 5)
**Status:** Spec ready for review.
**Execution:** executor models (not super-complex — the design call is made
here; the delta is one additive schema change, a backfill script, and two
small write-path edits). Continues on the executor's existing branch
`fix/ingredient-supplier-selection`, same PR.

## Goal

An ingredient's price/unit/quantity round-trip: what the user saves is what
the ingredients table, the dish-form picker, and dish cost math read back.

## Root Cause (verified 2026-08-23 at `3be3702`)

The UI-revamp schema moved `unit`, `unit_price`, `quantity` off the
`ingredients` table into the `supplier_ingredients` join table — but only
the **create** path followed:

- **Write:** `destructureIngredient` strips the three fields from the
  ingredient row and writes them into `supplier_ingredients` (one row per
  selected supplier — all rows carry the same values). This is what api:dev
  logs show "saving the price."
- **Read:** `IngredientRepository.findAll`/`findById` select only
  `ingredients ⋈ categories` — **no repository anywhere reads
  `supplier_ingredients`** (grep: its repository has only `create`). So
  `transformIngredientFromDB` computes `Number(undefined)` → NaN → guarded
  to 0/"Unavailable" downstream. The join table is write-only storage.
- **Update:** `IngredientService.update` `.set()`s the `ingredients` row
  (where the columns don't exist — Drizzle silently drops the unknown keys)
  and never touches `supplier_ingredients` → price edits persist nowhere.
- **Consequences:** ingredients table shows no price; dish picker sees
  `unitPrice 0` → dishes save `totalCost/foodCost 0`; recipe-edit hydration
  (`transformRecipeIngredentFromDB` reading the joined ingredient row) gets
  `undefined`; an ingredient created with **zero suppliers loses its price
  entirely** (no supplier row is ever written).
- The commits on `fix/ingredient-supplier-selection` (3be3702) fixed the
  display-layer items of 868kv85nv but not this read model — correctly so;
  the fix belongs in the data layer, per this spec.

## Decisions

1. **Canonical price lives on the `ingredients` row again.** Restore three
   columns — `unit unitEnum NOT NULL DEFAULT ''`,
   `unit_price numeric(10,5) NOT NULL DEFAULT 0`,
   `quantity numeric NOT NULL DEFAULT 1` — to `ingredientsTable`.
   Rationale: the entire domain model already treats them as ingredient
   properties — `DBIngredientSchema`/`Ingredient` types kept the fields, the
   forms capture one price per ingredient, the recipe-recalc cascade
   (decisions.md invariant) flows one `unitPrice`, and the UI duplicates the
   same price into every supplier row. Restoring the columns realigns the DB
   with the type system; every read path starts working with **zero query
   changes** (`findAll`/`findById` select full rows;
   `transformIngredientFromDB` and `transformRecipeIngredentFromDB` already
   map the fields), and supplier-less ingredients keep their price.
   Rejected: joining/aggregating `supplier_ingredients` at read time —
   needs a which-supplier-price policy the product doesn't have, adds a
   join to every ingredient read (list, picker, recipe hydration, search),
   and still loses the price when no supplier is selected.
2. **`supplier_ingredients` keeps its columns** as the future per-supplier
   offer surface (868kv84c1 just wired supplier selection). To keep it
   truthful, `IngredientService.update` syncs it in the same transaction:
   new `SupplierIngredientRepository.updateByIngredientId(tx, ingredientId,
   { unit, unitPrice, quantity })`. Create already writes both places once
   `destructureIngredient` stops stripping the fields from the row.
3. **Migration is additive, via the house tools:** columns added in
   `packages/db/src/schema.ts` + `drizzle-kit push` (defaults make it safe
   for existing rows), then a one-shot idempotent backfill script
   `packages/db/scripts/backfill-ingredient-prices.ts` (Task 3 script
   precedent: transaction, printed row-count assertions) copies each
   ingredient's values from any of its `supplier_ingredients` rows (they
   are duplicates by construction). Push + backfill run behind a
   ⛔ CHECKPOINT — the dev DB is the only DB.
4. **TDD bindings:** RED-green where behavior lives —
   `destructureIngredient` retaining the fields (pure, `packages/shared`),
   and the update-sync in `IngredientService.update` (vitest,
   `packages/domain`, mocked repositories). The schema change and backfill
   script are **declared config/migration exceptions** per `docs/AGENTS.md`
   (gated by the checkpoint's printed assertions and the walkthrough).
5. **Same branch, same PR:** this is the completion of 868kv85nv, executed
   on `fix/ingredient-supplier-selection` on top of the executor's display
   fixes. The bug task closes only when this spec's acceptance passes.

## Acceptance Criteria (verification gate)

1. Create an ingredient (price 12.5/kg, one supplier): ingredients-table
   "WHAT IT COSTS" shows the per-unit price; the dish-form picker shows a
   non-zero per-unit price; DB rows in **both** `ingredients` and
   `supplier_ingredients` carry it.
2. Build a dish from that ingredient: saved dish has non-zero
   `total_cost`/`food_cost` and sensible margin ("Work it out" preview
   matches).
3. Create an ingredient with **no supplier**: price still persists and
   displays (item 1 behavior, minus the supplier row).
4. Edit an ingredient's price: `ingredients` row, its
   `supplier_ingredients` rows, and dependent recipes' denormalized costs
   all update (decisions.md recalc invariant holds — verify one dependent
   dish's cost changes).
5. Recipe edit page shows the correct per-ingredient prices (joined
   hydration path).
6. Backfill ran with printed assertions: `#ingredients backfilled ==
   #ingredients having supplier_ingredients rows`; pre-existing
   walkthrough ingredients display their prices.
7. `pnpm build && pnpm test && pnpm lint` green; new RED tests green; CI
   green on the PR.

## Out of Scope

- Per-supplier differentiated pricing UI (offers with different prices per
  supplier) — future feature; the join table is ready for it.
- The already-fixed display items of 868kv85nv (VAT wiring, NaN defaults,
  formatPrice) — stay as the executor shipped them.
- `DBIngredientSchema.unitPrice`'s odd `z.string().min(0.001)` (string
  length min — latent, harmless here; note for a hygiene pass).

## Risks & Mitigations

- **Schema push against the live shared DB** → additive columns with
  defaults only; ⛔ CHECKPOINT with the `drizzle-kit push` statement
  preview pasted before confirming.
- **Backfill picks a "wrong" supplier row** → rows are identical by
  construction today (UI writes one price to all); script asserts and
  prints any ingredient whose supplier rows disagree instead of guessing.
- **Drizzle silently dropping unknown `.set()` keys masked the update bug**
  → after the columns exist the same call becomes correct; the new domain
  test pins the sync behavior so a future schema drift fails loudly.
