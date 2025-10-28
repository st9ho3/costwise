import {create} from 'zustand'

//Type interface for state
interface State {
    currentPage: number
    choosePage: (value: number) => void
    handleNext: () => void
    handlePrev: () => void
    resetPage: () => void
}

// Store that handles state and actions
export const usePaginationStore = create<State>((set) => ({

    //State
    currentPage: 1,

    //Actions
    choosePage: (value) => set({currentPage: value}),
    handleNext: () => set((state) => ({currentPage: state.currentPage + 1})),
    handlePrev: () => set((state) => ({currentPage: state.currentPage - 1})),
    resetPage: () => set({currentPage: 1})
}))