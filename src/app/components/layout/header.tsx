"use client"
import React from 'react'
import Image from 'next/image'
import { Bell, CircleUserRound } from 'lucide-react'
import { useHomeContext } from '@/app/context/homeContext/homeContext'
import { Session } from 'next-auth'
import NotificationsNumber from '../shared/notificationsNumber'

const Header = ({session}: {session: Session}) => {

  const {dispatch} = useHomeContext()
  
  return (
    <header className="flex items-center justify-between p-2 border-b border-gray-200">
      <div>
        
      </div>
      <div className="flex items-center">
        <div className='relative cursor-pointer'>
          <Bell color='gray' size={20} />
          <NotificationsNumber />
        </div>
        
        <span className="text-gray-600 mr-2 ml-3">
          Hello, {session?.user?.email} 
        </span>
        {session.user?.image 
          ? <Image onClick={() => {
              dispatch({ type: 'OPEN_PROFILE' });
            }}
            alt='profile pic'
            src={session?.user?.image}
            width={30}
            height={30}
            className='rounded-full cursor-pointer'
          /> 
          : <CircleUserRound onClick={() => {
              dispatch({ type: 'OPEN_PROFILE' });
            }}
            className="w-9 h-9 text-gray-300"
            strokeWidth={1.5}
          />
        } 
      </div>
    </header>
  )
}

export default Header
