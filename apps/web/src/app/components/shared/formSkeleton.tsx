import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function FormPageSkeleton({
  titleWidth = 'w-56',
  maxWidth = 'max-w-[760px]',
}: {
  titleWidth?: string;
  maxWidth?: string;
}) {
  return (
    <div className={`flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 ${maxWidth} mx-auto w-full`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-[12px] shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className={`h-8 ${titleWidth}`} />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-[44px] w-full rounded-[12px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-[44px] w-full rounded-[12px]" />
          </div>
        </div>

        <div className="h-px bg-[#EFE8DA]" />

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[44px] w-full rounded-[12px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-[44px] w-full rounded-[12px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-[44px] w-full rounded-[12px]" />
          </div>
        </div>

        <div className="h-px bg-[#EFE8DA]" />

        {/* Action Row */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default FormPageSkeleton;
