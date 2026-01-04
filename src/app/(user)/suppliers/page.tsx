import Pagination from '@/app/components/recipes/pagination';
import SuppliersTable from '@/app/components/suppliers/suppliersTable';
import { SupplierService } from '@/app/services/suppliersService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const SuppliersPage = async() => {

  const session = await auth();
  
      if (!session?.user?.id) {
          redirect('/signin');
      }

      const service = new SupplierService(session.user.id)
      const result = await service.findAll(session.user.id)
      const suppliers = result ? result.map((supplier) => {
        return supplier;
    }) : [];
  return (
    <div className="relative w-full h-full px px-2 md:px-5 bg-white">
            <SuppliersTable items={suppliers} />
            <Pagination items={suppliers} />
        </div>
  )
}

export default SuppliersPage
