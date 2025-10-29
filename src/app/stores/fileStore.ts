import { create } from "zustand"

interface State {
    file: File | null

    setFile: (file: File) => void

    reset: () => void
}

export const useFileStore = create<State>((set) => ({
    //State
    file: null,

    //Actions
    setFile: (file) => set({file: file}), 

    reset: () => set({file: null})
}))