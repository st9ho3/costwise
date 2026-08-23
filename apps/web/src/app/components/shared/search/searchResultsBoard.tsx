import React from 'react';
import { Results } from '@/app/hooks/useSearch';
import RecipeSearchResult from './recipeSearchResult';
import IngredientSearchResult from './ingredientSearchresult';
import SearchResultsDisplay from './searchResultsDisplay';
import { Loader2 } from 'lucide-react';

interface SearchResultsBoardProps {
  results: Results | undefined;
  loading: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const SearchResultsBoard = ({ results, loading, onClose, isMobile = false }: SearchResultsBoardProps) => {
  const { recipes, ingredients } = results || {};
  const hasRecipes = recipes && recipes.length > 0;
  const hasIngredients = ingredients && ingredients.length > 0;
  const isEmpty = !loading && !hasRecipes && !hasIngredients;

  const containerClasses = isMobile
    ? "flex flex-col w-full bg-white max-h-[80vh] overflow-y-auto"
    : "absolute z-40 top-[44px] left-0 w-full max-w-[460px] bg-white rounded-[26px] border border-[#EFE8DA] shadow-[0_4px_8px_rgba(27,26,22,0.05),0_20px_40px_-12px_rgba(27,26,22,0.16)] overflow-hidden flex flex-col max-h-[380px] overflow-y-auto animate-in fade-in-0 duration-140";

  if (loading) {
    return (
      <div className={`${containerClasses} h-36 justify-center items-center gap-2 text-stone-500`}>
        <Loader2 className="animate-spin text-green-700 size-5" />
        <span className="text-[14px] font-medium font-body">Finding delicious things…</span>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`${containerClasses} p-6 justify-center items-center text-center gap-1.5`}>
        <div className="font-display font-bold text-[17px] text-ink-900">
          Nothing matched that
        </div>
        <p className="text-[13px] text-stone-500 font-body">
          Try a shorter word — &ldquo;carb&rdquo;, &ldquo;egg&rdquo;, &ldquo;oil&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {hasRecipes && (
        <SearchResultsDisplay title="Dishes" total={recipes.length}>
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeSearchResult onClose={onClose} key={recipe.id} item={recipe} />
          ))}
        </SearchResultsDisplay>
      )}

      {hasRecipes && hasIngredients && <div className="h-px bg-[#EFE8DA] mx-4" />}

      {hasIngredients && (
        <SearchResultsDisplay title="Ingredients" total={ingredients.length}>
          {ingredients.slice(0, 4).map((ingredient) => (
            <IngredientSearchResult onClose={onClose} key={ingredient.id} item={ingredient} />
          ))}
        </SearchResultsDisplay>
      )}
    </div>
  );
};

export default SearchResultsBoard;