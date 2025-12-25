import SuppliersForm from '@/app/components/suppliers/suppliersForm'
import { SupplierService } from '@/app/services/suppliersService'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export interface Params {
    params: Promise<{
        id: string
    }>
}

const EditPage = async() => {

  const session = await auth()
  if (!session?.user) {
  redirect("/signin")
  }

  const service = new SupplierService()
  

  const tempId = '11299633-46cc-4746-89d3-ae93a9c1c88d'
  const supplier = await service.findById(tempId)
    
  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className={`relative w-full max-w-fit p-9 mx-4 transform transition-all duration-300 bg-white rounded-2xl shadow-xl`}>
                {session.user.id && <SuppliersForm userId={session.user.id} mode='edit' supplier={supplier}  />}
            </div>
        </div>
  )
}

export default EditPage
