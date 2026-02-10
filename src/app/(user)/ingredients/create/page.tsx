/**
 * Renders a full-screen overlay for creating a new ingredient.
 * It first checks for an authenticated user session. If no session is found,
 * it redirects the user to the sign-in page. If a user is authenticated,
 * it fetches all available suppliers and renders the `IngredientModal` component, 
 * configured for 'create' mode. The modal is passed the authenticated user's ID 
 * to associate the new ingredient with their account and the available suppliers
 * for selection.
 */
import React from 'react';
import { IngredientModal } from '@/app/constants/components';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SupplierService } from '@/app/services/suppliersService';
import { Metadata } from '@/types/specialTypes';

const Page = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }

    // Fetch all suppliers for the dropdown
    const supplierService = new SupplierService(session.user.id);
    
    const dropdownMetadata: Metadata = {
        page: 1,
        order: 'asc',
        sort: 'name',
        itemsPerPage: 1000,
        offset: 0,
    };

    const result = await supplierService.findAll(session.user.id, dropdownMetadata);
    
    // Transform suppliers for the select options
    const supplierOptions = result?.suppliers?.map((supplier) => ({
        id: supplier.id,
        name: supplier.name
    })) ?? [];

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className={`relative w-full max-w-fit p-9 mx-4 transform transition-all duration-300 bg-white rounded-2xl shadow-xl`}>
                <IngredientModal 
                    mode="create" 
                    ingredient={undefined} 
                    userId={session.user.id} 
                    supplierOptions={supplierOptions}
                />
            </div>
        </div>
    );
};

export default Page;