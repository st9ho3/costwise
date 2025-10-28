import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = () => {
  return (
    <div className='flex mr-3 w-80 border-b-1'>
      <Search className='mr-2' color='gray' size={20} />
      <input className='focus:outline-none w-full text-gray-500' type="text" placeholder='Search...' />
    </div>
  )
}

export default SearchBar
