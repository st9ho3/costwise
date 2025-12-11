// src/components/Header.tsx
"use client"
import React from 'react'
import { Bell, Menu } from 'lucide-react'
import { Session } from 'next-auth'
import NotificationsNumber from '../shared/notificationsNumber'
import SearchBoard from '../shared/search/searchBoard'

const Header = ({ session }: { session: Session }) => {
  // Safe fallback for user initials
  const userInitial = session?.user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header 
      className="
        sticky top-0 z-40 w-full
        flex items-center justify-between 
        px-6 py-3 h-20
        bg-white/95 backdrop-blur-sm
        border-b border-gray-100
      "
    >
      {/* LEFT: Logo or Menu Trigger (Placeholder) */}
      <div className="flex items-center gap-4 w-60">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 lg:hidden">
          <Menu size={24} />
        </button>
        {/* You can replace this text with your Logo Image */}
        <span className="text-xl font-semibold text-gray-700 tracking-tight hidden sm:block">
          Dashboard
        </span>
      </div>

      {/* CENTER: Search Bar (Takes prominent space) */}
      <div className="flex-1 flex justify-center px-4">
        <SearchBoard />
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center justify-end gap-3 w-60">
        
        {/* Notifications Icon Button */}
        <button className="relative group p-2.5 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="text-gray-500 group-hover:text-gray-700" size={22} strokeWidth={2} />
          {/* Positioning the badge absolutely within the button */}
          <div className="absolute top-2 right-2">
            <NotificationsNumber />
          </div>
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer group">
          
          {/* User Info (Hidden on mobile for cleanliness) */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Account
            </span>
            <span className="text-xs text-gray-400 max-w-[120px] truncate">
              {session?.user?.email}
            </span>
          </div>

          {/* Avatar / Circle */}
          <div className="
            h-10 w-10 rounded-full 
            bg-blue-600 text-white 
            flex items-center justify-center 
            text-sm font-medium shadow-sm ring-2 ring-white
            transition-transform duration-200 group-hover:scale-105
          ">
            {session?.user?.image ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img 
                 src={session.user.image} 
                 alt="Profile" 
                 className="h-full w-full rounded-full object-cover" 
               />
            ) : (
               <span>{userInitial}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header