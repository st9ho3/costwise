/**
 * Renders the suppliers page for a logged-in user.
 * This component fetches all suppliers associated with the current user's ID.
 * It first verifies user authentication and redirects to the sign-in page if no session is found.
 * It then uses the `SupplierService` to retrieve the supplier data and passes it to the `SuppliersTable`
 * and `Pagination` components for display and navigation. The page is set to be dynamically rendered
 * to ensure data is always up-to-date.
 */
import Pagination from '@/app/components/recipes/pagination';
import SuppliersTable from '@/app/components/suppliers/suppliersTable';
import { SupplierService } from '@/app/services/suppliersService';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { Metadata } from '@/types/specialTypes';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }>;
}

const SuppliersPage = async ({ searchParams }: Props) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { page, order, sort } = await searchParams;
  const numericPage = parseInt(page || '1');
  const itemsPerPage = 9;
  const offset = (numericPage - 1) * itemsPerPage;
  const metadata: Metadata = {
    page: numericPage,
    order,
    sort,
    itemsPerPage,
    offset,
  };

  const service = new SupplierService(session.user.id);
  const rawSuppliers = session.user.id && await service.findAll(session.user.id, metadata);
  const totalItems = rawSuppliers ? rawSuppliers.count.count : 1;
  const pageNumber = Math.ceil(totalItems / itemsPerPage);
  const suppliers = rawSuppliers
    ? rawSuppliers.suppliers.map((supplier) => {
        return supplier;
      })
    : [];

  return (
     <div className="flex flex-col h-full w-full px-2 md:px-5 bg-white">
            <div className="flex-1 overflow-auto">
                <SuppliersTable items={suppliers} />
            </div>
            <div className="mt-auto">
                <Pagination pageNumber={pageNumber} currentPage={page} />
            </div>
        </div>
  );
};

export default SuppliersPage;
