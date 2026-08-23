import React from 'react';
import {
  Carrot,
  Beef,
  Fish,
  Milk,
  Wheat,
  Sparkles,
  Droplets,
  Snowflake,
  Coffee,
  CupSoda,
  Croissant,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryDefinition {
  id: string;
  name: string;
  bg: string;
  color: string;
  border: string;
  icon: LucideIcon;
}

export const CATEGORIES: Record<string, CategoryDefinition> = {
  Produce: {
    id: '5dee106a-5050-443e-8368-03397e02af6d',
    name: 'Produce',
    bg: '#E4F3D8',
    color: '#1B4A2C',
    border: '#C6E7AF',
    icon: Carrot,
  },
  'Meat & Poultry': {
    id: 'a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5',
    name: 'Meat & Poultry',
    bg: '#FBE6E3',
    color: '#9E2A20',
    border: '#F7BC91',
    icon: Beef,
  },
  'Fish & Seafood': {
    id: '1670a6d4-f212-4770-80c7-0e31c0f4c26b',
    name: 'Fish & Seafood',
    bg: '#E6EFF8',
    color: '#3A6E9E',
    border: '#C9DDF0',
    icon: Fish,
  },
  'Dairy & Alternatives': {
    id: '80662af1-1943-4168-8549-ef721b0e9f54',
    name: 'Dairy & Alternatives',
    bg: '#FBF1D4',
    color: '#6E4A11',
    border: '#F3DFA3',
    icon: Milk,
  },
  'Dry Goods': {
    id: 'b660f354-a89d-420c-80d1-ba0f16b433ec',
    name: 'Dry Goods',
    bg: '#FDEBDD',
    color: '#9E4220',
    border: '#F7BC91',
    icon: Wheat,
  },
  'Spices & Seasonings': {
    id: '90aae231-631c-4fed-baf0-929be5a26b13',
    name: 'Spices & Seasonings',
    bg: '#FBF1D4',
    color: '#8A5F16',
    border: '#F3DFA3',
    icon: Sparkles,
  },
  'Oils, Vinegars, & Condiments': {
    id: '25f19080-3387-4470-95df-598817d5ccfe',
    name: 'Oils, Vinegars, & Condiments',
    bg: '#F1E7F5',
    color: '#7A4A8C',
    border: '#E2D1EA',
    icon: Droplets,
  },
  Frozen: {
    id: '83602573-0b31-439c-8890-ee084a547c22',
    name: 'Frozen',
    bg: '#E6EFF8',
    color: '#4A86C4',
    border: '#C9DDF0',
    icon: Snowflake,
  },
  'Coffee & Tea': {
    id: 'ad6fbf47-f289-4ffb-b070-a5957330a56b',
    name: 'Coffee & Tea',
    bg: '#FDEBDD',
    color: '#9E4220',
    border: '#F7BC91',
    icon: Coffee,
  },
  'Beverages (Other)': {
    id: 'f50e6aea-bb2d-42a1-8778-52cdbfec1540',
    name: 'Beverages (Other)',
    bg: '#E6EFF8',
    color: '#3A6E9E',
    border: '#C9DDF0',
    icon: CupSoda,
  },
  Bakery: {
    id: '0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5',
    name: 'Bakery',
    bg: '#FDEBDD',
    color: '#C4552C',
    border: '#F7BC91',
    icon: Croissant,
  },
  Other: {
    id: 'ef45178d-e566-4637-b7f9-abcf6d575466',
    name: 'Other',
    bg: '#F0EADC',
    color: '#6B6558',
    border: '#E2DACA',
    icon: Utensils,
  },
};

// Quick lookup by UUID or name
const ID_TO_CATEGORY: Record<string, CategoryDefinition> = {};
Object.values(CATEGORIES).forEach((cat) => {
  ID_TO_CATEGORY[cat.id] = cat;
  ID_TO_CATEGORY[cat.name.toLowerCase()] = cat;
});

export function getCategoryDefinition(categoryNameOrId?: string): CategoryDefinition {
  if (!categoryNameOrId) return CATEGORIES.Other;
  return (
    CATEGORIES[categoryNameOrId] ||
    ID_TO_CATEGORY[categoryNameOrId] ||
    ID_TO_CATEGORY[categoryNameOrId.toLowerCase()] ||
    CATEGORIES.Other
  );
}

export function CategoryThumbnail({
  category,
  size = 36,
  className,
}: {
  category?: string;
  size?: number;
  className?: string;
}) {
  const cat = getCategoryDefinition(category);
  const Icon = cat.icon;
  const iconSize = Math.round(size * 0.5);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full shrink-0 select-none ${className || ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: cat.bg,
        color: cat.color,
      }}
    >
      <Icon style={{ width: `${iconSize}px`, height: `${iconSize}px` }} strokeWidth={1.75} />
    </span>
  );
}

export function CategoryChip({
  category,
  className,
}: {
  category?: string;
  className?: string;
}) {
  const cat = getCategoryDefinition(category);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-tight select-none ${className || ''}`}
      style={{
        backgroundColor: cat.bg,
        color: cat.color,
      }}
    >
      {cat.name}
    </span>
  );
}

// Backwards compatibility functions
export const createIngredientIcon = (category: string | undefined): string => {
  const cat = getCategoryDefinition(category);
  return cat.name;
};

export const getIconColor = (category: string | undefined): string => {
  const cat = getCategoryDefinition(category);
  return cat.bg;
};
