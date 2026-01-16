"use client"
import React from 'react'
import { Home, ChefHat, Leaf, User, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/app/stores/uiStore'

const TabBar = () => {
  const pathname = usePathname()
  const openModal = useUIStore((state) => state.openModal)
  const openProfile = useUIStore((state) => state.openProfile)

  const isActive = (path: string) => pathname === path

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 md:hidden'>
      {/* Drop Shadow Container */}
      <div className="relative w-full h-[80px] filter drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        
        {/* Main Bar with Cutout Mask */}
        <div 
          className="absolute inset-0 bg-white flex items-center justify-between px-2 pb-2"
          style={{
            maskImage: 'radial-gradient(circle at 50% 0px, transparent 35px, black 36px)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 0px, transparent 35px, black 36px)',
          }}
        >
          {/* Home */}
          <Link 
            href="/" 
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors ${
              isActive('/') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} fill={isActive('/') ? "currentColor" : "none"} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Recipes */}
          <Link 
            href="/recipes" 
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors ${
              isActive('/recipes') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ChefHat size={24} strokeWidth={isActive('/recipes') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Recipes</span>
          </Link>

          {/* Spacer for FAB */}
          <div className="w-20 shrink-0" />

          {/* Ingredients */}
          <Link 
            href="/ingredients" 
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors ${
              isActive('/ingredients') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Leaf size={24} strokeWidth={isActive('/ingredients') ? 2.5 : 2} fill={isActive('/ingredients') ? "currentColor" : "none"} />
            <span className="text-[10px] font-medium">Ingredients</span>
          </Link>

          {/* Profile */}
          <button 
            onClick={openProfile}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full pt-3 transition-colors ${
              pathname === '/profile' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User size={24} strokeWidth={2} fill={pathname === '/profile' ? "currentColor" : "none"} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>

        {/* Floating Action Button */}
        <div className="absolute left-1/2 -top-7 -translate-x-1/2">
            <button 
                onClick={() => openModal('create')}
                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all"
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>
        </div>
      </div>
    </div>
  )
}

export default TabBar