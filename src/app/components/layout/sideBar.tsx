'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import OptionsModal from '../shared/optionsModal';
import {
  Home,
  BookMarked,
  PlusSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Carrot,
  Users
} from 'lucide-react';
import Modal from '../shared/modal';
import { useSession } from 'next-auth/react';
import { useUIStore } from '@/app/stores/uiStore';
import { useFileStore } from '@/app/stores/fileStore';



export function SidebarLink({
  icon: Icon,
  text,
  isCollapsed,
  href,
  onClick,
}: {
  icon: LucideIcon;
  text: string;
  isCollapsed: boolean;
  href: string;
  onClick?: () => void;
}) {
  const openModal = useUIStore((state) => state.openModal)


  // Use a conditional to render either a Link or a div that opens a modal
  if (href !== 'create' && href !== 'profile') {
    return (
        <Link
        href={href}
        onClick={onClick}
      className="flex relative group items-center p-2 text-gray-700 rounded-full hover:bg-gray-100"
      >
        <Icon className="w-5 h-5 stroke-1 shrink-0" />

     <span
          className={`ml-3 whitespace-nowrap text-sm transition-all duration-200 overflow-hidden ${
            isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-3xl'
          }`}
        >
          {text}
        </span>
        
      <span className={`absolute z-100 top-5 left-20  -translate-x-1/2 mb-2 w-max
               scale-0 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white
               transition-all duration-200  ${isCollapsed ? "group-hover:scale-100" : "group-hover:scale-0" }`}>{text}</span>
      </Link>
      
      
      
    );
  }

  return (
    <div
      onClick={() => {
        openModal('create')
        onClick?.()
      }}
      className="flex relative group items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group cursor-pointer"
    >
      <Icon className="w-5 h-5 stroke-1 shrink-0" />
      <span
        className={`ml-3 whitespace-nowrap text-sm transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {text}
      </span>
      <span className={`absolute z-100 top-5 left-20  -translate-x-1/2 mb-2 w-max
               scale-0 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white
               transition-all duration-200  ${isCollapsed ? "group-hover:scale-100" : "group-hover:scale-0" }`}>{text}</span>
    </div>
  );
}

/**
 * Renders a collapsible navigation sidebar.
 */
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isModalOpen = useUIStore((state) => state.isModalOpen)
  const modalType = useUIStore((state) => state.modalType)
  const isProfileOpen = useUIStore((state) => state.isProfileOpen)
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen)
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu)
  const reset = useUIStore((state) => state.reset)
  const resetFile = useFileStore((state) => state.reset)
  const {data} = useSession()
  

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white z-50 p-4 shadow-xl transition-transform duration-300 ease-in-out lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-8">
           <span className="text-xl font-semibold text-gray-800">Menu</span>
           <button onClick={closeMobileMenu} className="p-1 hover:bg-gray-100 rounded-full">
             <PanelLeftClose className="w-6 h-6" />
           </button>
        </div>
        
        <nav className="flex flex-col gap-2">
          <SidebarLink
            icon={Home}
            text="Home"
            isCollapsed={false}
            href="/"
            onClick={closeMobileMenu}
          />
          <SidebarLink
            icon={PlusSquare}
            text="Create"
            isCollapsed={false}
            href="create"
            onClick={closeMobileMenu}
          />
          <SidebarLink
            icon={BookMarked}
            text="Recipes"
            isCollapsed={false}
            href="/recipes"
            onClick={closeMobileMenu}
          />
          <SidebarLink
            icon={Carrot}
            text="Ingredients"
            isCollapsed={false}
            href="/ingredients"
            onClick={closeMobileMenu}
          />
          <SidebarLink
            icon={Users}
            text="Suppliers"
            isCollapsed={false}
            href="/suppliers"
            onClick={closeMobileMenu}
          />
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 justify-between hidden lg:flex flex-col gap-8 p-2 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-15' : 'w-40' // Adjusted width for better spacing
        }`}
      >
        {/* Top navigation links */}
        <nav className="flex flex-col">
          <SidebarLink
            icon={Home}
            text="Home"
            isCollapsed={isCollapsed}
            href="/"
          />
          <SidebarLink
            icon={PlusSquare}
            text="Create"
            isCollapsed={isCollapsed}
            href="create"
          />
          <SidebarLink
            icon={BookMarked}
            text="Recipes"
            isCollapsed={isCollapsed}
            href="/recipes"
          />
          <SidebarLink
            icon={Carrot}
            text="Ingredients"
            isCollapsed={isCollapsed}
            href="/ingredients"
          />
          <SidebarLink
            icon={Users}
            text="Suppliers"
            isCollapsed={isCollapsed}
            href="/suppliers"
          />
        </nav>

        {/* Bottom collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-end p-2 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-6 h-6 stroke-1" />
          ) : (
            <PanelLeftClose className="w-6 h-6 stroke-1" />
          )}
        </button>
      </aside>

      {/* Modal for 'create' action */}
      <Modal
        type='create'
        isOpen={isModalOpen && modalType.type === 'create'} // Added specific check
        onClose={() => {
          reset()
          resetFile()
        }}
      >
        <OptionsModal />
      </Modal>
    </>
  );
}