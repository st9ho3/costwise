import { Results } from '@/app/hooks/useSearch'
import React from 'react'
import RecipeSearchResult from './recipeSearchResult'
import IngredientSearchResult from './ingredientSearchresult'
import SearchResultsDisplay from './searchResultsDisplay'
import { Carrot, Loader } from 'lucide-react'

interface SearchResultsBoardProps {
    results: Results | undefined
    loading: boolean
    onClose: () => void
    
}

const SearchResultsBoard = ({results, loading, onClose}: SearchResultsBoardProps) => {

  if (!results || loading) {
    return (
      <div className='absolute flex justify-center items-center gap-2 z-1 top-10 w-100 h-100 border bg-white rounded-b-2xl border-gray-200 shadow-md'>
        <Loader className='animate-spin' size={30} />
        Loading...
      </div>
    )
  }

  const {recipes, ingredients} = results 

  if (recipes?.length === 0 && ingredients?.length === 0) {
    return (
      <div className='absolute flex justify-center items-center gap-2 z-1 top-10 w-100 h-100 border bg-white rounded-b-2xl border-gray-200 shadow-md'>
        <Carrot size={30} />
        No Items
      </div>
    )
  }
   console.log(results)
  return (
    <div className='absolute z-1 top-10 w-100 h-fit h-max-100 border bg-white rounded-b-2xl border-gray-200 shadow-md'>
      {recipes && recipes?.length > 0 && 
        <SearchResultsDisplay title='Recipes' total={recipes?.length}>
        {recipes && recipes.map((recipe) => <RecipeSearchResult onClose={onClose} key={recipe.id} item={recipe} /> )}
        </SearchResultsDisplay> 
      }
      {ingredients && ingredients?.length > 0 &&  
        <SearchResultsDisplay title='Ingredients' total={ingredients?.length}>
        {ingredients && ingredients.map((ingredient) => <IngredientSearchResult onClose={onClose} key={ingredient.id} item={ingredient} /> )}
      </SearchResultsDisplay>
      }
      
    </div>
  )
}

export default SearchResultsBoard
