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

export const unselectedTypeStyles = {
  // Ingredient Category Styles
  'Produce': 'border-green-300/30 text-green-500',
  'Meat & Poultry': 'border-red-300/30 text-red-500',
  'Fish & Seafood': 'border-blue-300/30 text-blue-500',
  'Dairy & Alternatives': 'border-yellow-300/30 text-yellow-500',
  'Dry Goods': 'border-orange-300/30 text-orange-500',
  'Spices & Seasonings': 'border-amber-300/30 text-amber-500',
  'Oils, Vinegars, & Condiments': 'border-indigo-300/30 text-indigo-500',
  'Frozen': 'border-sky-300/30 text-sky-500',
  'Coffee & Tea': 'border-stone-300/30 text-stone-500',
  'Beverages (Other)': 'border-cyan-300/30 text-cyan-500',
  'Bakery': 'border-rose-300/30 text-rose-500',
  'Other': 'border-gray-300/30 text-gray-500',
  '': 'border-gray-300/30 text-gray-500', // Fallback for empty string
}

// Define the data array with the specific UUIDs
export const categorySeedData = [
  { id: "5dee106a-5050-443e-8368-03397e02af6d", category: 'Produce' },
  { id: "a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5", category: 'Meat & Poultry' },
  { id: "1670a6d4-f212-4770-80c7-0e31c0f4c26b", category: 'Fish & Seafood' },
  { id: "80662af1-1943-4168-8549-ef721b0e9f54", category: 'Dairy & Alternatives' },
  { id: "b660f354-a89d-420c-80d1-ba0f16b433ec", category: 'Dry Goods' },
  { id: "90aae231-631c-4fed-baf0-929be5a26b13", category: 'Spices & Seasonings' },
  { id: "25f19080-3387-4470-95df-598817d5ccfe", category: 'Oils, Vinegars, & Condiments' },
  { id: "83602573-0b31-439c-8890-ee084a547c22", category: 'Frozen' },
  { id: "ad6fbf47-f289-4ffb-b070-a5957330a56b", category: 'Coffee & Tea' },
  { id: "f50e6aea-bb2d-42a1-8778-52cdbfec1540", category: 'Beverages (Other)' },
  { id: "0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5", category: 'Bakery' },
  { id: "ef45178d-e566-4637-b7f9-abcf6d575466", category: 'Other' },
];

export const deliveryOptions = [
  {
    value: '',
    text: '--'
  },
  {
    value: 'Same Day',
    text: 'Αυθημερόν' // Same Day
  },
  {
    value: '1-2 Days',
    text: '1-2 Ημέρες' // 1-2 Days
  },
  {
    value: '2-3 Days',
    text: '2-3 Ημέρες' // 2-3 Days
  },
  {
    value: 'Up to 5 days',
    text: 'Έως 5 Ημέρες' // Up to 5 days
  },
  {
    value: 'Weekly',
    text: 'Εβδομαδιαίως' // Weekly
  }
]

export type DeliveryOption = typeof deliveryOptions[number];

export const paymentTermsOptions = [
  {
    value: '',
    text: '--' // Placeholder/Default
  },
  {
    value: 'Net 30',
    text: '30 Ημέρες' // Net 30 Days (Πληρωτέο σε 30 ημέρες)
  },
  {
    value: 'Net 60',
    text: '60 Ημέρες' // Net 60 Days
  },
  {
    value: 'Net 90',
    text: '90 Ημέρες' // Net 60 Days
  },
  {
    value: 'Due on Receipt',
    text: 'Άμεσα Πληρωτέο' // Due on Receipt (Πληρωτέο με την παραλαβή)
  },
  {
    value: 'COD',
    text: 'Αντικαταβολή' // Cash on Delivery (Αντικαταβολή)
  },
  {
    value: 'Prepaid',
    text: 'Προπληρωμένο' // Prepaid (Προπληρωμή)
  }
] 

export type PaymentTermOption = typeof paymentTermsOptions[number];