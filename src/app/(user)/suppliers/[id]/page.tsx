import { SupplierRepository } from '@/app/repositories/suppliersRepository'
import React from 'react'

const SupplierPage = async() => {
  const service = new SupplierRepository()
  const supplier = await service.findById('e007de2c-1754-4877-a894-70fa1cad9cf1')
  console.log(supplier)

  return (
    <div>
      <p>{supplier?.id}</p>
      <p>{supplier?.name}</p>
      <p>{supplier?.contactPerson}</p>
      <p>{supplier?.phone}</p>
      <p>{supplier?.website}</p>
    </div>
  )
}

export default SupplierPage
