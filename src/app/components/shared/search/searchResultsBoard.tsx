import { Results } from '@/app/hooks/useSearch'
import React from 'react'
import RecipeSearchResult from './recipeSearchResult'
import IngredientSearchResult from './ingredientSearchresult'
import SearchResultsDisplay from './searchResultsDisplay'

interface SearchResultsBoardProps {
    results: Results | undefined
}

const SearchResultsBoard = ({results}: SearchResultsBoardProps) => {

    if (!results) {
      return 
    }

    const {recipes, ingredients} = results 
   
  return (
    <div className='absolute z-1 top-10 w-100 h-fit h-max-100 border bg-white rounded-b-md border-gray-200 shadow-xl'>
      {recipes && recipes?.length > 0 && 
        <SearchResultsDisplay title='Recipes' total={recipes?.length}>
        {recipes && recipes.map((recipe) => <RecipeSearchResult key={recipe.id} item={recipe} /> )}
        </SearchResultsDisplay>
      }
      {ingredients && ingredients?.length > 0 &&  
        <SearchResultsDisplay title='Ingredients' total={ingredients?.length}>
        {ingredients && ingredients.map((ingredient) => <IngredientSearchResult key={ingredient.id} item={ingredient} /> )}
      </SearchResultsDisplay>
      }
      
    </div>
  )
}

export default SearchResultsBoard
