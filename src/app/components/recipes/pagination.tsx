"use client";
import usePagination from '@/app/hooks/usePagination';
import Button from '../shared/sharedButton';
import { Ingredient, Recipe } from '@/shemas/recipe';


const Pagination = ({ items }: { items: Recipe[] | Ingredient[] }) => {

  const  {handleNext, handlePrev, state, dispatch, pages} = usePagination({items})
  console.log(pages)

  if (pages.length <= 1) {
        return null;
      }
      
  return (
    <div className='flex absolute left-0 right-0 justify-center items-center mx-auto w-full max-w-md px-4'>
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
