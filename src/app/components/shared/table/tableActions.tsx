import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface TableActionsProps {
    onDelete: (id: string | undefined) => void
    id: string | undefined
    path: string
}

const TableActions = ({onDelete, id, path}: TableActionsProps) => {
  return (
    <>
      <Link href={`/${path}/edit/${id}`}>
          <Pencil
            size="18px"
            strokeWidth="1.5px"
            className="cursor-pointer"
            />
        </Link>
        <Trash2
          onClick={() => onDelete(id)}
          size="18px"
          strokeWidth="1.5px"
          color="red"
          className="cursor-pointer"
        />
    </>
  )
}

export default TableActions
