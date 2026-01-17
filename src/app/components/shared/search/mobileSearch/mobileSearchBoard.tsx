import React from 'react'
import SearchResultsBoard from '../searchResultsBoard'
import SearchBoard from '../searchBoard'

const MobileSearchBoard = () => {
    const mobileSearch = true
    if (!mobileSearch) {
        return
    } 
  return (
    <div className='flex flex-col w-full h-full bg-white z-2 absolute'>
        <SearchBoard isMobile={true} />
        </div>
    
  )
}

export default MobileSearchBoard