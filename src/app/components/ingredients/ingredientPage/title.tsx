import React from 'react'

interface TitleProps {
    title: string | undefined
}

const Title = ({title}: TitleProps) => {

  return (
    <div className='text-xl text-gray-600'>
      {title}
    </div>
  )
}

export default Title
