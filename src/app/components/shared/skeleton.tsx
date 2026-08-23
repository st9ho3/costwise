import React from 'react';
import { Skeleton } from '../ui/skeleton';

export { Skeleton };
export { IngredientsTableSkeleton, IngredientsPageSkeleton } from '../ingredients/ingredientsSkeleton';
export { RecipesTableSkeleton, RecipesPageSkeleton } from '../recipes/recipesSkeleton';
export { SuppliersTableSkeleton, SuppliersPageSkeleton } from '../suppliers/suppliersSkeleton';
export { TodayViewSkeleton } from '../home/todaySkeleton';
export { IngredientDetailSkeleton } from '../ingredients/ingredientPage/ingredientDetailSkeleton';
export { FormPageSkeleton } from './formSkeleton';

export const TableSkeleton = ({ rowCount = 6 }: { rowCount?: number }) => {
  return (
    <div className="w-full bg-white rounded-[18px] border border-[#EFE8DA] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-cream-100/70 border-b border-[#EFE8DA]">
        <Skeleton className="w-1/4 h-3.5" />
        <Skeleton className="w-1/4 h-3.5" />
        <Skeleton className="w-1/4 h-3.5" />
        <Skeleton className="w-1/4 h-3.5" />
      </div>
      {/* Rows */}
      <div className="divide-y divide-[#EFE8DA]">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center w-1/4 space-x-3">
              <Skeleton circle className="size-9 shrink-0" />
              <Skeleton className="w-3/4 h-4" />
            </div>
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/4 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;