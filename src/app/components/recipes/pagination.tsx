"use client";

import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { paginationPages } from '@/app/utils/pagination';
import { Button } from '../ui/button';
import { cn } from '@/app/utils/cn';

interface PaginationProps {
  currentPage?: string;
  pageNumber?: number;
}

const Pagination = ({ currentPage = '1', pageNumber }: PaginationProps) => {
  const numericCurrentPage = Number(currentPage) || 1;
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathName = usePathname();
  const pages = useMemo(() => paginationPages(pageNumber), [pageNumber]);

  if (!pages || pages.length <= 1) {
    return null;
  }

  const handleNext = () => {
    const nextPage = numericCurrentPage + 1;
    if (pageNumber && nextPage > pageNumber) return;
    params.set('page', nextPage.toString());
    router.push(`${pathName}?${params}`);
  };

  const handlePrev = () => {
    const previousPage = numericCurrentPage - 1;
    if (previousPage < 1) return;
    if (previousPage === 1) {
      params.delete('page');
    } else {
      params.set('page', previousPage.toString());
    }
    router.push(`${pathName}?${params}`);
  };

  const choosePage = (page: number) => {
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`${pathName}?${params}`);
  };

  return (
    <div className="flex justify-center items-center gap-4.5 py-4 w-full select-none">
      <Button
        variant="secondary"
        size="sm"
        disabled={numericCurrentPage <= 1}
        onClick={handlePrev}
      >
        Back
      </Button>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isCurrent = numericCurrentPage === page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => choosePage(page)}
              className={cn(
                "size-[30px] rounded-[10px] flex items-center justify-center font-mono font-semibold text-[13px] tabular-nums transition-all cursor-pointer",
                isCurrent
                  ? "border border-sand-400 bg-cream-100 text-ink-900 shadow-xs font-bold"
                  : "bg-transparent text-stone-500 hover:bg-cream-100 hover:text-ink-900 border border-transparent"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        size="sm"
        disabled={pageNumber ? numericCurrentPage >= pageNumber : false}
        onClick={handleNext}
      >
        More
      </Button>
    </div>
  );
};

export default Pagination;
