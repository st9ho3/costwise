"use client"
import React from 'react'
import useSearch from '@/app/hooks/useSearch'
import SearchBar from './searchBar'
import SearchResultsBoard from './searchResultsBoard'


const SearchBoard = () => {

  const {searchTerm, handleSearch, results, resultsBoardOpen} = useSearch()
  

  return (
    <div className='relative'>
      <SearchBar
      searchTerm={searchTerm}
      onChange={handleSearch}
       />
      {
      resultsBoardOpen &&
      <SearchResultsBoard
        results={results}
      />
      }
     
    </div>
  )
}

export default SearchBoard
