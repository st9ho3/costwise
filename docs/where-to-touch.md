# Where To Touch

Use this as the routing guide before editing code.

## If You Need To Change...

- UI design system, styling, tokens, or typography
  - Start with `docs/ui.md`
  - Then inspect tokens and ramps in `src/app/globals.css`
  - Then inspect reusable primitives in `src/app/components/ui/*`

- Login, signup, or session behavior
  - Start with `src/auth.ts`
  - Then check `src/app/services/authservice.ts`
  - Then `src/app/api/auth/signup/route.ts` or `src/app/api/auth/[...nextauth]/route.ts`

- Recipe business rules, pricing, ingredient linking, or recipe persistence
- Start with `src/app/services/recipeService.ts`
- Then inspect `src/app/repositories/recipeRepository.ts`
- Then review `src/app/utils/pricing.ts`, `src/app/utils/transformers.ts`, and `src/shemas/recipe.ts`

- Ingredient business rules or usage recalculation
- Start with `src/app/services/ingredientService.ts`
- Then inspect `src/app/repositories/ingredientRepository.ts`
- Then review `src/app/services/recipeService.ts` for downstream recalculation logic

- Supplier creation, update, or deletion
- Start with `src/app/services/suppliersService.ts`
- Then inspect:
- `src/app/repositories/suppliersRepository.ts`
- `src/app/repositories/addressesRepository.ts`
- `src/app/repositories/supplierFinancialDataRepository.ts`
- `src/app/repositories/suppliersCategory.ts`

- Search behavior
- Start with `src/app/services/searchService.ts`
- Then inspect `src/app/repositories/searchRepository.ts`
- Then review `src/app/components/shared/search/*`

- File uploads
- Start with `src/app/api/upload/route.ts`
- Then inspect `src/app/hooks/useFileUpload.tsx` and `src/app/stores/fileStore.ts`

- Page layout, nav, header, sidebar, or mobile tab bar
- Start with `src/app/(user)/layout.tsx`
- Then inspect:
- `src/app/components/layout/header.tsx`
- `src/app/components/layout/sideBar.tsx`
- `src/app/components/layout/tabBar.tsx`

- Recipe UI forms and tables
- Start with `src/app/components/recipes/*`
- Then inspect the matching page under `src/app/(user)/recipes`

- Ingredient UI forms and detail pages
- Start with `src/app/components/ingredients/*`
- Then inspect the matching page under `src/app/(user)/ingredients`

- Supplier UI forms and pages
- Start with `src/app/components/suppliers/*`
- Then inspect the matching page under `src/app/(user)/suppliers`

- Global UI state or modals
- Start with `src/app/stores/uiStore.ts`
- Then inspect shared modal components in `src/app/components/shared/*`

- Database schema changes
- Start with `src/db/schema.ts`
- Then inspect the affected repository and service

## Quality Gates

- ESLint — BLOCKING. `pnpm lint`, enforced by the required `ci` job; red blocks merge.
- Fallow — ADVISORY, never blocks. `pnpm fallow` (local/agents) scans the
  monorepo for dead code, duplication, circular deps, and complexity.
  Config: `.fallowrc.json` at repo root — false-positive suppressions go
  THERE, with a reason, never as scattered inline ignores. CI: the
  non-required `fallow` job posts findings to the job summary on every PR.
  Findings triage into cleanup commits or ClickUp tasks (see
  docs/superpowers/specs/2026-08-23-task4.5-fallow-advisory-design.md).

## Rule Of Thumb

- If it affects business logic, touch a service first.
- If it affects SQL or data access, touch a repository first.
- If it affects rendering only, touch a page or component first.
- If it affects shared behavior across multiple domains, update the canonical doc in `docs/` before making code changes.

