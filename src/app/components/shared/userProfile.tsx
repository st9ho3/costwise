import { useUIStore } from '@/app/stores/uiStore'
import { CircleUserRound } from 'lucide-react'
import { Session } from 'next-auth'
import Image from 'next/image'
import React from 'react'

const Profile = ({session, isCollapsed}: {session: Session, isCollapsed: boolean}) => {

      const openProfile = useUIStore((state) => state.openProfile)

  return (
    <div className='ml-1'>
      {session.user?.image 
          ? <div onClick={() => openProfile()} className='flex items-center gap-1 border-b pb-1.5 mb-2 cursor-pointer border-gray-200 text-sm text-gray-600'>
            <Image 
            alt='profile pic'
            src={session?.user?.image}
            width={30}
            height={30}
            className='rounded-full '
            />
            
            <span className={`whitespace-nowrap transition-opacity  duration-200 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Hello, there</span>
            <span className={`whitespace-nowrap transition-opacity text-xl duration-200 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'}`}>👋</span>
          </div>
          :
          <div>
             <CircleUserRound onClick={() => openProfile()}
            className="w-9 h-9 text-gray-300"
            strokeWidth={1.5}
            />
            <span>Panos</span>
          </div>
          
        } 
    </div>
  )
}

export default Profile
