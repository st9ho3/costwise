import { formatPrice, getDisplayUnit } from '@/app/utils/pricing'
import React from 'react'

interface MonetaryCellProps {
    price: number | undefined
    unit?: string
    type: 'absolute' | 'per_unit'
}

const MonetaryCell = ({price,unit, type}: MonetaryCellProps) => {
    if (type === 'absolute')
  return (
    <div>
      € {formatPrice(price)}
    </div>
  )
    if (type === 'per_unit')
  return (
    <div>
      € {formatPrice(price)} / <span className="font-bold"> {getDisplayUnit(unit)} </span>
    </div>
  )
}

export default MonetaryCell
