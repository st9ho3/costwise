'use client'
import React from 'react'
import ExitButton from '../shared/exitButton'
import Input from './suppliersFormComponents/input'
import { AtSign, Banknote, BookCopy, Globe, LetterText, Phone, Pin, Tag, Truck } from 'lucide-react'
import Select from './suppliersFormComponents/select'
import { deliveryOptions, paymentTermsOptions } from '@/app/constants/data'
import useSuppliersForm from '@/app/hooks/useSuppliersForm'
import { INGREDIENT_CATEGORIES as categories } from '@/app/constants/supplierDeafaultValues'
import { Supplier } from '@/shemas/recipe'
import Modal from '../shared/modal'
import { useUIStore } from '@/app/stores/uiStore'
import { SubmitButton } from '@/app/constants/components'
import ItemsStore from '../shared/itemsStore'
import MultipleSelect from '../shared/multipleSelect'

interface SuppliersFormProps {
  userId: string 
  mode: 'create' | 'edit'
  supplier?: Supplier | undefined
}

const SuppliersForm = ({userId, mode, supplier}: SuppliersFormProps) => {
  
  const {register, handleSubmit, onSubmit, formState: {isSubmitting}, selectCategory, tempCategories, clearTempCategories} = useSuppliersForm({userId, mode, supplier})
  const { isModalOpen, modalType, closeModal } = useUIStore()

  /**
   * Handle modal close with cleanup logic.
   * If tempCategories exist, clear them before closing.
   */
  const handleCloseModal = () => {
    if (tempCategories.length > 0) {
      clearTempCategories()
    }
    closeModal()
  }

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
        <MultipleSelect
          selectedItems={categories.filter((cat) => tempCategories.includes(cat.id))}
          label="Κατηγορίες"
          placeholder="Επιλέξτε κατηγορίες..."
          modalType="categories"
          icon={Tag}
          getDisplayNames={(items) => items.map((item) => item.name)}
        />
        <SubmitButton mode={mode} isSubmitting={isSubmitting} />
      </form>

      {/* Categories Selection Modal */}
      <Modal isOpen={isModalOpen && modalType.type === 'categories'} onClose={handleCloseModal} type="create">
        <ItemsStore
          items={categories}
          selected={tempCategories}
          onSelect={selectCategory}
          title="Επιλογή Κατηγοριών"
          description="Επιλέξτε τις κατηγορίες που προμηθεύει"
          onClose={closeModal}
        />
      </Modal>
    </div>
  )
}

export default SuppliersForm
