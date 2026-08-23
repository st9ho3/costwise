import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function RecipesTableSkeleton({ rowCount = 7 }: { rowCount?: number }) {
  return (
    <div className="w-full">
      {/* Mobile Card Feed Skeleton */}
      <div className="md:hidden flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[18px] border border-[#EFE8DA] p-4 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton circle className="size-9 shrink-0" />
                <Skeleton className="h-5 w-36" />
              </div>
              <Skeleton className="size-8 rounded-full" />
            </div>
            <div className="h-px bg-[#EFE8DA]" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-18" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block w-full bg-white rounded-[18px] border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)] overflow-hidden">
        <div className="h-[44px] bg-cream-100/70 border-b border-[#EFE8DA] px-5 flex items-center">
          <div className="w-[32%]"><Skeleton className="h-3.5 w-16" /></div>
          <div className="w-[11%] pl-4"><Skeleton className="h-3.5 w-10" /></div>
          <div className="w-[15%] pl-4"><Skeleton className="h-3.5 w-20" /></div>
          <div className="w-[16%] pl-4"><Skeleton className="h-3.5 w-24" /></div>
          <div className="w-[15%] pl-4"><Skeleton className="h-3.5 w-18" /></div>
          <div className="w-[11%] text-right pr-2"><Skeleton className="h-3.5 w-14 ml-auto" /></div>
        </div>

        <div className="divide-y divide-[#EFE8DA]">
          {Array.from({ length: rowCount }).map((_, i) => (
            <div key={i} className="h-[56px] px-5 flex items-center">
              <div className="w-[32%] flex items-center gap-3">
                <Skeleton circle className="size-9 shrink-0" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="w-[11%] pl-4">
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="w-[15%] pl-4">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="w-[16%] pl-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="w-[15%] pl-4">
                <Skeleton className="h-4 w-14" />
              </div>
              <div className="w-[11%] flex justify-end pr-2">
                <Skeleton className="size-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecipesPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Table Skeleton */}
      <RecipesTableSkeleton rowCount={8} />

      {/* Pagination Skeleton */}
      <div className="mt-auto flex justify-center">
        <Skeleton className="h-9 w-44 rounded-full" />
      </div>
    </div>
  );
}

export default RecipesPageSkeleton;
