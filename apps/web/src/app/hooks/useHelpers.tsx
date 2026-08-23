'use client'
/**
 * - Provides a utility hook for displaying global notifications via the `HomeContext`.
 * - Accepts a standardized API response and automatically determines notification type (success/failure) and message.
 * - Dispatches a "show notification" action after a 1.5s delay and auto-hides it after 4s.
 * - Uses `NotificationType` for type-safe notification categorization.
 */
import { NotificationType } from '@costwise/domain/types/context';
import { useNotificationStore } from '../stores/notificationStore';
import { useUIStore } from "@/app/stores/uiStore";
import { useGeneralStore } from "@/app/stores/generalStore";
import { useCallback } from 'react';
import { deleteIngredient, deleteRecipesFromServer, deleteSupplier } from "@/app/services/services";
import { useRouter } from "next/navigation";


type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: { message: string };
};

interface UseHelpersProps {
  path: string | null
}

const useHelpers = ({path}: UseHelpersProps) => {

  const isOpen = useNotificationStore((state) => state.notification.isOpen)
  const openModal = useUIStore((state) => state.openModal)
  const isDeleteActive = useUIStore((state) => state.isDeleteActive)
  const closeModal = useUIStore((state) => state.reset)
  const activateDelete = useUIStore((state) => state.activateDelete)
  const isModalOpen = useUIStore((state) => state.isModalOpen)
  const passItemId = useGeneralStore((state) => state.setId)
  const storedItemId = useGeneralStore((state) => state.itemId)
  const router = useRouter()

  
  const handleNotification = useNotificationStore((state) => state.handleNotification)
  
  const raiseNotification = useCallback(<T,>(response: ApiResponse<T>) => {
    const message = response.success ? response.message : response.error?.message || 'An unknown error occurred.';
    const type = response.success ? NotificationType.Success : NotificationType.Failure;
    setTimeout(() => {
      handleNotification({isOpen: true, message: message, notificationType: type})
    }, 1500);
    setTimeout(() => {
      handleNotification({ isOpen: false, message: "", notificationType: NotificationType.Info})
    }, 4000);
  }, [handleNotification]);

  const chooseEntityToDelete = async(id: string | null) => {
     switch(path) {
      case 'ingredients':
        const res_i = await deleteIngredient(id)
      return res_i
      case 'recipes':
        const res_r = await deleteRecipesFromServer(id)
      return res_r
      case 'suppliers':
        const res_s = await deleteSupplier(id)
      return res_s
      default :
        return 
    }
  }
  const handleDelete = useCallback(async(id: string | null) => {
    const response = await chooseEntityToDelete(id)
    raiseNotification(response)
    router.replace(`/${path}` || '')
  },[raiseNotification, router, path])

  const askPermision = (id: string | undefined) => {
    openModal('delete')
    activateDelete()
    passItemId(id)
  }


  return { isOpen, isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision, raiseNotification };
};
export default useHelpers;