# Fallow full-pass triage — Task 4.5, Task 4

> **Status: Task 5 executed.** Rows 1–8 and 32 suppressed, rows 10–20 (row 16 amended to
> `packages/domain/src/types/auth.ts` only) deleted, rows 9/21–33 filed as ClickUp Tasks A–L. A
> post-deletion fallow re-run surfaced five second-order findings (cascades of rows 10/12/14/15/17);
> the checkpoint reviewer ruled on them as rows 34–38 below. Gate (`build test lint`) is green and
> `pnpm fallow` now maps 1:1 to rows 9, 21–31, 33, 34. A sixth cascade item, `@types/bcrypt`, was
> removed in commit `e36f60c` without an authorizing row; post-commit review caught it and the
> coordinator ratified it post-hoc as row 39. See the `Outcome` column per row and the "Checkpoint
> amendment" section for details.

| | |
| --- | --- |
| **Date** | 2026-08-23 |
| **Fallow version** | `fallow 3.17.0` (`npx fallow --version`; signature verified) |
| **Commit** | `d7ef639b51901653df12153e1cfd056ab84f5649` — *chore: fallow advisory surface — pnpm scripts, non-blocking CI job, docs* |
| **Branch** | `chore/task4.5-fallow-advisory` |
| **Command** | `pnpm --silent fallow:ci` (exit 1 — findings present, expected; advisory only) |
| **Config** | `.fallowrc.json` as landed in Task 2 |
| **Spec** | [`docs/superpowers/specs/2026-08-23-task4.5-fallow-advisory-design.md`](../specs/2026-08-23-task4.5-fallow-advisory-design.md) |
| **Plan** | [`docs/superpowers/plans/2026-08-23-task4.5-fallow-advisory.md`](../plans/2026-08-23-task4.5-fallow-advisory.md) |

## Totals

Fallow reported **269 `check` issues** plus the `dupes` and `health` sections:

| Section | Count |
| --- | --- |
| Unused files | 117 |
| Unused exports | 99 |
| Unused type exports | 14 |
| Unused dependencies (3) + devDependencies (1) | 4 |
| Unresolved imports | 20 |
| Unlisted dependencies | 2 |
| Duplicate exports | 1 |
| Circular dependencies | 12 |
| **`check` subtotal** | **269** |
| Clone groups / clone families / mirrored directories | 80 / 61 / 1 |
| Complexity findings / large functions / hotspots / file health scores / refactoring targets | 198 / 113 / 52 / 287 / 23 |

Bucket counts: **9 false-positive · 11 safe-delete · 13 needs-judgment** (33 rows, 12 drafted tasks —
row 31 is tracked under Task K rather than getting one of its own).

### Coverage reconciliation

Every reported finding lands in exactly one row. This table is the audit:

| Fallow section | Count | Rows that claim it |
| --- | --- | --- |
| Unused files | 117 | 1 (50) · 10 (30) · 12 (7) · 13 (3) · 14 (12) · 15 (8) · 16 (1) · 26 (4) · 33 (2) |
| Unused exports | 99 | 11 (58) · 13 (3) · 14 (2) · 15 (1) · 17 (8) · 18 (4) · 19 (9) · 25 (14) |
| Unused type exports | 14 | 11 (2) · 13 (2) · 18 (4) · 25 (6) |
| Unused dependencies + devDependencies | 4 | 4 (1) · 20 (3) |
| Unresolved imports | 20 | 2 (20) |
| Unlisted dependencies | 2 | 3 (1) · 9 (1) |
| Duplicate exports | 1 | 23 (1) |
| Circular dependencies | 12 | 21 (5) · 22 (7) |
| Clone groups | 80 | 5 (44) · 7 (5) · 24 (5) · 28 (1) · 29 (25) |
| Clone families | 61 | 5 (32) · 7 (4) · 24 (2) · 28 (1) · 29 (22) |
| Mirrored directories | 1 | 6 (1) |
| Complexity findings | 198 | 8 (131) · 24 (2) · 26 (4) · 27 (12) · 28 (2) · 30 (47) |
| Large functions | 113 | 8 (49) · 30 (64) |
| Hotspots | 52 | 24 (1) · 28 (1) · 30 (50) |
| Refactoring targets | 23 | 8 (3) · 27 (2) · 28 (1) · 31 (17) |
| File health scores | 287 | 8 (58 design) · 30 (229 app) |
| Clean sections (0 findings) | — | 32 |

### Repo facts this triage rests on

1. `Costwise Design System/` and `costwise_revamp/` are **tracked design-reference bundles**, not
   application code. `costwise_revamp/README.md` states it verbatim: the files "are design references
   created in HTML … **not production code to copy**". Neither directory is in
   `pnpm-workspace.yaml` (`apps/*`, `packages/*`); neither is built, imported or deployed. They
   account for 50 of the 117 unused files, 44 of the 80 clone groups, 131 of the 198 complexity
   findings and both unresolved-import files.
2. **`apps/web` contains no dynamic imports.** `grep -rn "next/dynamic\|import(" apps/web/src`
   returns nothing, so "no static importer" is equivalent to "unreachable" for every web file below.
3. Every `safe-delete` row below was re-verified with an independent grep across `apps/` and
   `packages/`, and against Next.js App Router convention paths (`page.tsx`, `layout.tsx`,
   `loading.tsx`, `route.ts`, `middleware`) — the evidence is cited inline.

---

## Triage table

Every finding from the run appears in exactly one row. Rows that group multiple findings share the
same file-cluster, bucket and reason, and list every file or symbol they cover.

| # | Finding (file / symbol) | Type | Bucket | Why | Outcome |
|---|---|---|---|---|---|
| 1 | **Unused files (50) in the design bundles.** `Costwise Design System/`: `_ds_bundle.js`, `support.js`, `styles.css`, `templates/app-screen/{ds-base.js,support.js}`, `tokens/{base,colors,fonts,motion,shape,spacing,typography}.css`, `components/agent/{ChatBubble,Composer,SuggestionChip}.jsx`, `components/brand/Logo.jsx`, `components/core/{Avatar,Badge,Button,Card,Icon,IconButton}.jsx`, `components/data/{DataRow,ProgressMeter,StatTile}.jsx`, `components/feedback/{Dialog,EmptyState,Toast,Tooltip}.jsx`, `components/forms/{Checkbox,Input,MoneyInput,Select,Switch}.jsx`, `components/navigation/{SidebarNav,Tabs}.jsx`, `ui_kits/costwise-app/{AppShell,AskScreen,DishScreen,InvoicesScreen,LoginScreen,TodayScreen}.jsx`. `costwise_revamp/design-system/`: `styles.css`, `tokens/{base,colors,fonts,motion,shape,spacing,typography}.css` | dead-code | `false-positive` | Fallow walks the whole repo tree, but these are design-reference bundles loaded by the Design Canvas host at design time via `<script>` / `<x-import>`, never by a build. They are outside the pnpm workspace globs (`apps/*`, `packages/*`), so no entry point can reach them by construction. `costwise_revamp/README.md`: "not production code to copy". | suppressed |
| 2 | **Unresolved imports (20).** `costwise_revamp/Costwise.dc.html` (10) and `costwise_revamp/Overview explorations.dc.html` (10), specifiers `./_ds/costwise-design-system-f2dfa314-…/{_ds_bundle.js,styles.css,tokens/{base,colors,fonts,motion,shape,spacing,typography}.css}` and `./support.js` | dead-code | `false-positive` | `.dc.html` is a Design Canvas document; its `x-import` specifiers resolve against a `_ds/<uuid>/` directory the canvas host materialises at render time, which is deliberately not committed. Nothing in the repo build resolves these paths. | suppressed |
| 3 | **Unlisted dependency `react`** — 47 import sites, all under `Costwise Design System/components/**` (`*.jsx` and `*.d.ts` for ChatBubble, Composer, SuggestionChip, Logo, Avatar, Badge, Button, Card, Icon, IconButton, DataRow, ProgressMeter, StatTile, Dialog, EmptyState, Toast, Tooltip, Checkbox, Input, MoneyInput, Select, Switch, SidebarNav, Tabs) | dead-code | `false-positive` | The design bundle has no `package.json`; its prototypes take React off `window.React`, supplied by the canvas host (see `getReact()` in `Costwise Design System/support.js`). There is no manifest for Fallow to find the dependency in. | suppressed |
| 4 | **Unused devDependency `eslint-config-next`** (`apps/web/package.json:49`) | dead-code | `false-positive` | `apps/web/eslint.config.mjs` loads it as a *string* through `FlatCompat`: `compat.extends("next/core-web-vitals", "next/typescript")`. ESLint resolves `next/*` to `eslint-config-next` at runtime; there is no `import` statement for Fallow's module graph to see. Removing it breaks `pnpm lint`. | suppressed |
| 5 | **Clone groups (44) and clone families (32) wholly inside the design bundles**, largest being `Costwise Design System/support.js:2-1911` ↔ `Costwise Design System/templates/app-screen/support.js:2-1911` (1,910 lines, `dup:4f3cbe98`), plus every `_ds_bundle.js` ↔ `components/**/*.jsx` pair (ChatBubble, Composer, SuggestionChip, Avatar, Badge, Button, Card, Icon, IconButton, DataRow, ProgressMeter, StatTile, Dialog, EmptyState, Toast, Tooltip, Checkbox, Input, MoneyInput, Select, Switch, SidebarNav, Tabs) and the `Costwise Design System/tokens/*` ↔ `costwise_revamp/design-system/tokens/*` pairs | dupe | `false-positive` | `_ds_bundle.js` **is** the compiled bundle of the sibling `.jsx` sources, and `templates/app-screen/support.js` is a verbatim copy of the runtime the template ships with — duplication is the artefact format, not a defect. The `tokens/*` duplication is the same design system vendored into two canvas bundles. | suppressed |
| 6 | **Mirrored directory:** `Costwise Design System/tokens/` ↔ `costwise_revamp/design-system/tokens/` (7 files, 172 lines: `base.css`, `colors.css`, `fonts.css`, `motion.css`, `shape.css`, `spacing.css`, `typography.css`) | dupe | `false-positive` | Same mechanism as row 5: each canvas bundle carries its own self-contained copy of the token set by design; they are distributed artefacts, not a shared source directory. | suppressed |
| 7 | **Mixed clone groups (5) / families (4) pairing `apps/web/src/app/globals.css` with design tokens:** `globals.css:4-72` ↔ `tokens/colors.css:1-33` (×3, 69L), `globals.css:73-108` ↔ `tokens/colors.css:34-59` (×3, 36L), `globals.css:137-144` ↔ `tokens/motion.css:2-9` (8L), `globals.css:111-123` ↔ `tokens/shape.css:2-4` (13L), and `apps/web/src/app/components/ui/avatar.tsx:25-33` ↔ `Costwise Design System/components/core/Avatar.jsx:14-15` + `_ds_bundle.js:250-251` (9L) | dupe | `false-positive` | `globals.css` is the app's deliberate port of the design-system tokens — the intended "recreate these designs inside the existing codebase" step from `costwise_revamp/README.md`. The design bundle is documentation, not an importable package, so the values cannot be shared and must be copied. | suppressed |
| 8 | **Health findings inside the design bundles:** 131 of 198 complexity findings, 49 of 113 large functions, 3 of 23 refactoring targets (`extract_complex_functions` on `Costwise Design System/_ds_bundle.js`, `Costwise Design System/support.js`, `Costwise Design System/templates/app-screen/support.js`), and the design-bundle file-health rows (`_ds_bundle.js` MI 74.3, `support.js` ×2 MI 68.0, `components/forms/Input.jsx` MI 70.4) | health | `false-positive` | These measure generated/vendored canvas-runtime code (the 3,106-line `<arrow>` IIFE in `_ds_bundle.js` is a bundler output). Not hand-maintained, not shipped, and not ours to refactor. | suppressed |
| 9 | **Unlisted dependency `@jest/globals`** — imported at `apps/web/src/app/utils/pagination.test.ts:1` | dead-code | `needs-judgment` | Real, verified: `@jest/globals` is **not** present in `apps/web/node_modules`; the import resolves only through pnpm's root hoisting today. Every other test file in the repo uses Jest's injected globals without importing them. Fixing it is a human call (declare the devDependency vs. drop the import) → **Task A**. | task-filed (A: 868kvw0ft) |
| 10 | **Recipe-/ingredient-form orphan cluster (30 files).** `apps/web/src/app/constants/components.ts` (the barrel) and everything only it reaches: `components/ingredients/ingredientModal.tsx`; `components/ingredients/ingredientsFormComponents/{FormSelect,formErrors,ingredientNameInput,ingredientSummary,ingredientpriceInput,selectOptions}.{tsx,ts}` and `.../button/{button,submitIngredientButton}.tsx`; `components/recipes/recipeForm/formComponents/{additionalCosts,errorDisplay,formHeader,pricing,recipeIngredientsForm,selectedFileBadge,submitButton}.tsx`, `.../pricingComponents/{calculateButton,pricingRadioOption}.tsx`, `.../recipeIngredientsFormComponents/{addIngredientButton,ingredientSelector,unitSelector}.tsx`, `.../totalDisplayComponents/{displayedIngredient,mobileIngredientsList,recipeIngredientsDisplay,statItem,total,viewIngredientsButtonMobile}.tsx`; `hooks/{usePricing,useRecipeIngredientsForm}.tsx` | dead-code | `safe-delete` | Orphaned by the UI revamp that replaced the decomposed forms with single self-contained components. Verified: `recipeForm.tsx` and `ingredientForm.tsx` import **none** of these (their full import lists are UI primitives, `@costwise/shared`, stores and hooks only); `grep -rn "constants/components"` returns 5 importers and all 5 are themselves inside this cluster; no dynamic imports exist in `apps/web`. The cluster is reachable only from itself. | deleted |
| 11 | **Unused exports/types inside the row-10 cluster (60 = 58 exports + 2 types).** Default exports of `ingredientModal.tsx:29`, `FormSelect.tsx:43`, `submitIngredientButton.tsx:31`, `formErrors.tsx:46`, `ingredientNameInput.tsx:56`, `ingredientSummary.tsx:47`, `ingredientpriceInput.tsx:69`, `additionalCosts.tsx:40`, `errorDisplay.tsx:18`, `formHeader.tsx:20`, `pricing.tsx:95`, `calculateButton.tsx:19`, `pricingRadioOption.tsx:74`, `recipeIngredientsForm.tsx:90`, `ingredientSelector.tsx:37`, `unitSelector.tsx:39`, `selectedFileBadge.tsx:26`, `submitButton.tsx:31`, `displayedIngredient.tsx:43`, `mobileIngredientsList.tsx:39`, `recipeIngredientsDisplay.tsx:40`, `statItem.tsx:41`, `total.tsx:55`, `viewIngredientsButtonMobile.tsx:22`; `addIngredientButton.tsx:8 AddRecipeIngredientButton`; `usePricing.tsx:20 usePricing`; `useRecipeIngredientsForm.tsx:22 useRecipeIngredientsForm`; all 31 exports of `constants/components.ts:36-66`; types `FormSelect.tsx:7 SelectOption`, `usePricing.tsx:18 PricingMethod` | dead-code | `safe-delete` | Same origin as row 10 — these are the exports *of* the orphaned files, listed separately because Fallow counts them separately. They disappear with the files. | deleted |
| 12 | **Home dashboard orphan cluster (7 files):** `apps/web/src/app/components/home/{card,categoryBreakdown,dashboardHeader,highImpactIngredients,kpiStrip,marginAlerts,onboardingChecklist}.tsx` | dead-code | `safe-delete` | Orphaned when the composed dashboard was replaced by the single `TodayView.tsx` decision-queue screen (the `costwise_revamp` "Today is no longer a dashboard" change). Verified: `(user)/(home)/page.tsx` renders only `<TodayView>`; `TodayView.tsx` imports only `ui/*` primitives, the notification store and `uiHelpers`; grep for each filename across `apps/web/src` returns zero importers; last touched by `ca9f301`/`03ed03e` (the monorepo move), i.e. untouched since. | deleted |
| 13 | **Auth-component orphans (3 files + 3 symbols):** `apps/web/src/app/components/auth/authComponents/{authButton,authInput,authLabel}.tsx`, with their unused `default` exports (`:58`, `:29`, `:12`) and types `authButton.tsx:4 ButtonProps`, `authInput.tsx:5 InputProps` | dead-code | `safe-delete` | Leftovers of the NextAuth-era sign-in/sign-up forms, superseded when auth moved to Better Auth in `apps/api` and the forms were rebuilt on `ui/*` primitives. `grep -rn "authButton\|authInput\|authLabel" apps/web/src` returns 3 hits, not zero: all three are the import lines at `apps/web/src/app/constants/components.ts:30-32`. The only importers are those three lines in `constants/components.ts`, which is itself the dead barrel deleted in row 10 — so this deletion is safe **only if row 10 is approved**; if row 10 is rebucketed instead, this row must be revisited. | deleted |
| 14 | **`components/shared/` orphans (12 files + 2 exports):** `actionsContainer.tsx`, `exitButton.tsx` (+ `default:21`), `itemsStore.tsx`, `label.tsx`, `multipleSelect.tsx`, `notificationsNumber.tsx`, `search/mobileSearch/mobileSearchBoard.tsx`, `selectItem.tsx`, `sharedButton.tsx`, `skeleton.tsx`, `uploadFiles.tsx` (+ `default:43`), `userProfile.tsx` | dead-code | `safe-delete` | Pre-revamp shared widgets superseded by `components/ui/*` primitives; `shared/skeleton.tsx` is a re-export barrel whose consumers now import the leaf skeleton modules directly. Verified per file with grep — the only hits are the `constants/components.ts` barrel (itself dead, row 10) for `exitButton`/`uploadFiles`. Note `shared/label.tsx` and `shared/skeleton.tsx` are distinct from the live `ui/label.tsx` and `ui/skeleton.tsx`. | deleted |
| 15 | **Ingredient-detail and supplier-form orphans (8 files + 1 export):** `components/ingredients/ingredientPage/{data,ingredientData,ingredientDetails,ingredientHeader,title}.tsx` (+ `title.tsx:16 default`), `components/suppliers/suppliersFormComponents/{input,select}.tsx`, `apps/web/src/app/utils/formatters.ts` | dead-code | `safe-delete` | Same revamp origin as rows 12–14. Verified: the live `IngredientDetailView.tsx` imports only `ui/*`, `uiHelpers`, `@costwise/shared/pricing`, `useHelpers` and the shared modals — none of its `ingredientPage/` siblings; the live `suppliersForm.tsx` imports `ui/*`, not `suppliersFormComponents/*`; `grep -rn "utils/formatters"` across `apps/` and `packages/` returns zero hits (formatting now lives in `@costwise/shared/pricing`). | deleted |
| 16 | **Package-level orphan (1 file):** `packages/domain/src/types/auth.ts` | dead-code | `safe-delete` | `types/auth.ts` is the NextAuth session-type shim, dead since auth moved to Better Auth in `apps/api` — `grep -rn "types/auth"` across `apps/` and `packages/` returns zero hits. | deleted (amended to `packages/domain/src/types/auth.ts` only) |
| 17 | **Superseded exports in live files (8):** `apps/web/src/app/utils/uiHelpers.tsx:193 createIngredientIcon` and `:198 getIconColor`; `apps/web/src/app/services/services.ts:17 createMessage`; `packages/domain/src/utils/errors.ts:68 AuthenticationError`; `apps/web/src/app/constants/data.ts:125 deliveryOptions`, `:140 paymentTermsOptions`, `:145 categorySeedData`, `:160 notificationVariants` | dead-code | `safe-delete` | `createIngredientIcon` was re-homed into `packages/shared/src/transformers.ts:41` as a module-private helper during the Task 3/4 domain-and-shared extraction, leaving the web copy stranded (grep shows the shared copy is the one in use, at `transformers.ts:193`); `getIconColor` went with it. `AuthenticationError` is a NextAuth-era error class with zero references anywhere. `createMessage` and the four `constants/data.ts` option/seed arrays each have exactly one grep hit — their own definition; `suppliersForm.tsx` consumes the raw `DELIVERY_OPTIONS`/`PAYMENT_OPTIONS` from the same file, not the derived `*Options` wrappers. | deleted |
| 18 | **Exports that never needed to be exported (8 = 4 exports + 4 types):** `apps/web/src/app/lib/webOrigin.ts:12 webOrigin`; `apps/api/src/testing/fakes.ts:42 createFakeState`; `apps/api/src/routes/schemas.ts:28 ErrorEnvelope` and `:57 CountSchema`; types `(user)/ingredients/edit/[id]/page.tsx:8 Params`, `(user)/suppliers/edit/[id]/page.tsx:8 Params`, `hooks/useSignIn.tsx:9 AuthProps`, `hooks/useSignUp.tsx:9 AuthProps` | dead-code | `safe-delete` | Each symbol is used only inside its own module and has no external consumer: `webOrigin` at `webOrigin.ts:19` (callers import the sibling `webUrl`), `createFakeState` at `fakes.ts:162`, `ErrorEnvelope` at `schemas.ts:36`, `CountSchema` at `schemas.ts:61/126/139`, each `Params` as the local prop annotation at line 14 of its page, and each `AuthProps` as the hook's own parameter type at line 13 (the two are same-named but separate local declarations, not a shared type). Fix is dropping the `export` keyword, not deleting code. Next.js consumes only the default export plus route-config exports from a `page.tsx`, so unexporting `Params` is convention-safe. | deleted (export keyword removed, code kept) |
| 19 | **Stale skeleton exports (9):** `components/home/todaySkeleton.tsx:127 default`; `components/ingredients/ingredientPage/ingredientDetailSkeleton.tsx:84 default`; `components/shared/formSkeleton.tsx:65 default`; `components/ingredients/ingredientsSkeleton.tsx:4 IngredientsTableSkeleton` + `:98 default`; `components/recipes/recipesSkeleton.tsx:4 RecipesTableSkeleton` + `:106 default`; `components/suppliers/suppliersSkeleton.tsx:4 SuppliersTableSkeleton` + `:98 default` | dead-code | `safe-delete` | Duplicate-of-named leftovers from the retired `shared/skeleton.tsx` barrel (row 14). Verified against the Next.js `loading.tsx` convention, which is the only production consumer: all eleven `apps/web/src/app/(user)/**/loading.tsx` files import the **named** `*PageSkeleton` / `TodayViewSkeleton` / `IngredientDetailSkeleton` / `FormPageSkeleton` exports, and `primitives.test.tsx` imports the same named ones. Nothing imports the defaults or the `*TableSkeleton` sub-parts. | deleted |
| 20 | **Unused dependencies (3):** `@fontsource/jetbrains-mono` (`apps/web/package.json:16`); `bcrypt` (`packages/domain/package.json:15`); `uid` (`packages/domain/package.json:17`) | dead-code | `safe-delete` | `@fontsource/jetbrains-mono` has zero references in `apps/web` (`grep -rn jetbrains` over `*.css`, `*.ts`, `*.tsx`, `*.mjs` → nothing) — a font that was evaluated and dropped during the revamp. `bcrypt` and `uid` are leftovers of the Task 3/4 split: the only `import` sites are `apps/api/src/auth.ts:3` and `apps/web/src/app/services/services.ts:6`, and **both** consuming workspaces already declare their own copy (`apps/api/package.json:19`, `apps/web/package.json` `uid ^2.0.2`), so `packages/domain` declares two dependencies it does not use. | deleted |
| 21 | **Circular dependencies (5) through the component barrel:** `constants/components.ts` ↔ `components/ingredients/ingredientModal.tsx`; ↔ `components/recipes/recipeForm/formComponents/pricing.tsx`; ↔ `.../recipeIngredientsForm.tsx`; ↔ `.../totalDisplayComponents/mobileIngredientsList.tsx`; ↔ `.../totalDisplayComponents/recipeIngredientsDisplay.tsx` | cycle | `needs-judgment` | A barrel that imports its own members and re-exports them to those same members — an architectural anti-pattern, and cycles are never bucketed `safe-delete`. It happens that every file in all five cycles is also in the row-10 orphan cluster, so approving row 10 dissolves these; the reviewer must decide explicitly rather than have a cycle removed as a side effect → **Task B**. | task-filed (B: 868kvw0q2) |
| 22 | **Circular dependencies (7) in the live recipe-form stack:** `recipeForm.tsx` → `shared/incremental.tsx` → `hooks/useIngredientsForm.tsx` → `hooks/useHelpers.tsx` → `services/services.ts` → `recipeForm.tsx`; the 4-file variant without `useHelpers`; `recipeForm.tsx` ↔ `hooks/useRecipeForm.tsx`; `recipeForm.tsx` → `useRecipeForm` → `hooks/useFileUpload.tsx` → `useHelpers` → `services` → back; the same via `useHelpers`; the same via `services` directly; and `constants/recipeFormDefaultValues.ts` ↔ `hooks/useRecipeForm.tsx` | cycle | `needs-judgment` | These involve **live** code and cross the layer order (UI → hooks/stores → services): `services/services.ts` imports types back from the component that consumes it. Breaking them means moving shared types into `@costwise/shared` or a local `types.ts` — a redesign, not a deletion → **Task C**. | task-filed (C: 868kvw0z3) |
| 23 | **Duplicate export `FormFields`** — `components/recipes/recipeForm/recipeForm.tsx:18` and `hooks/useRecipeForm.tsx:32` | dupe | `needs-judgment` | Two modules export the same name for the same `z.infer<typeof RecipeSchema>` type, so a barrel re-export would resolve ambiguously — and this duplication is one half of the `recipeForm.tsx` ↔ `useRecipeForm.tsx` cycle in row 22. Picking the canonical home is a design call → **Task D**. | task-filed (D: 868kvw157) |
| 24 | **Cross-package duplication, `packages/domain` ↔ `packages/shared` (3 clone groups, 81 lines):** `domain/src/services/validationService.ts:6-34` ↔ `shared/src/transformers.ts:253-308` (56L); `:34-46` ↔ `:308-320` (13L); `:46-57` ↔ `:320-331` (12L). Plus `shared/src/transformers.ts` internal clones: `:174-207` ↔ `:214-248` (35L) and `:316-324` ↔ `:327-335` (9L); its complexity findings `:133 transformSupplierFromDB` (CRAP 79.4) and `:253 destructureSupplier` (CRAP 71.3); and its hotspot row (15.3, ▲ accelerating, 14 fan-in, 548 churn) | dupe | `needs-judgment` | The clearest genuine artefact of the Task 3/4 split: supplier destructure/validation logic was copied into both `packages/domain` and `packages/shared` instead of being shared. It is also the repo's fastest-accelerating hotspot, so the duplication is actively diverging. Merging requires deciding which package owns the transform contract → **Task E**. | task-filed (E: 868kvw1a8) |
| 25 | **shadcn/ui vendored primitive surface — 14 unused exports and 6 unused type exports in `apps/web/src/app/components/ui/`:** `select.tsx:334-343` (`SelectPrimitive`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`), `badge.tsx:86 badgeVariants`, `button.tsx:68 buttonVariants`, `label.tsx:43 labelVariants`, `card.tsx:98 CardFooter`; types `button.tsx:42 ButtonProps`, `card.tsx:4 CardProps`, `iconButton.tsx:4 IconButtonProps`, `input.tsx:4 InputProps`, `label.tsx:22 LabelProps`, `moneyInput.tsx:4 MoneyInputProps` | dead-code | `needs-judgment` | Not migration leftovers: this is the vendored public API shadcn/ui components ship with, and each symbol is used *inside* its own module (`buttonVariants` at `button.tsx:56`, `SelectTrigger` at `select.tsx:302`, etc.) — only the re-export is unconsumed. Trimming it diverges the files from upstream and breaks future `npx shadcn add` merges; keeping it means a standing suppression. Policy call → **Task F**. | task-filed (F: 868kvw1hf) |
| 26 | **Unadopted UI primitives (4 files):** `apps/web/src/app/components/ui/{checkbox,dialog,switch,textarea}.tsx`, plus their complexity findings (`checkbox.tsx:10`, `dialog.tsx:13`, `switch.tsx:10`, `textarea.tsx:12`) | dead-code | `needs-judgment` | Provably unreferenced (zero grep hits, no dynamic imports) — but these are forward-looking, not stale: Checkbox, Dialog, Switch and a text input are all specified components of the Costwise Design System that the revamp has not reached yet. Deleting them discards work the design system calls for; keeping them needs a suppression. Product/design call, so not `safe-delete` → **Task G**. | task-filed (G: 868kvw1z4) |
| 27 | **App-code complexity cluster (12 complexity findings + 2 refactoring targets):** `components/recipes/recipeForm/recipeForm.tsx:39 RecipeForm` (cyclo 34 / cog 42 / 489 LOC, CRAP 283.7, CRITICAL) with `:115 handleWorkItOut` and `:440 <arrow>`; `hooks/useIngredientsForm.tsx:33 useIngredientForm` (cyclo 33 / 231 LOC) and `:149 onSubmit`; `hooks/useRecipeForm.tsx:34 useRecipeForm` (cog 16 / 137 LOC / 13 hooks) and `:87 onSubmit`; `components/home/TodayView.tsx:62 TodayView` (474 LOC) and `:336 <arrow>`; `components/ingredients/ingredientForm.tsx:26 IngredientForm` (CRAP 600.0); `components/suppliers/suppliersForm.tsx:22 SuppliersForm` (CRAP 306.0); `components/ingredients/ingredientPage/IngredientDetailView.tsx:31` (CRAP 380.0); plus targets `split_high_impact` on `packages/shared/src/pricing.ts` and `apps/web/src/app/lib/serverSession.ts` | health | `needs-judgment` | The genuine complexity debt the revamp created by collapsing decomposed forms into single components (the mirror image of rows 10 and 12). Every one is live code with tests depending on it; splitting them is redesign work that must not ride along with a cleanup PR → **Task H**. | task-filed (H: 868kvw2ah) |
| 28 | **`apps/api/src/testing/fakes.ts`** — target `split_high_impact` (396 LOC, 7 dependents), complexity findings `:124 seedSupplier` (cyclo 29, CRAP 31.8) and `:50 seedRecipe` (cyclo 25), internal clone `:218-224` ↔ `:228-234` (7L), and the repo's top hotspot (30.1, 417 churn, 7 fan-in) | health | `needs-judgment` | The in-memory fake used by five API route test suites; its churn and fan-in mean every schema change ripples through it. Splitting per-aggregate would change the test-support contract for `app.test.ts`, `analytics.test.ts`, `ingredients.test.ts`, `recipes.test.ts` and `search.test.ts` → **Task I**. | task-filed (I: 868kvw2hr) |
| 29 | **App-code boilerplate duplication — the remaining 25 app-only clone groups / 22 app-only clone families.** Route boilerplate: `(user)/{ingredients,recipes,suppliers}/page.tsx` (37L ×3, and a 14L ×2 subset), `(user)/{ingredients,recipes,suppliers}/edit/[id]/page.tsx` (16L ×3, plus 17L ×2), `(user)/{ingredients,recipes}/create/page.tsx` (18L), `(user)/recipes/{create,edit/[id]}/page.tsx` (23L). Auth: `(auth)/{signin,signup}/page.tsx` (40L), `components/auth/{signInForm,signUpForm}.tsx` (47L + 36L). Skeletons: `{ingredients,recipes,suppliers}Skeleton.tsx` (14L ×3, 20L ×2, 8L ×3). Intra-file: `hooks/useIngredientsForm.tsx` (17L ×2 twice), `hooks/useRecipeForm.tsx:105-114` ↔ `:123-132`, `components/layout/sideBar.tsx:90-102` ↔ `:161-175`, `components/ui/select.tsx:262-277` ↔ `:286-301`, `services/services.ts:34-46` ↔ `:67-79`, `components/home/marginAlerts.tsx:58-83` ↔ `:132-157`, `packages/domain/src/services/suppliersService.ts:31-38` ↔ `:182-190`, `packages/shared/src/auth.ts:17-22` ↔ `:29-34`, `apps/api/src/routes/suppliers.ts:60-64` ↔ `:114-118`. Cross-file: `apps/api/src/routes/{ingredients,recipes,suppliers}.ts` (8L ×3), `components/ui/{input,moneyInput}.tsx` (24L), `.../totalDisplayComponents/{mobileIngredientsList,recipeIngredientsDisplay}.tsx` (16L) | dupe | `needs-judgment` | Symmetric CRUD boilerplate across three parallel resources. Some of it is idiomatic App Router repetition worth keeping; some (the pagination block repeated across three Hono routes, the two near-identical auth forms) is worth extracting. Needs a per-cluster judgment, not a blanket fix → **Task J**. Note the `marginAlerts.tsx` and `mobileIngredientsList`/`recipeIngredientsDisplay` entries sit in the row-12 and row-10 orphan clusters and vanish if those are approved. | task-filed (J: 868kvw2u3) |
| 30 | **Health advisory baseline — the remaining measurements:** the other 47 of the 67 app-code complexity findings (all ≤ cyclo 13, mostly page/component render functions), the 64 app-code large functions, the 50 hotspot rows not claimed by rows 24 and 28, the app-code file-health scores, and the aggregate vital signs (31,967 LOC, MI 86.4 "good", avg cyclomatic 2.6, p90 5, dead files 31.6%, dead exports 17.8%, duplication 25.5%) | health | `needs-judgment` | Not defects — a baseline. The judgment the reviewer owes is whether to adopt these as tracked thresholds now that Fallow runs on every PR, or leave them as unwatched advisory noise. The headline percentages will move sharply once rows 1 and 10–20 are actioned, so the baseline should be re-taken after Task 5 → **Task K**. | task-filed (K: 868kvw2u8) |
| 31 | **Refactoring targets — the remaining 17 of 23.** `remove_dead_code` (5): `components/shared/skeleton.tsx` (12 unused exports, 100% dead), `components/ui/select.tsx` (10 unused exports, 83% dead), `components/{ingredients/ingredientsSkeleton,recipes/recipesSkeleton,suppliers/suppliersSkeleton}.tsx`. `break_circular_dependency` (12): `.../totalDisplayComponents/mobileIngredientsList.tsx`, `.../formComponents/pricing.tsx`, `.../totalDisplayComponents/recipeIngredientsDisplay.tsx`, `.../formComponents/recipeIngredientsForm.tsx`, `components/ingredients/ingredientModal.tsx`, `hooks/useIngredientsForm.tsx`, `services/services.ts`, `hooks/useRecipeForm.tsx`, `components/recipes/recipeForm/recipeForm.tsx`, `hooks/useHelpers.tsx`, `hooks/useFileUpload.tsx`, `components/shared/incremental.tsx` | health | `needs-judgment` | Fallow's ranked restatement of findings already triaged in rows 14, 19, 21, 22 and 25 — kept as its own row so no reported target goes unlisted (the other 6 targets are claimed by rows 8, 27 and 28). Each one's disposition follows its source row; the reviewer should confirm no target is left orphaned when those rows are approved or rebucketed → tracked under **Task K**, no separate task. | task-filed (K: 868kvw2u8) |
| 32 | **Boundary and policy checks — 0 findings** across `boundary_violations`, `boundary_coverage_violations`, `boundary_call_violations`, `policy_violations`, `re_export_cycles`, `private_type_leaks`, `invalid_client_exports`, `mixed_client_server_barrels`, `misplaced_directives`, `route_collisions`, `dynamic_segment_name_conflicts`, `stale_suppressions`, `dev_dependencies_in_production`, `unused_enum_members`, `unused_class_members` | — | `false-positive` | Recorded as a clean result, not a finding: `.fallowrc.json` declares no boundary rules, so the zero from the boundary checker is vacuous, not evidence. The actual evidence is `grep -rn "@costwise/domain\|@costwise/db" apps/web/src` → no hits, and `apps/web/package.json` declares only `@costwise/api-client` and `@costwise/shared` as workspace dependencies — i.e. `apps/web` cannot reach `packages/domain` or `packages/db` by construction. The `'use client'` / server-component split is intact, and no Next.js route collisions exist — the Task 2–4 separation holds. Listed so the run's clean sections are accounted for alongside its findings. | no action (clean result) |
| 33 | **Package-level orphans, checkpoint-tooling (2 files):** `packages/db/scripts/preflight-auth.ts`, `packages/db/scripts/verify-auth-migration.ts` | dead-code | `needs-judgment` | Provably unwired: they appear in **no** `package.json` script and in no doc (`grep` over `*.json`, `*.ts`, `*.md`, `*.yml`), and no other module imports them. Contrast the three genuinely wired scripts in the same directory (`migrate-auth.ts`, `backfill-ingredient-prices.ts`, `restore-ingredient-price-columns.ts`) and their shared `loadEnv.ts` — Fallow resolved all four through the package scripts and did **not** flag them, which is what makes these two provably unwired rather than a scripts false-positive. But the checkpoint review surfaced contrary evidence: `docs/superpowers/plans/2026-08-23-task3-better-auth.md:258` Step 4 ("⛔ CHECKPOINT — do NOT run the script yet … run migrate-auth") is still unticked while every other Task 3 step is ticked, and both file headers describe them as Task 3 checkpoint tooling ("Read-only preflight/post-migration verification for the Better Auth migration"). Whether the auth DB migration has actually run must be confirmed by a human before deleting migration tooling → **Task L**. | task-filed (L: 868kvw2ud) |

---

### Checkpoint amendment — second-order findings (post-deletion re-run)

After Step 2's deletions (rows 10–20) landed and the Step 3 gate passed green, the Step 4 `pnpm fallow`
re-run surfaced five finding-groups that were not named anywhere in rows 1–33: they are second-order
dead code, exposed only because this task's own approved deletions removed their last live consumer.
Each was traced to its exact cause with `git grep <symbol> HEAD` against the pre-Task-5 tree before
being brought to the checkpoint reviewer, who ruled on them below (rows 34–38). Rows 35–38 were
re-verified against the *current* (post-deletion) tree with `git grep` immediately before acting, and
that evidence is cited inline.

A sixth cascade item was not caught before commit `e36f60c`: `@types/bcrypt` (`packages/domain`
devDependencies) was removed alongside `bcrypt` in that commit's row-20 work, but no row in this
report — not even the rows-34–38 amendment — named it as authorized at the time. Post-commit review
flagged the gap; the coordinator ruled on it as row 39 below, ratifying the removal after the fact
rather than reverting it. See row 39's Why for the full account.

| # | Finding (file / symbol) | Type | Bucket | Why | Outcome |
|---|---|---|---|---|---|
| 34 | **Unused exports (3):** `apps/web/src/app/components/ui/card.tsx:98 CardContent, CardDescription, CardHeader` | dead-code | `needs-judgment` | Same class of finding as row 25 (the vendored shadcn/ui `card.tsx` module) — `CardFooter` was already in row 25's list; `CardContent`/`CardDescription`/`CardHeader` are exposed only because their sole consumers (`components/home/{categoryBreakdown,highImpactIngredients,marginAlerts,onboardingChecklist}.tsx`) were deleted under row 12 this task. They are part of the same vendored public API row 25 already covers, so the checkpoint reviewer folded them into Task F rather than filing a new task: keep as advisory findings until Task F settles the keep-vendored-surface-vs-trim policy; do not delete or suppress them here. | task-filed (F: 868kvw1hf) |
| 35 | **Unused export `apps/web/src/app/components/shared/SelectStore.tsx:78 default` (the `SelectStore` component)** | dead-code | `safe-delete` | Cascade of rows 10 and 14: the default export's only consumers were `ingredientModal.tsx` (row 10) and `itemsStore.tsx` (row 14), both deleted this task. Re-verified against the current tree: `git grep -n SelectStore -- 'apps/*' 'packages/*'` returns only `SelectStore.tsx`'s own definition plus three surviving files (`ingredientForm.tsx`, `constants/supplierDeafaultValues.ts`, `hooks/useIngredientsForm.tsx`) that import only the named `SelectableItem` type, never the default. The `SelectStore` function itself was not called anywhere inside its own module either (unlike row 18's symbols), so per the row 17/18 rule it was fully deleted rather than unexported — the function, its local `SelectStoreProps` interface, its now-unused `import React from 'react'`, and the now-pointless `'use client'` directive were removed; the exported `SelectableItem` interface (still consumed by the three surviving files) was left untouched. | deleted |
| 36 | **Unused type exports `apps/web/src/app/constants/data.ts:114 DeliveryOption`, `:119 PaymentTermOption`** | dead-code | `safe-delete` | Cascade of row 17: both types' only consumers were `deliveryOptions`/`paymentTermsOptions`, deleted under row 17 this task. Re-verified against the current tree: `git grep -n "\bDeliveryOption\b\|\bPaymentTermOption\b" -- 'apps/*' 'packages/*'` returns only their own declaration lines in `data.ts`. Both type declarations were deleted outright (not unexported — nothing in the file uses them either). | deleted |
| 37 | **Unused type export `apps/web/src/app/hooks/useSuppliersForm.tsx:14 FormFields`** | dead-code | `safe-delete` | Cascade of row 15: `FormFields`'s only consumers were `suppliersFormComponents/{input,select}.tsx`, both deleted under row 15 this task. Re-verified against the current tree: `git grep -n FormFields -- apps/web/src/app/hooks/useSuppliersForm.tsx apps/web/src/app/components/suppliers` shows the type is still used **inside its own module**, at `useSuppliersForm.tsx:25` (`useForm<FormInput, unknown, FormFields>`) and `:84` (`onSubmit`'s parameter). Per the row 17/18 rule, a symbol used inside its own module is unexported rather than deleted — only the `export` keyword was removed; the type declaration and both in-file usages are untouched. The sibling `FormInput` export on the same line-group is unrelated and still externally consumed (`suppliersForm.tsx`), so it was left exported. | deleted (export keyword removed, code kept) |
| 38 | **Unused dependency `uid` in `apps/web/package.json`** | dead-code | `safe-delete` | Cascade of row 17: `uid`'s sole import site in `apps/web` was `createMessage` in `services/services.ts`, deleted this task; the app's own `import { uid } from "uid"` was removed at that time as the "now-unused import" row 17's instruction anticipated, which then exposed the manifest entry itself as unused. Re-verified against the current tree: `grep -rn "\buid\b" apps/web/src apps/web/package.json` returns only the `package.json` declaration line, no source usage. (`packages/domain`'s `uid` was already removed under row 20 — this is `apps/web`'s separate declaration of the same package, `apps/web/package.json` `uid ^2.0.2`, noted but not flagged in the original row 20 evidence.) The dependency line was removed from `apps/web/package.json` and `pnpm install` was re-run to update the lockfile. | deleted |
| 39 | **`@types/bcrypt` in `packages/domain/package.json` devDependencies** | dead-code (cascade of row 20) | `safe-delete` | Row 20 authorized removing `bcrypt` from `packages/domain`'s `dependencies` but did not name `@types/bcrypt`. `@types/bcrypt` is a types-only companion of `bcrypt` — there is no other `bcrypt` usage anywhere in `packages/domain` (`apps/api` carries its own separate `bcrypt` + `@types/bcrypt` pair and is unaffected), so once `bcrypt` itself was removed the types package became instantly and unambiguously dead in the same package.json. **It was removed in commit `e36f60c` ahead of authorization** — bundled into the row-20 `pnpm install` without a naming row, the same class of gap rows 34–38 exist to catch. Post-commit review flagged it as out-of-table; the coordinator ratified the removal post-hoc rather than reverting it, since reverting would immediately re-create the exact unused-devDependency finding row 20's own reasoning already established as dead. | deleted (ratified post-hoc) |

---

## Drafted ClickUp tasks (one per `needs-judgment` row)

Ready to paste. The reviewer files these at the checkpoint; the executor does not need ClickUp access.
Every task links back to this report and to the spec.

---

### Task A — Declare or drop `@jest/globals` in `apps/web` *(row 9)*

**Context**
`apps/web/src/app/utils/pagination.test.ts:1` imports `describe`, `test` and `expect` from
`@jest/globals`, but `@jest/globals` is not in `apps/web/package.json`. It is not in
`apps/web/node_modules` either — the import resolves only through pnpm's root hoisting, so it is one
`node-linker` or hoisting-pattern change away from breaking. Every other test file in the repo
(`primitives.test.tsx`, `todayView.test.tsx`, `helpers.test.ts`, the `apps/api` suites) uses Jest's
injected globals with no import, so this file is also the odd one out stylistically.

**Anchors**
- `apps/web/src/app/utils/pagination.test.ts:1`
- `apps/web/package.json` (devDependencies — `jest ^30.1.3`, `@types/jest ^30.0.0`)

**Acceptance criteria**
- Either `@jest/globals` is declared in `apps/web` devDependencies at the version matching `jest`, or the import is removed and the file uses the injected globals like its siblings.
- `pnpm --filter web test` passes.
- Fallow's `unlisted_dependencies` no longer reports `@jest/globals`.

**Out of scope**
Changing the Jest configuration, the test's assertions, or any other test file.

**Links** · this report · `docs/superpowers/specs/2026-08-23-task4.5-fallow-advisory-design.md`
**Fields** · Type: Chore · Area: web · Surface: tests · Priority: Low

---

### Task B — Remove the `constants/components.ts` barrel cycle *(row 21)*

**Context**
`apps/web/src/app/constants/components.ts` re-exports 31 components while five of those same
components import back from it, producing five two-file cycles. Barrels that their own members import
are an initialisation-order hazard and defeat tree-shaking. All five cycles sit inside the orphaned
form cluster (row 10 of this report), so if that deletion is approved the cycles go with it — this
task exists so the cycle is closed by an explicit decision and so the pattern does not return if any
of those components is revived.

**Anchors**
- `apps/web/src/app/constants/components.ts:36-66`
- `apps/web/src/app/components/ingredients/ingredientModal.tsx:4`
- `apps/web/src/app/components/recipes/recipeForm/formComponents/pricing.tsx:7`
- `apps/web/src/app/components/recipes/recipeForm/formComponents/recipeIngredientsForm.tsx:11`
- `apps/web/src/app/components/recipes/recipeForm/formComponents/totalDisplayComponents/mobileIngredientsList.tsx:5`
- `apps/web/src/app/components/recipes/recipeForm/formComponents/totalDisplayComponents/recipeIngredientsDisplay.tsx:5`

**Acceptance criteria**
- Fallow reports 0 circular dependencies involving `constants/components.ts`.
- Any component that survives imports its siblings by direct path, never through the barrel.
- `pnpm build`, `pnpm test` and `pnpm lint` stay green.

**Out of scope**
The live recipe-form cycles (Task C). Deleting the orphan cluster — that is Task 4.5 / Task 5.

**Links** · this report · the Task 4.5 spec
**Fields** · Type: Chore · Area: web · Surface: components · Priority: Low

---

### Task C — Break the recipe-form hook/service import cycle *(row 22)*

**Context**
Seven cycles run through live code: `recipeForm.tsx` → `useRecipeForm` / `incremental` /
`useIngredientsForm` / `useFileUpload` → `useHelpers` → `services/services.ts` → back to
`recipeForm.tsx`, plus `constants/recipeFormDefaultValues.ts` ↔ `useRecipeForm.tsx`. The back-edge is
a layering inversion: `services/services.ts` (a service) imports types from `recipeForm.tsx` (UI),
against the documented layer order UI → hooks/stores → services → repositories → database. This is
the highest-risk cycle set in the repo — it is on the hot path for recipe create/edit and it blocks
tree-shaking on a 489-LOC component.

**Anchors**
- `apps/web/src/app/components/recipes/recipeForm/recipeForm.tsx:18` (`export type FormFields`)
- `apps/web/src/app/services/services.ts`
- `apps/web/src/app/hooks/{useRecipeForm,useHelpers,useFileUpload,useIngredientsForm}.tsx`
- `apps/web/src/app/components/shared/incremental.tsx`
- `apps/web/src/app/constants/recipeFormDefaultValues.ts`
- `docs/architecture.md` (layer order)

**Acceptance criteria**
- Fallow reports 0 circular dependencies in `apps/web/src/app/components/recipes/**` and `apps/web/src/app/hooks/**`.
- No module under `services/` imports from `components/`.
- Shared form types live in one place (`@costwise/shared` or a local `types.ts`), not in a component module.
- Recipe create and edit flows verified working; `pnpm build`, `pnpm test`, `pnpm lint` green.

**Out of scope**
Splitting `RecipeForm` itself (Task H). The barrel cycles (Task B).

**Links** · this report · the Task 4.5 spec · `docs/architecture.md`
**Fields** · Type: Chore · Area: web · Surface: hooks/services · Priority: Medium

---

### Task D — Give `FormFields` one canonical home *(row 23)*

**Context**
`FormFields` — `z.infer<typeof RecipeSchema>` — is exported from both
`components/recipes/recipeForm/recipeForm.tsx:18` and `hooks/useRecipeForm.tsx:32`. Two exports of
the same name for the same type make any barrel re-export resolve ambiguously, and the pairing is one
edge of the `recipeForm` ↔ `useRecipeForm` cycle in Task C. Since `RecipeSchema` already lives in
`@costwise/shared/recipe`, the inferred type most likely belongs there too.

**Anchors**
- `apps/web/src/app/components/recipes/recipeForm/recipeForm.tsx:18`
- `apps/web/src/app/hooks/useRecipeForm.tsx:32`
- `packages/shared/src/recipe.ts` (`RecipeSchema`)

**Acceptance criteria**
- Exactly one module exports `FormFields`; all consumers import from it.
- Fallow reports 0 duplicate exports.
- `pnpm build` and `pnpm test` green.

**Out of scope**
The rest of the cycle work (Task C).

**Links** · this report · the Task 4.5 spec
**Fields** · Type: Chore · Area: web · Surface: types · Priority: Low

---

### Task E — Merge the duplicated supplier transform/validation logic *(row 24)*

**Context**
81 lines of supplier destructure and validation logic exist twice: in
`packages/domain/src/services/validationService.ts:6-57` and
`packages/shared/src/transformers.ts:253-331`, in three clone groups. `transformers.ts` also carries
44 lines of internal duplication (`:174-207` ↔ `:214-248`, `:316-324` ↔ `:327-335`), two of the
repo's highest-CRAP functions (`transformSupplierFromDB` 79.4, `destructureSupplier` 71.3), and is
the fastest-accelerating hotspot in the codebase (score 15.3 ▲, 548 lines churned, 14 dependents).
The copies were made during the Task 3/4 domain/shared extraction and are now diverging under active
edits — the exact condition that produces a silent behaviour split between the API and the web app.

**Anchors**
- `packages/domain/src/services/validationService.ts:6-57`
- `packages/shared/src/transformers.ts:133`, `:174-248`, `:253-335`
- `docs/architecture.md` (what belongs in `packages/shared` vs `packages/domain`)

**Acceptance criteria**
- The supplier destructure/validation logic exists in exactly one package; the other imports it.
- The two intra-file clone pairs in `transformers.ts` are folded into one parameterised helper.
- Fallow reports no clone group spanning `validationService.ts` and `transformers.ts`.
- `pnpm test` green, including `packages/shared/src/helpers.test.ts` and the `apps/api` supplier suites.

**Out of scope**
Reducing `transformSupplierFromDB`'s complexity beyond what deduplication achieves (Task H).

**Links** · this report · the Task 4.5 spec · `docs/architecture.md`
**Fields** · Type: Chore · Area: packages (shared + domain) · Surface: transformers/services · Priority: **High**

---

### Task F — Decide the policy for the vendored shadcn/ui export surface *(row 25, amended by row 34)*

**Context**
20 symbols in `apps/web/src/app/components/ui/` are exported and unconsumed: the ten Radix
sub-components re-exported from `select.tsx:334-343`, the three `cva` variant objects
(`badgeVariants`, `buttonVariants`, `labelVariants`), `CardFooter`, and six component prop types.
None is dead code in the ordinary sense — each is used inside its own module, and this is the public
API shadcn/ui components ship with. Trimming them diverges the files from upstream and complicates
future `npx shadcn add` merges; keeping them means a standing Fallow suppression. Now that Fallow
runs on every PR, the repo needs one stated policy instead of a recurring judgment call.

**Amendment (post-Task-5 checkpoint, row 34):** the Task 5 re-run exposed three more unconsumed
`card.tsx` exports — `CardContent`, `CardDescription`, `CardHeader` (`card.tsx:98`, alongside
`CardFooter` above) — once their only consumers (the row-12 home-dashboard cluster) were deleted.
Same file, same vendored-surface class of finding; fold them into this task's scope rather than
treating them separately.

**Anchors**
- `apps/web/src/app/components/ui/select.tsx:334-343`
- `apps/web/src/app/components/ui/{badge.tsx:86,button.tsx:68,label.tsx:43,card.tsx:98}`
- `apps/web/src/app/components/ui/{button,card,iconButton,input,label,moneyInput}.tsx` (prop types)
- `.fallowrc.json` (`ignoreExports`)
- `docs/ui.md`

**Acceptance criteria**
- A decision is recorded in `docs/decisions.md`: keep the vendored surface intact (and suppress `apps/web/src/app/components/ui/**` in `.fallowrc.json` with a `-- <reason>` note) or trim to what is used.
- Fallow reports no unused exports under `components/ui/` after the chosen policy is applied.
- `pnpm build`, `pnpm test`, `pnpm lint` green.

**Out of scope**
The four unadopted primitive files (Task G).

**Links** · this report · the Task 4.5 spec · `docs/ui.md` · `docs/decisions.md`
**Fields** · Type: Decision · Area: web · Surface: components/ui · Priority: Medium

---

### Task G — Adopt or drop the four unbuilt UI primitives *(row 26)*

**Context**
`components/ui/{checkbox,dialog,switch,textarea}.tsx` have zero importers anywhere in the repo (and
`apps/web` has no dynamic imports, so that is conclusive). But they are not migration leftovers:
Checkbox, Dialog, Switch and a text input are all specified components of the Costwise Design System
that the revamp has not yet reached. Deleting them throws away work the design system calls for;
keeping them keeps four permanently-flagged files. Someone who knows the revamp roadmap should decide.

**Anchors**
- `apps/web/src/app/components/ui/{checkbox,dialog,switch,textarea}.tsx`
- `Costwise Design System/components/forms/{Checkbox,Switch}.jsx`, `components/feedback/Dialog.jsx`
- `costwise_revamp/README.md` (revamp scope)

**Acceptance criteria**
- Each of the four is either wired into a real screen, or deleted, or explicitly retained with a dated `.fallowrc.json` suppression naming the screen that will use it.
- No file is left in the "flagged forever, nobody decided" state.
- `pnpm build`, `pnpm test`, `pnpm lint` green.

**Out of scope**
The export-surface policy for the primitives already in use (Task F).

**Links** · this report · the Task 4.5 spec · `docs/ui.md`
**Fields** · Type: Decision · Area: web · Surface: components/ui · Priority: Low

---

### Task H — Split the oversized form and view components *(row 27)*

**Context**
The revamp collapsed decomposed forms into single components, and the complexity moved with the code
rather than disappearing. `RecipeForm` is 489 LOC at cyclomatic 34 / cognitive 42 (CRAP 283.7,
CRITICAL, JSX depth 9); `TodayView` is 474 LOC; `useIngredientForm` is 231 LOC at cyclomatic 33;
`useRecipeForm` runs 13 hooks across 137 LOC. `IngredientForm` (CRAP 600.0), `SuppliersForm` (306.0)
and `IngredientDetailView` (380.0) carry the highest untested-complexity scores in the app. Fallow
also flags `packages/shared/src/pricing.ts` and `apps/web/src/app/lib/serverSession.ts` as
high-impact split candidates. All of it is live, on the main CRUD paths.

**Anchors**
- `apps/web/src/app/components/recipes/recipeForm/recipeForm.tsx:39`, `:115`, `:440`
- `apps/web/src/app/components/home/TodayView.tsx:62`, `:336`
- `apps/web/src/app/hooks/useIngredientsForm.tsx:33`, `:149`
- `apps/web/src/app/hooks/useRecipeForm.tsx:34`, `:87`
- `apps/web/src/app/components/ingredients/ingredientForm.tsx:26`
- `apps/web/src/app/components/suppliers/suppliersForm.tsx:22`
- `apps/web/src/app/components/ingredients/ingredientPage/IngredientDetailView.tsx:31`
- `packages/shared/src/pricing.ts`, `apps/web/src/app/lib/serverSession.ts`

**Acceptance criteria**
- Scope agreed first — this is several sessions of work, not one PR; split into per-component subtasks before starting.
- No function above 60 LOC or cyclomatic 20 in the files taken on.
- Behaviour unchanged: recipe/ingredient/supplier create, edit and detail flows verified; existing tests pass unmodified where behaviour is unchanged.
- The extracted pieces do not reintroduce a barrel-import cycle (Tasks B, C).

**Out of scope**
The orphan-cluster deletions (Task 4.5 / Task 5). Test-coverage work beyond keeping the suite green.

**Links** · this report · the Task 4.5 spec · `docs/where-to-touch.md`
**Fields** · Type: Chore · Area: web + packages/shared · Surface: components/hooks · Priority: Medium

---

### Task I — Split `apps/api/src/testing/fakes.ts` *(row 28)*

**Context**
`fakes.ts` is the repo's top churn hotspot (score 30.1, 417 lines churned over 7 commits) with 7
dependents: `app.test.ts`, `analytics.test.ts`, `ingredients.test.ts`, `recipes.test.ts` and
`search.test.ts` all import `fakeDeps` and the seed helpers. At 396 LOC it also carries
`seedSupplier` (cyclomatic 29, CRAP 31.8), `seedRecipe` (cyclomatic 25) and an internal clone
(`:218-224` ↔ `:228-234`). Every schema change ripples through all five suites at once.

**Anchors**
- `apps/api/src/testing/fakes.ts:42` (`createFakeState`), `:50` (`seedRecipe`), `:124` (`seedSupplier`), `:218-234`
- `apps/api/src/{app.test.ts,routes/analytics.test.ts,routes/ingredients.test.ts,routes/recipes.test.ts,routes/search.test.ts}`

**Acceptance criteria**
- Fakes split per aggregate (ingredients / recipes / suppliers) behind a stable entry point, so a schema change touches one file.
- The `:218-234` clone pair is folded into one helper.
- No test assertions change; `pnpm --filter api test` green.

**Out of scope**
Adding test cases or changing coverage. Production route code.

**Links** · this report · the Task 4.5 spec
**Fields** · Type: Chore · Area: api · Surface: tests · Priority: Low

---

### Task J — Triage the app-code boilerplate duplication *(row 29)*

**Context**
26 clone groups sit inside application code, mostly the symmetric CRUD boilerplate across
ingredients / recipes / suppliers. Some is idiomatic App Router repetition that is clearer left
alone; some is worth extracting — notably the identical pagination/query block in the three Hono
routes (`ingredients.ts:138-145`, `recipes.ts:146-153`, `suppliers.ts:138-145`), the two
near-identical auth forms (83 lines across `signInForm.tsx` / `signUpForm.tsx`), and the three
skeleton modules (42 lines across three groups). A blanket "extract everything" would make the code
worse; this needs a per-cluster call.

**Anchors**
- Routes: `apps/web/src/app/(user)/{ingredients,recipes,suppliers}/page.tsx`, `.../edit/[id]/page.tsx`, `.../create/page.tsx`
- Auth: `apps/web/src/app/(auth)/{signin,signup}/page.tsx`, `apps/web/src/app/components/auth/{signInForm,signUpForm}.tsx`
- Skeletons: `apps/web/src/app/components/{ingredients/ingredientsSkeleton,recipes/recipesSkeleton,suppliers/suppliersSkeleton}.tsx`
- API: `apps/api/src/routes/{ingredients,recipes,suppliers}.ts`, `apps/api/src/routes/suppliers.ts:60-64` ↔ `:114-118`
- Intra-file: `hooks/useIngredientsForm.tsx`, `hooks/useRecipeForm.tsx:105-132`, `components/layout/sideBar.tsx:90-175`, `components/ui/select.tsx:262-301`, `services/services.ts:34-79`, `packages/domain/src/services/suppliersService.ts:31-190`, `packages/shared/src/auth.ts:17-34`

**Acceptance criteria**
- Each cluster gets a recorded verdict: extract, or keep-and-suppress with a reason.
- Extractions do not add indirection that makes a single resource harder to read.
- `pnpm build`, `pnpm test`, `pnpm lint` green.

**Out of scope**
Clusters inside the orphan clusters (rows 10, 12) — they disappear with Task 5. The cross-package duplication in Task E.

**Links** · this report · the Task 4.5 spec
**Fields** · Type: Chore · Area: web + api + packages · Surface: routes/components · Priority: Low

---

### Task K — Adopt (or decline) a Fallow health baseline *(rows 30, 31)*

**Context**
Beyond the actionable findings, the run produced measurements rather than defects: 47 further
app-code complexity findings, 64 large functions, 50 hotspot rows, 287 file-health scores, and the
aggregate vital signs — 31,967 LOC, maintainability 86.4 ("good"), average cyclomatic 2.6, p90 5,
dead files 31.6%, dead exports 17.8%, duplication 25.5%. With Fallow now advisory on every PR, the
question is whether these become tracked thresholds or stay unwatched noise. The dead-code and
duplication percentages will move sharply once the Task 5 deletions land, so the baseline is only
meaningful if taken afterwards. This task also owns the closing check that Fallow's 23 ranked
refactoring targets are each covered by a triage row (row 31) and that none is orphaned by the
reviewer's rebucketing.

**Anchors**
- `docs/superpowers/reports/2026-08-23-fallow-triage.md` (this report — the pre-cleanup baseline)
- `.fallowrc.json`
- `.github/workflows/ci.yml` (the non-blocking Fallow job from Task 3)
- `docs/decisions.md`

**Acceptance criteria**
- A post-Task-5 Fallow run is captured as the reference baseline, with its vital signs recorded.
- A decision in `docs/decisions.md` on whether any threshold becomes tracked — and it stays advisory: Fallow must never block a PR (spec Decision 1).
- Every one of the 23 refactoring targets is confirmed traceable to a triage row or to a filed task.

**Out of scope**
Making Fallow a required check — explicitly forbidden by the spec. Any refactor; this task only decides what is watched.

**Links** · this report · the Task 4.5 spec · `docs/decisions.md`
**Fields** · Type: Decision · Area: repo · Surface: CI/tooling · Priority: Low

---

### Task L — Confirm the Better Auth DB migration ran, then retire its checkpoint scripts *(row 33)*

**Context**
The two scripts above are pre/post-flight verification tooling for the Task 3 `migrate-auth`
cutover; the Task 3 plan's migration checkpoint step is recorded unticked, so the repo carries no
proof the production migration executed. Auth works in the app (Better Auth is live), but "works" and
"migration script ran and was verified" are different claims.

**Anchors**
- `packages/db/scripts/preflight-auth.ts`
- `packages/db/scripts/verify-auth-migration.ts`
- `packages/db/scripts/migrate-auth.ts`
- `docs/superpowers/plans/2026-08-23-task3-better-auth.md:258`

**Acceptance criteria**
- Panos confirms whether `migrate-auth` was run against production (and the plan checkbox is reconciled to reality).
- If confirmed done, the two checkpoint scripts (and, if desired, `migrate-auth.ts` plus its `package.json` wiring) are deleted in a follow-up commit.
- If not done, the scripts stay and this task becomes the reminder to complete the cutover.

**Out of scope**
Running the migration itself. Any auth code changes.

**Links** · this report · the Task 4.5 spec · `docs/superpowers/plans/2026-08-23-task3-better-auth.md`
**Fields** · Type: Decision · Area: db · Surface: scripts · Priority: Medium

---

## ⛔ CHECKPOINT

Task 5 (suppress false positives, apply safe deletes) is blocked until this table is reviewed.

Reviewer actions:
1. Approve or rebucket each row. Rows 1–8 and 32 become `.fallowrc.json` suppressions with `-- <reason>` notes; rows 10–20 (as amended) become deletions; rows 9, 21–31 and 33 become the tasks above.
2. File Tasks **A–L** in ClickUp (the executor does not need ClickUp access).
3. Confirm the judgment call most worth a second opinion: **row 26** (four unadopted `ui/*` primitives held for judgment rather than deleted, because the design system specifies them).
4. Consistency note: `components/shared/skeleton.tsx` is safe-delete via row 14 and also appears in row 31's target list — its `remove_dead_code` target is satisfied by the row-14 deletion.

---

## Task 5 execution record

Task 5 ran to completion, including the checkpoint amendment for rows 34–38 above and the row-39
post-hoc ratification of the `@types/bcrypt` cascade removal. See the `Outcome` column on every row
(1–39) for the per-row disposition.

**Task → ClickUp id mapping** (rows 9, 21–31, 33 and, by amendment, row 34):

A:868kvw0ft · B:868kvw0q2 · C:868kvw0z3 · D:868kvw157 · E:868kvw1a8 · F:868kvw1hf (rows 25 **and 34**) ·
G:868kvw1z4 · H:868kvw2ah · I:868kvw2hr · J:868kvw2u3 · K:868kvw2u8 (rows 30 and 31) · L:868kvw2ud

Outcome vocabulary is `suppressed` / `deleted` / `task-filed` / `reverted→needs-judgment` per row. One
exception is sanctioned: `no action (clean result)` is the correct value for a row that records a
zero-finding clean result (row 32) rather than an actual finding — there is nothing to suppress,
delete, or file for a check that came back empty.

**Gate:** `pnpm exec turbo run build test lint --cache-dir=.turbo --force` — 12/12 tasks green (80
API tests, 39 web tests, 34 `@costwise/shared` tests, 1 `@costwise/domain` test; no reverts).

**Final `pnpm fallow` re-run:** dead-code 38 issues (6 unused files, 17 unused exports, 6 unused type
exports, 1 unlisted dependency `@jest/globals`, 1 duplicate export pair, 7 circular dependencies) · 29
clone groups (6.9% duplication) · 54 complexity findings above threshold — every one maps 1:1 to rows
9, 21–31, 33 or 34 (Tasks A–L). No unauthorized or unaccounted-for finding remains.
