import React from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';

export function IngredientDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[900px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-[12px] shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-28 rounded-[12px]" />
          <Skeleton className="h-10 w-24 rounded-[12px]" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 items-start">
        {/* Left Hero Card */}
        <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-6 shadow-xs flex flex-col items-center text-center gap-4">
          <Skeleton circle className="size-[96px]" />

          <div className="flex flex-col items-center gap-2 w-full">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="w-full h-px bg-[#EFE8DA]" />

          <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>

          <Skeleton className="h-6 w-32 rounded-full mt-1" />
        </div>

        {/* Right Details Card & Metrics */}
        <div className="flex flex-col gap-5">
          {/* Stat Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[18px] border border-[#EFE8DA] p-4 shadow-xs flex flex-col gap-2"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>

          {/* Supplier Info Card */}
          <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-5 shadow-xs flex flex-col gap-4">
            <Skeleton className="h-5 w-44" />
            <div className="divide-y divide-[#EFE8DA]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton circle className="size-8" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientDetailSkeleton;
