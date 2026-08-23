import { MessageType } from "./chat";
import { IngredientCategory, Recipe, RecipeIngredients, Supplier } from "./recipe";

export interface HomeContextProps {
  state: HomeState;
  dispatch: (action: Action) => void;
}

export enum NotificationType {
  Success = "success",
  Failure = "failure",
  Info = "info",
}

export interface Notification {
  isOpen: boolean;
  message: string;
  notificationType: NotificationType;
}

export interface ModalType {
  type: string;
}

export interface HomeState {
  dialogExists: boolean;
  chatOpen: boolean;
  messages: MessageType[];
  currentPage: number;
  isModalOpen: boolean;
  isProfileOpen: boolean;
  modalType: ModalType;
  notification: Notification;
  file: File | null;
}

export type Action =
  | { type: "TOGGLE_CHAT" }
  | { type: "UPDATE_MESSAGES"; payload: MessageType }
  | { type: "CHOOSE_PAGE"; payload: number }
  | { type: "OPEN_MODAL"; payload: ModalType }
  | { type: "CLOSE_MODAL" }
  | { type: "OPEN_PROFILE" }
  | { type: "CLOSE_PROFILE" }
  | { type: "RESET_STATE" }
  | { type: "HANDLE_NOTIFICATION"; payload: Notification }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "RESET_FILE" };

export interface IngredientState {
  data: Ingredient[];
}

export type IngredientsAction =
  | { type: "SET_DATA"; payload: Ingredient[] };

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;
  type?: string;
}

export interface ButtonProps {
  text: any;
  action: () => void;
}

export interface Ingredient {
  ingredientId: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  iconBgColor: string;
  recipeId: string;
}

export interface RecipeUpdatePayload {
  recipe: Recipe;
  addedIngredients: RecipeIngredients[];
  removedIngredients: RecipeIngredients[];
}

export interface SupplierUpdatePayload {
  supplier: Supplier;
  addedCategories: IngredientCategory[];
  removedCategories: IngredientCategory[];
}
