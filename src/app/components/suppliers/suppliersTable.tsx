"use client"
import useHelpers from '@/app/hooks/useHelpers'
import useSorting from '@/app/hooks/useSorting'
import { usePaginationStore } from '@/app/stores/paginationStore'
import { paginate } from '@/app/utils/pagination'
import { Supplier } from '@/shemas/recipe'
import React, { useMemo } from 'react'
import TableHead from '../shared/table/tableHead'
import { supplierColumns, supplierSortedLinks } from '@/app/constants/data'

const SuppliersTable = ({items}: {items: Supplier[]}) => {
    const page = usePaginationStore((state) => state.currentPage)
  const reset = usePaginationStore((state) => state.resetPage)
  const {isOpen, isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision} = useHelpers({path: 'ingredients'})
  const {sortData, sortStatus, sortedData} = useSorting({data: items})
  const paginateItems = useMemo(() => paginate(10, page, sortedData ),[sortedData, page]);
  const itemsToDisplay = paginateItems ? paginateItems : [];

  return (
    <div>
        <table className="w-full table-fixed mb-2 ">
            <TableHead
                columns={supplierColumns}
                sortStatus={sortStatus}
                sortedLinks={supplierSortedLinks}
                onSort={sortData}
             />
        </table>
    </div>
  )
}

export default SuppliersTable