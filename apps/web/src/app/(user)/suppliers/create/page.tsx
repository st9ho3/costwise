import SuppliersForm from '@/app/components/suppliers/suppliersForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const SuppliersCreatePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  return <SuppliersForm userId={session.user.id} mode="create" />;
};

export default SuppliersCreatePage;
