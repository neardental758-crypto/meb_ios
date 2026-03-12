//agregado para ruedaporibague 
import { 
    VERIFY_LOCK_STATUS_TRIP,
    SET_STATUS_LOCK,
    CHANGE_STATUS_LOCK,
    CHANGE_STATUS_LOCK_CLOSED,
    CONFIRM_BLE_OPENED,
} from "../types/tripTypes";

export function changeStatusLock(){
    console.log("entra acción changeStatusLock");
    return {
        type:  CHANGE_STATUS_LOCK,
    }
}

export function changeStatusLockClosed(){
    console.log("entra acción changeStatusLock");
    return {
        type:  CHANGE_STATUS_LOCK_CLOSED,
    }
}

export function confirmBleOpened(){
    console.log("entra action opened");
    return {
        type: CONFIRM_BLE_OPENED,
    }
}

export function verifyLockStatusTrip(){
    //console.log("Entra a la accíón verifyLockStatusTrip");
    return {
        type: VERIFY_LOCK_STATUS_TRIP,
    }
}

export function setStatusLock(statusLock: any){
    //console.log("Entra acción setStatusLock");
    return {
        type: SET_STATUS_LOCK,
        statusLock,
    }
}

export const tripActions = {
    verifyLockStatusTrip,
    changeStatusLock,
    changeStatusLockClosed,
    setStatusLock
}