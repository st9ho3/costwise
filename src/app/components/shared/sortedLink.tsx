"use client"
import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface SortedLinkProps {
    children: React.ReactNode
    value: string
}

const SortedLink = ({children, value}: SortedLinkProps) => {

  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const orderValue = params.get('sort')
  const direction = params.get('order')
  const isActive = orderValue === value

  const setSorting = (value: string) => {
    const paramsValue = params.get('sort')
    params.delete('page')
    params.set('sort', value)
    
    if (!direction) {
      params.set('order', 'desc')
    }else{
      if (direction === 'desc' && value === paramsValue) {
        params.set('order', 'asc')
      } else {
        params.set('order', 'desc')
      }
      
    }
    router.push(`${pathName}?${params}`)
  }
  
  
  const showArrowsDirection = () => {
   
    if (isActive) {
      if (direction === 'desc') {
       return <ArrowDown color='green' size={15} />
      } else {
       return <ArrowUp color='green' size={15} /> 
      }
    }else {
      return <ArrowDownUp size={15} />
    }
  }
  const arrow = showArrowsDirection()
  return (
    <div className='cursor-pointer text-xs flex items-center gap-2' onClick={() => setSorting(value)}>
      {children}
      {arrow}
    </div>
  )
}

export default SortedLink
