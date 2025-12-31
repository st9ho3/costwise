"use client";
import Button from '../shared/sharedButton';
import { Ingredient, Recipe } from '@/shemas/recipe';
import { useEffect, useMemo } from 'react';
import { paginationPages } from '@/app/utils/pagination';
import { usePaginationStore } from '@/app/stores/paginationStore';


const Pagination = ({ items }: { items: Recipe[] | Ingredient[] }) => {
  
  const currentPage = usePaginationStore((state) => state.currentPage)
  const choosePage = usePaginationStore((state) => state.choosePage)
  const handleNext = usePaginationStore((state) => state.handleNext)
  const handlePrev = usePaginationStore((state) => state.handlePrev)
  
  const pages = useMemo(() => paginationPages(items, 10), [items])

      useEffect(() => {
        if (currentPage > pages.length) {
        choosePage(pages.length)
      }
      }, [pages, choosePage, currentPage])

  if (pages.length <= 1) {
        return null;
      }
      
  return (
    <div className='flex justify-center items-center mx-auto w-full max-w-md px-4'>
      <Button 
        text='Prev' 
        action={handlePrev}
      />
      <div className='mx-5 flex items-center justify-center'>
        {pages.map((page) => (
          <button 
            key={page} 
            onClick={() => choosePage(page)} 
            className={`
              w-6 h-6 mx-1 
              cursor-pointer 
              text-gray-600 
              rounded-md 
              flex items-center justify-center
              transition-colors duration-200
              ${currentPage === page 
                ? 'border-gray-400 border-1' 
                : 'border-gray-200 hover:bg-gray-300'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>
      <Button 
        text='Next' 
        action={handleNext} 
      />
    </div>
  );
};

export default Pagination;
