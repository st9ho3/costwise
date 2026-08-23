"use client";

import React, { useEffect } from 'react';
import useHelpers from '@/app/hooks/useHelpers';
import { Supplier } from '@/shemas/recipe';
import TableHead from '../shared/table/tableHead';
import { supplierColumns, supplierSortedLinks } from '@/app/constants/data';
import Link from 'next/link';
import TableActions from '../shared/table/tableActions';
import Modal from '../shared/modal';
import DeleteConfirmationModal from '../shared/deleteConfirmationModal';
import MobileListCard, { MobileCardRow } from '../shared/mobileListCard';
import { Badge } from '../ui/badge';
import { Store } from 'lucide-react';
import { useNotificationStore } from '@/app/stores/notificationStore';

const getDeliveryBadge = (deliveryTime: string | null | undefined) => {
  if (!deliveryTime) return <span className="text-stone-400 font-medium">—</span>;
  const dt = deliveryTime.toLowerCase();
  if (dt === 'same day') return <Badge tone="good">{deliveryTime}</Badge>;
  if (dt === '1-2 days' || dt === '2-3 days') return <Badge tone="info">{deliveryTime}</Badge>;
  return <Badge tone="neutral">{deliveryTime}</Badge>;
};

const SupplierThumb = () => (
  <span className="size-[36px] rounded-full bg-[#E6EFF8] text-[#3A6E9E] flex items-center justify-center shrink-0">
    <Store className="size-[18px]" strokeWidth={1.75} />
  </span>
);

const SuppliersTable = ({ items }: { items: Supplier[] }) => {
  const resetNotification = useNotificationStore((state) => state.reset);
  const {
    isModalOpen,
    isDeleteActive,
    closeModal,
    storedItemId,
    handleDelete,
    askPermision,
  } = useHelpers({ path: 'suppliers' });

  useEffect(() => {
    resetNotification();
  }, [resetNotification]);

  return (
    <div className="w-full">
      {/* Mobile Card Feed */}
      <div className="md:hidden flex flex-col gap-3">
        {items.map((item) => (
          <MobileListCard
            key={item.id}
            thumb={<SupplierThumb />}
            title={
              <Link href={`/suppliers/edit/${item.id}`} className="hover:text-green-800 transition-colors">
                {item.name}
              </Link>
            }
            actions={
              <TableActions
                id={item.id}
                onDelete={askPermision}
                path="suppliers"
              />
            }
          >
            <MobileCardRow
              label="Who you talk to"
              value={item.contactPerson || '—'}
              isMono={false}
            />
            <MobileCardRow
              label="Email"
              value={item.email || '—'}
              isMono={false}
            />
            <MobileCardRow
              label="Delivery"
              value={getDeliveryBadge(item.deliveryTime)}
              isMono={false}
            />
          </MobileListCard>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-white rounded-[18px] border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)] overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <TableHead columns={supplierColumns} sortedLinks={supplierSortedLinks} />
          <tbody className="divide-y divide-[#EFE8DA]">
            {items.map((item) => (
              <tr
                key={item.id}
                className="h-[56px] hover:bg-cream-100/60 transition-colors duration-140 group"
              >
                <td className="pl-5 pr-3 text-left">
                  <Link href={`/suppliers/edit/${item.id}`} className="flex items-center gap-3 py-1">
                    <SupplierThumb />
                    <span className="font-semibold text-[15px] text-ink-900 group-hover:text-green-800 transition-colors truncate">
                      {item.name}
                    </span>
                  </Link>
                </td>

                <td className="px-3.5 text-left text-[14px] text-ink-700 font-body">
                  {item.contactPerson || '—'}
                </td>

                <td className="px-3.5 text-left text-[14px] text-ink-700 font-body truncate">
                  {item.email || '—'}
                </td>

                <td className="px-3.5 text-left">
                  {getDeliveryBadge(item.deliveryTime)}
                </td>

                <td className="pr-5 pl-3 text-right">
                  <TableActions
                    id={item.id}
                    onDelete={askPermision}
                    path="suppliers"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && isDeleteActive && (
        <Modal isOpen={isModalOpen} onClose={closeModal} type="delete">
          <DeleteConfirmationModal
            onDelete={handleDelete}
            onClose={closeModal}
            id={storedItemId}
            itemType="supplier"
          />
        </Modal>
      )}
    </div>
  );
};

export default SuppliersTable;