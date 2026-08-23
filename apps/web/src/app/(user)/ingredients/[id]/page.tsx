import React from 'react';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect, notFound } from 'next/navigation';
import { IngredientService } from '@costwise/domain/services/ingredientService';
import IngredientDetailView from '@/app/components/ingredients/ingredientPage/IngredientDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

const IngredientDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const service = new IngredientService(session.user.id);
  const ingredient = await service.findById(id);

  if (!ingredient) {
    notFound();
  }

  return <IngredientDetailView ingredient={ingredient} />;
};

export default IngredientDetailPage;
