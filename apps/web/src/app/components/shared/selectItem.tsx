import { IngredientCategory, IngredientCategoryName } from '@/shemas/recipe';
import React from 'react';
import { getCategoryDefinition } from '@/app/utils/uiHelpers';

interface SelectItemProps {
  icon?: string;
  name: IngredientCategoryName;
  id: IngredientCategory;
  onSelect: (id: IngredientCategory) => void;
  selected: string[];
}

const SelectItem = ({ name, onSelect, id, selected }: SelectItemProps) => {
  const isSelected = selected.includes(id);
  const cat = getCategoryDefinition(name || id);
  const Icon = cat.icon;

  return (
    <div
      onClick={() => onSelect(id)}
      className={`px-3 py-1 gap-1.5 cursor-pointer flex items-center justify-center border rounded-full text-[12px] font-bold select-none transition-all ${
        isSelected
          ? 'shadow-xs'
          : 'bg-cream-50 text-stone-500 border-[#EFE8DA] hover:bg-cream-100'
      }`}
      style={
        isSelected
          ? {
              backgroundColor: cat.bg,
              color: cat.color,
              borderColor: cat.border,
            }
          : undefined
      }
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span>{cat.name}</span>
    </div>
  );
};

export default SelectItem;
