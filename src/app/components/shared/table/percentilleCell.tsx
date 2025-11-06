import React from 'react'

interface PercentilleCellProps {
    percentage: number
}

const PercentilleCell = ({percentage}: PercentilleCellProps) => {
  return (
    <div>
      {percentage * 100} %
    </div>
  )
}

export default PercentilleCell
