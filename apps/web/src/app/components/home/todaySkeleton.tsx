import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function TodayViewSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* 1. Header Row + Stat Line + Cleared Counter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-72 sm:w-96" />
          <Skeleton className="h-5 w-80 sm:w-[480px]" />

          {/* Stat line */}
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Progress Card */}
        <div className="w-full md:w-[220px] bg-white rounded-[16px] border border-[#EFE8DA] p-3.5 flex flex-col gap-2 shadow-xs shrink-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* 2. Decision Queue Cards */}
      <div className="flex flex-col gap-4">
        {/* Card 1 (Accent) */}
        <div className="rounded-[18px] p-5 sm:p-6 bg-gold-100/70 border border-[#F0E3BE] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton circle className="size-7" />
              <Skeleton className="h-3.5 w-36" />
            </div>
            <Skeleton className="h-3.5 w-28" />
          </div>
          <Skeleton className="h-7 w-64 sm:w-80" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-[12px] bg-white/70 border border-[#F0E3BE]">
            <div className="flex flex-col gap-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-5 w-20" /></div>
            <div className="flex flex-col gap-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-5 w-20" /></div>
            <div className="flex flex-col gap-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-5 w-20" /></div>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </div>

        {/* Card 2 (Standard) */}
        <div className="rounded-[18px] p-5 sm:p-6 bg-white border border-[#EFE8DA] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton circle className="size-7" />
              <Skeleton className="h-3.5 w-32" />
            </div>
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <div className="flex items-center gap-2.5 pt-2">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>

        {/* Card 3 (Standard) */}
        <div className="rounded-[18px] p-5 sm:p-6 bg-white border border-[#EFE8DA] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton circle className="size-7" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-3.5 w-20" />
          </div>
          <Skeleton className="h-7 w-60" />
          <Skeleton className="h-4 w-full" />

          <div className="flex items-center gap-2.5 pt-2">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. Last Touched Dishes Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="bg-white rounded-[18px] border border-[#EFE8DA] shadow-xs divide-y divide-[#EFE8DA] overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton circle className="size-9" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

