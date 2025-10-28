"use client";
import { useEffect, useMemo } from 'react';
import { paginationPages } from '@/app/services/helpers';
import { Ingredient, Recipe } from '@/shemas/recipe';
import { usePaginationStore } from '../stores/paginationStore';


interface UsePaginationProps {
    items: Ingredient[] | Recipe[]
}

const usePagination = ({items}: UsePaginationProps) => {

    const {currentPage, handleNext, handlePrev, choosePage, resetPage} = usePaginationStore((state) => state)

    const pages = useMemo( () => paginationPages(items, 10), [items]);

      useEffect(() => {
        if (currentPage > pages.length) {
        choosePage(pages.length)
      }
      }, [pages,choosePage, currentPage])
        
    
    
  return {
    handlePrev,
    handleNext,
    currentPage,
    choosePage,
    resetPage,
    pages
  }
}

export default usePagination
