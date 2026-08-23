import { create } from "zustand";
import { type Notification, NotificationType } from "../../types/context";

interface State {
  notification: Notification;
  handleNotification: (notification: Notification) => void;
  notify: (type: 'success' | 'failure' | 'error' | 'warning' | 'info' | string, message: string) => void;
  clearNotification: () => void;
  reset: () => void;
}

export const useNotificationStore = create<State>((set) => ({
  // State
  notification: {
    isOpen: false,
    message: "",
    notificationType: NotificationType.Success,
  },

  // Actions
  handleNotification: (notification) => set({ notification: notification }),

  notify: (type, message) => {
    let notifType = NotificationType.Success;
    if (type === 'failure' || type === 'error') notifType = NotificationType.Failure;
    else if (type === 'info') notifType = NotificationType.Info;

    set({
      notification: {
        isOpen: true,
        message,
        notificationType: notifType,
      },
    });
  },

  clearNotification: () =>
    set({
      notification: {
        isOpen: false,
        message: "",
        notificationType: NotificationType.Success,
      },
    }),

  // Reset State
  reset: () =>
    set({
      notification: {
        isOpen: false,
        message: "",
        notificationType: NotificationType.Success,
      },
    }),
}));