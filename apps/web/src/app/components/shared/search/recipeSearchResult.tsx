import { Recipe } from '@costwise/shared/recipe';
import Link from 'next/link';
import React from 'react';
import { CategoryThumbnail } from '@/app/utils/uiHelpers';

interface RecipeSearchResultProps {
  item: Recipe;
  onClose: () => void;
}

const RecipeSearchResult = ({ item, onClose }: RecipeSearchResultProps) => {
  return (
    <Link
      onClick={onClose}
      href={`/recipes/edit/${item.id}`}
      className="flex items-center justify-between px-4 py-2.5 hover:bg-cream-100 transition-colors duration-140 rounded-[12px] group"
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.imgPath ? (
          <img
            src={item.imgPath}
            alt={item.title}
            className="size-[36px] rounded-full object-cover shrink-0 border border-[#EFE8DA]"
          />
        ) : (
          <CategoryThumbnail category={item.category} size={36} />
        )}
        <span className="font-semibold text-[15px] text-ink-900 group-hover:text-green-800 transition-colors truncate">
          {item.title}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="font-mono font-bold text-[14px] tabular-nums text-ink-900">
          €{Number(item.sellingPrice || 0).toFixed(2)}
        </span>
      </div>
    </Link>
  );
};

export default RecipeSearchResult;