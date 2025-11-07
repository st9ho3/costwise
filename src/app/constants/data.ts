import { Column } from "@/shemas/recipe";
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const recipesColumns: Column[] = [
  {
    header: 'Food Name',
    accessor: 'foodName',
    className: "text-gray-500 w-2/4 md:w-3/10 text-sm text-center md:text-left"
  },
  {
    header: 'Tax',
    accessor: 'tax',
    className: "hidden md:table-cell md:w-1.5/10 text-gray-500 text-sm text-left pl-4"
  },
  {
    header: 'Price',
    accessor: 'sellingPrice',
    className: "hidden md:table-cell md:w-1.5/10 text-gray-500 text-sm text-left pl-4"
  },
  {
    header: 'Profit',
    accessor: 'profitMargin',
    className: "hidden md:table-cell md:w-1.5/10 text-gray-500 text-sm text-left pl-4"
  },
  {
    header: 'Cost',
    accessor: 'totalCost',
    className: "hidden md:table-cell text-gray-500 text-sm md:w-1.5/10 text-center md:text-left md:pl-4"
  },
  {
    header: 'Actions',
    accessor: 'actions',
    className: "text-gray-500 text-sm md:w-1/10 text-center md:text-left pl-4"
  }
];

export const recipeSortedLinks = recipesColumns.slice(0,5).map((column) => column.accessor)


export const ingredientColumns: Column[] = [
    {
        header: 'Name',
        accessor: 'name',
        className: "text-gray-500 w-3/6 md:w-4/10 text-sm text-center md:text-left"
    },
    {
        header: 'Price per Unit',
        accessor: 'unitPrice',
        className: "text-gray-500 w-1/6 md:w-2/10 text-sm text-center md: text-start pl-4"
    },
    {
        header: 'Usage',
        accessor: 'usage',
        className: "hidden md:table-cell md:w-2/10 text-gray-500 text-sm text-center md: text-start pl-4"
    },
    {
        header: 'Category',
        accessor: 'category',
        className: "hidden md:table-cell md:w-2/10 text-gray-500 text-sm text-center md: text-start pl-4"
    },
    {
        header: 'Actions',
        accessor: 'actions',
        className: "text-gray-500 w-2/6 md:w-2/10 text-sm text-center md:text-start pl-4"
    }
];
export const ingredientSortedLinks = ingredientColumns.slice(0,4).map((column) => column.accessor)

// Configuration object for different notification variants
export const notificationVariants = {
  success: {
    Icon: CheckCircle2,
    iconClass: 'text-green-600',
    borderClass: 'border-green-300',
    bgClass: 'bg-green-50',
    title: 'Success!',
  },
  failure: {
    Icon: AlertCircle,
    iconClass: 'text-red-600',
    borderClass: 'border-red-300',
    bgClass: 'bg-red-50',
    title: 'An error occurred.',
  },
  info: {
    Icon: Info,
    iconClass: 'text-blue-600',
    borderClass: 'border-blue-300',
    bgClass: 'bg-blue-50',
    title: 'Information',
  },
};

export const typeStyles = {
  // Profit/Usage Styles
  very_low: 'bg-red-200/30 text-red-600',
  low: 'bg-red-300/30 text-red-400',
  medium: 'bg-blue-300/30 text-blue-400',
  high: 'bg-green-300/30 text-green-400',

  // Ingredient Category Styles
  'Produce': 'bg-green-300/30 text-green-500',
  'Meat & Poultry': 'bg-red-300/30 text-red-500',
  'Fish & Seafood': 'bg-blue-300/30 text-blue-500',
  'Dairy & Alternatives': 'bg-yellow-300/30 text-yellow-500',
  'Dry Goods': 'bg-orange-300/30 text-orange-500',
  'Spices & Seasonings': 'bg-amber-300/30 text-amber-500',
  'Oils, Vinegars, & Condiments': 'bg-indigo-300/30 text-indigo-500',
  'Frozen': 'bg-sky-300/30 text-sky-500',
  'Coffee & Tea': 'bg-stone-300/30 text-stone-500',
  'Beverages (Other)': 'bg-cyan-300/30 text-cyan-500',
  'Bakery': 'bg-rose-300/30 text-rose-500',
  'Other': 'bg-gray-300/30 text-gray-500',
  '': 'bg-gray-300/30 text-gray-500', // Fallback for empty string
};



