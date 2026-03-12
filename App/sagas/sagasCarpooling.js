/*eslint-disable */
import {
    FETCH_SUCCESS_TRIP,
    FETCH_SUCCESS_ADD_CAR,
    FETCH_SUCCESS_SIT_APLICATE,
    FETCH_SUCCESS_ADD_RIDER,
    GET_VEHICULES,
    FETCH_SUCCESS_VEHICULES,
    GET_CONFIRMATION,
    FETCH_SUCCESS_CONFIRMATION,
    GET_RIDERS,
    FETCH_SUCCESS_RIDERS,
    GET_APLICATION,
    FETCH_SUCCESS_APLICATION,
    GET_ACTIVE_TRIP,
    FETCH_SUCCESS_ACTIVE_TRIP,
    GET_ACTIVE_TRIP_RIDER,
    FETCH_SUCCESS_ACTIVE_TRIP_RIDER,
    GET_ACTIVE_TRIP_DRIVER,
    FETCH_SUCCESS_ACTIVE_TRIP_DRIVER,
    GET_TRIP_ACTIVO,
    GET_ROLES_CARPOOLING,
    DRIVER_CARPOOLING,
    DRIVER_CARPOOLING_OK,
    DRIVER_ROL_CARPOOLING_OK,
    RIDER_CARPOOLING_OK,
    ACCEPT_TYC_CARPOOLING,
    SAVE_VEHICLE_CARPOOLING,
    SAVE_VEHICLE_CARPOOLING_OK,
    GET_MY_VEHICLES_CARPOOLING,
    GET_MY_VEHICLES_CARPOOLING_OK,
    SAVE_TRIP_CP,
    SAVE_TRIP_CP_OK,
    SELECT_TRIP_DRIVER_CARPOOLING,
    SELECT_TRIP_DRIVER_CARPOOLING_DATA,
    SELECT_TRIP_RIDER_CARPOOLING,
    SELECT_TRIP_RIDER_CARPOOLING_FILTER,
    SELECT_TRIP_RIDER_CARPOOLING_DATA,
    INIT_TRIP_CARPOOLING,
    INIT_TRIP_CARPOOLING_OK,
    GET_RIDER_CARPOOLING,
    GET_RIDER_CARPOOLING_DATA,
    ACCEPT_SOLICITUD_CARPOOLING,
    ACCEPT_SOLICITUD_CARPOOLING_OK,
    SELECT_TRIP_CARPOOLING,
    SAVE_TRIP_STATE,
    REDEFINIR_ROL,
    SAVE_TOKEN_MSN,
    ASK_PRACTICE,
    ASK_THEORETICAL,
    GET_SCHEDULE,
    GET_RIDERLIST_CARPOOLING,
    END_TRIP_CARPOOLING,
    END_TRIP_CARPOOLING_OK,
    SAVE_PAGO_CARPOOLING,
    SAVE_PAGO_CARPOOLING_OK,
    GET_RIDERLIST_CARPOOLING_DATA,
    INFO_USER,
    INFO_USER_DIR_CASA_SALIDA,
    INFO_USER_DIR_TRABAJO_SALIDA,
    INFO_USER_DIR_CASA_LLEGADA,
    INFO_USER_DIR_TRABAJO_LLEGADA,
    SEND_NOTIFICICATION,
    END_SOLICTUD_CARPOOLING,
    END_SOLICTUD_CARPOOLING_OK,
    SEND_APPLICATION_CARPOOLING,
    SEND_APPLICATION_CARPOOLING_OK,
    PATCH_TRIP_CARPOOLING,
    PATCH_TRIP_CARPOOLING_OK,
    GET_PAY_TRIP_PRODESO,
    GET_PAY_TRIP_PRODESO_OK,
    PATCH_ESTADO_PAGO_TRIP,
    PATCH_ESTADO_PAGO_TRIP_OK,
    SAVE_COMMENT_CARPOOLING,
    SAVE_COMMENT_CARPOOLING_OK,
    GET_DATA_PAGO,
    GET_DATA_PAGO_OK,
    PATCH_IMG,
    PATCH_CALIFICACIONES,
    PATCH_CALIFICACIONES_OK,
    TRIP_END_CARPOOLING,
    TRIP_END_CARPOOLING_OK,
    BRING_APPOINTMENTS,
    BRING_APPOINTMENTS_OK,
    FETCH_SUCCESS_USER_PRACTICE,
    FETCH_SUCCESS_USER_THEORETICAL,
    SEND_ANSWERS_THEORY,
    SEND_SCHEDULE,
    SEND_SCHEDULE_OK,
    CANCEL_SCHEDULE,
    CANCEL_SCHEDULE_OK,
    SITES_USER,
    GET_SITES_USER,
    PATCH_VEHICULO_CARPOOLING,
    PATCH_VEHICULO_CARPOOLING_OK,
    PATCH_CONDUCTOR_CARPOOLING,
    PATCH_CONDUCTOR_CARPOOLING_OK,
    LOGRO_PROGRESO_SOLICITUD_VIAJE,
    LOGRO_PROGRESO_VIAJE_COMPARTIDO_PASAJERO
} from '../types/typesCarpooling';
import { all, call, put, select, takeEvery, takeLatest, delay } from 'redux-saga/effects';
import { api } from '../api/apiCarpooling';
import { push } from '../api/notificacionesPush';
import { getItem } from '../Services/storage.service';
import * as RootNavigation from '../RootNavigation';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

function* viewAddCar() {
    yield takeLatest(FETCH_SUCCESS_ADD_CAR, addCarCarpooling);
};

function* addCarCarpooling(action) {
    let tabla = 'compartidoVehiculo/registrar';
    let data = action.vehiculeData;
    let addCar = yield api.addCar(tabla, data);
    if (!addCar.error) {
        console.log("Vehiculo agregado correctamente")
    } else {
        console.log('Error xd ', addCar.error)
    }
};

function* viewSitAplicate() {
    yield takeLatest(FETCH_SUCCESS_SIT_APLICATE, sitAplicate);
};

function* sitAplicate(action) {
    let tabla = 'compartidoSolicitud/registrar';
    let data = action.trip;
    let addTrip = yield api.addAplication(tabla, data);
    if (!addTrip.error) {
        console.log("Solicitud agregada correctamente")
    } else {
        console.log('Error xd ', addTrip.error)
    }
};

function* viewAddRider() {
    yield takeLatest(FETCH_SUCCESS_ADD_RIDER, addRider);
};

function* addRider(action) {
    let tabla = 'compartidoPasajero/registrar';
    let data = action.trip;
    let addTrip = yield api.addUserRider(tabla, data);
    if (!addTrip.error) {
        console.log("Pasajero agregado correctamente")
    } else {
        console.log('Error xd ', addTrip.error)
    }
};

function* viewGetVehicules() {
    yield takeLatest(GET_VEHICULES, getVehiculesCarpooling);
};

function* getVehiculesCarpooling(action) {
    let _id = action.userAuth;
    let tabla = 'compartidoVehiculo/filter/';
    let getVehicule = yield api.getVehicules(tabla, _id);
    if (!getVehicule.error) {
        yield put({ type: FETCH_SUCCESS_VEHICULES, payload: getVehicule });
    } else {
        console.log('Error xd ', getVehicule.error)
    }
};

function* viewGetConfirmation() {
    yield takeLatest(GET_CONFIRMATION, getConfirmationCarpooling);
};
//Cambiar en backend para traer un viaje en particular -- pantalla de conductor de confirmar usuarios PUT
function* getConfirmationCarpooling(action) {
    let _id = action.userAuth;
    let _idTrip = action.tripAuth;
    let tabla = 'compartidoSolicitud/';
    let getConfirmation = yield api.getConfirmation(tabla, _id, _idTrip);
    if (!getConfirmation.error) {
        yield put({ type: FETCH_SUCCESS_CONFIRMATION, payload: getConfirmation });
    } else {
        console.log('Error xd ', getConfirmation.error)
    }
};

function* viewGetRiders() {//Traer acompañantes
    yield takeLatest(GET_RIDERS, getRidersCarpooling);
};
//Busca el viaje por id, crear filtro en backend
function* getRidersCarpooling(action) {
    let _idTrip = action.tripAuth;
    let tabla = 'compartidoPasajero/filter/';
    let getRiders = yield api.getRiders(tabla, _idTrip);
    if (!getRiders.error) {
        yield put({ type: FETCH_SUCCESS_RIDERS, payload: getRiders });
    } else {
        console.log('Error xd ', getRiders.error)
    }
};

function* viewGetAplications() {//Traer solicitudes
    yield takeLatest(GET_APLICATION, getAplicationsCarpooling);
};
//Crear metodo backend
function* getAplicationsCarpooling(action) {
    let _idTrip = action.tripAuth;
    let tabla = 'compartidoSolicitud/filter/';
    let getAplication = yield api.getAplication(tabla, _idTrip);
    if (!getAplication.error) {
        yield put({ type: FETCH_SUCCESS_APLICATION, payload: getAplication });
    } else {
        console.log('Error xd ', getAplication.error)
    }
};

function* viewGetActiveTrips() {//Traer viajes activos para el pasajero
    yield takeLatest(GET_ACTIVE_TRIP, getActiveTripsCarpooling);
};

function* getActiveTripsCarpooling(action) {
    let tabla = 'compartidoViajeActivo/';
    let getActiveTrip = yield api.getActiveTrip(tabla);
    if (!getActiveTrip.error) {
        yield put({ type: FETCH_SUCCESS_ACTIVE_TRIP, payload: getActiveTrip });
    } else {
        console.log('Error xd ', getActiveTrip.error)
    }
};

function* viewGetActiveTripsRider() {//Traer viajes activos y filtrados para el pasajero
    yield takeLatest(GET_ACTIVE_TRIP_RIDER, getActiveTripsRider);
};
//Crear metodo backend
function* getActiveTripsRider(action) {
    console.log("getActiveTripsRider")
    let idUser = action.userAuth;
    let tabla = 'compartidoPasajeros/filter/';
    let getActiveTripRider = yield api.getActiveTripRider(tabla, idUser);
    if (!getActiveTripRider.error) {
        yield put({ type: FETCH_SUCCESS_ACTIVE_TRIP_RIDER, payload: getActiveTripRider });
    } else {
        console.log('Error xd ', getActiveTripRider.error)
    }
};

function* viewGetActiveTripsDriver() {//Traer viajes activos y filtrados para el pasajero
    yield takeLatest(GET_ACTIVE_TRIP_DRIVER, getActiveTripsDriver);
};
//Crear metodo backend
function* getActiveTripsDriver(action) {
    console.log("getActiveTripsDriver")
    let idUser = action.userAuth;
    let tabla = 'compartidoConductor/filter/';
    let getActiveTripDriver = yield api.getActiveTripDriver(tabla, idUser);
    if (!getActiveTripDriver.error) {
        yield put({ type: FETCH_SUCCESS_ACTIVE_TRIP_DRIVER, payload: getActiveTripDriver });
    } else {
        console.log('Error xd ', getActiveTripDriver.error)
    }
};


///////////////////////////////////////////////

//Crear metodo backend
function* driver_carpooling__get(action) {
    let user = yield getItem('user');
    let tabla = 'compartido' + action.rol + '/id/';
    let getActiveTripDriver = yield api.get_id(tabla, user.idNumber);
    if (action.rol === 'Conductor') {
        if (!getActiveTripDriver.error) {
            if (getActiveTripDriver.data !== null) {
                let tablaProceso = 'compartidoViajeActivo/conductorProceso/';
                let tripsProceso = yield api.get_active_trips(tablaProceso, user.idNumber);
                if (tripsProceso.data.length === 1) {
                    yield put({ type: SELECT_TRIP_CARPOOLING, payload: tripsProceso.data[0]._id, rol: action.rol })
                    yield put({ type: SAVE_TRIP_STATE, payload: tripsProceso.data[0].estado })
                    yield put({ type: SELECT_TRIP_DRIVER_CARPOOLING_DATA, payload: tripsProceso.data[0] })
                    yield put({ type: REDEFINIR_ROL, payload: 'Conductor' })
                    RootNavigation.navigate('CarpoolingTripInProcess');
                }
            }
        } else {
            console.log('Error xd ', getActiveTripDriver.error)
        }
        let tabla2 = 'compartidoConductor/itinerario/';
        let tripsCP = yield api.get_active_trips_filtered(tabla2, user.idNumber, { page: action.page });
        yield put({ type: FETCH_SUCCESS_TRIP, payload: tripsCP });
    }

    if (action.rol === 'Pasajero') {
        if (!getActiveTripDriver.error) {
            if (getActiveTripDriver.data !== null) {
                /*
                let tablaProceso = 'compartidoViajeActivo/conductorProceso/';
                let tripsProceso = yield api.get_active_trips(tablaProceso, user.idNumber);
                console.log('viaje en proceso ::::>>__', tripsProceso);
                console.log('viaje en proceso tamaño ::::>>__', tripsProceso.data.length);
                if(tripsProceso.data.length === 1){
                    console.log('tenemos viaje en proceso');  
                    yield put({ type: SELECT_TRIP_CARPOOLING, payload: tripsProceso.data[0]._id})
                    yield put({ type: SAVE_TRIP_STATE, payload: tripsProceso.data[0].estado})
                    yield put({ type: SELECT_TRIP_DRIVER_CARPOOLING_DATA, payload: tripsProceso.data[0]})
                    RootNavigation.navigate('CarpoolingTripInProcess');
                }

                if (tripsProceso.data.length === 0) {
                    console.log('NO tenemos viaje en proceso');
                    let tabla2 = 'compartidoViajeActivo/conductorActivo/';
                    let tripsCP = yield api.get_active_trips(tabla2, user.idNumber);
                    console.log('la data de viajes activos .....', tripsCP);
                    yield put({ type: FETCH_SUCCESS_TRIP, payload: tripsCP});
                    yield put({ type: SAVE_TRIP_STATE, payload: tripsCP.estado})
                }
                */
            }
        } else {
            console.log('Error xd ', getActiveTripDriver.error)
        }
    }

};
function* driver_carpooling_get() {
    yield takeLatest(DRIVER_CARPOOLING, driver_carpooling__get);
};
// Preguntar por roles
function* roles_carpooling_get() {
    let user = yield getItem('user');
    let tablaDriver = 'compartidoConductor/id/';
    let tablaRider = 'compartidoPasajero/id/';
    let getActiveTripDriver = yield api.get_id(tablaDriver, user.idNumber);
    if (!getActiveTripDriver.error) {
        if (getActiveTripDriver.data !== null) {
            yield put({ type: DRIVER_ROL_CARPOOLING_OK });
        }
    } else {
        console.log('Error', getActiveTripDriver.error)
    }
    let getActiveTripRider = yield api.get_id(tablaRider, user.idNumber);
    if (!getActiveTripRider.error) {
        if (getActiveTripRider.data !== null) {
            yield put({ type: RIDER_CARPOOLING_OK });
        }
    } else {
        console.log('Error xd ', getActiveTripRider.error)
    }
};
function* rol_carpooling_get() {
    yield takeLatest(GET_ROLES_CARPOOLING, roles_carpooling_get);
};

function* accept__tyc(action) {
    let user = yield getItem('user');
    const data = {
        "_id": user.idNumber,
        "fechaInscripcion": new Date(),
        "nombre": action.json.nombre,
        "numero": action.json.numero,
        "daviplata": action.json.daviplata,
        "nequi": action.json.nequi,
        "viajes": 0,
    }
    let tabla = 'compartido' + action.rol + '/registrar';
    let getActiveTripDriver = yield api.post__(tabla, data);
    if (!getActiveTripDriver.error) {
        if (getActiveTripDriver === 'Item Create Complete') {
            yield put({ type: DRIVER_ROL_CARPOOLING_OK });
            yield put({ type: FETCH_SUCCESS_ACTIVE_TRIP_DRIVER, payload: getActiveTripDriver });
        } else if (getActiveTripDriver === 'ok') {
            yield put({ type: RIDER_CARPOOLING_OK });
            yield put({ type: FETCH_SUCCESS_ACTIVE_TRIP_DRIVER, payload: getActiveTripDriver });
        }
    } else {
        console.log('Error xd ', getActiveTripDriver.error)
    }
};
function* accept_tyc() {//Traer viajes activos y filtrados para el pasajero
    yield takeLatest(ACCEPT_TYC_CARPOOLING, accept__tyc);
};

// registrar vehículo en carpooling
function* save_vc_usuario(action) {
    let data = action.data;
    let tabla = 'compartidoVehiculo/registrar';
    let regVP = yield api.post__(tabla, data);
    if (!regVP.error) {
        if (regVP === 'ok') {
            yield put({ type: SAVE_VEHICLE_CARPOOLING_OK });
        }
    } else {
        console.log('ERROR DE LA SAGA 3G: ', regVP.error)
    }
}
function* saveVCusuario() {
    yield takeLatest(SAVE_VEHICLE_CARPOOLING, save_vc_usuario);
}

// get vehiculos carpooling
function* get_myvehicles_v_c(action) {
    let user = yield getItem('user');
    let tabla = 'compartidoVehiculo/propietario/';
    let mvc = yield api.get_id(tabla, user.idNumber);
    if (!mvc.error) {
        yield put({ type: GET_MY_VEHICLES_CARPOOLING_OK, payload: mvc });
    } else {
        console.log('ERROR DE LA SAGA 3G: ', mvc.error)
    }
}
function* get_myvehicles_carpooling() {
    yield takeLatest(GET_MY_VEHICLES_CARPOOLING, get_myvehicles_v_c);
}

//guardar viaje
function* save_trip_carpooling(action) {
    let user = yield getItem('user');
    let tabla = 'compartidoViajeActivo/registrar'
    let trip = yield api.post__(tabla, action.trip);
    if (trip === 'ok') {
        yield put({ type: SAVE_TRIP_CP_OK });
    }
}
function* save_trip_cp() {
    yield takeLatest(SAVE_TRIP_CP, save_trip_carpooling);
}

//get viaje select por conductor
function* save_trip_carpooling_select(action) {
    let tabla = 'compartidoViajeActivo/id/'
    let tripSelect = yield api.get_id(tabla, action.id);
    if (!tripSelect.error) {
        yield put({ type: SELECT_TRIP_DRIVER_CARPOOLING_DATA, payload: tripSelect.data });
        yield put({ type: SAVE_TRIP_STATE, payload: tripSelect.data.estado })
    } else {
        console.log('ERROR DE LA SAGA 3G: ', tripSelect.error)
    }

}
function* save_trip_cp_select() {
    yield takeLatest(SELECT_TRIP_DRIVER_CARPOOLING, save_trip_carpooling_select);
}

//traer viajes diferentes al usuario
function* save_trips_active_out_user(action) {
    let user = yield getItem('user');
    let tabla = 'compartidoViajeActivo/viajes/';
    let pageNumber = action.pagina;
    let limite = 10;
    let offset = (pageNumber - 1) * limite;
    let tripsToShow = yield api.get_id_with_page(tabla, {
        documento: user.idNumber,
        limit: limite,
        page: pageNumber,  // Pasando el número de la página
        offset: offset,     // Pasando el offset calculado
    });
    if (!tripsToShow.error) {
        yield put({ type: SELECT_TRIP_RIDER_CARPOOLING_DATA, payload: tripsToShow });
    } else {
        console.log('ERROR DE LA SAGA CARPOOLING: ', tripsToShow);
    }
}
function* save_trip_rider_select() {
    yield takeLatest(SELECT_TRIP_RIDER_CARPOOLING, save_trips_active_out_user);
}

//traer viajes filtrados
function* get_trips_filter_carpooling_rider(action) {
    let user = yield getItem('user');
    let tabla = 'compartidoViajeActivo/viajesFiltered/';
    let pageNumber = action.pagina;
    let fromThisDate = action.fromThisDate;
    let position1 = action.position1;
    let position2 = action.position2;
    let limite = 10;
    let offset = (pageNumber - 1) * limite;
    const filters = {
        pago: [],
        transporte: [],
    };
    if (action.checkDaviPlata) {
        filters.pago.push('DaviPlata');
    }
    if (action.checkCash) {
        filters.pago.push('Efectivo');
    }
    if (action.checkCarro) {
        filters.transporte.push('Carro');
    }
    if (action.checkMoto) {
        filters.transporte.push('Moto');
    }

    let tripsToShow = yield api.get_id_filtered_with_page(tabla, {
        documento: user.idNumber,
        position1: position1,
        position2: position2,
        limit: limite,
        page: pageNumber,
        offset: offset,
        fechaInicio: fromThisDate,
        ...filters,
    });
    if (!tripsToShow.error) {
        yield put({ type: SELECT_TRIP_RIDER_CARPOOLING_DATA, payload: tripsToShow });
    } else {
        console.log('ERROR DE LA SAGA CARPOOLING: ', tripsToShow);
    }
}
function* save_trip_rider_select_filter() {
    yield takeLatest(SELECT_TRIP_RIDER_CARPOOLING_FILTER, get_trips_filter_carpooling_rider);
}

//iniciar viaje por conductor cambiamos el estado
function* iniciar_trip_carpooling(action) {
    let tabla = 'compartidoViajeActivo/' + action.id;
    let patchTrip = yield api.patch__(tabla, action.estado);
    if (!patchTrip.error) {
        if (patchTrip.status === 200) {
            yield put({ type: INIT_TRIP_CARPOOLING_OK, payload: patchTrip.data });
            yield put({ type: SAVE_TRIP_STATE, payload: patchTrip.data.estado })
        }
    } else {
        console.log('ERROR DE LA SAGA 3G: ', patchTrip.error)
    }
}
function* iniciar_trip_cp() {
    yield takeLatest(INIT_TRIP_CARPOOLING, iniciar_trip_carpooling);
}

//finalizar viaje por conductor cambiamos el estado
function* final_trip_carpooling(action) {
    const user = yield getItem('user');
    const getTripsForUser = yield api.get_id('compartidoConductor/id/', user.idNumber);
    const actualTrips = getTripsForUser.data.viajes;
    let tablaPach = 'compartidoConductor/' + user.idNumber;
    const dataPach = {
        "viajes": actualTrips + 1,
    }
    yield api.patch__(tablaPach, dataPach);
    let tabla = 'compartidoViajeActivo/' + action.id;
    let patchTrip = yield api.patch__(tabla, action.estado);
    if (!patchTrip.error) {
        AsyncStorage.removeItem('time');
        AsyncStorage.removeItem('startDate');
        console.log('se borro el storage del cronometro')
    } else {
        console.log('ERROR DE LA SAGA CARPOOLING: ', patchTrip.error)
    }

}
function* final_trip_cp() {
    yield takeLatest(END_TRIP_CARPOOLING, final_trip_carpooling);
}

//traer pasajeros por id del viaje
function* get_rider_carpooling(action) {
    let tabla = 'compartidoSolicitud/solicitudes/';
    let getRider = yield api.get_rider(tabla, action.id);
    if (!getRider.error) {
        yield put({ type: GET_RIDER_CARPOOLING_DATA, payload: getRider.data });
    } else {
        console.log('ERROR DE LA SAGA 3G: ', getRider.error)
    }

}
function* get_rider_cp() {
    yield takeLatest(GET_RIDER_CARPOOLING, get_rider_carpooling);
}

//traer lista de viajes para los que eres pasajero

function* get_riderlist() {
    yield takeLatest(GET_RIDERLIST_CARPOOLING, get_riderList_carpooling);
}

function* get_riderList_carpooling(action) {
    let user = yield getItem('user');
    let tabla = 'compartidoConductor/historial/';
    let getRider = yield api.get_id_with_page(tabla, {
        documento: user.idNumber,
        limit: 10,
        page: action.page
    });
    if (!getRider.error) {
        yield put({ type: GET_RIDERLIST_CARPOOLING_DATA, payload: getRider });
    } else {
        console.log('ERROR DE LA SAGA CARPOOLING: ', getRider.error)
    }
}

//aceptar solicitud carpooling
function* aceppt_solicitud_carpooling(action) {
    let tabla = 'compartidoSolicitud/idTrip/' + action.id;
    const dataPatch = {
        "estadoSolicitud": action.estado.estadoSolicitud,
    }
    let patchSolicitud = yield api.patch__(tabla, dataPatch);
    if (!patchSolicitud.error) {
        if (patchSolicitud.status === 200) {
            yield put({ type: ACCEPT_SOLICITUD_CARPOOLING_OK });
            let tabla2 = 'compartidoViajeActivo/' + action.idTrip;
            let patchTrip = yield api.patch__(tabla2, action.asientos);
            if (patchTrip.status === 200) {
                yield put({ type: INIT_TRIP_CARPOOLING_OK, payload: patchTrip.data });
            }
        }
    } else {
        console.log('ERROR DE LA SAGA: ', patchSolicitud.error)
    }
}
function* aceppt_solicitud_cp() {
    yield takeLatest(ACCEPT_SOLICITUD_CARPOOLING, aceppt_solicitud_carpooling);
}
//Enviar solicitud desde rider
function* send_application_carpooling(action) {
    let user = yield getItem('user');
    const dataToSend = {
        "_id": uuidv4(),
        "idSolicitante": user.idNumber,
        "fechaSolicitud": new Date(),
        "idViajeSolicitado": action.idViaje,
        "estadoSolicitud": 'PENDIENTE',
    }
    let tabla = 'compartidoSolicitud/registrar';
    let registerApplication = yield api.post__(tabla, dataToSend);
    if (!registerApplication.error) {
        if (registerApplication === 'Item Create Complete') {
            yield put({ type: SAVE_PAGO_CARPOOLING_OK });
        }
    } else {
        console.log('ERROR DE LA SAGA DEL PAGO: ', pago.error)
    }
}
function* send_solicitud_cp() {
    yield takeLatest(SEND_APPLICATION_CARPOOLING, send_application_carpooling);
}

//crear pago de solicitud aceptada
function* crear_pago_carpooling(action) {
    let tabla = 'compartidoPagos/registrar';
    let pago = yield api.post__(tabla, action.data);
    if (!pago.error) {
        if (pago === 'Item Create Complete') {
            yield put({ type: SAVE_PAGO_CARPOOLING_OK });
        }
    } else {
        console.log('ERROR DE LA SAGA DEL PAGO: ', pago.error)
    }
}
function* crear_pago_cp() {
    yield takeLatest(SAVE_PAGO_CARPOOLING, crear_pago_carpooling);
}

//get trip activos por conductor
function* trip_conductor__get(action) {
    let user = yield getItem('user');
    let tabla = 'compartidoViajeActivo/conductorActivo/';
    let tripsCP = yield api.get_active_trips(tabla, user.idNumber);
    if (tripsCP && !tripsCP.error) {
        yield put({ type: FETCH_SUCCESS_TRIP, payload: tripsCP });
    }
};

function* get_trip_conductor() {
    yield takeLatest(GET_TRIP_ACTIVO, trip_conductor__get);
};

//verificar si ya existe el token o si no guardarlo en la tabla token_msn
function* save_token_msn_user(action) {
    console.log('🚀 Iniciando saga save_token_msn_user...');
    try {
        let user = yield getItem('user');
        let token = yield getItem('tokenMSN');

        console.log('👤 Usuario cargado:', user ? user.idNumber : 'null');
        console.log('🔑 Token FCM cargado:', token ? token.token : 'null');

        if (!user || !user.idNumber || !token || !token.token) {
            console.log('⚠️ Faltan datos críticos (user o token). Abortando.');
            return;
        }

        let tabla = 'tokenMsn/documento/';
        console.log('🔍 Consultando si el token ya existe para el documento:', user.idNumber);
        let existDoc = yield api.get_id(tabla, user.idNumber);

        console.log('📡 Respuesta de existDoc:', JSON.stringify(existDoc));

        if (!existDoc.error) {
            if (existDoc.data && existDoc.data.length === 1) {
                console.log('📝 Registro encontrado. Verificando si el token es el mismo...');
                if (existDoc.data[0].token === token.token) {
                    console.log('✅ El token ya está actualizado en la DB.');
                } else {
                    console.log('🔄 El token es diferente. Actualizando...');
                    let tablaPach = 'tokenMsn/' + existDoc.data[0]._id;
                    const dataPach = {
                        "token": token.token
                    }
                    let patchRes = yield api.patch__(tablaPach, dataPach);
                    console.log('📡 Respuesta de actualización (patch):', JSON.stringify(patchRes));
                }
            } else if (existDoc.data && existDoc.data.length === 0) {
                console.log('🆕 Registro NO encontrado. Creando nuevo registro...');
                const dataToken = {
                    "_id": uuidv4(),
                    "documento": user.idNumber,
                    "email": user.email || '',
                    "token": token.token
                }
                let tablaReg = 'tokenMsn/registrar';
                let regRes = yield api.post__(tablaReg, dataToken);
                console.log('📡 Respuesta de creación (post):', JSON.stringify(regRes));
            }
        } else {
            console.log('❌ Error en el API get_id:', existDoc.error);
        }
    } catch (e) {
        console.log('❌ Error catastrófico en save_token_msn_user:', e);
    }
};
function* saveTokenMsn() {
    yield takeLatest(SAVE_TOKEN_MSN, save_token_msn_user);
};

//verificar pruebas practica y teorica
function* ask_practice_test(action) {
    let user = yield getItem('user');
    let token = yield getItem('tokenMSN');
    let tabla = 'bc_agendado/id/';
    const numberWithId = user ? user.idNumber || '0' : '0';
    let schedule = yield api.get_id(tabla, numberWithId);
    if (schedule) {
        if (!schedule.error) {
            if (schedule.data.length > 0) {
                yield put({ type: FETCH_SUCCESS_USER_PRACTICE, payload: true, isValidated: true });
            } else {
                yield put({ type: FETCH_SUCCESS_USER_PRACTICE, payload: false, isValidated: true });
            }
        }
    }
};
function* askPractice() {
    yield takeLatest(ASK_PRACTICE, ask_practice_test);
};

function* ask_theoretical_test(action) {
    let user = yield getItem('user');
    let token = yield getItem('tokenMSN');
    let tabla = 'bc_teorica/id/';
    const numberWithId = user ? user.idNumber || '0' : '0';
    let test = yield api.get_id(tabla, numberWithId);
    if (test) {
        if (!test.error) {
            if (test.data.length > 0) {
                yield put({ type: FETCH_SUCCESS_USER_THEORETICAL, payload: true, isValidated: true });
            } else {
                yield put({ type: FETCH_SUCCESS_USER_THEORETICAL, payload: false, isValidated: true });
            }
        }
    }
};
function* asktheoretical() {
    yield takeLatest(ASK_THEORETICAL, ask_theoretical_test);
};

function* get_schedule(action) {
    let user = yield getItem('user');
    let token = yield getItem('tokenMSN');
    let tabla = 'bc_agendado/activeUser/';
    const numberWithId = user ? user.idNumber || '0' : '0';
    let test = yield api.get_id(tabla, numberWithId);
    if (test) {
        if (!test.error) {
            if (test.data.length > 0) {
                yield put({ type: SEND_SCHEDULE_OK, payload: test.data });
            }
        }
    }
};
function* getSchedule() {
    yield takeLatest(GET_SCHEDULE, get_schedule);
};

function* info_user_mysql(action) {
    let user = yield getItem('user');
    let tabla = 'bc_usuarios'
    let datamysql = yield api.get_tabla_cc(tabla, user.idNumber);

    if (!datamysql.error) {
        if (action.lugar === 'casa' && action.punto === 'psalida') {
            let dir = datamysql.data;
            yield put({ type: INFO_USER_DIR_CASA_SALIDA, payload: dir });
        } else if (action.lugar === 'trabajo' && action.punto === 'psalida') {
            let dir = datamysql.data;
            yield put({ type: INFO_USER_DIR_TRABAJO_SALIDA, payload: dir });
        } else if (action.lugar === 'casa' && action.punto === 'pllegada') {
            let dir = datamysql.data;
            yield put({ type: INFO_USER_DIR_CASA_LLEGADA, payload: dir });
        } else if (action.lugar === 'trabajo' && action.punto === 'pllegada') {
            let dir = datamysql.data;
            yield put({ type: INFO_USER_DIR_TRABAJO_LLEGADA, payload: dir });
        }
    } else {
        console.log('ERROR DE LA SAGA VERIFICANDO RECORRIDO: ', datamysql.error)
    }
}
function* info_user() {
    yield takeLatest(INFO_USER, info_user_mysql);
}

function* sites_user_mysql(action) {
    let user = yield getItem('user');
    let tabla = 'bc_usuarios'
    let datamysql = yield api.get_tabla_cc(tabla, user.idNumber);
    if (!datamysql.error) {
        const direction = datamysql.data.coorTrabajo;
        const nameDirection = datamysql.data.usu_dir_trabajo;
        yield put({ type: GET_SITES_USER, direction: direction, nameDirection: nameDirection });
    } else {
        console.log('ERROR DE LA SAGA VERIFICANDO RECORRIDO: ', datamysql.error)
    }
}
function* sites_user() {
    yield takeLatest(SITES_USER, sites_user_mysql);
}

//notificaciones
function* enviar__notificacion(action) {
    let tabla = 'tokenMsn'
    let toToken = yield api.get_tabla_documento(tabla, action.to);
    if (!toToken.error) {
        let tokenPasajero = toToken.data[0].token;
        let resPush = yield push.sendPush(tokenPasajero, action.msn);
    } else {
        console.log('ERROR DE LA SAGA VERIFICANDO RECORRIDO: ', datamysql.error)
    }
}
function* enviar_notificacion() {
    yield takeLatest(SEND_NOTIFICICATION, enviar__notificacion);
}

//cancelar solicitud por pasajero
function* final_solicitud_carpooling(action) {
    let tabla = 'compartidoSolicitud/' + action.id;
    console.log('elimnar la solicitud de carga: ', tabla)
    let patchSolic = yield api.patch__(tabla, action.estado);
    if (!patchSolic.error) {
        if (patchSolic.status === 200) {
            yield put({ type: END_SOLICTUD_CARPOOLING_OK });
        }
    } else {
        console.log('ERROR DE LA SAGA CARPOOLONG: ', patchSolic.error)
    }

}
function* final_solicitud_cp() {
    yield takeLatest(END_SOLICTUD_CARPOOLING, final_solicitud_carpooling);
}

//actualizar viaje carpooling
function* patch__carpooling(action) {
    let tabla = 'compartidoViajeActivo/' + action.id;
    let patchSolic = yield api.patch__(tabla, action.data);

    if (!patchSolic.error) {
        if (patchSolic.status === 200) {
            yield put({ type: PATCH_TRIP_CARPOOLING_OK });
        }
    } else {
        console.log('ERROR DE LA SAGA CARPOOLONG: ', patchSolic.error)
    }

}
function* patch_trip_cp() {
    yield takeLatest(PATCH_TRIP_CARPOOLING, patch__carpooling);
}

//Traer pagos por viaje 
function* get_pay_trip_carpooling(action) {
    let tabla = 'compartidoPagos/idviaje/';
    let getPagos = yield api.get_id(tabla, action.id);
    if (!getPagos.error) {
        yield put({ type: GET_PAY_TRIP_PRODESO_OK, payload: getPagos.data });
    } else {
        console.log('ERROR DE LA SAGA CARPOOLONG: ', getPagos.error)
    }

}
function* get_pay_trip() {
    yield takeLatest(GET_PAY_TRIP_PRODESO, get_pay_trip_carpooling);
}

//actualizar estado pagos por viaje 
function* act_pay_trip_carpooling(action) {
    let tabla = 'compartidoPagos/' + action.id;
    let patchPagos = yield api.patch__(tabla, action.data);
    if (!patchPagos.error) {
        yield put({ type: PATCH_ESTADO_PAGO_TRIP_OK });
    } else {
        console.log('ERROR DE LA SAGA CARPOOLONG: ', patchPagos.error)
    }

}
function* act_pay_trip() {
    yield takeLatest(PATCH_ESTADO_PAGO_TRIP, act_pay_trip_carpooling);
}


// guardar comentario carpoolin
function* save_comment_carpooling(action) {
    let data = action.data;
    let tabla = 'compartidoComentarios/registrar';
    let regComment = yield api.post__(tabla, data);
    if (!regComment.error) {
        if (regComment === 'Item Create Complete') {
            //yield put({ type: SAVE_COMMENT_CARPOOLING_OK});
            console.log('se guardó el comentario')
        }
    } else {
        console.log('ERROR DE LA SAGA 3G: ', regComment.error)
    }
    const user = yield getItem('user');
    const getTripsForUser = yield api.get_id('compartidoPasajero/id/', user.idNumber);
    const actualTrips = getTripsForUser.data.viajes;
    let tablaPach = 'compartidoPasajero/' + user.idNumber;
    const dataPach = {
        "viajes": actualTrips + 1,
    }
    yield api.patch__(tablaPach, dataPach);
    const changes = {
        "estadoSolicitud": "FINALIZADA"
    }
    let stateApplication = `compartidoSolicitud/${data.solicitud}`;
    let patchApplication = yield api.patch__(stateApplication, changes);
    if (!patchApplication.error) {
        console.log('se actualizo el estado de la solicitud')
    } else {
        console.log('ERROR DE LA SAGA CAMBIANDOSOLICITUD: ', regComment.error)
    }

}
function* save_comment_cp() {
    yield takeLatest(SAVE_COMMENT_CARPOOLING, save_comment_carpooling);
}

//traer datos de pago
function* get_data_pago_carpooling(action) {
    let tabla = 'compartidoConductor/id/';
    let getPago = yield api.get_id(tabla, action.id);
    if (!getPago.error) {
        yield put({ type: GET_DATA_PAGO_OK, payload: getPago.data });
    } else {
        console.log('ERROR DE LA SAGA PAGO: ', getPago.error)
    }
};

function* get_data_pago_cp() {
    yield takeLatest(GET_DATA_PAGO, get_data_pago_carpooling);
};

//patch img en bc_usuario
function* patch_img(action) {
    const user = yield getItem('user');
    let tablaPach = 'bc_usuarios/' + user.idNumber;
    const dataPach = {
        "usu_img": user.documents
    }
    yield api.patch__(tablaPach, dataPach);
};

function* patchimg() {
    yield takeLatest(PATCH_IMG, patch_img);
};

//patch calificaciones en bc_usuarios
function* patch_calificaciones(action) {
    const user = yield getItem('user');
    let tabla = 'compartidoComentarios/idCalificacion/';
    let getCalificaciones = yield api.get_id(tabla, user.idNumber);

    if (getCalificaciones && getCalificaciones.data) {
        const calificaciones = getCalificaciones.data.map(item => parseFloat(item.calificacion));
        const promedio = calificaciones.reduce((sum, calificacion) => sum + calificacion, 0) / calificaciones.length;

        // Aquí puedes hacer algo con el promedio, por ejemplo, guardarlo en el estado
        let tablaPach = 'bc_usuarios/' + user.idNumber;
        const dataPach = {
            "usu_calificacion": promedio
        }
        let saveProm = yield api.patch__(tablaPach, dataPach);

        if (saveProm) {
            yield put({ type: PATCH_CALIFICACIONES_OK, payload: saveProm.usu_calificacion });
        }
    }

};

function* patchcalificaciones() {
    yield takeLatest(PATCH_CALIFICACIONES, patch_calificaciones);
};

//viajes finalizados
function* trip__end(action) {
    const user = yield getItem('user');
    let tabla = 'compartidoViajeActivo/viajeTerminado/';
    let getTrip = yield api.get_id(tabla, user.idNumber);
    if (getTrip && getTrip.data) {
        yield put({ type: TRIP_END_CARPOOLING_OK, payload: getTrip.data.length });
    }
};

function* trip_end() {
    yield takeLatest(TRIP_END_CARPOOLING, trip__end);
};

//funcion para traer practicasActivas
function* bringAvailableAppointments(action) {
    const user = yield getItem('user');
    const filter = {
        organizationId: user.organizationId
    }
    let tabla = 'bc_practica/';
    let getTrip = yield api.get(tabla, filter);
    if (getTrip && getTrip.data) {
        yield put({ type: BRING_APPOINTMENTS_OK, payload: getTrip.data });
    }
};

function* bringAppointments() {
    yield takeLatest(BRING_APPOINTMENTS, bringAvailableAppointments);
};

//funcion para enviar respuestas
function* send_answers_theoretical(action) {
    const user = yield getItem('user');
    const data = {
        ...action.data,
        teorica_usuario: user.idNumber
    };
    let tabla = 'bc_teorica/registrar';
    let getTrip = yield api.post__(tabla, data);
    if (!getTrip.error) {
        if (getTrip === 'ok') {
            console.log('se guardó el test')
        }
    } else {
        console.log('ERROR send_answers_theoretical : ', regComment.error)
    }
};

function* sendAnswers() {
    yield takeLatest(SEND_ANSWERS_THEORY, send_answers_theoretical);
};

//funcion para agendar cita
function* send_Schedule(action) {
    const user = yield getItem('user');
    const data = {
        ...action.data,
        agendado_cedula: user.idNumber,
        agendado_resultado: 'EN ESPERA'
    };
    const filter = {
        idPractice: action.data.quitar_cupo
    }
    let quitarCupo = yield api.get('bc_practica/remove/', filter);
    let tabla = 'bc_agendado/registrar';
    let getSchedule = yield api.post__(tabla, data);
    if (!getSchedule.error) {
        yield put({ type: SEND_SCHEDULE_OK, payload: getSchedule.data });
    } else {
        console.log('ERROR send_Schedule: ', regComment.error)
    }
};

function* sendSchedule() {
    yield takeLatest(SEND_SCHEDULE, send_Schedule);
};

//funcion para cancelar cita
function* cancel_Schedule(action) {
    const user = yield getItem('user');
    const data = {
        ...action.data,
        agendado_cedula: user.idNumber,
        agendado_resultado: 'FINALIZADA',
        agendado_estado: 'CANCELADA'
    };
    const filter = {
        idPractice: action.data.id
    }
    try {
        let agregarCupo = yield api.get('bc_practica/add/', filter);
        let tabla = `bc_agendado/${data.idSchedule}`;
        let getSchedule = yield api.patch__(tabla, data);
        if (getSchedule === 'ok') {
            yield put({ type: CANCEL_SCHEDULE_OK });
        } else {
            console.log('ERROR cancel_Schedule: ', getSchedule);
        }
    } catch (error) {
        console.error('ERROR en cancel_Schedule: ', error);
    }
};

function* cancelSchedule() {
    yield takeLatest(CANCEL_SCHEDULE, cancel_Schedule);
};

function* patch_vehiculos_carpooling__(action) {
    let tabla = 'compartidoVehiculo/' + action.payload._id;
    let patchveh = yield api.patch__(tabla, action.payload);
    console.log('patch vehiculo carpooling', patchveh);
    if (!patchveh.error) {
        if (patchveh.status === 200) {
            yield put({ type: PATCH_VEHICULO_CARPOOLING_OK });
        }
    }
}
function* patch_vehiculos_carpooling() {
    yield takeLatest(PATCH_VEHICULO_CARPOOLING, patch_vehiculos_carpooling__);
}


function* patch_conductor_carpooling__(action) {
    let tabla = 'compartidoConductor/' + action.payload._id;
    let patchcond = yield api.patch__(tabla, action.payload);
    console.log('patch conductor carpooling', patchcond);
    if (!patchcond.error) {
        if (patchcond.status === 200) {
            yield put({ type: PATCH_CONDUCTOR_CARPOOLING_OK });
        }
    }
}
function* patch_conductor_carpooling() {
    yield takeLatest(PATCH_CONDUCTOR_CARPOOLING, patch_conductor_carpooling__);
}

//LOGRO_PROGRESO_SOLICITUD_VIAJE
function* progreso_logro_solicitud_viaje__(action) {
    const user = yield getItem('user');

    //funcion para verificar si ya existe el progreso del logro
    //si no existe se crea uno nuevo
    //si existe se actualiza el progreso y el estado
    //si el progreso es igual a la meta se cambia el estado a completado
    //si el progreso es menor a la meta se cambia el estado a incompleto
    const data_logro = {
        "usuario_id": user.idNumber,
        "logro_id": "200",
        "estado": "INCOMPLETO",
    };
    let get_progreso_logro = yield api.get_logro_progreso('progreso_logros/logro_progreso', data_logro);

    const progreso_actual = get_progreso_logro?.data ?? [];

    console.log('✔ Progreso consulta tamaño:', progreso_actual.length);

    if (progreso_actual.length === 1) {
        console.log('✔ Progreso actual:', progreso_actual);
        const progreso = progreso_actual[0];
        const meta = progreso.logro.meta;
        const nombre_logro_progreso = progreso.logro.descripcion;

        console.log('✔ Meta del logro:', meta);
        console.log('✔ Progreso actual:', progreso.progreso);


        const nuevo_progreso = progreso.progreso + 1;
        const estado_final = nuevo_progreso == meta ? 'COMPLETADO' : 'INCOMPLETO';

        const update_data = {
            id: progreso.id,
            usuario_id: user.idNumber,
            progreso: nuevo_progreso,
            estado: estado_final,
            ultima_actualizacion: new Date(),
        };

        yield api.patch__('progreso_logros/' + progreso.id, update_data);
        console.log('✅ Progreso actualizado a:', nuevo_progreso, '| Estado:', estado_final);
        //Alert.alert('Progreso Logro actualizado', `Progreso: ${nuevo_progreso} de ${meta} | logro: ${nombre_logro_progreso}`);
    }

    if (progreso_actual.length === 0) {
        console.log('❌ No se encontró progreso para el logro especificado. Tenemos que crear uno nuevo.');
        const nuevo_logro = {
            "id": uuidv4(),
            "usuario_id": user.idNumber,
            "logro_id": "200",
            "progreso": 1,
            "estado": "INCOMPLETO",
            "ultima_actualizacion": new Date(),
        };
        yield api.post__('progreso_logros/registrar', nuevo_logro);
        console.log('✅ Nuevo logro creado:', nuevo_logro);

    }
}
function* progreso_logro_solicitud_viaje() {
    yield takeLatest(LOGRO_PROGRESO_SOLICITUD_VIAJE, progreso_logro_solicitud_viaje__);
}


//viaje compartido pasajero
function* progreso_logro_viaje_pasajero__(action) {
    const user = yield getItem('user');

    //funcion para verificar si ya existe el progreso del logro
    //si no existe se crea uno nuevo
    //si existe se actualiza el progreso y el estado
    //si el progreso es igual a la meta se cambia el estado a completado
    //si el progreso es menor a la meta se cambia el estado a incompleto
    const data_logro = {
        "usuario_id": user.idNumber,
        "logro_id": "201",
        "estado": "INCOMPLETO",
    };
    let get_progreso_logro = yield api.get_logro_progreso('progreso_logros/logro_progreso', data_logro);

    const progreso_actual = get_progreso_logro?.data ?? [];

    console.log('✔ Progreso consulta tamaño:', progreso_actual.length);

    if (progreso_actual.length === 1) {
        console.log('✔ Progreso actual:', progreso_actual);
        const progreso = progreso_actual[0];
        const meta = progreso.logro.meta;

        console.log('✔ Meta del logro:', meta);
        console.log('✔ Progreso actual:', progreso.progreso);


        const nuevo_progreso = progreso.progreso + 1;
        const estado_final = nuevo_progreso == meta ? 'COMPLETADO' : 'INCOMPLETO';

        const update_data = {
            id: progreso.id,
            usuario_id: user.idNumber,
            progreso: nuevo_progreso,
            estado: estado_final,
            ultima_actualizacion: new Date(),
        };

        yield api.patch__('progreso_logros/' + progreso.id, update_data);
        console.log('✅ Progreso actualizado a:', nuevo_progreso, '| Estado:', estado_final);
    }

    if (progreso_actual.length === 0) {
        console.log('❌ No se encontró progreso para el logro especificado. Tenemos que crear uno nuevo.');
        const nuevo_logro = {
            "id": uuidv4(),
            "usuario_id": user.idNumber,
            "logro_id": "201",
            "progreso": 1,
            "estado": "INCOMPLETO",
            "ultima_actualizacion": new Date(),
        };
        yield api.post__('progreso_logros/registrar', nuevo_logro);
        console.log('✅ Nuevo logro creado:', nuevo_logro);
    }
}
function* progreso_logro_viaje_pasajero() {
    yield takeLatest(LOGRO_PROGRESO_VIAJE_COMPARTIDO_PASAJERO, progreso_logro_viaje_pasajero__);
}




export const sagas = [
    viewAddCar(),
    viewSitAplicate(),
    viewAddRider(),
    viewGetVehicules(),
    viewGetConfirmation(),
    viewGetRiders(),
    viewGetAplications(),
    viewGetActiveTrips(),
    viewGetActiveTripsRider(),
    viewGetActiveTripsDriver(),
    get_riderlist(),
    accept_tyc(),
    driver_carpooling_get(),
    saveVCusuario(),
    get_myvehicles_carpooling(),
    save_trip_cp(),
    save_trip_cp_select(),
    save_trip_rider_select(),
    save_trip_rider_select_filter(),
    iniciar_trip_cp(),
    final_trip_cp(),
    get_rider_cp(),
    aceppt_solicitud_cp(),
    crear_pago_cp(),
    get_trip_conductor(),
    saveTokenMsn(),
    askPractice(),
    asktheoretical(),
    getSchedule(),
    info_user(),
    sites_user(),
    enviar_notificacion(),
    final_solicitud_cp(),
    send_solicitud_cp(),
    patch_trip_cp(),
    get_pay_trip(),
    act_pay_trip(),
    save_comment_cp(),
    get_data_pago_cp(),
    patchimg(),
    patchcalificaciones(),
    trip_end(),
    bringAppointments(),
    sendAnswers(),
    sendSchedule(),
    cancelSchedule(),
    rol_carpooling_get(),
    patch_vehiculos_carpooling(),
    patch_conductor_carpooling(),
    progreso_logro_solicitud_viaje(),
    progreso_logro_viaje_pasajero()
];