"use client"
import useHelpers from '@/app/hooks/useHelpers'
import useSorting from '@/app/hooks/useSorting'
import { usePaginationStore } from '@/app/stores/paginationStore'
import { paginate } from '@/app/utils/pagination'
import { Supplier } from '@/shemas/recipe'
import React, { useEffect, useMemo } from 'react'
import TableHead from '../shared/table/tableHead'
import { supplierColumns, supplierSortedLinks } from '@/app/constants/data'
import Link from 'next/link'
import TableClickableTitle from '../shared/table/tableClickableTitle'
import Label from '../shared/label'
import TableActions from '../shared/table/tableActions'
import Notification from '../shared/notification'
import Modal from '../shared/modal'
import DeleteConfirmationModal from '../shared/deleteConfirmationModal'

const SuppliersTable = ({items}: {items: Supplier[]}) => {
  const page = usePaginationStore((state) => state.currentPage)
  const reset = usePaginationStore((state) => state.resetPage)
  const {isOpen, isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision} = useHelpers({path: 'suppliers'})
  const {sortData, sortStatus, sortedData} = useSorting({data: items})
  const paginateItems = useMemo(() => paginate(10, page, sortedData ),[sortedData, page]);
  const itemsToDisplay = paginateItems ? paginateItems : [];
  
  useEffect(() => {reset()},[])
  
  return (
    <div>
        <table className="w-full table-fixed mb-2 ">
            <TableHead
                columns={supplierColumns}
                sortStatus={sortStatus}
                sortedLinks={supplierSortedLinks}
                onSort={sortData}
             />
             <tbody className="text-gray-500 text-md">
              {itemsToDisplay.map((item) => (
                <tr
                  key={item.id}
                  className="border-b h-12.5 border-gray-200 text-sm"
                >
                  <td className="pl-4 md:pl-0 pt-2">
                <Link href={`/suppliers/${item.id}`}>
                  <TableClickableTitle
                    title={item.name}
                  />
                </Link>
              </td>

              <td className="hidden md:table-cell pl-4">
                <p className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium'>
                  {item.contactPerson}
                </p>
              </td>
              <td className="hidden md:table-cell pl-4">
                <p className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium'>
                  {item.email}
                </p>
              </td>
              <td className="hidden md:table-cell pl-4">
                <Label
                  text={item.deliveryTime}
                  type={item.deliveryTime ? item.deliveryTime : 'Other'}
                />
              </td>

              <td className="align-middle text-center gap-5 flex justify-center md:text-start md:justify-start mt-4 md:pl-4">
                <TableActions
                  id={item.id}
                  onDelete={askPermision}
                  path="suppliers"
                />
              </td>
                </tr>
              ))}
             </tbody>
        </table>
        {isOpen && <Notification />}
      {isModalOpen && isDeleteActive && 
      <Modal isOpen={isModalOpen} onClose={closeModal} type="delete">
        <DeleteConfirmationModal
          onDelete={handleDelete}
          onClose={closeModal}
          id={storedItemId}
         />
      </Modal>}
    </div>
  )
}

export default SuppliersTable