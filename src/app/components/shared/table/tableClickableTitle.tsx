import Image from 'next/image'
import React from 'react'

interface TableClickableTitleProps {
    imgPath?: string
    title: string
    icon?: string | null
}

const TableClickableTitle = ({imgPath, title, icon}: TableClickableTitleProps) => {
  return (
    <div className="flex items-center gap-2 mb-1">
        {imgPath && 
        <Image
          className="w-9 h-9 rounded-full object-cover"
          src={imgPath || '/images/placeholder-image.png'}
          alt={title}
          width={1200}
          height={800}
        />
        }
        {!imgPath && 
          <div className="flex justify-center items-center w-9 h-9 text-xl bg-yellow-100 rounded-full object-cover">
          {icon}
          </div>
        }
        
        <p className="text-sm break-words transition-colors duration-300 ease-in-out hover:text-gray-400">
          {title}
        </p>
    </div>
  )
}

export default TableClickableTitle
