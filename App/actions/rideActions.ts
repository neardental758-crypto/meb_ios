import { VERIFY_CAMERA_PERMISSIONS, VALIDATE_QR, GET_TRIP_INFORMATION, GET_TRIP_USER, VERIFY_LOCK_RESUME, MODAL_QR_ERROR_STATUS, SET_BUTTON_START_VALIDATION, SET_END_TRIP_VALIDATION, SET_ACTUAL_TRIP, GET_ACTIVE_TRIP_CHECK_LIST, CHECK_LOCATION_PERMISSIONS, appRideTypes } from "../types/rideTypes";


export function verifyCameraPermissions() {
    return {
        type: VERIFY_CAMERA_PERMISSIONS
    }
}

export function validateQr(qrNumber: string, iduser: string, organizationId: string) {
    console.log('validation este qr :::', qrNumber)
    console.log('validadnon este iduser :::', iduser)
    console.log('validadnon este organizationID :::', organizationId)
    return {
        type: VALIDATE_QR,
        payload: { qrNumber },
        id: { iduser },
        org: { organizationId }
    }
}

export function modalQrStatus(modalQrStatus: boolean) {
    console.log('modalQrStatus', modalQrStatus)
    return {
        type: MODAL_QR_ERROR_STATUS,
        modalQrStatus: modalQrStatus,
    };
}

export function getActiveTrip() {
    return {
        type: GET_TRIP_INFORMATION
    }
}

export function getActiveTripChecklist() {
    return {
        type: GET_ACTIVE_TRIP_CHECK_LIST
    }
}
export function checkLocationPermissions() {
    return {
        type: CHECK_LOCATION_PERMISSIONS
    }
}

export function getTripUser() {
    return {
        type: GET_TRIP_USER
    }
}

export function verifyLockResume() {
    return {
        type: VERIFY_LOCK_RESUME
    }
}

export function setButtonStartValidation(buttonStartValidation: Boolean) {
    return {
        type: SET_BUTTON_START_VALIDATION,
        buttonStartValidation,
    };
}

export function setEndTripValidation(endTripValidation: Object) {
    return {
        type: SET_END_TRIP_VALIDATION,
        endTripValidation,
    };
}

export function setActualTrip(actualTrip: any) {
    return {
        type: SET_ACTUAL_TRIP,
        actualTrip,
    };
}

export const appRideActions = {
    checkBluetoothPermissions: function (location: any) {
        return {
            type: appRideTypes.checkBluetoothPermissions,
            location,
        };
    },
    validateUserLocation: function (location: any) {
        return {
            type: appRideTypes.validateUserLocation,
            location,
        };
    },
    startLockValidations: function () {
        return {
            type: appRideTypes.startLockValidations,
        };
    },
    checkLocationPermissions: function () {
        return {
            type: appRideTypes.checkLocationPermissions,
        };
    },
    setChecklistlocation: function (checklistlocation: Object) {
        return {
            type: appRideTypes.setChecklistlocation,
            checklistlocation,
        };
    },
    setBluetoothState: function (state: boolean) {
        console.log('setBluetoothState', state);
        return {
            type: appRideTypes.setBluetoothState,
            bluetoothState: state,
        };
    },
    openBluetoothTrip: function (lock: any) {
        console.log('LA INFO DEL LOCKCKCKCKCKKC', lock)
        return {
            type: appRideTypes.openBluetoothTrip,
            lock: lock,
        };
    },
    resetLock: function (mac: string, id: string, imei: string) {
        console.log('RESETTING LOCK WITH MAC:', mac, 'AND ID:', id, 'IMEI:', imei);
        return {
            type: appRideTypes.resetLock,
            mac: mac,
            id: id,
            imei: imei,
        };
    },
};