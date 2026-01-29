'use client'
import { IngredientCategory, Supplier, SupplierSchema } from '@/shemas/recipe';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaultSupplierValues, INGREDIENT_CATEGORIES as categories } from '../constants/supplierDeafaultValues';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useState } from 'react';
import { createSupplier, updateSupplier } from '../services/services';
import { useRouter } from 'next/navigation';
import { getArrayChanges } from '../utils/transformers';
import useHelpers from './useHelpers';
import { useUIStore } from '../stores/uiStore';

export type FormFields = z.infer<typeof SupplierSchema>;

interface UseSuppliersFormProps {
  userId: string
  mode: 'create' | 'edit'
  supplier: Supplier | undefined
}

const useSuppliersForm = ({userId, mode, supplier}: UseSuppliersFormProps) => {

    const {register, handleSubmit, reset, formState} = useForm<FormFields>({
        defaultValues: mode === 'create' ? getDefaultSupplierValues() : supplier,
        resolver: zodResolver(SupplierSchema)
    })
    const router = useRouter()
    const {raiseNotification} = useHelpers({path: null})
    const { isModalOpen, modalType, closeModal } = useUIStore()
    
    const INITIAL_STATE = mode === 'edit' && supplier ? supplier.category : []
    const [existingCategories] = useState<IngredientCategory[] | undefined>(supplier?.category)
    const [tempCategories, setTempCategories] = useState<IngredientCategory[]>(INITIAL_STATE)
    // Confirmed categories persist after modal confirmation - fixes bug where categories disappear when modal is reopened
    const [confirmedCategories, setConfirmedCategories] = useState<IngredientCategory[]>(INITIAL_STATE)
    

    const selectCategory = (id: IngredientCategory) => {
      if (!tempCategories.includes(id)) {
        setTempCategories([...tempCategories, id])
      } else {
        const filteredCategories = tempCategories.filter((category) => category !== id)
        setTempCategories(filteredCategories)
      }
    } 

    /**
     * Confirms the current temp categories selection.
     * Called when user clicks "Confirm" in the modal.
     */
    const confirmCategories = () => {
      setConfirmedCategories([...tempCategories])
      closeModal()
    }

    /**
     * Handles modal close without confirming.
     * Restores temp categories from confirmed state.
     */
    const handleCloseModal = () => {
      setTempCategories([...confirmedCategories])
      closeModal()
    }

    /**
     * Gets the category items that are currently confirmed for display
     */
    const getSelectedCategoryItems = () => {
      return categories.filter((cat) => confirmedCategories.includes(cat.id))
    }
    
    const resetForm = () => {
      setTimeout(() => {
        reset()
        setTempCategories([]) 
        setConfirmedCategories([])
        router.replace("/suppliers")
      }, 1000)
      
    }

    const onSubmit = async(data: FormFields) => {

      const supplier = {...data, category: confirmedCategories, userId: userId}


      if (mode === 'create') {

         const response = await createSupplier(supplier, confirmedCategories, [])
         raiseNotification(response)
        resetForm()
        
      } else {

        if (!existingCategories) {
          return {added: [''], removed: ['']}
        }
        
        const {added, removed} = getArrayChanges(existingCategories, confirmedCategories)

        await updateSupplier(supplier, added, removed)
        router.refresh()
        router.replace('/suppliers')
      }
     
    } 

  return {
    register,
    handleSubmit,
    reset,
    formState,
    onSubmit,
    selectCategory,
    tempCategories,
    confirmedCategories,
    confirmCategories,
    handleCloseModal,
    getSelectedCategoryItems,
    isModalOpen,
    modalType,
    closeModal
  }
}

export default useSuppliersForm
