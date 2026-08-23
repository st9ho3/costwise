/**
 * - Requires an active user session; redirects to "/signin" if the user is not authenticated.
 * - Accepts a dynamic route parameter `id` (representing a recipe ID) and displays it on the page.
 * - Uses Next.js App Router's async params handling to extract the `id` from the URL.
 */
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const page = async({params}: {params: Promise<{id: string}>}) => {

  const session = await auth()
    
    if (!session?.user) {
      redirect("/signin")
    }

  const {id} = await params

  return (
    <div>
      {`Recipe: ${id}`}
    </div>
  )
}

export default page
