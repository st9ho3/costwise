import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import SuppliersTable from '@/app/components/suppliers/suppliersTable';
import Pagination from '@/app/components/recipes/pagination';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { apiServer } from '@/app/lib/api';
import { Supplier } from '@costwise/shared/recipe';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }>;
}

const SuppliersPage = async ({ searchParams }: Props) => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { page, order, sort } = await searchParams;
  const numericPage = parseInt(page || '1');
  const itemsPerPage = 9;
  const offset = (numericPage - 1) * itemsPerPage;

  const api = await apiServer();
  const { data: rawSuppliers } = await api.GET('/v1/suppliers', {
    params: {
      query: {
        page: numericPage,
        order,
        sort,
        itemsPerPage,
        offset,
      },
    },
  });

  const totalItems = rawSuppliers ? rawSuppliers.count.count : 0;
  const pageNumber = Math.ceil(totalItems / itemsPerPage);
  const suppliers: Supplier[] = rawSuppliers
    ? rawSuppliers.suppliers.map((s) => ({
        ...s,
        icon: s.icon ?? undefined,
        dateAdded: s.dateAdded ? new Date(s.dateAdded) : undefined,
        deliveryTime: s.deliveryTime as Supplier['deliveryTime'],
      }))
    : [];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[30px] leading-tight text-ink-900 tracking-[-0.02em]">
            Your suppliers
          </h1>
          <p className="font-body text-[15px] text-stone-500 mt-1">
            {totalItems} {totalItems === 1 ? 'supplier' : 'suppliers'} you order from
          </p>
        </div>

        <Link href="/suppliers/create">
          <Button iconLeft={<Plus className="size-4" strokeWidth={2.5} />}>
            Add a supplier
          </Button>
        </Link>
      </div>

      {/* Suppliers Table */}
      <div className="w-full">
        <SuppliersTable items={suppliers} />
      </div>

      {/* Pagination */}
      {pageNumber > 1 && (
        <div className="mt-auto">
          <Pagination pageNumber={pageNumber} currentPage={page} />
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
