import React from 'react';

interface SearchResultsDisplayProps {
  children: React.ReactNode;
  title: string;
  total?: number;
}

const SearchResultsDisplay = ({ children, title, total }: SearchResultsDisplayProps) => {
  return (
    <div className="py-1">
      <div className="px-5 py-2 flex items-center justify-between border-b border-[#EFE8DA]/60">
        <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
          {title} {total !== undefined && `· ${total}`}
        </span>
      </div>
      <div className="flex flex-col p-1">
        {children}
      </div>
    </div>
  );
};

export default SearchResultsDisplay;