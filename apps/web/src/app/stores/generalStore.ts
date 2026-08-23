
// This is a general store for storing values that need for general purposes

import { create } from "zustand"

interface State {
    itemId: string | null // This is the id of an item taht is for deleting. We store it here in order to pass it to the modal that confirms the deletion
    
    setId: (id: string | undefined) => void

    reset: () => void
}

export const useGeneralStore = create<State>((set) => ({
    //State
    itemId: null,

    //Actions
    setId: (id) => set({itemId: id}),

    reset: () => set({
        itemId: null
    })
}))