import { create } from "zustand"
import {type Notification, NotificationType } from "../../types/context"

interface State {
    notification: Notification

    handleNotification: (notification: Notification) => void

    reset: () => void
}

export const useNotificationStore = create<State>((set) => ({

    //State
    notification: {
         isOpen: false, 
         message: "no message", 
         notificationType: NotificationType.Success },
    

    //Actions
    handleNotification: (notification) => set({notification: notification}),

    //Reset State

    reset: () => set({
        notification: {
            isOpen: false, 
            message: "no message", 
            notificationType: NotificationType.Success
    }})
}))