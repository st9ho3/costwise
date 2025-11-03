import React from 'react'

interface IconProps {
    children: React.ReactNode
}

const Icon = ({children}: IconProps) => {

  return (
    <div className='w-15 h-15 flex justify-center items-center rounded-full bg-amber-100 text-3xl'>
      {children}
    </div>
  )
}

export default Icon
