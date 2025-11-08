import React from 'react'
import Button from "../shared/sharedButton";

interface DeleteConfirmationModalProps {
    onDelete: (id: string | null) => void
    onClose: () => void
    id: string | null
}

const DeleteConfirmationModal = ({onDelete, onClose, id}: DeleteConfirmationModalProps) => {

  return (
    <div className="h-25 w-fit p-5">
        <p>This action is irreversible. Are you sure you want to continue?</p>
        <Button text='Yes' action={() => onDelete(id)} />
        <Button text='No' action={onClose} />
    </div> 
  )
}

export default DeleteConfirmationModal
