'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { IconButton } from '@/app/components/ui/iconButton';
import { StatTile } from '@/app/components/ui/statTile';
import { DataRow } from '@/app/components/ui/dataRow';
import { CategoryChip, CategoryThumbnail, getCategoryDefinition } from '@/app/utils/uiHelpers';
import { formatPrice, getDisplayUnit } from '@costwise/shared/pricing';
import useHelpers from '@/app/hooks/useHelpers';
import Modal from '@/app/components/shared/modal';
import DeleteConfirmationModal from '@/app/components/shared/deleteConfirmationModal';

interface IngredientDetailViewProps {
  ingredient: {
    id: string;
    name: string;
    unitPrice?: number | string;
    unit?: string;
    quantity?: number | string;
    usage?: number | string;
    category?: string;
    categoryName?: string;
    suppliers?: Array<{ name?: string }>;
  };
}

export default function IngredientDetailView({ ingredient }: IngredientDetailViewProps) {
  const router = useRouter();
  const { isModalOpen, isDeleteActive, closeModal, handleDelete, askPermision } =
    useHelpers({ path: 'ingredients' });

  const catDef = getCategoryDefinition(ingredient.categoryName || ingredient.category);
  const Icon = catDef.icon;
  const numPrice = Number(ingredient.unitPrice || 0);
  const displayUnit = getDisplayUnit(ingredient.unit);
  const supplierName =
    ingredient.suppliers && ingredient.suppliers.length > 0 && ingredient.suppliers[0]?.name
      ? ingredient.suppliers[0].name
      : 'Direct purchase';

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[900px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconButton
            icon={<ArrowLeft className="size-5" strokeWidth={1.75} />}
            variant="outline"
            label="Back to ingredients"
            onClick={() => router.push('/ingredients')}
          />
          <div>
            <h1 className="font-display font-bold text-[28px] sm:text-[30px] text-ink-900 leading-snug">
              {ingredient.name}
            </h1>
            <p className="font-body text-[15px] text-stone-500">
              You buy it from {supplierName}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/ingredients/edit/${ingredient.id}`}>
            <Button variant="secondary" iconLeft={<Pencil className="size-4" strokeWidth={1.75} />}>
              Change it
            </Button>
          </Link>

          <Button
            variant="danger"
            iconLeft={<Trash2 className="size-4" strokeWidth={1.75} />}
            onClick={() => askPermision(ingredient.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 items-start">
        {/* Left Hero Card */}
        <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-6 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col items-center text-center gap-4">
          <div
            className="size-[96px] rounded-full flex items-center justify-center shadow-xs"
            style={{ backgroundColor: catDef.bg, color: catDef.color }}
          >
            <Icon className="size-[44px]" strokeWidth={1.75} />
          </div>

          <div>
            <h2 className="font-display font-bold text-[20px] text-ink-900">
              {ingredient.name}
            </h2>
            <div className="mt-2">
              <CategoryChip category={ingredient.categoryName || ingredient.category} />
            </div>
          </div>
        </div>

        {/* Right Details Stack */}
        <div className="flex flex-col gap-4">
          {/* 3 Stat Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatTile
              label="What it costs you"
              value={`€${formatPrice(numPrice)}`}
              unit={`/ ${displayUnit}`}
            />
            <StatTile
              label="You buy it in"
              value={String(ingredient.quantity || 1)}
              unit={ingredient.unit || 'kg'}
            />
            <StatTile
              label="How often"
              value={Number(ingredient.usage || 0) > 15 ? 'Most days' : Number(ingredient.usage || 0) > 8 ? 'Weekly' : 'Sometimes'}
            />
          </div>

          {/* Data Rows Card */}
          <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-4 sm:px-5 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col">
            <DataRow
              title="Who you buy it from"
              subtitle={supplierName}
              thumb={<CategoryThumbnail category="Other" size={32} />}
            />
            <DataRow
              title="Measured in"
              subtitle={ingredient.unit || 'grams'}
              thumb={<CategoryThumbnail category={ingredient.categoryName || ingredient.category} size={32} />}
            />
            <DataRow
              title="Catalog category"
              subtitle={catDef.name}
              thumb={<CategoryThumbnail category={ingredient.categoryName || ingredient.category} size={32} />}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && isDeleteActive && (
        <Modal isOpen={isModalOpen} onClose={closeModal} type="delete">
          <DeleteConfirmationModal
            onDelete={handleDelete}
            onClose={closeModal}
            id={ingredient.id}
            itemType="ingredient"
          />
        </Modal>
      )}
    </div>
  );
}
