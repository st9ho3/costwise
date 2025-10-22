import { IngredientsAction, IngredientState } from "@/types/context"

export const INITIAL_STATE: IngredientState = {
    data: []
}

export const ingredientsReducer = (state: IngredientState, action: IngredientsAction) => {

    switch(action.type) {
        case 'SET_DATA' :
            return {
                ...state, data: action.payload
            }
        default:
            return state
    }
}