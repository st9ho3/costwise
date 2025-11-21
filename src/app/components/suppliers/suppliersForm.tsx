'use client'
import React from 'react'
import ExitButton from '../shared/exitButton'
import Input from './suppliersFormComponents/input'
import { AtSign, Banknote, BookCopy, Globe, LetterText, Phone, Pin, Truck } from 'lucide-react'
import Select from './suppliersFormComponents/select'
import { deliveryOptions, paymentTermsOptions } from '@/app/constants/data'

const SuppliersForm = () => {
  
  return (
    <div className='flex w-5xl h-fit'>
      <ExitButton />
      <form className='flex flex-col p-3 gap-2 flex-grow '>
        <div className='flex justify-between'>
          <Input 
          label='Όνοματεπώνυμο'
          placeholder='Εισάγετε ονοματεπώνυμο'
          type='text'
          icon={LetterText}
          width={50}
           />
          <Input 
          label='Επωνυμία'
          placeholder='π.χ. Διανομεύς ΑΕ'
          type='text'
          icon={LetterText}
          width={50}
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
         />
          <Input
          label='Τηλέφωνο'
          placeholder='π.χ. 6955331016'
          type='number'
          icon={Phone}
          width={50}
         />
         <Input
        label='Website'
        type='url'
        placeholder='www.example.com'
        icon={Globe}
        width={50}
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
           />
          <Select
            label='Πληρωμή'
            icon={Banknote}
            width={30}
            options={paymentTermsOptions}
           />
          <Input
            label='ΑΦΜ'
            type='number'
            placeholder='Προσθέστε το ΑΦΜ'
            icon={BookCopy}
            width={30}
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
        />
          <Input 
          label='Πόλη'
          type='text'
          placeholder='π.χ. Αθήνα'
          width={30}
        />
          <Input 
          label='T.K'
          type='text'
          placeholder='π.χ. 11851'
          width={30}
        />
        </div>
        </div>
        
        
      </form>
      <div className='p-3 flex-grow'>
        
      </div>
    </div>
  )
}

export default SuppliersForm
