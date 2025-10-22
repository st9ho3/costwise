"use client"
import { IngredientsAction } from '@/types/context'
import React, { useContext, useReducer } from 'react'
import { ingredientsReducer, INITIAL_STATE } from './ingredientsReducer'
import { createContext } from 'react'

interface IngredientsContextProps { 
    state: typeof INITIAL_STATE;
    dispatch: React.Dispatch<IngredientsAction>
}

const ingredientsContext = createContext<IngredientsContextProps | undefined>(undefined)

const IngredientsContextProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(ingredientsReducer, INITIAL_STATE)

  return (
    <ingredientsContext.Provider value={{state, dispatch}}>
        {children}
    </ingredientsContext.Provider>
  )
}

export default IngredientsContextProvider

export const useIngredientsContext = () => {
    const ingCon = useContext(ingredientsContext)
    if (!ingCon) {
        throw new Error("useIngredientsContext must be used within a IngredientsContext provider")
    }
}
