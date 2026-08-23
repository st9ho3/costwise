import { Column } from "@/shemas/recipe";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

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

export type DeliveryOption = {
  value: string;
  text: string;
};

export type PaymentTermOption = {
  value: string;
  text: string;
};

export const deliveryOptions: DeliveryOption[] = DELIVERY_OPTIONS.map((d) => ({
  value: d.value,
  text: d.label,
}));

export const PAYMENT_OPTIONS = [
  { value: "", label: "Pick one" },
  { value: "Due on Receipt", label: "Due on receipt" },
  { value: "Net 30", label: "Net 30 (30 days)" },
  { value: "Net 60", label: "Net 60 (60 days)" },
  { value: "Net 90", label: "Net 90 (90 days)" },
  { value: "COD", label: "COD (Cash on delivery)" },
  { value: "Prepaid", label: "Prepaid (Paid up front)" },
];

export const paymentTermsOptions: PaymentTermOption[] = PAYMENT_OPTIONS.map((p) => ({
  value: p.value,
  text: p.label,
}));

export const categorySeedData = [
  { id: "5dee106a-5050-443e-8368-03397e02af6d", category: "Produce" },
  { id: "a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5", category: "Meat & Poultry" },
  { id: "1670a6d4-f212-4770-80c7-0e31c0f4c26b", category: "Fish & Seafood" },
  { id: "80662af1-1943-4168-8549-ef721b0e9f54", category: "Dairy & Alternatives" },
  { id: "b660f354-a89d-420c-80d1-ba0f16b433ec", category: "Dry Goods" },
  { id: "90aae231-631c-4fed-baf0-929be5a26b13", category: "Spices & Seasonings" },
  { id: "25f19080-3387-4470-95df-598817d5ccfe", category: "Oils, Vinegars, & Condiments" },
  { id: "83602573-0b31-439c-8890-ee084a547c22", category: "Frozen" },
  { id: "ad6fbf47-f289-4ffb-b070-a5957330a56b", category: "Coffee & Tea" },
  { id: "f50e6aea-bb2d-42a1-8778-52cdbfec1540", category: "Beverages (Other)" },
  { id: "0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5", category: "Bakery" },
  { id: "ef45178d-e566-4637-b7f9-abcf6d575466", category: "Other" },
];

export const notificationVariants = {
  success: {
    Icon: CheckCircle2,
    iconClass: "text-green-700",
    borderClass: "border-green-200",
    bgClass: "bg-green-50",
    title: "Filed",
  },
  failure: {
    Icon: AlertCircle,
    iconClass: "text-tomato-600",
    borderClass: "border-tomato-200",
    bgClass: "bg-tomato-50",
    title: "One number short",
  },
  info: {
    Icon: Info,
    iconClass: "text-blueberry-600",
    borderClass: "border-blueberry-200",
    bgClass: "bg-blueberry-50",
    title: "Information",
  },
};
