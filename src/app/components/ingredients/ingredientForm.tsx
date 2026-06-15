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
import FormSelect from './ingredientsFormComponents/FormSelect';
import { categoryOptions, unitOptions } from './ingredientsFormComponents/selectOptions';
import { Tag, Scale, Truck } from 'lucide-react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import Modal from '../shared/modal';
import ItemsStore from '../shared/itemsStore';
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
     modalType,
     fields,
     append,
     remove
  } = useIngredientForm({ ingredient, mode, userId, supplierOptions });
  
  return (
    <form 
      className="w-full max-w-3xl mx-auto p-2 md:mt-4" 
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* SINGLE CARD CONTAINER: Fits content efficiently */}
      <Card className="p-6">
        
        {/* GRID LAYOUT: 12-column grid for precise sizing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          
          {/* --- ROW 1: Name & Category --- */}
          
          {/* Name: Takes up ~60% of width */}
          <div className="md:col-span-7">
            <Label className="mb-1.5 ml-1 block">Ingredient Name</Label>
            <IngredientNameInput register={register} onKeyDown={handleKeyDown} />
          </div>

          {/* Category: Takes up ~40% of width */}
          <div className="md:col-span-5"> 
             <Label className="mb-1.5 ml-1 block">Category</Label>
             <FormSelect 
               fieldName="category"
               options={categoryOptions}
               placeholder="Select a Category"
               icon={Tag}
               register={register}
               onKeyDown={handleKeyDown}
               getValue={(opt) => opt.value}
               getLabel={(opt) => opt.name}
             />
          </div>


          {/* --- ROW 2: Supplier, Quantity, Unit, Price --- */}
          <div className='w-full flex flex-col'>
            {fields.map((field, index) => 

          <div key={field.id} className='w-full md:flex items-center border'>
          {/* Supplier - uses confirmed suppliers for display */}
          <div className='md:row-span-3'>
            <FormSelect 
               fieldName={`suppliers.${index}.suppliersId`}
               options={supplierOptions}
               placeholder="Supplier"
               icon={Scale}
               register={register}
               onKeyDown={handleKeyDown}
               getValue={(opt) => opt.id}
               getLabel={(opt) => opt.name}
             />
          </div>
        
          {/* Quantity: Takes up ~33% */}
           <div className="md:col-span-3">
            <Label className="mb-1.5 ml-1 block">Quantity</Label>
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
            <Label className="mb-1.5 ml-1 block">Unit</Label>
            <FormSelect 
               fieldName="unit"
               options={unitOptions}
               placeholder="Unit"
               icon={Scale}
               register={register}
               onKeyDown={handleKeyDown}
               getValue={(opt) => opt.value}
               getLabel={(opt) => opt.name}
             />
          </div>

          {/* Price: Takes up ~42% (Remaining space) */}
          <div className="md:col-span-3">
            <Label className="mb-1.5 ml-1 block">Price / Unit</Label>
            <IngredientPriceInput
              onChange={setValue}
              price={price}
            />
          </div>
          <button onClick={() => append({ suppliersId: "", unit: "", quantity: 1, price: 0, isActive: false })}>Add</button>
        </div>
        
        )}
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
      </Card>

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