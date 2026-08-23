"use client";

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '@/app/utils/cn';

interface SortedLinkProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const SortedLink = ({ children, value, className }: SortedLinkProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const orderValue = params.get('sort');
  const direction = params.get('order');
  const isActive = orderValue === value;

  const setSorting = (val: string) => {
    params.delete('page');
    params.set('sort', val);

    if (!direction) {
      params.set('order', 'desc');
    } else {
      if (direction === 'desc' && val === orderValue) {
        params.set('order', 'asc');
      } else {
        params.set('order', 'desc');
      }
    }
    router.push(`${pathName}?${params}`);
  };

  return (
    <button
      type="button"
      onClick={() => setSorting(value)}
      className={cn(
        "inline-flex items-center gap-1 font-bold text-[11px] uppercase tracking-[0.08em] select-none cursor-pointer transition-colors outline-none",
        isActive ? "text-green-800" : "text-stone-500 hover:text-ink-900",
        className
      )}
    >
      <span>{children}</span>
      {isActive && (
        <span className="text-green-700 font-bold text-[13px] leading-none">
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
};

export default SortedLink;
