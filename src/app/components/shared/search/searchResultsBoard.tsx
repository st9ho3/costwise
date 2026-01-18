// src/components/SearchResultsBoard.tsx

import React from 'react'
import { Results } from '@/app/hooks/useSearch'
import RecipeSearchResult from './recipeSearchResult'
import IngredientSearchResult from './ingredientSearchresult'
import SearchResultsDisplay from './searchResultsDisplay'
import { SearchX, Loader2 } from 'lucide-react'

interface SearchResultsBoardProps {
  results: Results | undefined
  loading: boolean
  onClose: () => void
}

const SearchResultsBoard = ({ results, loading, onClose, isMobile = false }: SearchResultsBoardProps & { isMobile?: boolean }) => {
  const { recipes, ingredients } = results || {}
  const hasRecipes = recipes && recipes.length > 0
  const hasIngredients = ingredients && ingredients.length > 0
  const isEmpty = !loading && !hasRecipes && !hasIngredients

  // Desktop: Dropdown/Modal styles
  const desktopClasses = `
    hidden md:flex
    absolute z-20 top-full left-0 right-0 mt-2
    w-full bg-white
    rounded-[28px] border border-gray-100
    shadow-xl shadow-gray-200/50
    overflow-hidden flex flex-col
  `

  // Mobile: Full width/height styles
  const mobileClasses = `
    flex flex-col w-full bg-white h-140
    overflow-y-auto
  `

  const containerClasses = isMobile ? mobileClasses : desktopClasses

  if (loading) {
    return (
      <div className={`${containerClasses} ${!isMobile ? 'h-30 md:h-40' : 'h-full'} justify-center items-center gap-3 text-gray-400`}>
        <Loader2 className='animate-spin text-blue-500' size={24} />
        <span className="text-sm font-medium">Finding delicious things...</span>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={`${containerClasses} ${!isMobile ? 'h-full md:h-40' : 'h-full'} justify-center items-center gap-2 text-gray-400`}>
        <div className="p-3 bg-gray-50 rounded-full mb-1">
            <SearchX size={24} className="text-gray-400" />
        </div>
        <span className="text-sm font-medium">No results found</span>
      </div>
    )
  }

  return (
    <div className={`${containerClasses} ${!isMobile ? 'max-h-[60vh]' : ''} overflow-y-auto py-4`}>
      {hasRecipes && (
        <SearchResultsDisplay title='Recipes' total={recipes.length}>
          {recipes.map((recipe) => (
            <RecipeSearchResult onClose={onClose} key={recipe.id} item={recipe} />
          ))}
        </SearchResultsDisplay>
      )}

      {hasRecipes && hasIngredients && <div className="h-px bg-gray-100 mx-8 my-2" />}

      {hasIngredients && (
        <SearchResultsDisplay title='Ingredients' total={ingredients.length}>
          {ingredients.map((ingredient) => (
            <IngredientSearchResult onClose={onClose} key={ingredient.id} item={ingredient} />
          ))}
        </SearchResultsDisplay>
      )}
    </div>
  )
}

export default SearchResultsBoard