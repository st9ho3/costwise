import { create } from "zustand"

type ModalType = {
    type: string
}

interface State {
    isModalOpen: boolean
    isProfileOpen: boolean
    modalType: ModalType

    openModal: (type: string) => void
    closeModal: () => void
    openProfile: () => void
    closeProfile: () => void

    reset: () => void
}

export const useUIStore = create<State>((set) => ({
    //State
    isModalOpen: false,
    isProfileOpen: false,
    modalType: {type: ''},

    //Actions
    openModal: (type) => set({
        isModalOpen: true,
        modalType: {type: type}
    }),
    closeModal: () => set({isModalOpen: false}),
    openProfile: () => set({isProfileOpen: true}),
    closeProfile: () => set({isProfileOpen: false}),

    reset: () => set({
        isModalOpen: false,
        isProfileOpen: false,
        modalType: {type: ''}
    })
}))