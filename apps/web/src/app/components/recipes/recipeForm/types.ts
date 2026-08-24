import {
  Ingredient,
  IngredientToDisplay,
  Recipe,
  RecipeIngredients,
} from '@costwise/shared/recipe';

/**
 * Inputs to the recipe form — the component's props and, identically, the
 * arguments `useRecipeForm` takes.
 *
 * It lives here rather than in `recipeForm.tsx` so the hook can name its own
 * parameter type without importing from the component that consumes it. That
 * import was the last back edge in the recipeForm ↔ hooks ↔ services cycle and
 * a layering inversion against the documented order (UI → hooks/stores →
 * services). Keep this module free of imports from `components/` and `hooks/`.
 */
export interface RecipeFormProps {
  mode: 'create' | 'edit';
  ingredients: (Ingredient | IngredientToDisplay)[];
  recipe?: Recipe;
  recipeIngredients: RecipeIngredients[];
  userId: string;
}
