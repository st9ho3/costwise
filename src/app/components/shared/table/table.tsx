'use client'
import React from 'react'
import TableHead from './tableHead'
import TableBody from './tableBody'
import { SortStatus, TableHeadColumn } from '@/types/specialTypes'

interface TableProps {
    columns: TableHeadColumn[]
    sortedLinks: string[]
    onSort: (value: string) => void
    sortStatus: SortStatus
    
}

const Table = ({columns, sortStatus, sortedLinks, onSort}: TableProps ) => {

  return (
    <table className='w-full table-fixed mb-2'>
      <TableHead
        columns={columns}
        sortStatus={sortStatus}
        sortedLinks={sortedLinks}
        onSort={onSort}
       />
      <TableBody />
    </table>
  )
}

export default Table
