import React from 'react';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect } from 'next/navigation';
import { Metadata } from '@costwise/shared/specialTypes';
import IngredientForm from '@/app/components/ingredients/ingredientForm';
import { apiServer } from '@/app/lib/api';

const Page = async () => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const dropdownMetadata: Metadata = {
    page: 1,
    order: 'asc',
    sort: 'name',
    itemsPerPage: 1000,
    offset: 0,
  };

  const api = await apiServer();
  const { data: result } = await api.GET('/v1/suppliers', {
    params: {
      query: {
        page: dropdownMetadata.page,
        order: dropdownMetadata.order,
        sort: dropdownMetadata.sort,
        itemsPerPage: dropdownMetadata.itemsPerPage,
        offset: dropdownMetadata.offset,
      },
    },
  });

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