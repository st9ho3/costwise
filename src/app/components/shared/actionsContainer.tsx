'use client'
import useHelpers from '@/app/hooks/useHelpers'
import React from 'react'
import TableActions from './table/tableActions'
import Modal from './modal'
import DeleteConfirmationModal from './deleteConfirmationModal'

const ActionsContainer = ({id}: {id: string | undefined}) => {
    
  const {isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision} = useHelpers({path: 'ingredients'})

  return (
    <div className='flex justify-evenly items-center gap-3 p-2 border border-white hover:border-gray-200 duration-400 rounded-lg w-fit'>
      <TableActions
        id={id}
        onDelete={askPermision}
        path='ingredients'
       />
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

export default ActionsContainer
