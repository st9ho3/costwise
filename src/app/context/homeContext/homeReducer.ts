/**
 * Defines the initial state and reducer logic for a global state management system using `useReducer`.
 * This reducer manages various UI states for a home page or application, including chat visibility,
 * messaging, pagination, modal windows, profile view, and notifications.
 *
 * `initialState`:
 * - An object that defines the starting values for all state properties.
 * - Properties include `dialogExists`, `chatOpen`, `messages`, `currentPage`, `isModalOpen`,
 * `isProfileOpen`, `modalType`, `notification`, and `file`.
 * - This provides a clear and predictable starting point for the application's UI state.
 *
 * `homeReducer`:
 * - A pure function that takes the current `state` and an `action` and returns a new state.
 * - It uses a `switch` statement to handle different action types.
 * - Each case returns a new state object by spreading the current state and updating
 * the specific properties corresponding to the action.
 * - This ensures immutability, which is a key principle of reducer patterns in React.
 * - The actions handled include toggling chat, updating messages, changing pages,
 * controlling modal and profile visibility, managing notifications, and handling file uploads.
 */
import { HomeState, Action } from "@/types/context";
import { NotificationType } from "@/types/context";

// Initial state for the reducer
const initialState: HomeState = {
    dialogExists: false,
    chatOpen: false,
    messages: [],
    currentPage: 1,
    isModalOpen: false,
    isProfileOpen: false,
    modalType: {
        type: ""
    },
    notification: { isOpen: false, message: "no message", notificationType: NotificationType.Success },
    file: null
};

const homeReducer = (state: HomeState, action: Action): HomeState => {
    switch (action.type) {
        case 'TOGGLE_CHAT':
            return {
                ...state,
                chatOpen: !state.chatOpen,
            };
        case 'UPDATE_MESSAGES':
            // TypeScript now correctly infers that action has a 'payload' of type 'Message'
            const updatedMessages = [...state.messages, action.payload];
            return {
                ...state,
                messages: updatedMessages,
            };
        case 'CHOOSE_PAGE':
            return {
                ...state,
                currentPage: action.payload
            };
        case 'OPEN_MODAL':
            return {
                ...state,
                isModalOpen: true,
                modalType: action.payload
            };
        case 'CLOSE_MODAL':
            return {
                ...state,
                isModalOpen: false
            };
        case "OPEN_PROFILE":
            return {
                ...state,
                isProfileOpen: true
            };
        case "CLOSE_PROFILE":
            return {
                ...state,
                isProfileOpen: false
            };
        case "RESET_STATE":
            return initialState
        case 'HANDLE_NOTIFICATION':
            return {
                ...state,
                notification: action.payload
            };
        case 'SET_FILE':
            return {
                ...state,
                file: action.payload
            };
        case "RESET_FILE":
            return {
                ...state,
                file: null
            };
        default:
            return state;
    }
};

export { initialState, homeReducer };