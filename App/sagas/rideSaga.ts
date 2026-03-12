//IMPORTS TYPES

import { Alert, PermissionsAndroid, Platform } from "react-native";
import { SET_NEW_TRIP, CALCULATE_TRIP_TIME, GET_STATIONS_BEGIN, RECORD_TRIP_BEGIN, START_CALCULATE_TIME, VALIDATE_PENALTY_BEGIN, appTypes } from "../types/types";
import {
    appRideTypes,
    CHECK_LOCATION_PERMISSIONS,
    GET_ACTIVE_TRIP_CHECK_LIST,
    GET_COORDINATES_TRIP,
    GET_TRIP_INFORMATION,
    GET_TRIP_USER,
    MODAL_QR_ERROR_STATUS,
    SET_BIKE_INFORMATION,
    SET_BUTTON_START_VALIDATION,
    SET_COORDINATES_TRIP,
    SET_END_TRIP_VALIDATION,
    SET_ERROR_MESSAGE,
    SET_LOADING,
    SET_LOADING_LOCK,
    SET_LOCK_INFORMATION,
    SET_STATION_BIKE,
    SET_TRIP_INFORMATION,
    START_TRIP,
    VALIDATE_QR,
    VALIDATE_TRIP,
    VERIFY_CAMERA_PERMISSIONS,
    VERIFY_LOCK_RESUME
} from "../types/rideTypes";
import { RESET_MODAL_LOCK } from "../types/tripTypes"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appActions, calculateTripTime, getActiveTrip, getStations, recordCoordinate, startCalculateTime, validatePenalty } from '../actions/actions';
import { appRideActions, setButtonStartValidation, setEndTripValidation } from '../actions/rideActions';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { getItem, removeAllItems, setItem } from '../Services/storage.service';
import { GET_ACTIVE_TRIP_SUCCESS } from "../types/types.js";
import Geolocation from 'react-native-geolocation-service';
//import SocketService from '../Services/socket.service';
import { api } from "../api/api.service";
//import { v4 as uuidv4 } from 'uuid';
import BluetoothService from "../Services/bluetooth.service2";
import * as RootNavigation from '../RootNavigation';


//IMPORT REACT NATIVE THINGS AND MORE


//IMPORT REDUX SAGA

let bluetooth = new BluetoothService();

// IMPORT API SERVICE 


//SOCKET SERVICE


//MODULAR FUNCTIONS


async function validatePermissionsAndroid() {
    if (Platform.OS === 'android') {
        try {
            const grantedCamera = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Bycycle APP permisos de cámara",
                    message: "Para poder acceder a las funcionalidades de viaje y escanear código QR debe aceptar estos permisos",
                    buttonNeutral: "Pregúntame luego",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );

            const grantedBluetooth = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                {
                    title: "Bycycle APP permisos de Bluetooth",
                    message: "Para poder utilizar la función de bluetooth, debe aceptar los permisos de ubicación",
                    buttonNeutral: "Pregúntame luego",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );

            if (
                grantedCamera === PermissionsAndroid.RESULTS.GRANTED &&
                grantedBluetooth === PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('permisos correctamente de camara y bluetooth');
            } else {
                Alert.alert("Error", "Para poder usar todas nuestras funcionalidades, debe aceptar los permisos necesarios.");
            }
        } catch (err) {
            console.warn(err);
        }
    }
}

function* showError(action: any) {
    yield delay(200);
    Alert.alert("Error", action.payload);
}

function* verifyLockStatus(id: any, userId:any): any {
    console.log("VerifyLockStatus ÑÑÑÑÑÑÑÑÑÑÑÑ");
    let lockInfo = yield select((state) => state.rideReducer.lock);
    let filter = {
        where: {
            id: id
        }
    }
    let lockOpened = false;
    //const apiData = yield api.get("locks", filter);
    //console.log('apiData que trae esta const :::::::::::apiData::::::::: ÑÑÑÑÑÑÑÑÑÑÑÑ', apiData)
    /*for (let i = 0; i < 11; i++) {
        const apiResponse = yield api.get("locks", filter);
        try {
            //console.log('en el trip de verifyLookStatus', apiResponse[0])
            
            if (apiResponse[0] && apiResponse[0].lockStatus == "open") {
                //Alert.alert("Candado abierto");
                i == 11;
                lockOpened = true;
                
                yield put({ type: START_TRIP, payload: userId});

                return apiResponse[0];
            } else {
                //Alert.alert("Candado cerrado");
                if (i > 10) {
                    // yield put({ type: MODAL_QR_ERROR_STATUS, payload: true });
                    // yield put({ type: SET_ERROR_MESSAGE, payload: "Al parecer este candado no ha abierto aun, vamos a intentar desbloquearlo por bluetooth, enciendalo en configuraciones." });
                    //console.log('CANDADO CERRADO Y ENTRRANDO A SEGUIR VERIFCANDO ::::', i);
                    yield put({ type: SET_LOADING_LOCK, payload: false });
                    if (!lockOpened) {
                        //yield put({ type: appTypes.setBluetoothLoader, payload: true });
                        //console.log("1 -> bluetooth.waitUntilDeviceState");
                        //Alert.alert("1 -> bluetooth.waitUntilDeviceState");
                        //bluetooth.waitUntilDeviceState(apiResponse[0].mac, apiResponse[0].id);
                        //console.log("3 -> Iniciar viaje sin confirmacion candado");
                        
                        yield put({ type: appRideTypes.openBluetoothTrip, lock: lockInfo });
                        yield put({ type: START_TRIP, payload: userId });
                        
                    }
                } else {
                    yield delay(1000);
                }
            }
        } catch (err) {
            if (i < 11) {
                // yield put({ type: MODAL_QR_ERROR_STATUS, payload: true });
                // yield put({ type: SET_ERROR_MESSAGE, err });
                yield put({ type: SET_LOADING_LOCK, payload: false });
                if (!lockOpened) {
                    //yield put({ type: appTypes.setBluetoothLoader, payload: true });
                    //console.log("2 -> bluetooth.waitUntilDeviceState");
                    //bluetooth.waitUntilDeviceState(apiResponse[0].mac, apiResponse[0].id);
                    console.log("3 -> Iniciar viaje sin confirmacion candado");
                    yield put({ type: appRideTypes.openBluetoothTrip, lock: lockInfo });
                    yield put({ type: START_TRIP, payload: userId });
                }
                yield delay(1000);
            }
        }
    }
    // yield put({ type: MODAL_QR_ERROR_STATUS, payload: true });
    // yield put({ type: SET_ERROR_MESSAGE, payload: "Al parecer este candado no ha abierto aun, vamos a intentar desbloquearlo por bluetooth, enciendalo en configuraciones." });
    */
    yield put({ type: SET_LOADING_LOCK, payload: false });
    if (!lockOpened) {
        //yield put({ type: appTypes.setBluetoothLoader, payload: true });
        //console.log("3 -> bluetooth.waitUntilDeviceState");
        //Alert.alert("3 -> bluetooth.waitUntilDeviceState");
        //bluetooth.waitUntilDeviceState(apiData[0].mac, apiData[0].id);
        console.log("3 -> Iniciar viaje sin confirmacion candado PPP");
        yield put({ type: appRideTypes.openBluetoothTrip, lock: lockInfo });
        yield put({ type: START_TRIP, payload: userId }); // este es el que registra el trip
    }
}

function* verifyLockStatusResumeTrip(id: any): any {
    //let navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
    let filter = {
        where: {
            id: id
        }
    }
    for (let i = 0; i < 11; i++) {
        try {
            const apiResponse = yield api.get("locks", filter);
            if (apiResponse[0] && apiResponse[0].lockStatus == "open") {
                i == 11;
                RootNavigation.navigate("TripScreen");
                yield put({ type: SET_LOADING_LOCK, payload: false });
                return apiResponse[0];
            } else {
                if (i > 10) {
                    yield put({ type: SET_ERROR_MESSAGE, payload: "Al parecer este candado no ha abierto aun, intentelo despues." });
                    yield put({ type: SET_LOADING_LOCK, payload: false });
                } else {
                    yield delay(1000);
                }
            }
        } catch (err) {
            if (i < 11) {
                yield put({ type: SET_ERROR_MESSAGE, err });
                yield put({ type: SET_LOADING_LOCK, payload: false });
                yield delay(1000);
            }
        }
    }
    yield put({ type: SET_ERROR_MESSAGE, payload: "Al parecer este candado no ha abierto aun, intentelo despues." });
    yield put({ type: SET_LOADING_LOCK, payload: false });
}

//SAGAS AND EFFECTS

function* verifyCameraPermissionsSagas() {
    yield takeLatest(VERIFY_CAMERA_PERMISSIONS, function* verifyCameraPermissions() {
        yield validatePermissionsAndroid();
    });
}

function* startTrip(action:any): any {
    //se guarda el registro de viaje
    //console.log("startTrip :::::INTENTANDO LLEGAR IDUSER POR ACA::::::::: ", action.payload);
    //let navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
    let lockInfo = yield select((state) => state.rideReducer.lock);
    //let userInfo = yield select((state) => state.globalReducer.user);
    let stationInfo = yield select((state) => state.rideReducer.station);
    //console.log('funtion starTrip lockInfo :::::::: ', lockInfo)
    //Alert.alert("funtion starTrip lockInfo", lockInfo);
    //console.log('funtion starTrip userInfo :::::::: ', userInfo)
    //Alert.alert("Erfuntion starTrip userInforor", userInfo);
    //console.log('funtion starTrip stationInfo :::::::: ', stationInfo)
    //Alert.alert("funtion starTrip stationInfo", stationInfo);
    let body = {
        //userId: userInfo.id, //no está llegando
        userId: action.payload, //no está llegando
        bikeId: lockInfo.bikeId,
        startStationId: stationInfo.id,
        organizationId: lockInfo.organizationId 
    };
    //console.log('en startTrip despues del body ', body);
    /**
     en startTrip despues del body  
     {  "bikeId": "627a93fa31feb31c33378092", 
        "organizationId": undefined, 
        "startStationId": "645d46ded1dc6d02b894a91c", 
        "userId": undefined}
     */
    let response = yield api.postData('startTrip', body);
    //console.log('LA RESPUESTA DE LA FUNCION STARTRIP ::::', response);
    if (response.createdAt) {
        yield put({ type: SET_LOADING_LOCK, payload: false });
        yield put({ type: SET_NEW_TRIP, payload: response });
        //SocketService.socketInstance.emitUpdateStations(stationInfo.id);
        RootNavigation.navigate("TripScreen");
        //PUT NAVIGATION TO CURRENT TRIP SCREEN
    } else {
        yield put({ type: MODAL_QR_ERROR_STATUS, modalQrStatus: true });
    }
}

function* validateQr(action: any): any {
    let regExp = /^[0-9]*$/g;
    //const navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
    if (action.payload?.qrNumber && regExp.test(action.payload.qrNumber) && action.payload.qrNumber.length == 7) {
        yield put({ type: SET_LOADING, payload: true });
        yield put({ type: VALIDATE_TRIP, payload: { 
            qrNumber: action.payload.qrNumber,
            id: action.id.iduser,
            org: action.org.organizationId
            } 
        });
    } else {
        yield put({ type: SET_ERROR_MESSAGE, payload: "Este codigo parece no ser correcto, intentelo de nuevo." });
        //yield put({ type: MODAL_QR_ERROR_STATUS, payload: true });
        RootNavigation.navigate("Home");
    }
}

function* validateTrip(action: any): any {
    //console.log("validateTrip", action);
    //let userInfo = yield select((state) => state.globalReducer.user);
    //console.log('QUE TRAE EL USER INFO BBBBBBBBBBBBBBBBBBB ', userInfo);
    let qrNumber = action.payload.qrNumber;
    //let organizationId = userInfo.organizationId;
    let organizationId = action.payload.org;
    //let userId = userInfo.id;
    let userId = action.payload.id;
    console.log('QR', qrNumber);
    console.log('ORG', organizationId);
    console.log('USERID', userId);
    let request = yield api.validateTrip(qrNumber, organizationId, userId);
    console.log("request validate bikeInformation", request.bikeInformation);
    console.log("request validate lockInformation", request.lockInformation);
    console.log("request validate stationInformation", request.stationInformation);
    if (request?.error) {
        console.log("request?.error");
        yield put({ type: SET_LOADING, payload: false });
        yield put({ type: MODAL_QR_ERROR_STATUS, modalQrStatus: true });
        yield put({ type: SET_ERROR_MESSAGE, payload: request.error });
    } else {
        console.log('validando el trip ::::tripppppp::::', request);
        if (request.lockInformation && request.bikeInformation && request.stationInformation) {
            yield put({ type: SET_BIKE_INFORMATION, payload: { bikeInformation: request.bikeInformation } });
            yield put({ type: SET_LOCK_INFORMATION, payload: { lockInformation: request.lockInformation } });
            yield put({ type: SET_STATION_BIKE, payload: { stationInformation: request.stationInformation } });
            yield put({ type: SET_LOADING, payload: false });
            yield put({ type: SET_LOADING_LOCK, payload: true });
            yield call(verifyLockStatus, request.lockInformation.id, userId);
        } else {
            yield put({ type: SET_LOADING, payload: false });
            yield put({ type: SET_ERROR_MESSAGE, payload: "Al parecer algo ha ocurrido y no se ha podido iniciar su viaje... intentelo nuevamente." });
        }
    }
}

function* getUserTrip(): any {
    yield put({ type: SET_LOADING, payload: true });
    //const navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
    //let userInfo = yield select((state) => state.globalReducer.user);
    let userInfo = yield getItem('user');
    console.log('LALALAL DATATAT DEL SUSUARIO ES: ', userInfo);
    let masterListActive = yield api.get(`master-lists/617b259ee95e31dbb418357a`);
    let filter: Object = {
        where: { userId: userInfo.id, state: masterListActive.value }
    };
    console.log('DATOS PARA FILTRAR EL VIAJE KKKKKKKKK ', filter);
    let res = yield api.get("trips", filter);
    if (res.length) {
        let response = res[0];
        if (response.id) {
            yield put({ type: GET_ACTIVE_TRIP_SUCCESS, payload: response });
            yield put({ type: GET_COORDINATES_TRIP, payload: response.id });
        }
    } else {
        Alert.alert("Error", "Algo ha ocurrido y no se ha encontrado su viaje.");
        RootNavigation.navigate("Home");
        yield put({ type: SET_LOADING, payload: false });
    }
}

function* getCoordinatesTrip(action: any): any {
    let tripId: string = action.payload;
    let data: Object = {
        tripId,
        divided: false
    }
    let coordinates: Array<any> = yield api.get("coordinates", { where: { tripId }, order: ["date ASC"] });
    let coordNormalized: any = [];
    let normalized = {};
    if (coordinates.length) {
        coordinates.map((co: any) => {
            normalized = {
                latitude: parseFloat(co.latitude),
                longitude: parseFloat(co.longitude)
            };
            coordNormalized.push(normalized)
        });
    } else {
        coordNormalized = [{ latitude: 0, longitude: 0 }]
    }
    yield put({ type: SET_COORDINATES_TRIP, payload: coordNormalized });
    yield put({ type: GET_TRIP_INFORMATION, payload: tripId });

}

function* tripInfo(action: any): any {
    let tripId = action.payload;
    let data: Object = {
        tripId
    }
    let res: any = yield api.postData("tripInfo", data);
    if (res) {
        yield put({ type: SET_LOADING, payload: false });
        yield put({ type: SET_TRIP_INFORMATION, payload: res });
    }
}


function* getCurrentLocation(): any {
    let location: any;
    let coordinates = yield select((state) => state.rideReducer.coordinates);
    yield put({ type: appTypes.setLoadingEnd, payload: true });
    try {
        location = yield geoLocation();
        yield put(appActions.validationEndTrip(location));
    } catch (error) {
        if (coordinates.length) {
            location = {
                accuracy: 4,
                latitude: coordinates[coordinates.length - 1].latitude,
                altitude: 4,
                longitude: coordinates[coordinates.length - 1].longitude,
                speed: 0
            };
        } else {
            location = {
                accuracy: 4,
                latitude: 4.668254,
                altitude: 4,
                longitude: -74.103983,
                speed: 0
            }
        }
        yield put(appActions.validationEndTrip(location));
    }
}

function geoLocation(): Promise<any> {
    let geoSetup = Platform.OS == "android" ? {
        enableHighAccuracy: true,
        timeout: 3000
    } : {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 3600000
    }
    return new Promise((resolve: any, reject: any) => {
        Geolocation.getCurrentPosition(
            (positionActual: any) => {
                resolve(positionActual.coords);
            },
            (erro: any) => {
                reject(erro);
            },
            geoSetup
        );
    })
}

function* validationEndTrip(action: any): any {
    let trip = yield select((state) => state.userReducer.actualTrip);
    let apiResponse = yield api.validationEndTrip(trip, action.currentLocation);
    if (apiResponse?.error) {
        yield put({ type: appTypes.setLoadingEnd, payload: false });
        yield delay(100);
        Alert.alert("Error validacion", apiResponse.error);
    } else {
        if (apiResponse.lockStatus == "open") {
            yield put({ type: appTypes.setLoadingEnd, payload: false });
            yield delay(100);
            Alert.alert("Error con el candado", "Parece ser el candado esta abierto, por favor cierralo para terminar el viaje");
        } else {
            yield put(appActions.endTrip(trip, apiResponse.closestStationId));
        }
    }

}

function* endTrip(action: any): any {
    yield put({ type: appTypes.setLoadingEnd, payload: true });
    let userTripInformation = yield select((state) => state.rideReducer.userTripInformation);
    
    let user = yield getItem('user');
    const indicadoresString = yield AsyncStorage.getItem('indicadores');
    const indicadores = indicadoresString ? JSON.parse(indicadoresString) : {}; // Verifica y parsea solo si no es nulo
    console.log('ACTION....INDICADORES', indicadores);
    //Acá crear registro de los indicadores de impacto 5G
    let data_ind = {
        "ind_id": new Date().getTime(), 
        "ind_usuario": user.idNumber, 
        "ind_viaje": action.trip.id, 
        "ind_modulo": "5g", 
        "ind_duracion": indicadores.duracion ?? null, 
        "ind_distancia": indicadores.distancia ?? null, 
        "ind_calorias": indicadores.calorias ?? null, 
        "ind_co2": indicadores.co2 ?? null
    }
	let tabla = 'bc_indicadores_trip/registrar';    
    console.log('la data_ind: ', data_ind);

	let saveIndicadores = yield api.guardandoIndicadores(tabla, data_ind);

    console.log('LA RESPUESTA DE SAVE INDICADORES', saveIndicadores);

    let apiResponse = yield api.endTrip(action.trip, action.endStationId, userTripInformation);
    
    if (apiResponse?.error) {
        Alert.alert("Error", "No hemos podido terminar el viaje");
        yield put({ type: appTypes.setLoadingEnd, payload: false });
    } else {
        yield put({ type: appTypes.setLoadingEnd, payload: false });
        yield put({ type: RESET_MODAL_LOCK, payload: false });
        //SocketService.socketInstance.emitUpdateStations(action.endStationId); 
        //const navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
        //RootNavigation.navigate("travelExperienceScreen"); //navegacion normal 
        //RootNavigation.navigate("FinalizarViaje");
        RootNavigation.navigate("travelExperienceScreen");
        // navigation.navigate("FinishingScreen");
    }
}

function* verifyLockResume(): any {
    yield put({ type: appTypes.setLoadingResume, payload: true });
    //let navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
    let trip = yield select((state) => state.userReducer.actualTrip);
    let lck = yield api.get("locks", { where: { bikeId: trip.bikeId, lockStatus: "closed" } });
    let lock = lck[0];
    if (lock) {
        yield api.get(`openLock/${lock.imei}`);
        yield put({ type: appTypes.setLoadingResume, payload: false });
        yield put({ type: SET_LOADING_LOCK, payload: true });
        yield call(verifyLockStatusResumeTrip, lock.id);
    } else {
        RootNavigation.navigate("TripScreen");
        yield put({ type: appTypes.setLoadingResume, payload: false });
    }
}

function* getActiveTripChecklist(action: any): any { 
    //console.log('EN LA SAGA getActiveCheckList ')
    yield put({ type: appTypes.setLoadingEnd, payload: false });
    yield put(setEndTripValidation({
                        userInRange: "loading",
                        lockInRange: "loading",
                        lockIsClosed: "loading"
                    })); 
    //let userInfo = yield select((state) => state.globalReducer.user);
    //console.log('la info del user en ride saga check list :::::CHECKLIST', userInfo);
    //let userId = userInfo.id;
    
    let user = yield getItem('user');
    //console.log('la info del user en ride saga check list :::::CHECKLIST', user);
    let userId = user.id;

    
    let filter = {
        where: {
            userId: userId,
            state: { inq: ['finishing', 'active'] }
        }
    }
    //const navigation = yield select((state) => state.globalReducer.nav._navigation); // SE COMENTO
    let trips = yield api.get("trips", filter);
    let tripsFinishing = trips.filter((trip: any) => trip.state == 'finishing');
    let tripsActive = trips.filter((trip: any) => trip.state == 'active');
    console.log("getActiveTripChecklist",{user,trips})

    if (tripsActive.length > 0) {
        yield put({ type: GET_ACTIVE_TRIP_SUCCESS, payload: tripsActive[0] });
        //yield put({ type: CHECK_LOCATION_PERMISSIONS }); //se comento 23 feb probando
    } else if (tripsFinishing.length > 0) {        
        RootNavigation.navigate('travelExperienceScreen');
    } else {
        //RootNavigation.navigate("Home");
    }
}

function* validateUserLocation(action: any): any {//checklistlocation(stationId, trips)
    let trip = yield select((state) => state.userReducer.actualTrip);
    let apiResponse = yield api.validationEndTripC(trip, action.location);
    console.log("validateUserLocation ::::::::::::::::::",{trip,apiResponse})
    if (apiResponse?.error) {
        yield put(setButtonStartValidation(true));
        yield put(setEndTripValidation({
                    userInRange: "no",
                    lockInRange: "waiting",
                    lockIsClosed: "waiting"
                }));
        yield delay(100);
        Alert.alert("Error validacion", apiResponse.error);
    } else {
        yield put(setEndTripValidation({
                    userInRange: "yes",
                    lockInRange: "loading",
                    lockIsClosed: "loading"
                }));
        yield put(appRideActions.setChecklistlocation({trip, closestStationId: apiResponse.closestStationId}));
        yield put({type: appRideTypes.startLockValidations});                
    }
}
//CHECKLIST SAGAS
function* checkLocationPermissions(action: any): any {
    let location: any;
    console.log("checkLocationPermissions");
    yield put(setEndTripValidation({
                    userInRange: "loading",
                    lockInRange: "loading",
                    lockIsClosed: "loading"
                }));
    try {
        location = yield geoLocation();
        console.log("checkLocationPermissions location",location)
        yield put(appRideActions.checkBluetoothPermissions(location));
    } catch (error) {
        console.log("checkLocationPermissions error",error)
        yield put(setEndTripValidation({
                    userInRange: "waiting",
                    lockInRange: "waiting",
                    lockIsClosed: "waiting"
                }));
        yield put(setButtonStartValidation(true));
        Alert.alert("Error de geolocación", "Asegurate de permitir acceso a tu ubicación e intentalo nuevamente")
    }
}

function* checkBluetoothPermissions(action: any): any {
    //descomentar
    let bluetoothState = yield select((state) => state.rideReducer.bluetoothState);
    //let bluetoothState = true;
    console.log("checkBluetoothPermissions",{bluetoothState});
    if (bluetoothState) {
        yield put(appRideActions.validateUserLocation(action.location));
    } else {
        yield put(setEndTripValidation({
                    userInRange: "waiting",
                    lockInRange: "waiting",
                    lockIsClosed: "waiting"
                }));
        yield put(setButtonStartValidation(true));
        Alert.alert("Error de conexión al bluetooth", "Debe encender el bluetooth de su dispositivo para poder continuar")
    }
}

function* startLockValidations(action: any): any {
    let trip = yield select((state) => state.userReducer.actualTrip);
    let endTripValidation = yield select((state) => state.rideReducer.endTripValidation);
    let locks = yield api.get("locks", { where: { bikeId: trip.bikeId } });
    console.log("startLockValidations",{trip,endTripValidation,locks});
    if(locks.length>0){
        bluetooth.scanForLock(endTripValidation, locks[0].mac);
    }else{
        yield put(setEndTripValidation({
                    userInRange: "yes",
                    lockInRange: "waiting",
                    lockIsClosed: "waiting"
                }));
        yield put(setButtonStartValidation(true));
        Alert.alert("Error validacion", "Candado de la bicicleta no registrado, contacta soporte");
    }
    
}
//agregado para ruedaporibague 
function* openBluetoothTrip(action: any): any {
    //abrir candado por bluetooth mientras esta en viaje
    yield put({ type: appTypes.setBluetoothLoader, payload: true });
    console.log("openBluetoothTrip", action);
    bluetooth.waitUntilDeviceState(action.lock.mac, action.lock.id);
}


//SAGAS EXPORT
function* startLockValidationsSagas() {
    yield takeLatest(appRideTypes.startLockValidations, startLockValidations);
}

function* checkLocationPermissionsSagas() {
    yield takeLatest(CHECK_LOCATION_PERMISSIONS, checkLocationPermissions);
}
function* validateUserLocationSagas() {
    yield takeLatest(appRideTypes.validateUserLocation, validateUserLocation);
}
function* checkBluetoothPermissionsSagas() {
    yield takeLatest(appRideTypes.checkBluetoothPermissions, checkBluetoothPermissions);
}
function* getActiveTripChecklistSagas() {
    yield takeLatest(GET_ACTIVE_TRIP_CHECK_LIST, getActiveTripChecklist);
}
function* validateQrSagas() {
    yield takeLatest(VALIDATE_QR, validateQr);
}

function* validateTripSagas() {
    yield takeLatest(VALIDATE_TRIP, validateTrip);
}

function* showErrorSagas() {
    yield takeLatest(SET_ERROR_MESSAGE, showError);
}

function* startTripSagas() {
    yield takeLatest(START_TRIP, startTrip);
}


function* getCurrentLocationSaga() {
    yield takeLatest(appTypes.getCurrentLocation, getCurrentLocation);
}

function* validationEndTripSaga() {
    yield takeLatest(appTypes.validationEndTrip, validationEndTrip);
}

function* endTripSaga() {
    yield takeLatest(appTypes.endTrip, endTrip);
}

function* getUserTripSagas() {
    yield takeLatest(GET_TRIP_USER, getUserTrip);
}

function* getCoordinatesTripSaga() {
    yield takeLatest(GET_COORDINATES_TRIP, getCoordinatesTrip);
}

function* tripInfoSagas() {
    yield takeLatest(GET_TRIP_INFORMATION, tripInfo);
}

function* verifyLockResumeSagas() {
    yield takeLatest(VERIFY_LOCK_RESUME, verifyLockResume);
}
//agregado para ruedaporibague 
function* openBluetoothTripSagas() {
    yield takeLatest(appRideTypes.openBluetoothTrip, openBluetoothTrip);
}

export const sagas = [
    checkLocationPermissionsSagas(),
    validateUserLocationSagas(),
    checkBluetoothPermissionsSagas(),
    startLockValidationsSagas(),
    getActiveTripChecklistSagas(),
    verifyCameraPermissionsSagas(),
    validateQrSagas(),
    validateTripSagas(),
    showErrorSagas(),
    startTripSagas(),
    getCurrentLocationSaga(),
    validationEndTripSaga(),
    getUserTripSagas(),
    getCoordinatesTripSaga(),
    tripInfoSagas(),
    endTripSaga(),
    verifyLockResumeSagas(),
    //agregado para ruedaporibague 
    openBluetoothTripSagas(),
]
