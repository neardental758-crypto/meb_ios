//IMPORT TYPES

import { appRideActions } from "../actions/rideActions";
import { 
    VERIFY_CAMERA_PERMISSIONS,
    SET_LOADING, 
    SET_LOCK_INFORMATION, 
    SET_BIKE_INFORMATION, 
    SET_STATION_BIKE, 
    SET_LOADING_LOCK, 
    SET_COORDINATES_TRIP, 
    SET_TRIP_INFORMATION, 
    MODAL_QR_ERROR_STATUS, 
    VALIDATE_TRIP, 
    SET_END_TRIP_VALIDATION, 
    SET_BUTTON_START_VALIDATION,
    appRideTypes 
} from "../types/rideTypes";


import { appTypes } from "../types/types";
import { LOGOUT } from '../types/userTypes.js';

//INTERFACES
interface InitialValues {
    userTripInformation: UserTripInformation,
    bike: BikeInfo,
    lock: LockInfo,
    userTrip: UserTrip,
    bikeHasTrip: boolean,
    loading: boolean,
    loadingLock: boolean,
    modalQrStatus: boolean,
    loadingEnd: boolean,
    loadingResume: boolean,
    lockOpened: boolean,
    lockCount: number,
    station: any,
    coordinates: Array<Object>,
    endTripValidation: Object,
    buttonStartValidation: boolean
    loadingBluetooth: boolean,
    bluetoothState: boolean,
    checklistlocation: Object,
}

interface UserTrip {
    id: string,
    time: string,
    distanceKm: number,
    startDate: string,
    endDate: string,
    state: string,
    bikePhoto: string,
    userId: string,
    startStationId: string,
    endStationId: string,
    bikeId: string,
    organizationId: string
}

interface LockInfo {
    id: string,
    imei: string,
    qrNumber: string,
    latitude: string,
    longitude: string,
    mac: string,
    battery: any,
    lockStatus: string,
    signal: any,
    simNumber: any,
    lastCommandDate: string,
    organizationId: string
}

interface BikeInfo {
    latitude: string,
    longitude: string,
    battery: any,
    type: any,
    tripCount: number,
    state: string,
    number: number,
    organizationId: string,
    lockId: string,
    stationId: string
}

interface UserTripInformation {
    time: number,
    distance: number,
    co2: number,
    calories: number
}



//STATE GENERAL INITIAL

let initialState: InitialValues = {
    userTripInformation: {
        time: 0,
        distance: 0,
        co2: 0,
        calories: 0
    },
    coordinates: [],
    bike: {
        latitude: "",
        longitude: "",
        battery: "",
        type: "",
        tripCount: 0,
        state: "",
        number: 0,
        organizationId: "",
        lockId: "",
        stationId: ""
    },
    lock: {
        id: "",
        imei: "",
        qrNumber: "",
        latitude: "",
        longitude: "",
        mac: "",
        battery: "",
        lockStatus: "",
        signal: "",
        simNumber: "",
        lastCommandDate: "",
        organizationId: ""
    },
    userTrip: {
        id: "",
        time: "",
        distanceKm: 0,
        startDate: "",
        endDate: "",
        state: "",
        bikePhoto: "",
        userId: "",
        startStationId: "",
        endStationId: "",
        bikeId: "",
        organizationId: ""
    },
    bikeHasTrip: false,
    loading: false,
    loadingLock: false,
    modalQrStatus: false,
    lockOpened: false,
    loadingEnd: false,
    loadingResume: false,
    lockCount: 0,
    station: {},
    endTripValidation: {},
    buttonStartValidation: false,
    loadingBluetooth: false,
    bluetoothState: false,
    checklistlocation: {},
}

//EXPORT REDUCER ARROW FUNCTION

const rideReducer = (state: InitialValues = initialState, action: any) => {
    switch (action.type) {
        case appRideTypes.setBluetoothState:
            return {
                ...state,
                bluetoothState: action.bluetoothState
            }
        case appRideTypes.setChecklistlocation:
            return {
                ...state,
                checklistlocation: action.checklistlocation
            }
        case SET_BUTTON_START_VALIDATION:
            return {
                ...state,
                buttonStartValidation: action.buttonStartValidation
            }
        case SET_END_TRIP_VALIDATION:
            return {
                ...state,
                endTripValidation: action.endTripValidation
            }
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case SET_LOADING_LOCK:
            return {
                ...state,
                loadingLock: action.payload
            }

        case MODAL_QR_ERROR_STATUS:
            return {
                ...state,
                modalQrStatus: action.modalQrStatus
            }

        /*case VALIDATE_TRIP:
            return {
                ...state,
                modalQrStatus: false
            }*/

        case SET_BIKE_INFORMATION:
            let bikeInfo = action.payload.bikeInformation ? action.payload.bikeInformation : initialState.bike
            return {
                ...state,
                bike: bikeInfo
            }

        case SET_LOCK_INFORMATION:
            let lockInfo = action.payload.lockInformation ? action.payload.lockInformation : initialState.lock
            return {
                ...state,
                lock: lockInfo
            }
        case SET_STATION_BIKE:
            return {
                ...state,
                station: action.payload.stationInformation
            }

        case LOGOUT:
            return {
                ...state
            }

        case SET_COORDINATES_TRIP:
            return {
                ...state,
                coordinates: action.payload
            }
        case SET_TRIP_INFORMATION:
            return {
                ...state,
                userTripInformation: action.payload
            }
        case appTypes.setLoadingEnd:
            return {
                ...state,
                loadingEnd: action.payload,
                bike: {
                    latitude: "",
                    longitude: "",
                    battery: "",
                    type: "",
                    tripCount: 0,
                    state: "",
                    number: 0,
                    organizationId: "",
                    lockId: "",
                    stationId: ""
                },
                lock: {
                    id: "",
                    imei: "",
                    qrNumber: "",
                    latitude: "",
                    longitude: "",
                    mac: "",
                    battery: "",
                    lockStatus: "",
                    signal: "",
                    simNumber: "",
                    lastCommandDate: "",
                    organizationId: ""
                },
                modalQrStatus: false,
                lockOpened: false,
                buttonStartValidation: false,
                endTripValidation: {},
                loadingBluetooth: false,
                bluetoothState: false,
                checklistlocation: {},
                loading: false, //se agrego 22feb
                station: {}, //se agrego 22feb
                loadingLock: false, //se agrego 22feb
            }
        case appTypes.setLoadingResume:
            return {
                ...state,
                loadingResume: action.payload
            }
        case appTypes.setBluetoothLoader:
            return {
                ...state,
                loadingBluetooth: action.payload
            }
        default:
            return { ...state }
    }
}

export default rideReducer;