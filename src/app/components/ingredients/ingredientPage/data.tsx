import React from 'react'

interface DataProps {
    label: string
    text: string | number | undefined
}
const classNameTypes = {
    low: 'bg-red-200 text-red-700',
    high: 'bg-green-200 text-green-700'
}

const Data = ({label, text}: DataProps) => {
  return (
    <div className='mb-5'>
      <p className='text-gray-400 text-sm font-bold'>{label}</p>
      <div className={label === 'Usage' ? `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-sm font-medium ${ Number(text) > 3 ? classNameTypes.high : classNameTypes.low}` : undefined}>
        <p>{label === 'Usage' ? Number(text) > 3 ? 'High' : 'Low' : text}{label === 'Price per Unit' ? ' €' : null}</p>
      </div>
    </div>
  )
}

export default Data
