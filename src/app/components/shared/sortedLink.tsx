import { Filter } from '@/app/hooks/useSorting'
import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react'
import React from 'react'

interface SortedLinkProps {
    children: React.ReactNode
    onSort: (value: string) => void
    sortStatus: Filter
}

const SortedLink = ({children, onSort, sortStatus: {isAscending, isFiltering, value}}: SortedLinkProps) => {

  return (
    <div className='cursor-pointer text-xs flex items-center gap-2' onClick={() => onSort(`${children}`)}>
      {children}
      {!isFiltering 
      ? <ArrowDownUp size={15}/> 
      : isAscending && value === children
      ? <ArrowDown color='green' size={15} /> 
      : value === children ? <ArrowUp color='green' size={15}/> : <ArrowDownUp size={15} /> }
      
    </div>
  )
}

export default SortedLink
