/**
 * - Defines the initial default values for a recipe form.
 * - Matches the `FormFields` type to ensure type safety and consistent form state initialization.
 * - Includes placeholder values for all recipe properties, including metadata, pricing, and image URL.
 */
import { FormFields } from "../hooks/useRecipeForm"

export const defaultValues: FormFields = {
    
      id: '',
      title: '',
      totalCost: 0, 
      category: 'starter',
      createdBy: 'User',
      dateCreated: new Date(),
      tax: 0,
      sellingPrice: 0, 
      profitMargin: 0,
      foodCost: 0, 
      imgPath: "https://yqbnjpxj7oneobhf.public.blob.vercel-storage.com/beef%20burger.png",
      userId:  " "
}

