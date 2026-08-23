import { Ingredient } from '@/shemas/recipe';
import Link from 'next/link';
import React from 'react';
import { CategoryThumbnail } from '@/app/utils/uiHelpers';

interface IngredientSearchResultProps {
  item: Ingredient;
  onClose: () => void;
}

const IngredientSearchResult = ({ item, onClose }: IngredientSearchResultProps) => {
  const price = Number(item.unitPrice || 0);
  const formattedPrice = price < 1 ? `€${price.toFixed(3)}` : `€${price.toFixed(2)}`;

  return (
    <Link
      onClick={onClose}
      href={`/ingredients/${item.id}`}
      className="flex items-center justify-between px-4 py-2.5 hover:bg-cream-100 transition-colors duration-140 rounded-[12px] group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <CategoryThumbnail category={item.category} size={36} />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-[15px] text-ink-900 group-hover:text-green-800 transition-colors truncate">
            {item.name}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-1 shrink-0 ml-3">
        <span className="font-mono font-bold text-[14px] tabular-nums text-ink-900">
          {formattedPrice}
        </span>
        <span className="text-[12px] font-medium text-stone-500 font-body">
          / {item.unit || 'g'}
        </span>
      </div>
    </Link>
  );
};

export default IngredientSearchResult;