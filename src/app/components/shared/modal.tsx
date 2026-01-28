"use client"
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ModalProps } from '../../../types/context';
import { AlertCircleIcon } from "lucide-react";


const Modal= ({ isOpen, onClose, children, type }: ModalProps) => {

  const modalRef = useRef<HTMLDivElement>(null);
 

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-55 flex items-center justify-center ${type === 'delete' ? 'bg-white/30' : 'bg-gray-600/30' }  backdrop-blur-sm transition-opacity duration-300`}>
      <div
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        className={`relative w-full max-w-fit ${type === 'create' ? 'p-9' : 'pt-9'} mx-4 transform transition-all duration-300 bg-white rounded-2xl shadow-xl`} >
        {type === 'delete' && <AlertCircleIcon className="absolute top-3 left-3" color="red" size={28} /> }
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-offset-2 transition-colors"
          aria-label="Close modal" >
            <X />
        </button>
        {children}
      </div>
    </div>
  );
};


export default Modal
