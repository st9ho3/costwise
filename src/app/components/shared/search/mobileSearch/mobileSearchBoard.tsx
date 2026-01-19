'use client'
import React from 'react'
import SearchBoard from '../searchBoard'
import { useUIStore } from '@/app/stores/uiStore'
import { X } from 'lucide-react'

const MobileSearchBoard = () => {
  const mobileSearch = useUIStore((state) => state.isMobileSearchOpen)
  const onClose = useUIStore((state) => state.closeMobileSearch)

    if (!mobileSearch) {
        return
    } 
  return (
    <div className='flex flex-col w-full h-full bg-white z-2 relative md:hidden'>
      <div className='absolute top-1 left-2'>
        <X onClick={onClose}/>
      </div>
      <SearchBoard isMobile={true} />
    </div>
    
  )
}

export default MobileSearchBoard