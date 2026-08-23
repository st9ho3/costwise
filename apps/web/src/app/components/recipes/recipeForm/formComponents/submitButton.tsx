import React, { memo } from 'react'
import { Check } from 'lucide-react'

interface Props {
    mode: "create" | "edit"
    isSubmitting: boolean
}

const SubmitButton = memo(({isSubmitting, mode}: Props) => {

  let buttonText = ""

  if (isSubmitting) {
    buttonText = mode === "create" ? "Submitting..." : "Updating..."
  } else {
    buttonText = mode === "create" ? "Add" : "Update"
  } 

  return (
    <div className='flex justify-center'>
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors w-full sm:w-auto flex-shrink-0" >
          {!isSubmitting && <Check />}
          <button type='submit' disabled={isSubmitting}  > {buttonText} </button>
        </div>
      </div>
  )
})

SubmitButton.displayName = "SubmitButton"

export default SubmitButton
