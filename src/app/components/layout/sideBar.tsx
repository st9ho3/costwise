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
import UserProfile from '../shared/profileModal';
import { useUIStore } from '@/app/stores/uiStore';
import { useFileStore } from '@/app/stores/fileStore';

function SidebarLink({
  icon: Icon,
  text,
  isCollapsed,
  href,
}: {
  icon: LucideIcon;
  text: string;
  isCollapsed: boolean;
  href: string;
}) {
  const openModal = useUIStore((state) => state.openModal)


  // Use a conditional to render either a Link or a div that opens a modal
  if (href !== 'create' && href !== 'profile') {
    return (
      <Link
        href={href}
        className="flex relative group items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group"
      >
        <Icon className="w-6 h-6 stroke-1 shrink-0" />
        <span
          className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
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
      onClick={() => openModal('create')}
      className="flex relative group items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group cursor-pointer"
    >
      <Icon className="w-6 h-6 stroke-1 shrink-0" />
      <span
        className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
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
  const closeModal = useUIStore((state) => state.closeModal)
  const isProfileOpen = useUIStore((state) => state.isProfileOpen)
  const resetFile = useFileStore((state) => state.reset)
  const {data} = useSession()
  

  return (
    <>
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col justify-between p-2 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-15' : 'w-40' // Adjusted width for better spacing
        }`}
      >
        {/* Top navigation links */}
        <nav className="flex flex-col space-y-2">

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
        isOpen={isModalOpen}
        onClose={() => {
          closeModal()
          resetFile()
        }}
      >
        {modalType.type === 'create' 
        && <OptionsModal />
        }
      </Modal>

      {isProfileOpen && <UserProfile name={data?.user?.name || "Unknown name"} email={data?.user?.email || "Unknown email"} avatar={data?.user?.image} />}
    </>
  );
}