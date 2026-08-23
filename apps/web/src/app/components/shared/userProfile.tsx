import { useUIStore } from '@/app/stores/uiStore'
import { CircleUserRound } from 'lucide-react'
import { Session } from 'next-auth'
import Image from 'next/image'
import React from 'react'

const Profile = ({session}: {session: Session}) => {

      const openProfile = useUIStore((state) => state.openProfile)

  return (
    <div className='ml-1'>
      {session.user?.image 
          ? <div onClick={() => openProfile()} className='h-10 w-10 rounded-full 
            bg-blue-600 text-white 
            flex items-center justify-center 
            text-sm font-medium shadow-sm ring-2 ring-white
            transition-transform duration-200 group-hover:scale-105'>
            <Image 
            alt='profile pic'
            src={session?.user?.image}
            width={50}
            height={50}
            className='rounded-full '
            />
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
