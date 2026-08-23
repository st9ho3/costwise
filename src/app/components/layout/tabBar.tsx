"use client";

import React from 'react';
import { House, Utensils, Carrot, Truck, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/app/stores/uiStore';
import { cn } from '@/app/utils/cn';

const TabBar = () => {
  const pathname = usePathname();
  const openModal = useUIStore((state) => state.openModal);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden select-none">
      {/* Drop Shadow Container */}
      <div className="relative w-full h-[82px] filter drop-shadow-[0_-4px_10px_rgba(27,26,22,0.06)]">
        {/* Main Bar with Cutout Mask */}
        <div
          className="absolute inset-0 bg-white flex items-center justify-between px-2 pb-1"
          style={{
            maskImage: 'radial-gradient(circle at 50% 0px, transparent 35px, black 36px)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 0px, transparent 35px, black 36px)',
          }}
        >
          {/* Today */}
          <Link
            href="/"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors",
              isActive('/') ? "text-green-800" : "text-sand-400 hover:text-ink-700"
            )}
          >
            <House size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-bold tracking-tight">Today</span>
          </Link>

          {/* Dishes */}
          <Link
            href="/recipes"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors",
              isActive('/recipes') ? "text-green-800" : "text-sand-400 hover:text-ink-700"
            )}
          >
            <Utensils size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-bold tracking-tight">Dishes</span>
          </Link>

          {/* Spacer for FAB */}
          <div className="w-20 shrink-0" />

          {/* Ingredients */}
          <Link
            href="/ingredients"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors",
              isActive('/ingredients') ? "text-green-800" : "text-sand-400 hover:text-ink-700"
            )}
          >
            <Carrot size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-bold tracking-tight">Ingredients</span>
          </Link>

          {/* Suppliers */}
          <Link
            href="/suppliers"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors",
              isActive('/suppliers') ? "text-green-800" : "text-sand-400 hover:text-ink-700"
            )}
          >
            <Truck size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-bold tracking-tight">Suppliers</span>
          </Link>
        </div>

        {/* Floating Action Button (FAB) */}
        <div className="absolute left-1/2 -top-7 -translate-x-1/2">
          <button
            type="button"
            onClick={() => openModal('create')}
            className="size-[56px] rounded-full bg-green-800 text-cream-50 flex items-center justify-center shadow-[0_8px_24px_-10px_rgba(27,74,44,0.5)] hover:bg-green-700 active:scale-95 transition-all cursor-pointer"
            aria-label="Add something"
          >
            <Plus size={26} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabBar;