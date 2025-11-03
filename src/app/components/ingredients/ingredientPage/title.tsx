import React from 'react'

interface TitleProps {
    title: string | undefined
}

const Title = ({title}: TitleProps) => {

  return (
    <div className='text-4xl text-gray-600 font-medium'>
      {title}
    </div>
  )
}

export default Title
