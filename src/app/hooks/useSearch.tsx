import React, { useEffect, useState } from 'react'
import { search } from '../services/services'
import { Ingredient, Recipe } from '@/shemas/recipe'
import useDebounce from './useDebounce'

export interface Results {
    ingredients: Ingredient[] | undefined
    recipes: Recipe[] | undefined
}

const useSearch = () => {
    
    const [searchTerm, setSearchTerm] = useState<string>('')
    const {debouncedValue} = useDebounce({searchTerm, delay: 500})
    const [results, setResults] = useState<Results | undefined>(undefined)
    const [loading, setLoading] = useState(false)  
    const [resultsBoardOpen, setResultsBoardOpen] = useState(false) 

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value
        setSearchTerm(searchTerm)
    }

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            setResultsBoardOpen(true)
            setLoading(true);
        } else {
            setResultsBoardOpen(false)
        }
    }, [searchTerm])
    
    console.log(resultsBoardOpen)

    useEffect(() => {
        
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
        resultsBoardOpen
    }
}

export default useSearch