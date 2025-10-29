"use client"
import React from 'react'
import Image from 'next/image'
import { Bell, CircleUserRound } from 'lucide-react'
import { Session } from 'next-auth'
import NotificationsNumber from '../shared/notificationsNumber'
import SearchBar from '../shared/searchBar'
import { useUIStore } from '@/app/stores/uiStore'

const Header = ({session}: {session: Session}) => {

  const openProfile = useUIStore((state) => state.openProfile)
  
  return (
    <header className="flex items-center justify-between p-2 border-b border-gray-200">
      <div>
        
      </div>
      <div className="flex items-center">
        <div className='mr-4'>
          <SearchBar />
        </div>
        <div className='relative cursor-pointer mr-4'>
          <Bell color='gray' size={20} />
          <NotificationsNumber />
        </div>
        
        <span className="text-gray-600 mr-4">
          Hello, {session?.user?.email} 
        </span>
        {session.user?.image 
          ? <Image onClick={() => openProfile()}
            alt='profile pic'
            src={session?.user?.image}
            width={30}
            height={30}
            className='rounded-full cursor-pointer'
          /> 
          : <CircleUserRound onClick={() => openProfile()}
            className="w-9 h-9 text-gray-300"
            strokeWidth={1.5}
          />
        } 
      </div>
    </header>
  )
}

export default Header
