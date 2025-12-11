
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './sharedButton';

interface DeleteConfirmationModalProps {
    onDelete: (id: string | null) => void;
    onClose: () => void;
    id: string | null;
}

const DeleteConfirmationModal = ({ onDelete, onClose, id }: DeleteConfirmationModalProps) => {

  return (
    // CONTAINER: Standard Dialog width, generous padding, rounded corners (Material Large Shape)
    <div className="w-full max-w-sm p-6 bg-white rounded-[28px] shadow-xl border border-gray-100">
      
      {/* HEADER: Icon + Title */}
      <div className="flex flex-col items-center text-center gap-4 mb-8">
        {/* Warning Icon Container */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={24} strokeWidth={2.5} />
        </div>

        <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
                Delete this item?
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed px-2">
                This action cannot be undone. This will permanently remove the item from your inventory.
            </p>
        </div>
      </div>

      {/* ACTIONS: Flex-row-reverse places the Primary action on the right */}
      <div className="flex flex-col sm:flex-row-reverse gap-3">
        
        {/* PRIMARY ACTION: Red (Destructive) */}
        <Button text='Yes' action={() => onDelete(id)} />
        <Button text='No' action={onClose} />
      </div>
    </div> 
  );
};

export default DeleteConfirmationModal;