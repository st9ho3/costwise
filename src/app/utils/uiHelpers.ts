export const createIngredientIcon = (category: string | undefined): string => {
  switch (category) {
    case '5dee106a-5050-443e-8368-03397e02af6d': // Produce
      return '🥕';
    case 'a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5': // Meat & Poultry
      return '🥩';
    case '1670a6d4-f212-4770-80c7-0e31c0f4c26b': // Fish & Seafood
      return '🐟';
    case '80662af1-1943-4168-8549-ef721b0e9f54': // Dairy & Alternatives
      return '🧀';
    case 'b660f354-a89d-420c-80d1-ba0f16b433ec': // Dry Goods
      return '🌾';
    case '90aae231-631c-4fed-baf0-929be5a26b13': // Spices & Seasonings
      return '🧂';
    case '25f19080-3387-4470-95df-598817d5ccfe': // Oils, Vinegars, & Condiments
      return '🫙';
    case '83602573-0b31-439c-8890-ee084a547c22': // Frozen
      return '❄️';
    case 'ad6fbf47-f289-4ffb-b070-a5957330a56b': // Coffee & Tea
      return '☕';
    case 'f50e6aea-bb2d-42a1-8778-52cdbfec1540': // Beverages (Other)
      return '🧃';
    case '0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5': // Bakery
      return '🍞';
    case 'ef45178d-e566-4637-b7f9-abcf6d575466': // Other
      return '📦';
    default:
      return '🧾'; // A generic receipt/item icon as a fallback
  }
};

export const getIconColor = (category: string | undefined): string => {
  switch (category) {
    case '5dee106a-5050-443e-8368-03397e02af6d': // Produce
      return 'bg-green-200';
    case 'a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5': // Meat & Poultry
      return 'bg-red-200';
    case '1670a6d4-f212-4770-80c7-0e31c0f4c26b': // Fish & Seafood
      return 'bg-blue-200';
    case '80662af1-1943-4168-8549-ef721b0e9f54': // Dairy & Alternatives
      return 'bg-yellow-200';
    case 'b660f354-a89d-420c-80d1-ba0f16b433ec': // Dry Goods
      return 'bg-orange-200';
    case '90aae231-631c-4fed-baf0-929be5a26b13': // Spices & Seasonings
      return 'bg-amber-200';
    case '25f19080-3387-4470-95df-598817d5ccfe': // Oils, Vinegars, & Condiments
      return 'bg-indigo-200';
    case '83602573-0b31-439c-8890-ee084a547c22': // Frozen
      return 'bg-sky-200';
    case 'ad6fbf47-f289-4ffb-b070-a5957330a56b': // Coffee & Tea
      return 'bg-stone-200';
    case 'f50e6aea-bb2d-42a1-8778-52cdbfec1540': // Beverages (Other)
      return 'bg-cyan-200';
    case '0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5': // Bakery
      return 'bg-rose-200';
    case 'ef45178d-e566-4637-b7f9-abcf6d575466': // Other
    default:
      return 'bg-gray-200';
  }
};