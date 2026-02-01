// src/components/ingredients/IngredientForm.tsx

"use client"
import React from 'react';
import { 
  IngredientNameInput, 
  IngredientPriceInput, 
  IngredientSummary, 
  AddIngredientButton, 
  FormErrors 
} from '../../constants/components';
import Incremental from '../shared/incremental';
import { Ingredient } from '@/shemas/recipe';
import { useIngredientForm } from '../../hooks/useIngredientsForm';
import FormSelect, { SelectOption } from './ingredientsFormComponents/FormSelect';
import { categoryOptions, unitOptions } from './ingredientsFormComponents/selectOptions';
import { Tag, Scale, Truck } from 'lucide-react';
import Modal from '../shared/modal';
import ItemsStore from '../shared/itemsStore';
import MultipleSelect from '../shared/multipleSelect';
import { SelectableItem } from '../shared/SelectStore';

type AddIngredientProps = {
  ingredient: Ingredient | undefined
  mode: 'create' | 'edit'
  userId: string
  supplierOptions: SelectableItem[]
};

const IngredientForm = ({ ingredient, mode, userId, supplierOptions}: AddIngredientProps) => {
  // All supplier selection and modal logic now managed by the hook
  const {
     price, error, register, quantity, unit, name,
     setErrors, handleKeyDown, handleSubmit, onSubmit, setValue, isSubmitting,
     tempSuppliers,
     selectSupplier,
     confirmSuppliers,
     handleCloseModal,
     getSelectedSupplierItems,
     isModalOpen,
     modalType
  } = useIngredientForm({ ingredient, mode, userId, supplierOptions });
  console.log(error)
  return (
    <form 
      className="w-full max-w-3xl mx-auto p-2 md:mt-4" 
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* SINGLE CARD CONTAINER: Fits content efficiently */}
      <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">
        
        {/* GRID LAYOUT: 12-column grid for precise sizing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          
          {/* --- ROW 1: Name & Category --- */}
          
          {/* Name: Takes up ~60% of width */}
          <div className="md:col-span-7">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
              Ingredient Name
            </label>
            <IngredientNameInput register={register} onKeyDown={handleKeyDown} />
          </div>

          {/* Category: Takes up ~40% of width */}
          <div className="md:col-span-5">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
               Category
             </label>
             <FormSelect 
               fieldName="category"
               options={categoryOptions}
               placeholder="Select a Category"
               icon={Tag}
               register={register}
               onKeyDown={handleKeyDown}
             />
          </div>


          {/* --- ROW 2: Supplier, Quantity, Unit, Price --- */}
         
          {/* Supplier - uses confirmed suppliers for display */}
          <div className='md:col-span-3'>
            <MultipleSelect
              selectedItems={getSelectedSupplierItems()}
              label="SUPPLIERS"
              placeholder="Select suppliers..."
              modalType="suppliers"
              icon={Truck}
              getDisplayNames={(items) => items.map((item) => item.name)}
            />
          </div>
        
          {/* Quantity: Takes up ~33% */}
           <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
              Quantity
            </label>
            <div className="w-full flex justify-center">
              <Incremental 
                onIngredientChange={setValue} 
                count={quantity} 
                onKeyDown={handleKeyDown} 
                setErrors={setErrors} 
              />
            </div>
          </div>

          {/* Unit: Takes up ~25% */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
              Unit
            </label>
            <FormSelect 
               fieldName="unit"
               options={unitOptions}
               placeholder="Unit"
               icon={Scale}
               register={register}
               onKeyDown={handleKeyDown}
             />
          </div>

          {/* Price: Takes up ~42% (Remaining space) */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
              Price / Unit
            </label>
            <IngredientPriceInput
              onChange={setValue}
              price={price}
            />
          </div>
        </div>

        {/* --- FOOTER SECTION: Summary & Actions --- */}
        <div className="mt-6 space-y-4">
            {/* Dynamic Summary */}
            <div className="min-h-[80px]"> {/* Min-height prevents layout jump */}
                <IngredientSummary quantity={quantity} unit={unit} name={name} price={price} />
            </div>

            {/* Error Feedback */}
            <FormErrors errors={error} />

            {/* Action Button: Right aligned */}
            <div className="flex justify-end pt-2">
                <div className="w-full md:w-auto min-w-[160px]">
                    <AddIngredientButton mode={mode} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
      </div>

      {/* Suppliers Selection Modal */}
      <Modal isOpen={isModalOpen && modalType.type === 'suppliers'} onClose={handleCloseModal} type="create">
        <ItemsStore
          items={supplierOptions}
          selected={tempSuppliers}
          onSelect={selectSupplier}
          title="Select Suppliers"
          description="Choose suppliers for this ingredient"
          onClose={confirmSuppliers}
        />
      </Modal>
    </form>
  );
};

export default IngredientForm;