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
import IngredientDetails from '@/app/components/ingredients/ingredientPage/ingredientDetails'
import IngredientData from '@/app/components/ingredients/ingredientPage/ingredientData'
import Data from '@/app/components/ingredients/ingredientPage/data'
import ActionsContainer from '@/app/components/shared/actionsContainer'



const page = async ({params}: {params: Promise<{id: string}>}) => {
  const {id} = await params
  const session = await auth()
    
    if (!session?.user?.id) {
      redirect("/signin")
    }

  const service = new IngredientService(session.user.id)
  const ingredient = await service.findById(id)
  
  return (
    <div className='flex p-5'>
      <IngredientDetails>
        <ActionsContainer id={ingredient?.id} />
        <IngredientHeader
        name={ingredient?.name}
        icon={ingredient?.icon}
        type={ingredient?.categoryName || 'Other'} 
        />
        <IngredientData>
          <Data category='' label='Unit Measure' text={ingredient?.unit} />
          <Data category='' label='Price per Unit' text={ingredient?.unitPrice} />
          <Data category='' label='Usage' text={ingredient?.usage} />
          <Data category={ingredient?.categoryName || 'Other'} label='Category' text={ingredient?.categoryName } />
        </IngredientData>
        
      </IngredientDetails>
      
    </div>
  )
}

export default page
