'use client';

import React from 'react';
import { TableHeadColumn } from '@costwise/domain/types/specialTypes';
import SortedLink from '../sortedLink';
import { cn } from '@/app/utils/cn';

interface TableHeadProps {
  columns: TableHeadColumn[];
  sortedLinks: string[];
}

const TableHead = ({ columns, sortedLinks }: TableHeadProps) => {
  return (
    <thead>
      <tr className="h-[44px] bg-cream-50/70 border-b border-[#EFE8DA] select-none">
        {columns.map((column, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === columns.length - 1;
          const isSortable = sortedLinks.includes(column.accessor);

          return (
            <th
              key={column.accessor}
              className={cn(
                "font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500",
                isFirst ? "pl-5 pr-3 text-left" : isLast ? "pr-5 pl-3 text-right" : "px-3.5 text-left",
                column.className
              )}
            >
              {isSortable ? (
                <SortedLink value={column.accessor}>{column.header}</SortedLink>
              ) : (
                <span>{column.header}</span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
