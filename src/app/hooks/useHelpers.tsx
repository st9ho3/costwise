/**
 * - Provides a utility hook for displaying global notifications via the `HomeContext`.
 * - Accepts a standardized API response and automatically determines notification type (success/failure) and message.
 * - Dispatches a "show notification" action after a 1.5s delay and auto-hides it after 4s.
 * - Uses `NotificationType` for type-safe notification categorization.
 */
import { NotificationType } from '@/types/context';
import { useNotificationStore } from '../stores/notificationStore';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: { message: string };
};

const useHelpers = () => {
  const handleNotification = useNotificationStore((state) => state.handleNotification)
  
  const raiseNotification = <T,>(response: ApiResponse<T>) => {
    const message = response.success ? response.message : response.error?.message || 'An unknown error occurred.';
    const type = response.success ? NotificationType.Success : NotificationType.Failure;
    setTimeout(() => {
      handleNotification({isOpen: true, message: message, notificationType: type})
    }, 1500);
    setTimeout(() => {
      handleNotification({ isOpen: false, message: "", notificationType: NotificationType.Info})
    }, 4000);
  };
  return { raiseNotification };
};
export default useHelpers;