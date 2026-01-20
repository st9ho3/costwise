"use client"
import useHelpers from '@/app/hooks/useHelpers'
import { Supplier } from '@/shemas/recipe'
import React from 'react'
import TableHead from '../shared/table/tableHead'
import { supplierColumns, supplierSortedLinks } from '@/app/constants/data'
import Link from 'next/link'
import TableClickableTitle from '../shared/table/tableClickableTitle'
import Label from '../shared/label'
import TableActions from '../shared/table/tableActions'
import Notification from '../shared/notification'
import Modal from '../shared/modal'
import DeleteConfirmationModal from '../shared/deleteConfirmationModal'
import MobileListCard, { MobileCardRow } from '../shared/mobileListCard'

const SuppliersTable = ({items}: {items: Supplier[]}) => {
 
  const {isOpen, isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision} = useHelpers({path: 'suppliers'})
  
  return (
    <div>
      <div className="md:hidden">
        {items.map((item) => (
          <MobileListCard
            key={item.id}
            title={
              <Link href={`/suppliers/${item.id}`}>
                <TableClickableTitle
                  title={item.name}
                  imgPath="/images/supplierIcon.png"
                />
              </Link>
            }
            actions={
              <div className="flex gap-3">
                <TableActions
                  id={item.id}
                  onDelete={askPermision}
                  path="suppliers"
                />
              </div>
            }
          >
            <MobileCardRow
              label="Contact Person"
              value={
                <p className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {item.contactPerson}
                </p>
              }
            />
            <MobileCardRow
              label="Email"
              value={
                <p className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {item.email}
                </p>
              }
            />
            <MobileCardRow
              label="Delivery Time"
              value={
                <Label
                  text={item.deliveryTime}
                  type={item.deliveryTime ? item.deliveryTime : "Other"}
                />
              }
            />
          </MobileListCard>
        ))}
      </div>
      <table className="w-full table-fixed mb-2 hidden md:table">
        <TableHead columns={supplierColumns} sortedLinks={supplierSortedLinks} />
        <tbody className="text-gray-500 text-md">
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b h-12.5 border-gray-200 text-sm"
            >
              <td className="pl-4 md:pl-0 pt-2">
                <Link href={`/suppliers/${item.id}`}>
                  <TableClickableTitle
                    title={item.name}
                    imgPath="/images/supplierIcon.png"
                  />
                </Link>
              </td>

              <td className="hidden md:table-cell pl-4">
                <p className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {item.contactPerson}
                </p>
              </td>
              <td className="hidden md:table-cell pl-4">
                <p className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {item.email}
                </p>
              </td>
              <td className="hidden md:table-cell pl-4">
                <Label
                  text={item.deliveryTime}
                  type={item.deliveryTime ? item.deliveryTime : "Other"}
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