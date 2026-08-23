'use client';

import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '../ui/button';

interface DeleteConfirmationModalProps {
  onDelete: (id: string | null) => void;
  onClose: () => void;
  id: string | null;
  itemType?: 'dish' | 'ingredient' | 'supplier' | 'item';
}

const DeleteConfirmationModal = ({
  onDelete,
  onClose,
  id,
  itemType = 'item',
}: DeleteConfirmationModalProps) => {
  return (
    <div className="w-full max-w-[440px] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="size-[40px] rounded-[12px] bg-tomato-100 text-tomato-600 flex items-center justify-center shrink-0 mt-0.5">
          <TriangleAlert className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col">
          <h3 className="font-display font-bold text-[20px] text-ink-900 leading-snug">
            Delete this {itemType}?
          </h3>
          <p className="font-body text-[14px] text-stone-500 mt-1 leading-normal">
            It&apos;ll go for good — costs and history with it. Nothing else on your list changes.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2.5 mt-2">
        <Button variant="secondary" onClick={onClose}>
          Leave it
        </Button>
        <Button variant="danger" onClick={() => onDelete(id)}>
          Delete it
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;