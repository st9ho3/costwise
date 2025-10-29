import { create } from "zustand"

interface State {
    file: string | null

    setFile: (file: string) => void

    reset: () => void
}

export const useFileStore = create<State>((set) => ({
    //State
    file: null,

    //Actions
    setFile: (file) => set({file: file}), 

    reset: () => set({file: null})
}))