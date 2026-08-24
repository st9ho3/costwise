import { Column } from "@costwise/shared/recipe";

export const recipesColumns: Column[] = [
  {
    header: "Dish",
    accessor: "foodName",
    className: "w-[32%] text-left",
  },
  {
    header: "VAT",
    accessor: "tax",
    className: "hidden md:table-cell w-[11%] text-left pl-4",
  },
  {
    header: "Menu price",
    accessor: "sellingPrice",
    className: "w-[15%] text-left pl-4",
  },
  {
    header: "What you keep",
    accessor: "profitMargin",
    className: "hidden md:table-cell w-[16%] text-left pl-4",
  },
  {
    header: "Plate cost",
    accessor: "totalCost",
    className: "hidden md:table-cell w-[15%] text-left pl-4",
  },
  {
    header: "Actions",
    accessor: "actions",
    className: "w-[11%] text-right pr-2",
  },
];

export const recipeSortedLinks = recipesColumns
  .slice(0, 5)
  .map((column) => column.accessor);

export const ingredientColumns: Column[] = [
  {
    header: "Ingredient",
    accessor: "name",
    className: "w-[34%] text-left",
  },
  {
    header: "What it costs",
    accessor: "unitPrice",
    className: "w-[20%] text-left pl-4",
  },
  {
    header: "How often",
    accessor: "usage",
    className: "hidden md:table-cell w-[16%] text-left pl-4",
  },
  {
    header: "Kind",
    accessor: "category",
    className: "hidden md:table-cell w-[19%] text-left pl-4",
  },
  {
    header: "Actions",
    accessor: "actions",
    className: "w-[11%] text-right pr-2",
  },
];

export const ingredientSortedLinks = ingredientColumns
  .slice(0, 4)
  .map((column) => column.accessor);

export const supplierColumns: Column[] = [
  {
    header: "Supplier",
    accessor: "name",
    className: "w-[28%] text-left",
  },
  {
    header: "Who you talk to",
    accessor: "contactPerson",
    className: "hidden sm:table-cell w-[22%] text-left pl-4",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell w-[24%] text-left pl-4 truncate",
  },
  {
    header: "Delivery",
    accessor: "deliveryTime",
    className: "w-[15%] text-left pl-4",
  },
  {
    header: "Actions",
    accessor: "actions",
    className: "w-[11%] text-right pr-2",
  },
];

export const supplierSortedLinks = supplierColumns
  .slice(0, 4)
  .map((column) => column.accessor);

// Canonical Delivery & Payment options
export const DELIVERY_OPTIONS = [
  { value: "", label: "Pick one" },
  { value: "Same Day", label: "Same day" },
  { value: "1-2 Days", label: "1-2 days" },
  { value: "2-3 Days", label: "2-3 days" },
  { value: "Up to 5 days", label: "Up to 5 days" },
  { value: "Weekly", label: "Weekly" },
];

export const PAYMENT_OPTIONS = [
  { value: "", label: "Pick one" },
  { value: "Due on Receipt", label: "Due on receipt" },
  { value: "Net 30", label: "Net 30 (30 days)" },
  { value: "Net 60", label: "Net 60 (60 days)" },
  { value: "Net 90", label: "Net 90 (90 days)" },
  { value: "COD", label: "COD (Cash on delivery)" },
  { value: "Prepaid", label: "Prepaid (Paid up front)" },
];

