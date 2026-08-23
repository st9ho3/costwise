"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

const ExitButton = () => {

    const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 right-4 flex items-center justify-center size-8 rounded-full border border-primary bg-card text-foreground hover:bg-neutral-100 active:translate-y-[1px] active:translate-x-[1px] transition-all focus:outline-none focus:ring-2 focus:ring-focus-accent"
      aria-label="Close modal"
    >
      <X className="size-4" />
    </button>
  )
}

export default ExitButton
