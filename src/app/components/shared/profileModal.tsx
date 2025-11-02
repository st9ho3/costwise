"use client"
import React from 'react';
import { LogOut, CircleUserRound, X } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useUIStore } from '@/app/stores/uiStore';


const UserProfile = ({ name, email, avatar }: {name: string, email: string, avatar: string | null | undefined}) => {

  const closeProfile = useUIStore((state) => state.closeProfile)
  return (
    <div className=" absolute top-13 right-8 z-50 w-72 font-sans bg-white rounded-xl shadow-lg border border-gray-200/50">
      <X onClick={() => closeProfile()} className='flex justify-self-end m-1 cursor-pointer' />
      <div className="p-2">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors duration-150"
        >
          <LogOut className="w-5 h-5 mr-3" strokeWidth={2} />
          Sign Out
        </button>
      </div>
      
      <hr className="border-gray-200/75" />
      
      <div className="flex items-center p-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-4 border-2 border-gray-100">
           {avatar 
           ? <Image src={avatar} alt='profile avatar' width={90} height={90} /> 
           : <CircleUserRound className="w-full h-full text-gray-300" strokeWidth={1.5} />
          }
           
          
        </div>

        <div className="flex-grow overflow-hidden">
          <p className="font-semibold text-gray-800 truncate">{name}</p>
          <div className="flex items-center">
            <p className="text-sm text-gray-500 truncate">{email}</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;