import React, { useEffect, useState } from 'react'
import { search } from '../services/services'
import { Ingredient, Recipe } from '@costwise/shared/recipe'
import useDebounce from './useDebounce'

export interface Results {
    ingredients: Ingredient[] | undefined
    recipes: Recipe[] | undefined
}

const useSearch = () => {
    
    const [searchTerm, setSearchTerm] = useState<string>('')
    const {debouncedValue} = useDebounce({searchTerm, delay: 300})
    const [results, setResults] = useState<Results | undefined>(undefined)
    const [loading, setLoading] = useState(false)  
    const [resultsBoardOpen, setResultsBoardOpen] = useState(false) 
    

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value
        setSearchTerm(searchTerm)
    }
     const handleClose = () => {
        setSearchTerm('')
        setResultsBoardOpen(false)
    }

    const clearSearch = () => {
        setSearchTerm('')
    }

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            setResultsBoardOpen(true)
            setLoading(true);
        } else {
            setResultsBoardOpen(false)
        }
    }, [searchTerm])
    
   

    useEffect(() => {
        if (searchTerm.trim() === '') {
            return
        }
        const searchResults = async() => {
        
            try {
                const res =  await search(debouncedValue)
                if (!res.data) {
                    setResults(undefined)
                } 

                setResults(res.data)
            } catch(error) {
                console.error('Search Error',String(error))
            } finally {
                setLoading(false)
            }

        }

        searchResults()
        
        
    }, [debouncedValue])

    return {
        searchTerm,
        handleSearch,
        loading,
        results,
        resultsBoardOpen,
        handleClose,
        setSearchTerm,
        clearSearch
    }
}

export default useSearch