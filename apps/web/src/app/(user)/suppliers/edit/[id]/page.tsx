import SuppliersForm from '@/app/components/suppliers/suppliersForm';
import { SupplierService } from '@costwise/domain/services/suppliersService';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import React from 'react';

export interface Params {
  params: Promise<{
    id: string;
  }>;
}

const EditPage = async ({ params }: Params) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const service = new SupplierService(session.user.id);
  const { id } = await params;
  const supplier = await service.findById(id);

  if (!supplier) {
    notFound();
  }

  return (
    <SuppliersForm
      userId={session.user.id}
      mode="edit"
      supplier={supplier}
    />
  );
};

export default EditPage;
