/* eslint-disable prettier/prettier */
/**
 * Movilidad5g Reducer
 * State management for the 5G bicycle mobility module
 */

import * as types from '../types/movilidad5gTypes';

export interface Movilidad5gState {
    // Lock information
    lock: {
        id: string;
        imei: string;
        qrNumber: string;
        latitude: string;
        longitude: string;
        mac: string;
        battery: string;
        lockStatus: 'open' | 'closed' | 'unknown';
        signal: string;
        simNumber: string;
        lastCommandDate: string;
        organizationId: string;
    };

    // Connection state
    connectionState: 'idle' | 'scanning' | 'connecting' | 'connected' | 'failed';
    retryCount: number;
    lastError: string | null;

    // Trip state
    activeTrip: any | null;
    tripInformation: any;
    tripValidation: any;
    endTripValidation: any;

    // Lock state
    lockCount: number;

    // UI state
    loading: boolean;
    loadingLock: boolean;
    modalQrStatus: boolean;
    errorMessage: string;
    qrError: string | null;

    // Bike information
    bike: {
        id: string;
        number: string;
        latitude: string;
        longitude: string;
        battery: string;
        type: string;
        state: string;
        lockId: string;
        stationId: string;
        organizationId: string;
    };

    // Bluetooth state
    bluetoothState: boolean;
}

const initialState: Movilidad5gState = {
    lock: {
        id: '',
        imei: '',
        qrNumber: '',
        latitude: '',
        longitude: '',
        mac: '',
        battery: '',
        lockStatus: 'unknown',
        signal: '',
        simNumber: '',
        lastCommandDate: '',
        organizationId: ''
    },
    connectionState: 'idle',
    retryCount: 0,
    lastError: null,
    activeTrip: null,
    tripInformation: {},
    tripValidation: {},
    endTripValidation: {},
    lockCount: 0,
    loading: false,
    loadingLock: false,
    modalQrStatus: false,
    errorMessage: '',
    qrError: null,
    bike: {
        id: '',
        number: '',
        latitude: '',
        longitude: '',
        battery: '',
        type: '',
        state: '',
        lockId: '',
        stationId: '',
        organizationId: ''
    },
    bluetoothState: false
};

export const movilidad5gReducer = (state: Movilidad5gState = initialState, action: any): Movilidad5gState => {
    switch (action.type) {
        // QR Validation
        case types.SET_QR_VALIDATION_RESULT:
            return {
                ...state,
                qrError: null,
                bike: {
                    ...state.bike,
                    ...(action.payload.bikeInformation || {})
                },
                lock: {
                    ...state.lock,
                    ...(action.payload.lockInformation || {})
                }
            };

        case types.SET_QR_ERROR:
            return {
                ...state,
                qrError: action.payload,
                loading: false
            };

        // Lock Operations
        case types.START_LOCK_CONNECTION:
            return {
                ...state,
                connectionState: 'connecting',
                loading: true,
                lastError: null
            };

        case types.LOCK_CONNECTION_SUCCESS:
            return {
                ...state,
                connectionState: 'connected',
                retryCount: 0,
                lastError: null
            };

        case types.LOCK_CONNECTION_FAILED:
            return {
                ...state,
                connectionState: 'failed',
                lastError: action.error,
                loading: false
            };

        case types.SET_LOCK_INFORMATION_5G:
            return {
                ...state,
                lock: {
                    ...state.lock,
                    ...action.lock
                }
            };

        case types.SET_LOCK_STATUS_5G:
            return {
                ...state,
                lock: {
                    ...state.lock,
                    lockStatus: action.payload
                }
            };

        case types.SET_LOCK_COUNT_5G:
            return {
                ...state,
                lockCount: action.payload
            };

        // Trip Management
        case types.SET_ACTIVE_TRIP_ID_5G:
            return {
                ...state,
                activeTrip: action.tripId
            };

        case types.SET_TRIP_INFORMATION_5G:
            return {
                ...state,
                tripInformation: action.payload
            };

        case types.SET_END_TRIP_VALIDATION_5G:
            return {
                ...state,
                endTripValidation: action.payload
            };

        // UI States
        case types.SET_LOADING_5G:
            return {
                ...state,
                loading: action.payload
            };

        case types.SET_LOADING_LOCK_5G:
            return {
                ...state,
                loadingLock: action.payload
            };

        case types.SET_ERROR_MESSAGE_5G:
            return {
                ...state,
                errorMessage: action.payload,
                loading: false
            };

        case types.CLEAR_ERROR_5G:
            return {
                ...state,
                errorMessage: '',
                qrError: null,
                lastError: null
            };

        case types.MODAL_QR_ERROR_STATUS_5G:
            return {
                ...state,
                modalQrStatus: action.payload
            };

        // Connection State
        case types.SET_CONNECTION_STATE_5G:
            return {
                ...state,
                connectionState: action.payload
            };

        case types.INCREMENT_RETRY_COUNT_5G:
            return {
                ...state,
                retryCount: state.retryCount + 1
            };

        case types.RESET_RETRY_COUNT_5G:
            return {
                ...state,
                retryCount: 0
            };

        default:
            return state;
    }
};

export default movilidad5gReducer;
