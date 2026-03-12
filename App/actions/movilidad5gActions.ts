/* eslint-disable prettier/prettier */
/**
 * Movilidad5g Actions
 * Action creators for the 5G bicycle mobility module
 */

import { movilidad5gTypes } from '../types/movilidad5gTypes';
import * as types from '../types/movilidad5gTypes';

export const movilidad5gActions = {
    // QR Validation
    validateQrCode: function (qrNumber: string, organizationId: string, userId: string, userCompany: string) {
        console.log('Validating QR Code:', qrNumber);
        return {
            type: movilidad5gTypes.validateQrCode,
            qrNumber,
            organizationId,
            userId,
            userCompany
        };
    },

    setQrValidationResult: function (result: any) {
        return {
            type: movilidad5gTypes.setQrValidationResult,
            payload: result
        };
    },

    setQrError: function (error: string) {
        return {
            type: types.SET_QR_ERROR,
            payload: error
        };
    },

    // Lock Operations
    startLockConnection: function (mac: string, id: string, imei: string) {
        console.log('Starting lock connection:', { mac, id, imei });
        return {
            type: movilidad5gTypes.startLockConnection,
            mac,
            id,
            imei
        };
    },

    lockConnectionSuccess: function () {
        return {
            type: movilidad5gTypes.lockConnectionSuccess
        };
    },

    lockConnectionFailed: function (error: string) {
        return {
            type: movilidad5gTypes.lockConnectionFailed,
            error
        };
    },

    resetLock: function (mac: string, id: string, imei: string) {
        console.log('RESETTING LOCK WITH MAC:', mac, 'AND ID:', id, 'IMEI:', imei);
        return {
            type: movilidad5gTypes.resetLock,
            mac,
            id,
            imei,
        };
    },

    setLockInformation: function (lockData: any) {
        return {
            type: types.SET_LOCK_INFORMATION_5G,
            lock: lockData
        };
    },

    setLockStatus: function (status: string) {
        return {
            type: types.SET_LOCK_STATUS_5G,
            payload: status
        };
    },

    setLockCount: function (count: number) {
        return {
            type: types.SET_LOCK_COUNT_5G,
            payload: count
        };
    },

    // Trip Management
    startTrip: function (tripData: any) {
        console.log('Starting trip 5G:', tripData);
        return {
            type: movilidad5gTypes.startTrip,
            payload: tripData
        };
    },

    endTrip: function (tripId: string, endStationId: string, userTripInformation: any) {
        return {
            type: movilidad5gTypes.endTrip,
            tripId,
            endStationId,
            userTripInformation
        };
    },

    setActiveTripId: function (tripId: string) {
        return {
            type: movilidad5gTypes.setActiveTripId,
            tripId
        };
    },

    setTripInformation: function (tripData: any) {
        return {
            type: types.SET_TRIP_INFORMATION_5G,
            payload: tripData
        };
    },

    getTripInformation: function (tripId: string) {
        return {
            type: types.GET_TRIP_INFORMATION_5G,
            tripId
        };
    },

    // End Trip Validation
    setEndTripValidation: function (validation: any) {
        return {
            type: types.SET_END_TRIP_VALIDATION_5G,
            payload: validation
        };
    },

    verifyLockResume: function (mac: string, endTripValidation: any) {
        return {
            type: types.VERIFY_LOCK_RESUME_5G,
            mac,
            endTripValidation
        };
    },

    // Permissions & Bluetooth
    checkBluetoothPermissions: function () {
        return {
            type: movilidad5gTypes.checkBluetoothPermissions
        };
    },

    checkLocationPermissions: function () {
        return {
            type: movilidad5gTypes.checkLocationPermissions
        };
    },

    openBluetoothTrip: function () {
        return {
            type: movilidad5gTypes.openBluetoothTrip
        };
    },

    setBluetoothState: function (state: boolean) {
        return {
            type: movilidad5gTypes.setBluetoothState,
            payload: state
        };
    },

    // UI States
    setLoading: function (loading: boolean) {
        return {
            type: types.SET_LOADING_5G,
            payload: loading
        };
    },

    setLoadingLock: function (loading: boolean) {
        return {
            type: types.SET_LOADING_LOCK_5G,
            payload: loading
        };
    },

    setErrorMessage: function (message: string) {
        return {
            type: types.SET_ERROR_MESSAGE_5G,
            payload: message
        };
    },

    clearError: function () {
        return {
            type: types.CLEAR_ERROR_5G
        };
    },

    setModalQrErrorStatus: function (status: boolean) {
        return {
            type: types.MODAL_QR_ERROR_STATUS_5G,
            payload: status
        };
    },

    // Connection State
    setConnectionState: function (state: 'idle' | 'scanning' | 'connecting' | 'connected' | 'failed') {
        return {
            type: types.SET_CONNECTION_STATE_5G,
            payload: state
        };
    },

    incrementRetryCount: function () {
        return {
            type: types.INCREMENT_RETRY_COUNT_5G
        };
    },

    resetRetryCount: function () {
        return {
            type: types.RESET_RETRY_COUNT_5G
        };
    },
};
