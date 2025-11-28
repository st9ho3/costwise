
export const defaultSupplierValues = {
  // Status & Metadata (RHF defaults can often override Zod defaults)
  // For RHF, it's best to explicitly set the default value.
  id: '', 
  userId: '', 
  name: '',
  
  // What they sell
  // Initialize arrays as empty arrays
  category: [], // This should match the type of IngredientCategorySchema[]

  // Contact Info
  contactPerson: '',
  email: '',
  phone: '',
  website: '',

  // Structured Address
  // Initialize nested objects
  address: {
    street: '',
    city: '',
    state: '', 
    postalCode: '',
    country: '',
  },

  // Financial & Admin
  // Pick a sensible default for the required union
  paymentTerms: undefined, 
  vatNumber: '', 
  notes: '',

  // Logistics (Optional)
  // If the field is optional, an empty string or undefined is typically used.
  // Using an empty string is often easier for text/select inputs.
  deliveryTime: undefined, // Or '' if your select uses an empty string for the placeholder
  isActive: false,
  dateAdded: new Date(),
};