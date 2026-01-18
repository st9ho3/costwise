import React from 'react'
import SearchBoard from '../searchBoard'

const MobileSearchBoard = () => {
    const mobileSearch = false
    if (!mobileSearch) {
        return
    } 
  return (
    <div className='flex flex-col w-full h-full bg-white z-2 absolute md:hidden'>
        <SearchBoard isMobile={true} />
        </div>
    
  )
}

export default MobileSearchBoard