/* eslint-disable prettier/prettier */
/**
 * Movilidad5g Types
 * Action types for the 5G bicycle mobility module
 */

// QR Validation
export const VALIDATE_QR_CODE = 'VALIDATE_QR_CODE';
export const SET_QR_VALIDATION_RESULT = 'SET_QR_VALIDATION_RESULT';
export const SET_QR_ERROR = 'SET_QR_ERROR';

// Lock Operations
export const START_LOCK_CONNECTION = 'START_LOCK_CONNECTION';
export const LOCK_CONNECTION_SUCCESS = 'LOCK_CONNECTION_SUCCESS';
export const LOCK_CONNECTION_FAILED = 'LOCK_CONNECTION_FAILED';
export const RESET_LOCK_5G = 'RESET_LOCK_5G';
export const SET_LOCK_INFORMATION_5G = 'SET_LOCK_INFORMATION_5G';
export const SET_LOCK_STATUS_5G = 'SET_LOCK_STATUS_5G';
export const SET_LOCK_COUNT_5G = 'SET_LOCK_COUNT_5G';

// Trip Management
export const START_TRIP_5G = 'START_TRIP_5G';
export const END_TRIP_5G = 'END_TRIP_5G';
export const SET_ACTIVE_TRIP_ID_5G = 'SET_ACTIVE_TRIP_ID_5G';
export const SET_TRIP_INFORMATION_5G = 'SET_TRIP_INFORMATION_5G';
export const GET_TRIP_INFORMATION_5G = 'GET_TRIP_INFORMATION_5G';

// End Trip Validation (Checklist)
export const SET_END_TRIP_VALIDATION_5G = 'SET_END_TRIP_VALIDATION_5G';
export const VERIFY_LOCK_RESUME_5G = 'VERIFY_LOCK_RESUME_5G';

// UI States
export const SET_LOADING_5G = 'SET_LOADING_5G';
export const SET_LOADING_LOCK_5G = 'SET_LOADING_LOCK_5G';
export const SET_ERROR_MESSAGE_5G = 'SET_ERROR_MESSAGE_5G';
export const CLEAR_ERROR_5G = 'CLEAR_ERROR_5G';
export const MODAL_QR_ERROR_STATUS_5G = 'MODAL_QR_ERROR_STATUS_5G';

// Connection State
export const SET_CONNECTION_STATE_5G = 'SET_CONNECTION_STATE_5G';
export const INCREMENT_RETRY_COUNT_5G = 'INCREMENT_RETRY_COUNT_5G';
export const RESET_RETRY_COUNT_5G = 'RESET_RETRY_COUNT_5G';

// Saga action types (for redux-saga)
export const movilidad5gTypes = {
    // QR Validation
    validateQrCode: '[movilidad5g] validateQrCode',
    setQrValidationResult: '[movilidad5g] setQrValidationResult',

    // Lock Operations
    startLockConnection: '[movilidad5g] startLockConnection',
    lockConnectionSuccess: '[movilidad5g] lockConnectionSuccess',
    lockConnectionFailed: '[movilidad5g] lockConnectionFailed',
    resetLock: '[movilidad5g] resetLock',
    setLockInformation: '[movilidad5g] setLockInformation',

    // Trip Management
    startTrip: '[movilidad5g] startTrip',
    endTrip: '[movilidad5g] endTrip',
    setActiveTripId: '[movilidad5g] setActiveTripId',

    // Permissions & Bluetooth
    checkBluetoothPermissions: '[movilidad5g] checkBluetoothPermissions',
    checkLocationPermissions: '[movilidad5g] checkLocationPermissions',
    openBluetoothTrip: '[movilidad5g] openBluetoothTrip',
    setBluetoothState: '[movilidad5g] setBluetoothState',

    // UI States
    setLoading: '[movilidad5g] setLoading',
    setError: '[movilidad5g] setError',
    clearError: '[movilidad5g] clearError',
};
