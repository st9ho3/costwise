'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  Plus,
  Utensils,
  Carrot,
  Truck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import OptionsModal from '../shared/optionsModal';
import Modal from '../shared/modal';
import { useUIStore } from '@/app/stores/uiStore';
import { useFileStore } from '@/app/stores/fileStore';
import { cn } from '@/app/utils/cn';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isCreate?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Today', href: '/', icon: House },
  { name: 'Add something', href: '#create', icon: Plus, isCreate: true },
  { name: 'Dishes', href: '/recipes', icon: Utensils },
  { name: 'Ingredients', href: '/ingredients', icon: Carrot },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const modalType = useUIStore((state) => state.modalType);
  const openModal = useUIStore((state) => state.openModal);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const reset = useUIStore((state) => state.reset);
  const resetFile = useFileStore((state) => state.reset);

  const isActive = (item: NavItem) => {
    if (item.isCreate) return false;
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-ink-900/40 backdrop-blur-[3px] z-40 lg:hidden animate-in fade-in-0 duration-200"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[260px] bg-cream-50 z-50 p-4 border-r border-[#EFE8DA] shadow-xl transition-transform duration-300 ease-out lg:hidden flex flex-col justify-between",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo-mark-transparent.png"
                alt="Costwise"
                width={26}
                height={26}
                className="shrink-0"
              />
              <span className="font-logotype font-extrabold text-[22px] text-green-800 tracking-[-0.015em]">
                Costwise
              </span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-1 text-stone-500 hover:text-ink-900 rounded-lg hover:bg-cream-100 transition-colors"
            >
              <PanelLeftClose className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              if (item.isCreate) {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      openModal('create');
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 min-h-[42px] px-3 rounded-[12px] text-[15px] font-semibold text-ink-700 hover:bg-cream-100 hover:text-ink-900 transition-all duration-140 cursor-pointer text-left"
                  >
                    <Icon className="size-5 shrink-0 text-ink-700" />
                    <span>{item.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center gap-3 min-h-[42px] px-3 rounded-[12px] text-[15px] font-semibold transition-all duration-140",
                    active
                      ? "bg-green-50 text-green-800 font-bold"
                      : "text-ink-700 hover:bg-cream-100 hover:text-ink-900"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", active ? "text-green-800" : "text-ink-700")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col justify-between bg-cream-50 border-r border-[#EFE8DA] p-3 transition-all duration-200 ease-out shrink-0 select-none z-20",
          sidebarCollapsed ? "w-[64px]" : "w-[248px]"
        )}
      >
        <div className="flex flex-col gap-5">
          {/* Top Logo Lockup */}
          <div
            className={cn(
              "flex items-center gap-2.5 transition-all overflow-hidden",
              sidebarCollapsed ? "justify-center py-2" : "px-2 pt-2 pb-1"
            )}
          >
            <img
              src="/images/logo-mark-transparent.png"
              alt="Costwise"
              width={26}
              height={26}
              className="shrink-0"
            />
            {!sidebarCollapsed && (
              <span className="font-logotype font-extrabold text-[22px] text-green-800 tracking-[-0.015em] whitespace-nowrap">
                Costwise
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              if (item.isCreate) {
                return (
                  <button
                    key={item.name}
                    type="button"
                    title={sidebarCollapsed ? item.name : undefined}
                    onClick={() => openModal('create')}
                    className={cn(
                      "flex items-center rounded-[12px] text-[15px] font-semibold text-ink-700 hover:bg-cream-100 hover:text-ink-900 transition-all duration-140 cursor-pointer",
                      sidebarCollapsed
                        ? "size-[44px] justify-center mx-auto"
                        : "gap-3 min-h-[42px] px-3 w-full text-left"
                    )}
                  >
                    <Icon className="size-5 shrink-0 text-ink-700" />
                    {!sidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center rounded-[12px] text-[15px] font-semibold transition-all duration-140",
                    sidebarCollapsed
                      ? "size-[44px] justify-center mx-auto"
                      : "gap-3 min-h-[42px] px-3 w-full",
                    active
                      ? "bg-green-50 text-green-800 font-bold"
                      : "text-ink-700 hover:bg-cream-100 hover:text-ink-900"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", active ? "text-green-800" : "text-ink-700")} />
                  {!sidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Gold Note Card + Collapse Button */}
        <div className="flex flex-col gap-3">
          {!sidebarCollapsed && (
            <div className="rounded-[18px] bg-gold-100 border border-[#F0E3BE] p-3.5 flex flex-col gap-1 text-gold-800">
              <span className="font-bold text-[13px] leading-snug">
                You&apos;ve kept €1,840 this month
              </span>
              <span className="text-[12px] opacity-80 leading-normal">
                Mostly by fixing three dish prices.
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Tuck it away"}
            className={cn(
              "flex items-center rounded-[12px] text-[14px] font-semibold text-stone-500 hover:text-ink-900 hover:bg-cream-100 transition-colors p-2 cursor-pointer",
              sidebarCollapsed ? "justify-center" : "gap-2.5 px-3"
            )}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-5 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="size-5 shrink-0" />
                <span className="whitespace-nowrap">Tuck it away</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Modal for 'create' action */}
      <Modal
        type="create"
        isOpen={isModalOpen && modalType.type === 'create'}
        onClose={() => {
          reset();
          resetFile();
        }}
      >
        <OptionsModal />
      </Modal>
    </>
  );
}