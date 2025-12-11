// src/components/SearchResultsDisplay.tsx
import React from 'react'

interface SearchResultsDisplayProps {
  children: React.ReactNode
  title: 'Recipes' | 'Ingredients'
  total: number | undefined
}

const SearchResultsDisplay = ({ children, title, total }: SearchResultsDisplayProps) => {
  return (
    <div className='py-2'>
      {/* PADDING UPDATE: px-5 -> px-8 */}
      <div className='px-8 pb-3 pt-2 flex items-center justify-between'>
        <span className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
          {title}
        </span>
        {total !== undefined && (
            <span className='bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold'>
                {total}
            </span>
        )}
      </div>
      
      {/* PADDING UPDATE: The list items usually need the same padding 
          to align with the header. We apply px-8 here.
      */}
      <div className='flex flex-col px-4'>
        {children}
      </div>
    </div>
  )
}

export default SearchResultsDisplay