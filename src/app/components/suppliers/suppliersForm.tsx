'use client'
import React from 'react'
import ExitButton from '../shared/exitButton'
import Input from './suppliersFormComponents/input'
import { AtSign, Banknote, BookCopy, ChevronDown, Globe, LetterText, Phone, Pin, Tag, Truck } from 'lucide-react'
import Select from './suppliersFormComponents/select'
import { deliveryOptions, paymentTermsOptions } from '@/app/constants/data'
import useSuppliersForm from '@/app/hooks/useSuppliersForm'
import { INGREDIENT_CATEGORIES as categories } from '@/app/constants/supplierDeafaultValues'
import { Supplier } from '@/shemas/recipe'
import SelectStore from '../shared/SelectStore'
import Modal from '../shared/modal'
import { useUIStore } from '@/app/stores/uiStore'
import { SubmitButton } from '@/app/constants/components'

interface SuppliersFormProps {
  userId: string 
  mode: 'create' | 'edit'
  supplier?: Supplier | undefined
}

const SuppliersForm = ({userId, mode, supplier}: SuppliersFormProps) => {
  
  const {register, handleSubmit, onSubmit, formState: {isSubmitting}, selectCategory, tempCategories} = useSuppliersForm({userId, mode, supplier})
  const { isModalOpen, modalType, openModal, closeModal } = useUIStore()
console.log(isModalOpen, modalType)
  // Get names of selected categories for display
  const selectedNames = categories
    .filter((cat) => tempCategories.includes(cat.id))
    .map((cat) => cat.name);

  const displayText = selectedNames.length > 0 
    ? selectedNames.slice(0, 2).join(', ') + (selectedNames.length > 2 ? ` +${selectedNames.length - 2}` : '')
    : 'Επιλέξτε κατηγορίες...';

  return (
    <div className='flex w-5xl h-fit'>
      <ExitButton />
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-3 gap-2 w-4/5 '>
        <div className='flex justify-between'>
          <Input 
          label='Όνοματεπώνυμο'
          placeholder='Εισάγετε ονοματεπώνυμο'
          type='text'
          icon={LetterText}
          width={50}
          register={register}
          name='contactPerson'
           />
          <Input 
          label='Επωνυμία'
          placeholder='π.χ. Διανομεύς ΑΕ'
          type='text'
          icon={LetterText}
          width={50}
          register={register}
          name='name'
           />
        </div>
        <hr className='border-gray-100 my-2' />
        <div className='flex flex-col gap-2'>
          
          <div className='flex'>
          <Input
          label='Email'
          placeholder='f_kiritsis@gmail.com'
          type='email'
          icon={AtSign}
          width={50}
          register={register}
          name='email'
         />
          <Input
          label='Τηλέφωνο'
          placeholder='π.χ. 6955331016'
          type='number'
          icon={Phone}
          width={50}
          register={register}
          name='phone'
         />
         <Input
        label='Website'
        type='text'
        placeholder='www.example.com'
        icon={Globe}
        width={50}
        register={register}
        name='website'
         />
        </div>
        </div>
        <hr className='border-gray-100 my-2' />
        <div className='flex gap-2'>
          <Select
            label='Παράδοση'
            icon={Truck}
            width={30}
            options={deliveryOptions}
            register={register}
            name='deliveryTime'
           />
          <Select
            label='Πληρωμή'
            icon={Banknote}
            width={30}
            options={paymentTermsOptions}
            register={register}
            name='financialData.paymentTerms'
           />
          <Input
            label='ΑΦΜ'
            type='number'
            placeholder='Προσθέστε το ΑΦΜ'
            icon={BookCopy}
            width={30}
            register={register}
            name='financialData.vatNumber'
           />
        </div>
        <hr className='border-gray-100 my-2' />
        <div className='flex flex-col'>
          <div className='flex gap-2'>
          <Input 
          label='Διεύθυνση'
          type='text'
          placeholder='Σολωμού 49'
          icon={Pin}
          width={30}
          register={register}
          name='address.street'
        />
          <Input 
          label='Πόλη'
          type='text'
          placeholder='π.χ. Αθήνα'
          width={30}
          register={register}
          name='address.city'
        />
          <Input 
          label='T.K'
          type='text'
          placeholder='π.χ. 11851'
          width={30}
          register={register}
          name='address.postalCode'
        />
        </div>
        </div>
        

        {/* Categories Input Trigger */}
        <div className='flex flex-col gap-1 mt-4'>
          <label className="text-sm font-medium text-gray-600 ml-1">Κατηγορίες</label>
          <div
            onClick={() => openModal('categories')}
            className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className={`text-sm truncate ${selectedNames.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                {displayText}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
          {tempCategories.length > 0 && (
            <span className="text-xs text-emerald-600 ml-1">
              {tempCategories.length} επιλεγμένα
            </span>
          )}
        </div>
        <SubmitButton mode={mode} isSubmitting={isSubmitting} />
      </form>

      {/* Categories Selection Modal */}
      <Modal isOpen={isModalOpen && modalType.type === 'categories'} onClose={closeModal} type="create">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Επιλογή Κατηγοριών</h3>
            <p className="text-sm text-gray-400 mt-1">Επιλέξτε τις κατηγορίες που προμηθεύει</p>
          </div>
          <SelectStore 
            items={categories} 
            selected={tempCategories} 
            onSelect={selectCategory}
            className="flex flex-wrap gap-2 justify-center"
          />
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Επιβεβαίωση
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SuppliersForm
