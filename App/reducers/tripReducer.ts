import { SET_STATUS_LOCK, RESET_MODAL_LOCK } from "../types/tripTypes";
import { SET_NEW_TRIP, SET_STATUS_LOCK_OPEN } from "../types/types";

export interface State {
    statusLock: any;
    newTrip: Object;
    lockOpen: boolean;
}

const initialState = {
    statusLock: {},
    newTrip: {},
    lockOpen: false
}

export const tripReducer = (state: State = initialState, action:any) => {

    switch (action.type) {
        case SET_STATUS_LOCK:
            return {
                ...state,
                statusLock: action.statusLock
            }
        
        case SET_NEW_TRIP:
            return {
                ...state,
                newTrip: action.payload
            }
        
        case SET_STATUS_LOCK_OPEN:
            return {
                ...state,
                lockOpen: true
            }
        
        case RESET_MODAL_LOCK:
            return {
                ...state,
                lockOpen: false
            }

        default:
            return {...state};
    }

};

export default tripReducer;