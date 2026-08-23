/**
 * - Requires an active user session; redirects to "/signin" if the user is not authenticated.
 * - Accepts a dynamic route parameter `id` representing the ingredient to edit.
 * - Fetches the ingredient data by ID using `IngredientService`.
 * - Fetches all available suppliers using `SupplierService` for the dropdown.
 * - Renders a modal overlay (`IngredientModal` in "edit" mode) centered on the screen, displaying the ingredient form for the authenticated user.
 * - Passes the user ID, ingredient data, and supplier options to the modal for editing context.
 */
import React from 'react'
import { IngredientModal } from '@/app/constants/components'
import { IngredientService } from '@/app/services/ingredientService'
import { SupplierService } from '@/app/services/suppliersService'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Metadata } from '@/types/specialTypes'
import { Ingredient } from '@/shemas/recipe'

export interface Params {
    params: Promise<{
        id: string
    }>
}

const IngredientEditPage = async ({params}: Params ) => {

    const session = await auth()
    if (!session?.user?.id) {
        redirect("/signin")
    }

    const ingredientService = new IngredientService(session.user.id)
    const supplierService = new SupplierService(session.user.id)
    
    const {id} = await params

    // Fetch ingredient data
    const ingredient = await ingredientService.findById(id)

    // Fetch all suppliers for the dropdown
    const dropdownMetadata: Metadata = {
        page: 1,
        order: 'asc',
        sort: 'name',
        itemsPerPage: 1000,
        offset: 0,
    }

    const result = await supplierService.findAll(session.user.id, dropdownMetadata)
    
    // Transform suppliers for the select options
    const supplierOptions = result?.suppliers?.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
    })) ?? []

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-3xl p-8 mx-4 bg-card bg-grid border-2 border-primary rounded-lg shadow-[6px_6px_0px_0px_#000000]">
                <IngredientModal 
                    mode='edit' 
                    ingredient={ingredient} 
                    userId={session.user.id} 
                    supplierOptions={supplierOptions}
                />
            </div>
        </div>
    )
}

export default IngredientEditPage