/**
 * - Requires an active user session; redirects to "/signin" if the user is not authenticated.
 * - Fetches analytics data for the authenticated user, including total recipes, total ingredients, average food cost, and average profit margin.
 * - Displays a header with session context and a summary dashboard of key metrics using styled cards with icons.
 * - Uses service classes (`RecipeService`, `IngredientService`) to retrieve user-specific analytics from the backend.
 */
import { auth } from '@/auth'
import { Carrot, Percent, ShoppingBasket } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import Card from '@/app/components/home/card'
import { RecipeService } from '@/app/services/recipeService'
import { IngredientService } from '@/app/services/ingredientService'

const page = async() => {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/signin")
  }

  const recipeService = new RecipeService(session.user.id)
  const ingredientService = new IngredientService(session.user.id)

  const [recipeAnalytics, ingredientAnalytics] = await Promise.all([
  recipeService.getRecipesAnalytics(session.user.id),
  ingredientService.getIngredientAnalytics(session.user.id)
])
  
  const totalRecipes = recipeAnalytics ? recipeAnalytics.totalRecipes : 0
  const avgfoodCost = recipeAnalytics  && recipeAnalytics.avgFoodCost !== null ? Number(recipeAnalytics.avgFoodCost) : 0
  const avgProfitMargin = recipeAnalytics && recipeAnalytics.avgProfitMargin !== null ? Number(recipeAnalytics.avgProfitMargin) : 0
  const totalIngredients = ingredientAnalytics ? ingredientAnalytics.totalIngredients : 0
  
  return (
    <div className=' m-2'>
      <div className='m-1 p-3 grid grid-cols-1 gap-4 place-items-center md:grid-cols-4 rounded-2xl h-full'>
        <Card title='Recipes' value={totalRecipes} Icon={ShoppingBasket} color='border-1' />
        <Card title='Ingredients' value={totalIngredients} Icon={Carrot} color='border-1 ' />
        <Card title='Avg Food Cost' value={Number(avgfoodCost.toFixed(2))} Icon={Percent} color='border-1' />
        <Card title='Avg Profit Margin' value={Number(avgProfitMargin.toFixed(2))} Icon={Percent} color='border-1  border-purple-600' />
      </div>
    </div>
  )
}

export default page
