import React from 'react';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';
import IngredientDetailView from '@/app/components/ingredients/ingredientPage/IngredientDetailView';
import { apiServer } from '@/app/lib/apiServer';

interface PageProps {
  params: Promise<{ id: string }>;
}

const IngredientDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const api = await apiServer();
  const { data: ingredient, error } = await api.GET('/v1/ingredients/{id}', {
    params: { path: { id } },
  });

  if (error || !ingredient) {
    notFound();
  }

  return <IngredientDetailView ingredient={ingredient} />;
};

export default IngredientDetailPage;
