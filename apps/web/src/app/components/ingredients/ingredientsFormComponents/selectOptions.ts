// src/components/ingredients/ingredientsFormComponents/selectOptions.ts

import { SelectOption } from "./FormSelect";

export const categoryOptions: SelectOption[] = [
  { value: "5dee106a-5050-443e-8368-03397e02af6d", name: "🥕 Produce" },
  { value: "a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5", name: "🥩 Meat & Poultry" },
  { value: "1670a6d4-f212-4770-80c7-0e31c0f4c26b", name: "🐟 Fish & Seafood" },
  {
    value: "80662af1-1943-4168-8549-ef721b0e9f54",
    name: "🧀 Dairy & Alternatives",
  },
  { value: "b660f354-a89d-420c-80d1-ba0f16b433ec", name: "🌾 Dry Goods" },
  {
    value: "90aae231-631c-4fed-baf0-929be5a26b13",
    name: "🧂 Spices & Seasonings",
  },
  {
    value: "25f19080-3387-4470-95df-598817d5ccfe",
    name: "🫙 Oils, Vinegars, & Condiments",
  },
  { value: "83602573-0b31-439c-8890-ee084a547c22", name: "❄️ Frozen" },
  { value: "ad6fbf47-f289-4ffb-b070-a5957330a56b", name: "☕ Coffee & Tea" },
  {
    value: "f50e6aea-bb2d-42a1-8778-52cdbfec1540",
    name: "🧃 Beverages (Other)",
  },
  { value: "0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5", name: "🍞 Bakery" },
  { value: "ef45178d-e566-4637-b7f9-abcf6d575466", name: "📦 Other" },
];

export const unitOptions: SelectOption[] = [
  { value: "kg", name: "kg (Kilogram)" },
  { value: "L", name: "L (Liter)" },
  { value: "g", name: "g (Gram)" },
  { value: "ml", name: "ml (Milliliter)" },
  { value: "piece", name: "Piece / Count" },
];
