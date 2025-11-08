"use client"
import React from 'react'
import { Bell } from 'lucide-react'
import { Session } from 'next-auth'
import NotificationsNumber from '../shared/notificationsNumber'
import SearchBoard from '../shared/search/searchBoard'

const Header = ({session}: {session: Session}) => {

  
  return (
    <header className="flex items-center justify-between p-2 border-b border-gray-200">
      <div>
        
      </div>
      <div className="flex items-center">
        <div className='mr-4'>
          <SearchBoard />
        </div>
        <div className='relative cursor-pointer mr-4'>
          <Bell color='gray' size={20} />
          <NotificationsNumber />
        </div>
        
        <span className="text-gray-600 mr-4">
          Hello, {session?.user?.email} 
        </span>
      </div>
    </header>
  )
}

export default Header
