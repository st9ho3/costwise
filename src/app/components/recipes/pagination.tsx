"use client";
import Button from '../shared/sharedButton';
import {  useMemo } from 'react';
import { paginationPages } from '@/app/utils/pagination';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';


const Pagination = ({currentPage = '1' ,pageNumber}: {currentPage?: string ,pageNumber?: number}) => {
  
  const numericCurrentPage = Number(currentPage)
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const pathName = usePathname()
  const pages = useMemo(() => paginationPages(pageNumber, 10), [pageNumber])
    
  if (!pages || pages.length <= 1 ) {
        return null;
      }
      const handleNext = () => {
        let nextPage = numericCurrentPage + 1
        if (!numericCurrentPage) {
          nextPage = 2
        } else {
          nextPage = numericCurrentPage + 1
        }
        if (pageNumber && nextPage > pageNumber) {
          return
        }
        params.set('page', nextPage.toString())
        router.push(`${pathName}?${params}`)
      }
      const handlePrev = () => {
        let previousPage 
        if (!numericCurrentPage) { 
          previousPage = 1
        } else {
           previousPage = numericCurrentPage - 1
        }
        
        params.set('page', previousPage.toString())
        if (pageNumber && previousPage < 2) {
          params.delete('page')
        }
        router.push(`${pathName}?${params}`)
      }

      const choosePage = (page: number) => {
        params.set('page', page.toString())
        if (page < 2) {
          params.delete('page')
        }
        router.push(`${pathName}?${params}`)
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
              ${numericCurrentPage === page 
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
