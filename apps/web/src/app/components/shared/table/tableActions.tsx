import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface TableActionsProps {
  onDelete: (id: string | undefined) => void;
  id: string | undefined;
  path: string;
}

const TableActions = ({ onDelete, id, path }: TableActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/${path}/edit/${id}`}
        className="size-[32px] rounded-lg flex items-center justify-center text-stone-500 hover:text-ink-900 hover:bg-cream-100 transition-colors"
        title="Edit"
      >
        <Pencil className="size-[17px]" strokeWidth={1.75} />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="size-[32px] rounded-lg flex items-center justify-center text-tomato-600 hover:text-tomato-700 hover:bg-tomato-100 transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 className="size-[17px]" strokeWidth={1.75} />
      </button>
    </div>
  );
};

export default TableActions;
