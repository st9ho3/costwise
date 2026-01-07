'use client'
import React from 'react'
import { SortStatus, TableHeadColumn } from '@/types/specialTypes'
import SortedLink from '../sortedLink'

interface TableHeadProps {
    columns: TableHeadColumn[]
    sortedLinks: string[]
}

const TableHead = ({columns, sortedLinks}: TableHeadProps) => {
  return (
    <thead>
      <tr className="border-b-1 h-8 border-gray-200">
      {columns.map((column) => (
        <th key={column.accessor} className={column.className}>
          {/* column.accessor === 'tax' || column.accessor === 'sellingPrice' || column.accessor === 'profitMargin' || column.accessor === 'totalCost' */
          sortedLinks.includes(column.accessor)
          ? 
          <SortedLink value={column.accessor} >
          {column.header}
          </SortedLink>
          : column.header
           }
        </th>
        ))}
    </tr>
    </thead>
  )
}

export default TableHead
