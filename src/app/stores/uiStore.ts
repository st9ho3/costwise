import { create } from "zustand";

type ModalType = {
  type: string;
};

interface State {
  isModalOpen: boolean;
  isProfileOpen: boolean;
  modalType: ModalType;
  isDeleteActive: boolean;
  isMobileMenuOpen: boolean;

  openModal: (type: string) => void;
  closeModal: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  activateDelete: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  reset: () => void;
}

export const useUIStore = create<State>((set) => ({
  //State
  isModalOpen: false,
  isProfileOpen: false,
  modalType: { type: "" },
  isDeleteActive: false,
  isMobileMenuOpen: false,

  //Actions
  openModal: (type) =>
    set({
      isModalOpen: true,
      modalType: { type: type },
    }),
  closeModal: () => set({ isModalOpen: false }),
  openProfile: () => set({ isModalOpen: true, isProfileOpen: true }),
  closeProfile: () => set({ isProfileOpen: false }),
  activateDelete: () => set({ isDeleteActive: true }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  reset: () =>
    set({
      isModalOpen: false,
      isProfileOpen: false,
      modalType: { type: "" },
      isDeleteActive: false,
      isMobileMenuOpen: false,
    }),
}));
