import { IngredientCategoryType } from '@costwise/domain/types/specialTypes';
import React from 'react'
import { Badge } from '@/app/components/ui/badge'

interface DataProps {
    label: string
    text: string | number | undefined
    category: IngredientCategoryType
}

const Data = ({label, text}: DataProps) => {
  const isUsage = label === 'Usage';
  const isCategory = label === 'Category';
  const isBadge = isUsage || isCategory;

  return (
    <div className='mb-5'>
      <p className='text-muted-foreground text-[11px] font-mono uppercase tracking-[0.12em] mb-1.5'>{label}</p>
      {isBadge ? (
        <Badge variant="secondary">
          {isUsage ? (Number(text) > 3 ? 'High' : 'Low') : text}
        </Badge>
      ) : (
        <p className="text-sm font-medium text-foreground">
          {text}{label === 'Price per Unit' ? ' €' : null}
        </p>
      )}
    </div>
  )
}

export default Data
