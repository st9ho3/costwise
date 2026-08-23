import React from 'react';
import { getServerSession } from '@/app/lib/serverSession';
import { notFound, redirect } from 'next/navigation';
import { apiServer } from '@/app/lib/apiServer';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/signin');
  }

  const { id } = await params;
  const api = await apiServer();
  const { data: recipe, error } = await api.GET('/v1/recipes/{id}', {
    params: { path: { id } },
  });

  if (error || !recipe) {
    notFound();
  }

  return <div>{`Recipe: ${id}`}</div>;
};

export default page;
