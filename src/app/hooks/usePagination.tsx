"use client";
import { useCallback, useEffect, useMemo } from 'react';
import { paginationPages } from '@/app/services/helpers';
import { useHomeContext } from '@/app/context/homeContext/homeContext';
import { Ingredient, Recipe } from '@/shemas/recipe';


interface UsePaginationProps {
    items: Ingredient[] | Recipe[]
}

const usePagination = ({items}: UsePaginationProps) => {

    const { state, dispatch } = useHomeContext();
      const pages = useMemo( () => paginationPages(items, 10), [items]);

      useEffect(() => {
        if (state.currentPage > pages.length) {
        dispatch({ type: "CHOOSE_PAGE", payload: pages.length });
      }
      }, [pages])
        
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
    
  return {
    handlePrev,
    handleNext,
    state,
    dispatch,
    pages
  }
}

export default usePagination
