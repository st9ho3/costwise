/**
 * - Requires an active user session; redirects to "/signin" if the user is not authenticated.
 * - Accepts a dynamic route parameter `id` (representing an ingredient ID) and displays it on the page.
 * - Uses Next.js App Router's async params handling to extract the `id` from the URL.
 */
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { IngredientService } from '@/app/services/ingredientService'
import IngredientHeader from '@/app/components/ingredients/ingredientPage/ingredientHeader'



const page = async ({params}: {params: Promise<{id: string}>}) => {
  const {id} = await params
  const service = new IngredientService()
  const ingredient = await service.findById(id)

  console.log(ingredient)
  const session = await auth()
    
    if (!session?.user) {
      redirect("/signin")
    }
  
  return (
    <div>
      <IngredientHeader
      name={ingredient?.name}
      icon={ingredient?.icon}
      />
    </div>
  )
}

export default page
