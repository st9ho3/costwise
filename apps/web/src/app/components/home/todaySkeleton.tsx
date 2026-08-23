import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function TodayViewSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* Header + stat line */}
      <div className="flex flex-col gap-2 pb-2">
        <Skeleton className="h-10 w-72 sm:w-96" />
        <Skeleton className="h-5 w-80 sm:w-[420px]" />

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Recently touched dishes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="bg-white border border-[#EFE8DA] rounded-[18px] p-2 sm:px-4 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 py-3 border-b border-[#EFE8DA] last:border-b-0"
            >
              <Skeleton circle className="size-9 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-4 w-14 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
