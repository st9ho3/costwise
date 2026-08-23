import React from 'react';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';
import { Metadata } from '@costwise/shared/specialTypes';
import IngredientForm from '@/app/components/ingredients/ingredientForm';
import { apiServer } from '@/app/lib/api';

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

  const { id } = await params;
  const api = await apiServer();

  const dropdownMetadata: Metadata = {
    page: 1,
    order: 'asc',
    sort: 'name',
    itemsPerPage: 1000,
    offset: 0,
  };

  const [ingredientRes, suppliersRes] = await Promise.all([
    api.GET('/v1/ingredients/{id}', {
      params: { path: { id } },
    }),
    api.GET('/v1/suppliers', {
      params: {
        query: {
          page: dropdownMetadata.page,
          order: dropdownMetadata.order,
          sort: dropdownMetadata.sort,
          itemsPerPage: dropdownMetadata.itemsPerPage,
          offset: dropdownMetadata.offset,
        },
      },
    }),
  ]);

  const ingredient = ingredientRes.data;
  if (!ingredient || ingredientRes.error) {
    notFound();
  }

  const supplierOptions =
    suppliersRes.data?.suppliers?.map((supplier) => ({
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