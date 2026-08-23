import { useEffect, useState } from 'react'

interface useDebounceProps {
    searchTerm: string
    delay: number
}
const useDebounce = ({searchTerm, delay}: useDebounceProps) => {

    const [debouncedValue, setDebouncedValue] = useState('')

    useEffect(() => {

       const timer = setTimeout(() => {
            setDebouncedValue(searchTerm)
        }, delay)

        return () => clearTimeout(timer)
        
    }, [searchTerm,delay])

  return {
    debouncedValue
  }
}

export default useDebounce
