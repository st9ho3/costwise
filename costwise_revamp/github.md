repo: st9ho3/costwise
branch: main
path: src/app

## Last sync
date: 2026-08-22T14:05:00Z

### Updated in this project
- Today rebuilt as a decision queue (three approve/dismiss proposals, cleared counter, done strip) on both desktop and phone; stat tiles and insight pair removed.
- Added a day-one Today: a written brief of what Costwise worked out from signup data (`firstDay` prop).
- Supplier form fixed: create no longer crashes, payment terms aligned to one plain-language list, required-field validation.
- Greek support: per-character font fallback to Geologica / Fira Sans / Fira Mono, since none of the four brand faces carry Greek.

## Sync history
### 2026-08-22T08:30:00Z
- Rebuilt the whole app on the Costwise design system as one Design Component (`Costwise.dc.html`).
- All 10 screens recreated with today's functionality: Today, Dishes, Ingredients, Suppliers, three create/edit forms, ingredient detail, sign in/up.
- Copy rewritten in the Costwise voice; delivery/payment terms translated from Greek to English.
- Desktop table + phone card-feed views, plus search overlay, create sheet, delete confirm, profile and toasts.

## Screen map
| Screen (in Costwise.dc.html) | Built from |
| --- | --- |
| App shell (sidebar, glass topbar) | `src/app/(user)/layout.tsx`, `components/layout/sideBar.tsx`, `components/layout/header.tsx` |
| Today — decision queue + day-one brief | `src/app/(user)/(home)/page.tsx`, `components/home/card.tsx` (rebuilt, not re-skinned — needs new proposal endpoints) |
| Dishes list | `(user)/recipes/page.tsx`, `components/recipes/recipestable.tsx`, `components/recipes/pagination.tsx`, `constants/data.ts` |
| Ingredients list | `(user)/ingredients/page.tsx`, `components/ingredients/ingredientsTable.tsx`, `utils/pricing.ts`, `utils/uiHelpers.ts` |
| Suppliers list | `(user)/suppliers/page.tsx`, `components/suppliers/suppliersTable.tsx` |
| Shared table cells / labels | `components/shared/table/*`, `components/shared/label.tsx`, `components/shared/mobileListCard.tsx` |
| Dish form | `components/recipes/recipeForm/recipeForm.tsx` + `formComponents/*` (pricing, additionalCosts, total, statItem, displayedIngredient, formHeader), `utils/pricing.ts` |
| Ingredient form | `components/ingredients/ingredientForm.tsx`, `ingredientsFormComponents/*`, `shared/incremental.tsx` |
| Supplier form | `components/suppliers/suppliersForm.tsx`, `suppliersFormComponents/*`, `constants/data.ts` (delivery/payment options) |
| Ingredient detail | `(user)/ingredients/[id]/page.tsx`, `components/ingredients/ingredientPage/*` |
| Sign in / Sign up | `(auth)/layout.tsx`, `components/auth/signInForm.tsx`, `components/auth/signUpForm.tsx` |
| Search overlay | `components/shared/search/searchBoard.tsx`, `searchBar.tsx`, `searchResultsBoard.tsx` |
| Create sheet / delete confirm / profile / toast | `components/shared/optionsModal.tsx`, `modal.tsx`, `deleteConfirmationModal.tsx`, `profileModal.tsx`, `notification.tsx` |
| Phone view (tab bar + card feed) | `components/layout/tabBar.tsx`, `components/shared/mobileListCard.tsx` |
