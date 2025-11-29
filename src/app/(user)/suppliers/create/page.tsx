import SuppliersForm from '@/app/components/suppliers/suppliersForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const SuppliersCreatePage = async() => {

     const session = await auth();
    
        if (!session?.user) {
            redirect('/signin');
        }

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className={`relative w-full max-w-fit p-9 mx-4 transform transition-all duration-300 bg-white rounded-2xl shadow-xl`}>
                {session.user.id && <SuppliersForm userId={session.user.id} />}
            </div>
        </div>
  )
}

export default SuppliersCreatePage
