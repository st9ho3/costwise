'use client';

import React from 'react';
import { LogOut, CircleUserRound } from 'lucide-react';
import { authClient } from '@/app/lib/authClient';
import { Avatar } from '../ui/avatar';

interface UserProfileProps {
  name: string;
  email: string;
  avatar?: string | null;
}

const UserProfile = ({ name, email, avatar }: UserProfileProps) => {
  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      {/* Identity Section */}
      <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
        <Avatar name={name} src={avatar} size="xl" className="mb-3.5 shadow-sm" />
        <h3 className="font-display font-bold text-[20px] text-ink-900 leading-snug">
          {name || 'Account'}
        </h3>
        <span className="mt-1 px-3 py-0.5 rounded-full bg-cream-100 border border-[#EFE8DA] text-[12px] font-medium text-stone-600 truncate max-w-[240px]">
          {email}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#EFE8DA] my-2" />

      {/* Actions */}
      <div className="flex flex-col gap-1 w-full p-1">
        <button
          type="button"
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-full text-[15px] font-semibold text-ink-700 hover:bg-cream-100 hover:text-ink-900 transition-colors cursor-pointer"
        >
          <CircleUserRound className="size-5 text-stone-500 shrink-0" strokeWidth={1.75} />
          <span>Your details</span>
        </button>

        <button
          type="button"
          onClick={async () => {
            await authClient.signOut();
            window.location.href = '/signin';
          }}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-full text-[15px] font-semibold text-tomato-700 hover:bg-tomato-100 transition-colors cursor-pointer"
        >
          <LogOut className="size-5 text-tomato-600 shrink-0" strokeWidth={1.75} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;