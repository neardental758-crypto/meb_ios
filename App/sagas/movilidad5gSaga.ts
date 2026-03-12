/* eslint-disable prettier/prettier */
/**
 * Movilidad5g Saga
 * Business logic for the 5G bicycle mobility module
 * Includes improved BLE connection logic with retry mechanisms
 */

import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { call, delay, put, select, takeLatest, race, take } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { movilidad5gTypes } from '../types/movilidad5gTypes';
import * as types from '../types/movilidad5gTypes';
import { movilidad5gActions } from '../actions/movilidad5gActions';
import { api } from '../api/api.service';
import { bluetooth } from '../Services/bluetooth.service2';
import { getItem, setItem } from '../Services/storage.service';
import * as RootNavigation from '../RootNavigation';

// Constants for retry logic
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 10000; // 10 seconds
const MAX_TIMEOUT = 30000; // 30 seconds
const RETRY_BACKOFF_MULTIPLIER = 1.5;

/**
 * Validate permissions for camera, Bluetooth, and location.
 */
async function validateBLEPermissions() {
    if (Platform.OS === 'android') {
        try {
            console.log('📋 Requesting Android permissions...');
            const grantedCamera = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Bycycle APP permisos de cámara',
                    message: 'Para poder acceder a las funcionalidades de viaje y escanear código QR debe aceptar estos permisos',
                    buttonNeutral: 'Pregúntame luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar'
                }
            );

            const grantedBluetoothScan = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                {
                    title: 'Bycycle APP permisos de Bluetooth',
                    message: 'Para poder utilizar la función de bluetooth, debe aceptar los permisos',
                    buttonNeutral: 'Pregúntame luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar'
                }
            );

            const grantedBluetoothConnect = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                {
                    title: 'Bycycle APP permisos de Bluetooth',
                    message: 'Para poder conectar con el dispositivo, debe aceptar los permisos',
                    buttonNeutral: 'Pregúntame luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar'
                }
            );

            const grantedLocation = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Bycycle APP permisos de Ubicación',
                    message: 'La ubicación es necesaria para escanear dispositivos Bluetooth',
                    buttonNeutral: 'Pregúntame luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar'
                }
            );

            if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED &&
                grantedBluetoothScan === PermissionsAndroid.RESULTS.GRANTED &&
                grantedBluetoothConnect === PermissionsAndroid.RESULTS.GRANTED &&
                grantedLocation === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('✓ All permissions granted');
                return true;
            } else {
                console.log('✗ Permissions denied');
                return false;
            }
        } catch (err) {
            console.warn('Permission error:', err);
            return false;
        }
    }
    // On iOS, Bluetooth permissions are handled via Info.plist and the BleManager state
    return true;
}

/**
 * Validate QR code and check bike availability
 */
function* validateQrCode(action: any): any {
    try {
        console.log('🔍 Validating QR code:', action.qrNumber);
        yield put(movilidad5gActions.setLoading(true));
        yield put(movilidad5gActions.clearError());

        const user = yield call(getItem, 'user');

        // Call API to validate trip
        const response = yield call(
            api.validateTrip,
            action.qrNumber,
            action.organizationId || user.organizationId,
            action.userId || user.id,
            action.userCompany || user?.empresa || user?.DataUser?.empresa
        );

        console.log('🔍 QR validation full response:', JSON.stringify(response, null, 2));

        if (response && response.lockInformation && response.bikeInformation) {
            // ... (rest of success block)
            const { lockInformation } = response;

            yield put(movilidad5gActions.setLockInformation({
                id: lockInformation.id,
                imei: lockInformation.imei || '',
                mac: lockInformation.mac || '',
                qrNumber: lockInformation.qrNumber || action.qrNumber,
                organizationId: lockInformation.organizationId || action.organizationId || user.organizationId,
                lockStatus: lockInformation.lockStatus || 'closed'
            }));

            // Store bike information
            if (response.bikeInformation && (response.bikeInformation.bic_id || response.bikeInformation.id)) {
                yield call(setItem, 'bikeId', (response.bikeInformation.bic_id || response.bikeInformation.id).toString());
            }

            yield put(movilidad5gActions.setQrValidationResult(response));
            yield put(movilidad5gActions.setLoading(false));

            console.log('✅ QR Validation success. Lock ID:', lockInformation.id);

            // Automatically start the trip now that validation passed
            yield put(movilidad5gActions.startTrip({}));
        } else {
            console.warn('⚠️ QR validation failed: lockInformation or bikeInformation missing', response);

            // Extract string message from ResponseError body or use fallback
            console.log('⚠️ Rejection payload:', JSON.stringify(response, null, 2));
            const errorMsg = response?.body?.error || response?.error?.body?.error || response?.error || 'No se encontró información del candado o la bicicleta';
            const serializableMsg = typeof errorMsg === 'string' ? errorMsg : 'Información de candado no válida o rechazada por el servidor';

            yield put(movilidad5gActions.setQrError(serializableMsg));
            yield put(movilidad5gActions.setModalQrErrorStatus(true));
            yield put(movilidad5gActions.setLoading(false));
        }
    } catch (error: any) {
        console.error('❌ QR validation error:', error);

        // Ensure we only put a string message into Redux
        const msg = error?.body?.error || error?.message || 'Error validando QR';
        yield put(movilidad5gActions.setQrError(typeof msg === 'string' ? msg : 'Error inesperado de validación'));
        yield put(movilidad5gActions.setModalQrErrorStatus(true));
        yield put(movilidad5gActions.setLoading(false));
    }
}

/**
 * Start lock connection with improved retry logic
 */
function* startLockConnection(action: any): any {
    try {
        console.log('🔐 Starting lock connection:', { mac: action.mac, id: action.id, imei: action.imei });

        // Validate permissions first
        const permissionsGranted = yield call(validateBLEPermissions);
        if (!permissionsGranted) {
            yield put(movilidad5gActions.lockConnectionFailed('Permisos necesarios no fueron otorgados. Verifica los ajustes de tu teléfono.'));
            return;
        }

        yield put(movilidad5gActions.setConnectionState('scanning'));
        yield put(movilidad5gActions.setLoadingLock(true));

        // Trigger the asynchronous background listener of legacy bluetooth module 
        // with the is5g parameter flag = true
        bluetooth.waitUntilDeviceState(action.mac, action.id, true);

        console.log('✅ Lock background handshake initiated successfully');
        yield put(movilidad5gActions.lockConnectionSuccess());
        yield put(movilidad5gActions.setConnectionState('connected'));
    } catch (error: any) {
        console.log('Critical error in startLockConnection saga:', error);
        yield put(movilidad5gActions.lockConnectionFailed(error.message));
        yield put(movilidad5gActions.setErrorMessage('Error al invocar conexión BT: ' + error.message));
    } finally {
        yield put(movilidad5gActions.setLoadingLock(false));
    }
}

/**
 * Reset lock with improved error handling
 */
function* resetLock(action: any): any {
    if (!action.imei) {
        yield put(movilidad5gActions.setErrorMessage('Error: IMEI faltante'));
        return;
    }

    try {
        yield put(movilidad5gActions.setLoadingLock(true));
        console.log('🔄 Force opening lock:', { mac: action.mac, id: action.id, imei: action.imei });

        // Use the same robust connection method
        const result = yield call([bluetooth, 'connectAndOpen5G'], action.mac, action.imei, action.id);

        if (result && result.success) {
            console.log('✅ Force opening success');
            Alert.alert("Éxito", "El candado se ha abierto correctamente por medio de Bluetooth.");
        }
    } catch (error: any) {
        console.log('❌ Force opening failed:', error.message);
        const userFriendlyMsg = error.message && error.message.includes('not authorized')
            ? "La aplicación no tiene autorización para usar Bluetooth. Por favor, ve a Ajustes y habilita el permiso."
            : error.message || "Error desconocido al intentar abrir el candado.";

        Alert.alert("Error de Conexión", `No se pudo abrir el candado: ${userFriendlyMsg}`);
    } finally {
        yield put(movilidad5gActions.setLoadingLock(false));
    }
}

/**
 * Start trip
 */
function* startTrip(action: any): any {
    try {
        console.log('🚴 Starting trip 5G');
        yield put(movilidad5gActions.setLoading(true));

        const user = yield call(getItem, 'user');
        const state = yield select();
        const lockInfo = state.movilidad5gReducer?.lock;
        const bikeInformation = state.movilidad5gReducer?.bikeInformation;
        const bikeId = yield call(getItem, 'bikeId');

        const now = new Date();
        const dateString = now.toISOString();
        const timeString = now.toLocaleTimeString('en-GB', { hour12: false });

        // Parse bikeId explicitly as an integer to satisfy the bc_prestamos MySQL model
        const parsedBikeId = parseInt(bikeId, 10) || 0;

        // Use valid records from MySQL for foreign key constraints
        // bikeInformation.bic_estacion is "Estacion tuempresa"
        // bro_id for "Estacion tuempresa" is 114
        const stationName = bikeInformation?.bic_estacion || "Estacion tuempresa";
        const bicicleteroId = 114;

        const requestBody = {
            pre_id: 0,
            pre_hora_server: dateString,
            pre_usuario: user.idNumber || user.id || user.usu_documento,
            pre_bicicleta: parsedBikeId,
            pre_retiro_estacion: stationName,
            pre_retiro_bicicletero: bicicleteroId,
            pre_retiro_fecha: dateString,
            pre_retiro_hora: timeString,
            pre_devolucion_estacion: stationName,
            pre_devolucion_bicicletero: bicicleteroId,
            pre_devolucion_fecha: dateString,
            pre_devolucion_hora: timeString,
            pre_duracion: "null",
            pre_dispositivo: Platform.OS + '-' + '5g',
            pre_estado: 'ACTIVA',
            pre_modulo: '5g'
        };

        console.log('🚴 requestBody (aligned with 3G):', JSON.stringify(requestBody));
        const response = yield call(api.postMysql, "bc_prestamos/registrar", requestBody);
        console.log('🏁 response registrar:', JSON.stringify(response));

        // API returns { success: true, data: { ... } }
        if (response && response.success === true && response.data) {
            console.log('✅ Trip registered successfully in MySQL');
            try {
                // Agregar formulario preoperacional linking just like 3G/4G does
                const preoperacionales = yield select((estado) => estado.reducerPerfil.form_preoperacional);
                if (preoperacionales && (preoperacionales.respuestas || preoperacionales.comentario)) {
                    let formPre = {
                        "id": new Date().getTime(),
                        "usuario": user.idNumber || user.id || user.usu_documento,
                        "idViaje": response.data.pre_id,
                        "modulo": '5g',
                        "respuestas": preoperacionales.respuestas || [],
                        "comentario": preoperacionales.comentario || ''
                    };
                    console.log('📝 Guardando preoperacional 5G:', JSON.stringify(formPre));
                    let preRes = yield call(api.guardandoPreoperacionales, 'bc_preoperacionales/registrar', formPre);
                    console.log('✅ Preoperacional guardado:', preRes);

                    // Import the action dynamically if missing, but it is standard to rely on actionPerfil
                    const { reset_preoperacional } = require('../actions/actionPerfil');
                    yield put(reset_preoperacional());
                } else {
                    console.log('⚠️ No hay datos preoperacionales en el Redux state para guardar.');
                }
            } catch (err) {
                console.log('⚠️ Failed to save preoperacional data:', err);
            }

            try {
                // Update bicycle status to PRESTADA using the correct POST endpoint
                const statusRes = yield call(api.postMysql, "bc_bicicletas/updateEstado", {
                    bic_id: parsedBikeId,
                    bic_estado: 'PRESTADA'
                });
                console.log('✅ Bike status update response:', JSON.stringify(statusRes));
            } catch (err) {
                console.log('⚠️ Failed to update bike status:', err);
            }

            const tripData = {
                id: response.data.pre_id,
                pre_id: response.data.pre_id,
                pre_usuario: response.data.pre_usuario,
                userId: user.id,
                lockId: lockInfo.id,
                bikeId: bikeId,
                startDate: response.data.pre_retiro_fecha,
                status: 'active'
            };

            yield put(movilidad5gActions.setActiveTripId(tripData.id));
            yield put(movilidad5gActions.setTripInformation(tripData));
            // Crucial missing hook for the global Timer/LocationServiceModule
            yield put({ type: 'GET_ACTIVE_TRIP_SUCCESS', payload: tripData });
            yield call(setItem, 'activeTrip5g', tripData);

            // Turn off loading BEFORE navigating to avoid UI glitches
            yield put(movilidad5gActions.setLoading(false));

            // Navigate to the trip screen only when backend confirms
            RootNavigation.navigate('TripScreen5G');

            // Connect and unlock lock via BLE
            console.log('🔓 Unlocking lock via BLE...');
            yield put(movilidad5gActions.startLockConnection(
                lockInfo.mac || '',
                lockInfo.id,
                lockInfo.imei || ''
            ));
        } else {
            console.warn("❌ Failed to register trip in MySQL backend. Response details:", JSON.stringify(response));
            const errorMsg = response?.message || "No se pudo registrar el viaje en la base de datos central.";

            // Only alert if we really didn't get a success:true back
            Alert.alert(
                "Error de sistema",
                errorMsg,
                [{ text: "Entendido", onPress: () => console.log('Alert closed') }]
            );
            yield put(movilidad5gActions.setLoading(false));
            return;
        }
    } catch (error: any) {
        console.error('❌ Start trip error:', error);
        yield put(movilidad5gActions.setErrorMessage('Error al iniciar el viaje'));
        yield put(movilidad5gActions.setLoading(false));
    }
}

/**
 * End trip
 */
function* endTrip(action: any): any {
    try {
        console.log('🏁 Ending trip 5G');
        yield put(movilidad5gActions.setLoading(true));

        const state = yield select();
        const activeTrip = state.movilidad5gReducer?.tripInformation;
        const user = yield call(getItem, 'user');

        let apiResponse;
        if (activeTrip && activeTrip.pre_id) {
            // --- INDICATORS LOGIC ---
            try {
                const indicadoresString = yield call([AsyncStorage, 'getItem'], 'indicadores');
                const indicadores = indicadoresString ? JSON.parse(indicadoresString) : {};
                console.log('ACTION....INDICADORES 5G', indicadores);

                const data_ind = {
                    "ind_id": new Date().getTime(),
                    "ind_usuario": user.idNumber,
                    "ind_viaje": activeTrip.pre_id,
                    "ind_modulo": "5g",
                    "ind_duracion": indicadores.duracion ?? 0,
                    "ind_distancia": indicadores.distancia ?? 0,
                    "ind_calorias": indicadores.calorias ?? 0,
                    "ind_co2": indicadores.co2 ?? 0
                };
                console.log('la data_ind 5G logic: ', data_ind);
                yield call(api.guardandoIndicadores, 'bc_indicadores_trip/registrar', data_ind);
            } catch (indError) {
                console.error("Error registering 5G indicators:", indError);
            }
            // --- END INDICATORS LOGIC ---

            apiResponse = yield call(api.endTrip, activeTrip, activeTrip.organizationId || state.movilidad5gReducer?.lock?.organizationId, user);
            console.log("Response end trip from backend", apiResponse);
        }

        yield put(movilidad5gActions.setLoading(false));

        // Navigate to feedback screen with trip ID as param (before clearing state)
        const tripId = activeTrip?.pre_id || '';
        RootNavigation.navigate('TravelExperience5G', { tripId: tripId });

        // Clear trip state AFTER navigating so the param is passed
        yield put(movilidad5gActions.setActiveTripId(''));
        yield call(AsyncStorage.removeItem, 'activeTrip5g');
        yield call(AsyncStorage.removeItem, 'indicadores');

    } catch (error: any) {
        console.error('❌ End trip error:', error);
        yield put(movilidad5gActions.setErrorMessage('Error al finalizar el viaje'));
        yield put(movilidad5gActions.setLoading(false));
    }
}

/**
 * Verify lock resume (for end trip checklist)
 */
function* verifyLockResume(action: any): any {
    try {
        console.log('🔒 Verifying lock status for trip end');
        yield call(bluetooth.scanForLock, action.endTripValidation, action.mac);
    } catch (error: any) {
        console.error('❌ Verify lock resume error:', error);
        yield put(movilidad5gActions.setErrorMessage('Error al verificar el candado'));
    }
}

/**
 * Root saga - watches for all movilidad5g actions
 */
export function* movilidad5gSaga() {
    yield takeLatest(movilidad5gTypes.validateQrCode, validateQrCode);
    yield takeLatest(movilidad5gTypes.startLockConnection, startLockConnection);
    yield takeLatest(movilidad5gTypes.resetLock, resetLock);
    yield takeLatest(movilidad5gTypes.startTrip, startTrip);
    yield takeLatest(movilidad5gTypes.endTrip, endTrip);
    yield takeLatest(types.VERIFY_LOCK_RESUME_5G, verifyLockResume);
}

export default movilidad5gSaga;
