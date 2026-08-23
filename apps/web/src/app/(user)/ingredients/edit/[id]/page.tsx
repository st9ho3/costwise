import React from 'react';
import { IngredientService } from '@costwise/domain/services/ingredientService';
import { SupplierService } from '@costwise/domain/services/suppliersService';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';
import { Metadata } from '@costwise/domain/types/specialTypes';
import IngredientForm from '@/app/components/ingredients/ingredientForm';

export interface Params {
  params: Promise<{
    id: string;
  }>;
}

const IngredientEditPage = async ({ params }: Params) => {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const ingredientService = new IngredientService(session.user.id);
  const supplierService = new SupplierService(session.user.id);

  const { id } = await params;

  // Fetch ingredient data
  const ingredient = await ingredientService.findById(id);
  if (!ingredient) {
    notFound();
  }

  // Fetch all suppliers for the dropdown
  const dropdownMetadata: Metadata = {
    page: 1,
    order: 'asc',
    sort: 'name',
    itemsPerPage: 1000,
    offset: 0,
  };

  const result = await supplierService.findAll(session.user.id, dropdownMetadata);

  const supplierOptions =
    result?.suppliers?.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
    })) ?? [];

  return (
    <IngredientForm
      mode="edit"
      ingredient={ingredient}
      userId={session.user.id}
      supplierOptions={supplierOptions}
    />
  );
};

export default IngredientEditPage;