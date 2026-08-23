import { CategoryThumbnail } from '@/app/utils/uiHelpers';
import React from 'react';

interface TableClickableTitleProps {
  imgPath?: string;
  title: string;
  category?: string;
  subtitle?: string;
}

const TableClickableTitle = ({ imgPath, title, category, subtitle }: TableClickableTitleProps) => {
  return (
    <div className="flex items-center gap-3 py-1">
      {imgPath ? (
        <img
          className="size-[36px] rounded-full object-cover shrink-0 border border-[#EFE8DA]"
          src={imgPath}
          alt={title}
        />
      ) : (
        <CategoryThumbnail category={category} size={36} />
      )}

      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-[15px] text-ink-900 leading-snug group-hover:text-green-800 transition-colors truncate">
          {title}
        </span>
        {subtitle && (
          <span className="text-[12px] text-stone-500 truncate font-body">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default TableClickableTitle;
