import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  autoFocus?: boolean;
}

const SearchBar = ({ searchTerm, onChange, onClear, autoFocus = false }: SearchBarProps) => {
  return (
    <div className="relative flex items-center w-full max-w-[460px] h-[36px] px-3.5 rounded-full bg-cream-100 border border-transparent hover:border-sand-300 focus-within:border-green-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-green-500/20 transition-all duration-140 select-none">
      <Search className="size-[16px] text-stone-500 mr-2 shrink-0" strokeWidth={1.75} />
      <input
        type="text"
        autoFocus={autoFocus}
        value={searchTerm}
        onChange={onChange}
        placeholder="Search dishes, ingredients, suppliers…"
        className="w-full bg-transparent border-0 outline-none font-body text-[13px] text-ink-900 placeholder:text-stone-500"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={onClear}
          className="size-[20px] rounded-full bg-cream-200 hover:bg-sand-300 text-stone-600 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          aria-label="Clear search"
        >
          <X className="size-[12px]" strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;