"use client"
import React from 'react'
import useSearch from '@/app/hooks/useSearch'
import SearchBar from './searchBar'
import SearchResultsBoard from './searchResultsBoard'


const SearchBoard = () => {

  const {searchTerm, handleSearch, results} = useSearch() 

  return (
    <div>
      <SearchBar
      searchTerm={searchTerm}
      onChange={handleSearch}
       />
  <SearchResultsBoard
  results={results}
   />
    </div>
  )
}

export default SearchBoard
