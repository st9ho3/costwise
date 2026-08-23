"use client"
import React from 'react'
import { File, X } from 'lucide-react';
import { useFileStore } from '@/app/stores/fileStore';


const SelectedFileBadge = () => {
    const { file, reset } = useFileStore()
  return (
    <div className="flex items-center justify-between w-1/2 py-1.5 px-2 group">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <File size={18} className="text-slate-400" />
            <span className="truncate">{file?.name}</span>
          </div>
          <button
            onClick={reset}
            className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        </div>
  )
}

export default SelectedFileBadge
