import { IngredientCategory } from '@/shemas/recipe';
import { v4 as uuidv4 } from 'uuid';

export const getDefaultSupplierValues = () => ({
  id: uuidv4(), // ✅ Fresh UUID each time
  userId: '', 
  name: '',
  category: [] as IngredientCategory[],
  contactPerson: '',
  email: '',
  phone: '',
  website: '',
  address: {
    street: '',
    city: '',
    state: '', 
    postalCode: '',
    country: '',
  },
  
    paymentTerms: '', 
    vatNumber: '',
  notes: '',
  deliveryTime: undefined, 
  isActive: false,
  dateAdded: new Date(), // ✅ Fresh date each time too
});

export const INGREDIENT_CATEGORIES = [
  { name: 'Produce', id: '5dee106a-5050-443e-8368-03397e02af6d', icon: '🥕' },
  { name: 'Meat & Poultry', id: 'a7b9013d-8f0d-4ef5-96fa-1f91df6e7fb5', icon: '🥩' },
  { name: 'Fish & Seafood', id: '1670a6d4-f212-4770-80c7-0e31c0f4c26b', icon: '🐟' },
  { name: 'Dairy & Alternatives', id: '80662af1-1943-4168-8549-ef721b0e9f54', icon: '🧀' },
  { name: 'Dry Goods', id: 'b660f354-a89d-420c-80d1-ba0f16b433ec', icon: '🌾' },
  { name: 'Spices & Seasonings', id: '90aae231-631c-4fed-baf0-929be5a26b13', icon: '🧂' },
  { name: 'Oils, Vinegars, & Condiments', id: '25f19080-3387-4470-95df-598817d5ccfe', icon: '🫙' },
  { name: 'Frozen', id: '83602573-0b31-439c-8890-ee084a547c22', icon: '❄️' },
  { name: 'Coffee & Tea', id: 'ad6fbf47-f289-4ffb-b070-a5957330a56b', icon: '☕' },
  { name: 'Beverages (Other)', id: 'f50e6aea-bb2d-42a1-8778-52cdbfec1540', icon: '🧃' },
  { name: 'Bakery', id: '0d4584b2-8bfa-4a82-9f11-a3b88af2d6c5', icon: '🍞' },
  { name: 'Other', id: 'ef45178d-e566-4637-b7f9-abcf6d575466', icon: '📦' },
] as const;


