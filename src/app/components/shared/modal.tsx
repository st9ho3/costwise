"use client";

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/app/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type?: string;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-900/40 backdrop-blur-[3px] animate-in fade-in-0 duration-140"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        className={cn(
          "relative w-full max-w-fit p-6 sm:p-8 bg-white rounded-[28px] shadow-[0_8px_16px_rgba(27,26,22,0.06),0_32px_64px_-20px_rgba(18,52,32,0.24)] border border-[#EFE8DA] animate-in zoom-in-95 duration-140"
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-stone-500 hover:text-ink-900 hover:bg-cream-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
