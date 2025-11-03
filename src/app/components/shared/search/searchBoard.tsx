"use client"
import React, { useEffect, useRef } from 'react'
import useSearch from '@/app/hooks/useSearch'
import SearchBar from './searchBar'
import SearchResultsBoard from './searchResultsBoard'


const SearchBoard = () => {

  const {searchTerm, handleSearch, results, resultsBoardOpen, loading, handleClose} = useSearch()
const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
          
          if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
              handleClose()
      }}

      document.addEventListener('mousedown', handleClickOutside)
      
      return () => {
          document.removeEventListener('mousedown', handleClickOutside)
      }
  }, [])

  return (
    <div className='relative' ref={searchRef}>
      <SearchBar
      searchTerm={searchTerm}
      onChange={handleSearch}
       />
      {
        resultsBoardOpen &&
        <SearchResultsBoard
        onClose={handleClose}
        loading={loading}
        results={results}
        
      />
      }
      
     
    </div>
  )
}

export default SearchBoard
