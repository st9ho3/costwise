"use client";
import React, { useCallback, useMemo } from 'react';
import Button from '../shared/sharedButton';
import { paginationPages } from '@/app/services/helpers';
import { useHomeContext } from '@/app/context/homeContext/homeContext';
import { Ingredient, Recipe } from '@/shemas/recipe';


const Pagination = ({ items }: { items: Recipe[] | Ingredient[] }) => {
  const { state, dispatch } = useHomeContext();
  const pages = useMemo( () => paginationPages(items, 10), [items]);

  const handlePrev = useCallback((): void => {
    if (state.currentPage > 1) {
      dispatch({ type: "CHOOSE_PAGE", payload: state.currentPage - 1 });
    }
  },[dispatch, state.currentPage]);

  const handleNext = useCallback((): void => {
    if (state.currentPage < pages.length) {
      dispatch({ type: "CHOOSE_PAGE", payload: state.currentPage + 1 });
    }
  },[state.currentPage, dispatch, pages]);

  if (pages.length <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }
console.log(state.currentPage)
  return (
    <div className='absolute bottom-5 left-0 right-0 flex justify-center items-center mx-auto w-full max-w-md px-4'>
      <Button 
        text='Prev' 
        action={handlePrev}
      />
      <div className='mx-5 flex items-center justify-center'>
        {pages.map((page) => (
          <button 
            key={page} 
            onClick={() => dispatch({ type: "CHOOSE_PAGE", payload: page })} 
            className={`
              w-6 h-6 mx-1 
              cursor-pointer 
              text-gray-600 
              rounded-md 
              flex items-center justify-center
              transition-colors duration-200
              ${state.currentPage === page 
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
