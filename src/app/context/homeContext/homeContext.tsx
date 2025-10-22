/**
 * Provides a React context for managing the state of the home page using `useReducer`.
 *
 * `HomeContext`
 * - A context object created using `createContext` to hold the state and dispatch function.
 *
 * `HomeContextProvider`
 * - A React component that acts as the provider for the `homeContext`.
 * - It initializes the state and dispatch function using `useReducer` with the `homeReducer` and `initialState`.
 * - It makes the state and dispatch function available to its children components through the context.
 *
 * `useHomeContext`
 * - A custom hook that simplifies accessing the context.
 * - It uses `useContext` to retrieve the `homeContext`.
 * - It includes an error check to ensure the hook is used within the `HomeContextProvider`, preventing common developer mistakes.
 * - This hook provides a clean way for components to access and interact with the home page's state.
 */
"use client";

import { createContext, useContext, useReducer, PropsWithChildren } from 'react';
import { initialState, homeReducer } from './homeReducer';
import { Action } from '@/types/context';

interface HomeContextProps {
    state: typeof initialState;
    dispatch: React.Dispatch<Action>;
}

const homeContext = createContext<HomeContextProps | undefined>(undefined);

const HomeContextProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(homeReducer, initialState);

    return (
        <homeContext.Provider value={{ state, dispatch }}>
            {children}
        </homeContext.Provider>
    );
};

export default HomeContextProvider;

// Custom hook to use the HomeContext
export const useHomeContext = () => {
    const homeCon = useContext(homeContext);
    if (!homeCon) {
        throw new Error("useHomeContext must be used within a HomeContext provider");
    }
    return homeCon;
};