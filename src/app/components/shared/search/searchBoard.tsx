// src/components/SearchBoard.tsx
"use client"

import React, { useEffect, useRef } from 'react'
import useSearch from '@/app/hooks/useSearch'
import SearchBar from './searchBar'
import SearchResultsBoard from './searchResultsBoard'

interface SearchBoardProps {
  isMobile?: boolean;
}

const SearchBoard = ({ isMobile = false }: SearchBoardProps) => {
  const { searchTerm, handleSearch, results, resultsBoardOpen, loading, handleClose, clearSearch } = useSearch()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // On mobile, we might not want click-outside to close if it's a full page experience
      if (!isMobile && searchRef.current && !searchRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClose, isMobile])

  return (
   
    <div className={`flex flex-col items-center ${isMobile ? 'w-full h-full' : 'relative md:relative md:w-full md:max-w-2xl md:z-50'}`} ref={searchRef}>
      <SearchBar
        searchTerm={searchTerm}
        onChange={handleSearch}
        onClear={clearSearch}
      />
      
      {resultsBoardOpen && (
        <SearchResultsBoard
          onClose={handleClose}
          loading={loading}
          results={results}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

export default SearchBoard