import React from 'react'

interface SearchResultsDisplayProps {
    children: React.ReactNode
    title: 'Recipes' | 'Ingredients'
    total: number | undefined
}

const SearchResultsDisplay = ({children, title, total}: SearchResultsDisplayProps) => {
  return (
    <div className='p-3 border-b border-b-gray-100'>
        <div className='text-gray-400 text-sm'>
            {title} <span className='text-xs'>({total})</span>
        </div>
        <div className='py-2'>
            {children}
        </div>
      </div>
  )
}

export default SearchResultsDisplay
