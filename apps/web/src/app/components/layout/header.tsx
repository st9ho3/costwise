'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Session } from '@/app/lib/serverSession';
import SearchBoard from '../shared/search/searchBoard';
import { useUIStore } from '@/app/stores/uiStore';
import UserProfile from '../shared/profileModal';
import Modal from '../shared/modal';
import { Avatar } from '../ui/avatar';

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const isProfileOpen = useUIStore((state) => state.isProfileOpen);
  const openProfile = useUIStore((state) => state.openProfile);
  const reset = useUIStore((state) => state.reset);

  const userName = session?.user?.name || 'Account';
  const userEmail = session?.user?.email || '';

  return (
    <>
      <header className="sticky top-0 z-30 w-full h-[60px] px-4 sm:px-6 flex items-center justify-between bg-cream-50/80 backdrop-blur-[8px] border-b border-[#EFE8DA] transition-all select-none">
        {/* LEFT: Mobile Menu Button & Search Trigger */}
        <div className="flex items-center gap-3 flex-1 max-w-[480px]">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="p-1.5 rounded-lg text-ink-700 hover:bg-cream-100 hover:text-ink-900 lg:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Desktop & Mobile Search Dropdown Container */}
          <div className="flex-1 w-full">
            <SearchBoard />
          </div>
        </div>

        {/* RIGHT: Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative size-[36px] rounded-full flex items-center justify-center text-ink-700 hover:bg-cream-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" strokeWidth={1.75} />
            <span className="absolute top-1.5 right-1.5 min-w-[8px] h-[8px] rounded-full bg-tomato-600 ring-2 ring-cream-50" />
          </button>

          {/* Divider */}
          <div className="h-[24px] w-px bg-[#EFE8DA] hidden sm:block" />

          {/* Account Chip */}
          <button
            type="button"
            onClick={openProfile}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-cream-100 transition-colors cursor-pointer text-left group"
          >
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="font-semibold text-[13px] text-ink-900 group-hover:text-green-800 transition-colors truncate max-w-[130px]">
                {userName}
              </span>
              <span className="text-[11px] text-stone-500 truncate max-w-[130px]">
                {userEmail}
              </span>
            </div>
            <Avatar name={userName} src={session?.user?.image} size="sm" />
          </button>
        </div>
      </header>

      {/* User Profile Modal */}
      {isProfileOpen && (
        <Modal isOpen={isModalOpen} onClose={reset}>
          <UserProfile
            name={userName}
            email={userEmail}
            avatar={session?.user?.image}
          />
        </Modal>
      )}
    </>
  );
}