import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SupplierService } from '@/app/services/suppliersService';
import { Metadata } from '@/types/specialTypes';
import IngredientForm from '@/app/components/ingredients/ingredientForm';

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const supplierService = new SupplierService(session.user.id);

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
      mode="create"
      ingredient={undefined}
      userId={session.user.id}
      supplierOptions={supplierOptions}
    />
  );
};

export default Page;