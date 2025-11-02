import { Search } from 'lucide-react'
import React from 'react'

interface SearchBarProps {
  searchTerm: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar = ({searchTerm, onChange}: SearchBarProps) => {

  return (
    <div className='flex mr-3 w-80 border-b-1'>
      <Search className='mr-2' color='gray' size={20} />
      <input 
      className='focus:outline-none w-full text-gray-500' 
      value={searchTerm} 
      onChange={onChange} 
      type="text" 
      placeholder='Search...' />
    </div>
  )
}

export default SearchBar
