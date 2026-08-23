import SuppliersForm from '@/app/components/suppliers/suppliersForm';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';
import React from 'react';
import { apiServer } from '@/app/lib/apiServer';
import { Supplier } from '@costwise/shared/recipe';

export interface Params {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: Params) => {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { id } = await params;
  const api = await apiServer();
  const { data: rawSupplier, error } = await api.GET('/v1/suppliers/{id}', {
    params: { path: { id } },
  });

  if (error || !rawSupplier) {
    notFound();
  }

  const supplier: Supplier = {
    ...rawSupplier,
    icon: rawSupplier.icon ?? undefined,
    dateAdded: rawSupplier.dateAdded ? new Date(rawSupplier.dateAdded) : undefined,
    deliveryTime: rawSupplier.deliveryTime as Supplier['deliveryTime'],
  };

  return (
    <SuppliersForm
      userId={session.user.id}
      mode="edit"
      supplier={supplier}
    />
  );
};

export default EditPage;
