// src/components/shared/UserProfile.tsx

"use client"
import React from 'react';
import { LogOut, CircleUserRound, User } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const UserProfile = ({ name, email, avatar }: {name: string, email: string, avatar: string | null | undefined}) => {
  
  return (
    // CONTAINER:
    // 1. rounded-[28px]: Matches the large rounded surface style
    // 2. shadow-xl: Gives it elevation above the rest of the UI
    <div className="w-80 bg-white rounded-[28px] shadow-xl border border-gray-100 overflow-hidden flex flex-col p-2">
      
      {/* SECTION 1: IDENTITY (Centered Top) */}
      <div className="flex flex-col items-center justify-center pt-6 pb-4">
        {/* Avatar Container with Ring */}
        <div className="relative w-20 h-20 mb-3 rounded-full border-4 border-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
           {avatar ? (
             <Image 
               src={avatar} 
               alt='Profile Avatar' 
               fill 
               className="object-cover"
               sizes="80px"
             /> 
           ) : (
             <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <CircleUserRound className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
             </div>
           )}
        </div>

        {/* Text Info */}
        <div className="text-center px-4">
          <p className="text-lg font-bold text-gray-900 truncate tracking-tight">
            {name || "User"}
          </p>
          <p className="text-xs font-medium text-gray-500 truncate mt-0.5 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
            {email}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100 my-1" />

      {/* SECTION 2: ACTIONS (Menu List) */}
      <div className="flex flex-col gap-1 p-2">
        
        {/* User Details Button */}
        <button
          className="
            group flex items-center w-full px-4 h-12 
            rounded-full 
            text-sm font-medium text-gray-700 
            hover:bg-gray-100 hover:text-gray-900 
            transition-all duration-200
          "
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-blue-600 mr-3 transition-colors">
             <User className="w-4 h-4" strokeWidth={2.5} />
          </div>
          Account Details
        </button>

        {/* Sign Out Button (Destructive Styling) */}
        <button
          onClick={() => signOut()}
          className="
            group flex items-center w-full px-4 h-12 
            rounded-full 
            text-sm font-medium text-red-600 
            hover:bg-red-50 
            transition-all duration-200
          "
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 group-hover:bg-red-100 group-hover:text-red-600 mr-3 transition-colors">
             <LogOut className="w-4 h-4" strokeWidth={2.5} />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;