
import React from 'react'
import { FieldErrors } from 'react-hook-form'


const ErrorDisplay = ({error, errors}: {error: string | undefined, errors: string[], pricingErrors: FieldErrors}) => {
  return (
    <div>
      {errors.map((e: string) => <p key={e} className='text-red-500 ml-3'> {e} </p>  )}
      <p className='text-red-500 ml-3'> {error} </p>
    </div>
    
    
   
  )
}

export default ErrorDisplay
