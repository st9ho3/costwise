// src/components/SearchBar.jsx

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, onChange }: SearchBarProps) => {
  return (
    // CONTAINER:
    // 1. 'rounded-full' creates the signature Google Pill shape
    // 2. 'bg-gray-100' creates the off-white surface (Google's #f1f3f4)
    // 3. 'focus-within:' classes handle the transition to active state (White bg + Shadow)
    <div
      className={`
        relative flex items-center w-full max-w-md h-12 px-5
        rounded-full bg-gray-100
        transition-all duration-300 ease-in-out
        
        /* Hover State: Subtle darkening to indicate interactivity */
        hover:bg-gray-200/70 hover:shadow-sm
        
        /* Focus State: The "Pop" effect (Background turns white, adds elevation) */
        focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100
      `}
    >
      {/* ICON:
          Start with a lighter gray, darken slightly on focus to draw attention 
      */}
      <Search 
        className="w-5 h-5 text-gray-500 transition-colors duration-300 group-focus-within:text-blue-600 mr-3" 
        strokeWidth={2}
      />

      {/* INPUT:
          1. bg-transparent: Lets the container's color show through
          2. w-full: Fills the pill
          3. outline-none: We handle focus rings on the parent <div> instead
      */}
      <input
        className="
          w-full h-full bg-transparent border-none outline-none
          text-gray-700 placeholder-gray-500 font-medium tracking-wide
          text-sm
        "
        value={searchTerm}
        onChange={onChange}
        type="text"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;