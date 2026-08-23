# Ingredient Price Read Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Checkbox steps track progress.
>
> **Authority (docs/AGENTS.md):** authored by Fable 5; executors implement as written, STOP-and-report on anything uncovered. **Execution: executor models, continuing on the existing branch `fix/ingredient-supplier-selection` in the executor's own checkout** (same PR as the 868kv85nv display fixes).
>
> **TDD:** Tasks 4–5 are red-green with the test code below verbatim. Tasks 2–3 (schema + backfill) are **declared config/migration exceptions** per spec Decision 4 — gated by the ⛔ checkpoint's printed output and the Task 6 walkthrough.
>
> **Executor mode:** external allowed — push every task-boundary commit with gate output in the body, tick checkboxes in the same commit, STOP at every `⛔ CHECKPOINT`.
>
> **Ops rule:** after ANY edit under `packages/*`, restart `pnpm dev` — Turbopack wedges on hot-reloading transpiled workspace packages (presents as blank 500s).

**Goal:** ingredient `unit`/`unitPrice`/`quantity` round-trip — saved values come back in the ingredients table, dish picker, dish cost math, and recipe-edit hydration; price edits sync `supplier_ingredients` and recalc dependent recipes.

**Architecture:** restore the three canonical columns on `ingredients` (spec Decision 1) so every existing read path works with zero query changes; keep writing the duplicate into `supplier_ingredients` and sync it on update in the same transaction; backfill existing rows from their supplier rows.

**Tech Stack:** Drizzle (`drizzle-kit push`), tsx one-shot script, vitest.

**Spec:** `docs/superpowers/specs/2026-08-23-ingredient-price-read-model-design.md`
**ClickUp:** https://app.clickup.com/t/868kv85nv

## Execution Record (2026-08-23)

Executed by **Fable 5 in supervised mode** on Panos's direction ("you fix
them or send subagents — I will not hand this to executor"), directly in
`~/Desktop/agent` on `fix/ingredient-supplier-selection` (commits cff7384,
46095d2, 92b27af, 22383f6 on PR #164). All tasks complete; every RED test
was watched failing first. Amendments made in execution, by plan author
authority:

1. **Task 2/3 migration mechanism:** idempotent `ADD COLUMN IF NOT EXISTS`
   script (`restore-ingredient-price-columns.ts`) instead of interactive
   `drizzle-kit push` — same three additive statements, runnable
   non-interactively, zero drop risk. Both DB scripts were run by Panos
   himself (sandbox blocks DB mutation): restore printed the column list,
   backfill printed counts with `disagreements: 0`.
2. **Added scope — Select clear bug:** the "forms not clearing" symptom
   was a `ui/select.tsx` defect (controlled value cleared to `''` maps to
   `undefined`, flipping Radix to uncontrolled, which redisplays its stale
   internal selection). Fixed via remount-on-clear key; regression test
   with a real UI selection (jsdom pointer-event polyfill) proven red
   pre-fix.
3. `loadEnv.ts` added to `packages/db/scripts/` — `dotenv/config` resolved
   `.env` against cwd (`packages/db`), not the repo root, so `pg` fell
   back to localhost (ECONNREFUSED).

**Verification:** gates green (build 6/6, 155 tests, lint); Panos
confirmed in-app: table prices display, plate cost computes correctly,
picker clears.

## Global Constraints

- All multi-table writes stay inside one `db.transaction` with the same `tx` threaded through (decisions.md invariant).
- Ingredient price changes must keep recalculating dependent recipes (decisions.md invariant — the existing cascade in `IngredientService.update` must not be reordered or skipped).
- Workspace gates (`pnpm build && pnpm test && pnpm lint`) green at every commit.
- Numeric values are stored as strings in DB shapes (`DBIngredient` convention): `unitPrice.toString()`, `quantity.toString()`.

---

### Task 1: Preflight (executor)

- [x] In the executor checkout: branch `fix/ingredient-supplier-selection` checked out, clean tree, `git pull` — tip at or after `3be3702`.
- [x] `pnpm build && pnpm test && pnpm lint` green before starting (baseline).

---

### Task 2: Restore canonical columns (schema — declared exception)

**Files:**
- Modify: `packages/db/src/schema.ts` (ingredientsTable, ~line 88)

**Interfaces produced:** `ingredientsTable` gains `unit`, `unitPrice` (`unit_price`), `quantity` columns — same names/types the pre-revamp code and `DBIngredient` type already use.

- [x] **Step 1:** In `packages/db/src/schema.ts`, add three columns to `ingredientsTable` after `name`:

```ts
export const ingredientsTable = pgTable("ingredients", {
  id: uuid("id").primaryKey(),
  icon: varchar("icon"),
  name: varchar("name", { length: 255 }).notNull(),
  unit: unitEnum("unit").notNull().default(""),
  unitPrice: numeric("unit_price", { precision: 10, scale: 5 })
    .notNull()
    .default("0"),
  quantity: numeric("quantity").notNull().default("1"),
  usage: numeric("usage").notNull().default("1"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: uuid("category")
    .notNull()
    .references(() => categories.id),
});
```

- [x] **Step 2:** `pnpm build` → green (typecheck only; nothing consumes the columns yet).
- [x] **Step 3:** Preview the push: `pnpm --filter @costwise/db push` (if it can't find `DATABASE_URL`, run `pnpm dotenv -c -- pnpm --filter @costwise/db push` from the repo root). When drizzle-kit prints its statement preview, **confirm it is exactly three additive `ALTER TABLE "ingredients" ADD COLUMN` statements** — if it proposes anything else (drops, alters of other tables), abort and STOP-and-report.
- [x] **Step 4:** ⛔ **CHECKPOINT** — paste the printed statements to Panos/Fable before letting push execute against the shared DB. After approval, execute.
- [x] **Step 5:** Commit:

```bash
git add packages/db/src/schema.ts
git commit -m "feat(db): restore canonical unit/unit_price/quantity columns on ingredients"
git push
```

---

### Task 3: Backfill script (declared exception)

**Files:**
- Create: `packages/db/scripts/backfill-ingredient-prices.ts`

- [x] **Step 1:** Create the script:

```ts
import "dotenv/config";
import { db } from "../src/db";
import { ingredientsTable, supplierIngredients } from "../src/schema";
import { eq } from "drizzle-orm";

const run = async () => {
  await db.transaction(async (tx) => {
    const supRows = await tx.select().from(supplierIngredients);
    const allIngredients = await tx.select().from(ingredientsTable);

    const byIngredient = new Map<string, typeof supRows>();
    for (const row of supRows) {
      const list = byIngredient.get(row.ingredientId) ?? [];
      list.push(row);
      byIngredient.set(row.ingredientId, list);
    }

    let updated = 0;
    const disagreements: string[] = [];
    for (const [ingredientId, rows] of byIngredient) {
      const first = rows[0];
      const disagree = rows.some(
        (r) =>
          r.unit !== first.unit ||
          Number(r.unitPrice) !== Number(first.unitPrice) ||
          Number(r.quantity) !== Number(first.quantity),
      );
      if (disagree) {
        disagreements.push(ingredientId);
        continue;
      }
      await tx
        .update(ingredientsTable)
        .set({
          unit: first.unit,
          unitPrice: first.unitPrice,
          quantity: first.quantity,
        })
        .where(eq(ingredientsTable.id, ingredientId));
      updated++;
    }

    console.log(`ingredients total:               ${allIngredients.length}`);
    console.log(`ingredients with supplier rows:  ${byIngredient.size}`);
    console.log(`ingredients backfilled:          ${updated}`);
    console.log(`supplier-row disagreements:      ${disagreements.length}`);
    if (disagreements.length > 0) {
      console.log("NOT backfilled (rows disagree):", disagreements);
      throw new Error("Disagreeing supplier rows — resolve manually, tx rolled back");
    }
    if (updated !== byIngredient.size) {
      throw new Error("Assertion failed: updated != ingredients-with-rows, tx rolled back");
    }
  });
  console.log("backfill committed");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [x] **Step 2:** Add `"backfill-ingredient-prices": "tsx scripts/backfill-ingredient-prices.ts"` to `packages/db/package.json` scripts.
- [x] **Step 3:** Run it: `pnpm --filter @costwise/db backfill-ingredient-prices` (same dotenv fallback as Task 2). Expected: the four count lines, `disagreements: 0`, `backfill committed`. Re-run once to prove idempotency (same counts, no error).
- [x] **Step 4:** ⛔ **CHECKPOINT** — paste the printed counts. On approval, commit:

```bash
git add packages/db/scripts/backfill-ingredient-prices.ts packages/db/package.json
git commit -m "feat(db): backfill ingredient prices from supplier_ingredients"
git push
```

---

### Task 4: `destructureIngredient` keeps the fields (TDD)

**Files:**
- Modify: `packages/shared/src/transformers.ts` (`DBIngredientForTable`, `destructureIngredient`)
- Test: `packages/shared/src/helpers.test.ts`

**Interfaces produced:** `destructureIngredient(ingredient).dbIngredient` now includes `unit: Unit`, `unitPrice: string`, `quantity: string` (alongside the existing fields); `supplierIngredients` output unchanged.

- [x] **Step 1 (RED):** In `packages/shared/src/helpers.test.ts`, add `destructureIngredient` to the existing `./transformers` import, and append:

```ts
describe("destructureIngredient", () => {
  const base: Ingredient = {
    id: "0b7f43cd-6c9e-4a02-9c1a-6f2b8f9d1e11",
    icon: "Other",
    name: "Feta",
    unit: "g",
    unitPrice: 0.0125,
    quantity: 1,
    usage: "0",
    userId: "user-1",
    category: "ef45178d-e566-4637-b7f9-abcf6d575466",
    suppliers: [
      {
        suppliersId: "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
        unit: "g",
        quantity: 1,
        price: 0.0125,
        isActive: true,
      },
    ],
  };

  test("keeps unit, unitPrice and quantity on the ingredient row", () => {
    const { dbIngredient, supplierIngredients } = destructureIngredient(base);
    expect(dbIngredient.unit).toBe("g");
    expect(dbIngredient.unitPrice).toBe("0.0125");
    expect(dbIngredient.quantity).toBe("1");
    expect(supplierIngredients).toHaveLength(1);
    expect(supplierIngredients[0].unitPrice).toBe("0.0125");
  });

  test("keeps the price on the row when there are no suppliers", () => {
    const { dbIngredient, supplierIngredients } = destructureIngredient({
      ...base,
      suppliers: [],
    });
    expect(dbIngredient.unitPrice).toBe("0.0125");
    expect(supplierIngredients).toHaveLength(0);
  });
});
```

- [x] **Step 2:** `pnpm --filter @costwise/shared test` → FAIL (`unit`/`unitPrice`/`quantity` not on `dbIngredient`; TS error on the type).
- [x] **Step 3 (GREEN):** In `packages/shared/src/transformers.ts`: extend the type —

```ts
export type DBIngredientForTable = {
  id: string;
  icon?: string | null;
  name: string;
  unit: Unit;
  unitPrice: string;
  quantity: string;
  usage: string;
  userId: string;
  category: IngredientCategory;
};
```

and in `destructureIngredient`, build the row with the fields (note the destructuring already pulls `unit`, `unitPrice`, `quantity` out of `rest` — keep that, and add them back explicitly):

```ts
  const dbIngredient: DBIngredientForTable = {
    id: rest.id,
    icon: rest.icon,
    name: rest.name,
    unit: unit,
    unitPrice: unitPrice.toString(),
    quantity: quantity.toString(),
    usage: rest.usage,
    userId: rest.userId,
    category: rest.category,
  };
```

- [x] **Step 4:** `pnpm --filter @costwise/shared test` → PASS. `pnpm build && pnpm test && pnpm lint` → green (the api/domain consumers accept the widened row type; STOP-and-report if any consumer errors instead of "fixing" it ad hoc).
- [x] **Step 5:** Commit:

```bash
git add packages/shared/src/transformers.ts packages/shared/src/helpers.test.ts
git commit -m "fix(shared): destructureIngredient keeps canonical price fields on the ingredient row"
git push
```

---

### Task 5: Update path syncs `supplier_ingredients` (TDD)

**Files:**
- Modify: `packages/domain/src/repositories/supplierIngredientsRepository.ts`
- Modify: `packages/domain/src/types/repositories.ts` (`ISupplierIngredientRepository`)
- Modify: `packages/domain/src/services/ingredientService.ts` (`update`)
- Test: `packages/domain/src/services/ingredientService.test.ts` (new file)

**Interfaces produced:** `SupplierIngredientRepository.updateByIngredientId(tx, ingredientId, { unit, unitPrice, quantity }): Promise<void>`; `IngredientService.update` calls it inside the existing transaction after the ingredient-row update.

- [x] **Step 1 (RED):** Create `packages/domain/src/services/ingredientService.test.ts`:

```ts
import { describe, test, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  ingredientUpdate: vi.fn(async (ing: { id: string }) => ({ id: ing.id })),
  findAllByIngredientId: vi.fn(async () => []),
  updateByIngredientId: vi.fn(async () => undefined),
}));

vi.mock("../repositories/ingredientRepository", () => ({
  IngredientRepository: vi.fn(() => ({ update: mocks.ingredientUpdate })),
}));
vi.mock("../repositories/recipeRepository", () => ({
  RecipeRepository: vi.fn(() => ({
    findAllByIngredientId: mocks.findAllByIngredientId,
  })),
}));
vi.mock("../repositories/supplierIngredientsRepository", () => ({
  SupplierIngredientRepository: vi.fn(() => ({
    updateByIngredientId: mocks.updateByIngredientId,
  })),
}));
vi.mock("./recipeService", () => ({
  RecipeService: vi.fn(() => ({
    updateRecipeAfterIngredientsChange: vi.fn(),
  })),
}));
vi.mock("@costwise/db/db", () => ({
  db: { transaction: (fn: (tx: object) => unknown) => fn({ __tx: true }) },
}));

import { IngredientService } from "./ingredientService";
import { Ingredient } from "@costwise/shared/recipe";

const ingredient: Ingredient = {
  id: "0b7f43cd-6c9e-4a02-9c1a-6f2b8f9d1e11",
  icon: "Other",
  name: "Feta",
  unit: "g",
  unitPrice: 0.0125,
  quantity: 1,
  usage: "0",
  userId: "user-1",
  category: "ef45178d-e566-4637-b7f9-abcf6d575466",
  suppliers: [
    {
      suppliersId: "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
      unit: "g",
      quantity: 1,
      price: 0.0125,
      isActive: true,
    },
  ],
};

describe("IngredientService.update", () => {
  test("syncs price fields into supplier_ingredients in the same tx", async () => {
    const service = new IngredientService("user-1");
    await service.update(ingredient);

    expect(mocks.updateByIngredientId).toHaveBeenCalledTimes(1);
    expect(mocks.updateByIngredientId).toHaveBeenCalledWith(
      expect.objectContaining({ __tx: true }),
      ingredient.id,
      { unit: "g", unitPrice: "0.0125", quantity: "1" },
    );
  });
});
```

- [x] **Step 2:** `pnpm --filter @costwise/domain test` → FAIL (`updateByIngredientId` never called / not a function). If vitest reports a mock-hoisting or module-resolution error instead of the assertion failure, STOP-and-report — don't restructure the mocks.
- [x] **Step 3 (GREEN):** In `supplierIngredientsRepository.ts`, replace the empty `update` stub with (and add `eq` to the drizzle-orm import, plus `Unit` from `@costwise/shared/recipe`):

```ts
  async updateByIngredientId(
    tx: Database,
    ingredientId: string,
    data: { unit: Unit; unitPrice: string; quantity: string },
  ): Promise<void> {
    await tx
      .update(supplierIngredients)
      .set(data)
      .where(eq(supplierIngredients.ingredientId, ingredientId));
  }
```

Update `ISupplierIngredientRepository` in `types/repositories.ts`: replace the old `update(tx, supplierId, data)` signature with `updateByIngredientId(tx: Database, ingredientId: string, data: { unit: Unit; unitPrice: string; quantity: string }): Promise<void>` (grep first: `git grep -n "\.update(" -- packages/domain apps/api | grep -i supplierIngredient` must show no other callers of the old stub — STOP if it does). In `ingredientService.ts` `update`, inside the transaction directly after `const result = await this.ingredientRepository.update(DBIngredient, tx);` add:

```ts
      await this.supplierIngredientRepository.updateByIngredientId(
        tx,
        DBIngredient.id,
        {
          unit: DBIngredient.unit,
          unitPrice: DBIngredient.unitPrice,
          quantity: DBIngredient.quantity,
        },
      );
```

- [x] **Step 4:** `pnpm --filter @costwise/domain test` → PASS. Full gates `pnpm build && pnpm test && pnpm lint` → green.
- [x] **Step 5:** Commit:

```bash
git add packages/domain/src/repositories/supplierIngredientsRepository.ts packages/domain/src/types/repositories.ts packages/domain/src/services/ingredientService.ts packages/domain/src/services/ingredientService.test.ts
git commit -m "fix(domain): ingredient update syncs supplier_ingredients price fields in-tx"
git push
```

---

### Task 6: Walkthrough — acceptance gate (Panos; executor records)

Restart `pnpm dev` fresh (packages changed). Then on localhost:

- [x] Create ingredient "Walkthrough-A" 12.5/kg with one supplier → ingredients table shows its per-unit price (not €0.00/Unavailable); DB check (any client): `ingredients` row has `unit_price` ≈ 0.0125/g-normalized value and matching `supplier_ingredients` row.
- [x] Dish-form picker shows Walkthrough-A's non-zero price; create a dish from it → saved dish has non-zero `total_cost`/`food_cost`; "Work it out" preview matched.
- [x] Create ingredient "Walkthrough-B" with **no supplier** → price persists and displays.
- [x] Edit Walkthrough-A's price (e.g. 15/kg) → table shows new price; its `supplier_ingredients` row updated; the dish's cost changed accordingly (recalc invariant).
- [x] Recipe edit page for the dish shows correct per-ingredient prices.
- [x] Pre-existing ingredients (backfilled) display their prices.
- [x] ⛔ **CHECKPOINT** — all green: update the PR description with this plan + spec links, paste gate outputs, and hand the PR to review; ClickUp 868kv85nv moves to done only after PR review + merge. Any failure: STOP and report findings against this plan.
