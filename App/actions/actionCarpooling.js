/*eslint-disable */
import { 
    FETCH_SUCCESS_ADD_CAR,
    GET_VEHICULES,
    GET_CONFIRMATION,
    GET_RIDERS,
    GET_APLICATION,
    GET_ACTIVE_TRIP,
    GET_ACTIVE_TRIP_RIDER,
    GET_ACTIVE_TRIP_DRIVER,
    RESET_TYC,
    ACCEPT_TYC_CARPOOLING,
    DRIVER_CARPOOLING,
    SAVE_VEHICLE_CARPOOLING,
    CREAR_MAS_VEH_CAR,
    GET_MY_VEHICLES_CARPOOLING,
    CLEAR_TRIP_ESTADO,
    SAVE_TRIP_CP,
    SELECT_TRIP_CARPOOLING,
    SELECT_TRIP_CARPOOLING_RESET,
    SELECT_TRIP_DRIVER_CARPOOLING,
    SELECT_TRIP_RIDER_CARPOOLING,
    SELECT_TRIP_RIDER_CARPOOLING_FILTER,
    INIT_TRIP_CARPOOLING,
    END_TRIP_CARPOOLING,
    END_SOLICTUD_CARPOOLING,
    GET_RIDER_CARPOOLING,
    GET_RIDER_CARPOOLING_DATA_RESET,
    GET_RIDERLIST_CARPOOLING,
    ACCEPT_SOLICITUD_CARPOOLING,
    GET_TRIP_ACTIVO,
    SAVE_TOKEN_MSN,
    ASK_PRACTICE,
    ASK_THEORETICAL,
    GET_SCHEDULE,
    ASIENTO_SELECT,
    ASIENTO_CLEAR,
    SAVE_PAGO_CARPOOLING,
    RESET_STATE_PAGO,
    INFO_USER,
    SITES_USER,
    LIMPIAR_PSALIDA,
    LIMPIAR_PLLEGADA,
    SEND_NOTIFICICATION,
    SEND_APPLICATION_CARPOOLING,
    TRIP_FOR_EDIT,
    PATCH_TRIP_CARPOOLING,
    CLEAR_STATE_TRIP_PATCH,
    GET_PAY_TRIP_PRODESO,
    PATCH_ESTADO_PAGO_TRIP,
    RESET_PAGO_OK,
    SAVE_COMMENT_CARPOOLING,
    SAVE_STATE_TRIP_RIDE_SELECT,
    GET_DATA_PAGO,
    TRIP_SELECT_FOR_SOL,
    TRIP_SELECT_SOLICITUD_RESET,
    PATCH_IMG,
    PATCH_CALIFICACIONES,
    TRIP_END_CARPOOLING,
    BRING_APPOINTMENTS,
    SEND_ANSWERS_THEORY,
    SEND_SCHEDULE,
    CANCEL_SCHEDULE,
    SET_CARPOOLING_DRAWER,
    SET_SUCCESS_USER_THEORETICAL,
    GET_ROLES_CARPOOLING,
    SET_KM_TO_SAVE_POINTS,
    PATCH_VEHICULO_CARPOOLING,
    PATCH_RESET_CONDUCTOR_CARPOOLING,
    PATCH_CONDUCTOR_CARPOOLING,
    LOGRO_PROGRESO_SOLICITUD_VIAJE,
    LOGRO_PROGRESO_VIAJE_COMPARTIDO_PASAJERO,
    SEND_GROUP_NOTIFICATION
} from '../types/typesCarpooling';

export function sendVehicule(vehiculeData) {
     return {
      type: FETCH_SUCCESS_ADD_CAR,
      vehiculeData: vehiculeData
    };
}
export function getVehicule(user) {
  return {
   type: GET_VEHICULES,
   userAuth : user
 };
}
export function getConfirmation(user, tripToConfirmation) {
  return {
   type: GET_CONFIRMATION,
   userAuth : user,
   tripAuth : tripToConfirmation
 };
}
export function getRiders(confirmedTrip) {
  return {
   type: GET_RIDERS,
   tripAuth : confirmedTrip
 };
}
export function getAplication(tripId) {
  return {
   type: GET_APLICATION,
   tripAuth : tripId
 };
}
export function getActiveTrip() {
  return {
   type: GET_ACTIVE_TRIP
 };
}
export function getActiveTripRider(userId) {
  return {
   type: GET_ACTIVE_TRIP_RIDER,
   userAuth : userId
 };
}
export function getActiveTripDriver(userId) {
  return {
   type: GET_ACTIVE_TRIP_DRIVER,
   userAuth : userId
 };
}
//////////////////    ////////////////////////

export function accept_tyc(rol, json) {
  return {
   type: ACCEPT_TYC_CARPOOLING,
   rol: rol,
   json: json
 };
}

export function reset_tyc(rol) {
  return {
   type: RESET_TYC,
   rol: rol
 };
}

export function driver_carpooling_exit(rol, pageNumber) {
  return {
   type: DRIVER_CARPOOLING,
   rol: rol,
   page: pageNumber
 };
}

export function trip_select_solicitudes (data) {
  return {
    type: TRIP_SELECT_FOR_SOL,
    data: data
  }
}

export function trip_select_solicitud_reset () {
  return {
    type: TRIP_SELECT_SOLICITUD_RESET
  }
}

export function register_veh_cp(data) {
  return {
    type: SAVE_VEHICLE_CARPOOLING,
    data: data,
  };
}

export function crear_mas_veh_car() {
  return {
    type: CREAR_MAS_VEH_CAR,
  }
}

export function getVehicles_carpooling() {
  return {
    type: GET_MY_VEHICLES_CARPOOLING
  };
}

export function limpiarEstadoViaje () {
  return {
    type: CLEAR_TRIP_ESTADO
  }
}

export function sendTrip (trip) {
  return {
    type: SAVE_TRIP_CP,
    trip: trip
  }
}

export function trip_select (data, rol) {
  return {
    type: SELECT_TRIP_CARPOOLING,
    data: data,
    rol: rol
  }
}

export function trip_select_reset () {
  return {
    type: SELECT_TRIP_CARPOOLING_RESET
  }
}

export function get_trip_select_carpooling (id) {
  return {
    type: SELECT_TRIP_DRIVER_CARPOOLING,
    id: id
  }
}

export function get_trip_user_carpooling(page) {
  return {
    type: SELECT_TRIP_RIDER_CARPOOLING,
    pagina : page,
  }
}

export function get_trip_user_carpooling_filter(page, checkDaviPlata, checkCash, checkCarro, checkMoto, fromThisDate, position1, position2) {
  return {
    type: SELECT_TRIP_RIDER_CARPOOLING_FILTER,
    pagina : page,
    fromThisDate : new Date(fromThisDate).toISOString(),
    checkDaviPlata : checkDaviPlata,
    checkCash : checkCash,
    checkCarro : checkCarro,
    checkMoto : checkMoto,
    position1: position1,
    position2: position2
  }
}

export function init_trip_carpooling (id, estado) {
  return {
    type: INIT_TRIP_CARPOOLING,
    id: id,
    estado: estado
  }
}

export function end_trip_carpooling (id, estado) {
  return {
    type: END_TRIP_CARPOOLING,
    id: id,
    estado: estado
  }
}

export function get_pasajeros (id) {
  return {
    type: GET_RIDER_CARPOOLING,
    id: id
  }
}

export function reset_state_pago () {
  return {
    type: RESET_STATE_PAGO
  }
}

export function get_riderList(page) {
  return {
    type: GET_RIDERLIST_CARPOOLING,
    page: page
  }
}

export function accept_solicitud (id, estado, idTrip, asientos) {
  console.log('en action para solicitud')
  return {
    type: ACCEPT_SOLICITUD_CARPOOLING,
    id: id,
    estado: estado,
    idTrip: idTrip,
    asientos: asientos
  }
}

export function crear_pago ( data ) {
  return {
    type: SAVE_PAGO_CARPOOLING,
    data: data
  }
}

export function get_trip_carpooling () {
  return {
    type: GET_TRIP_ACTIVO,
  }
}
export function save_token_msn () {
  return {
    type: SAVE_TOKEN_MSN
  }
}
export function ask_practice () {
  return {
    type: ASK_PRACTICE
  }
}
export function ask_theoretical () {
  return {
    type: ASK_THEORETICAL
  }
}
export function passed_theoretical () {
  return {
    type: SET_SUCCESS_USER_THEORETICAL
  }
}
export function get_schedule () {
  return {
    type: GET_SCHEDULE
  }
}

export function asientoSelect (valor) {
  return {
    type: ASIENTO_SELECT,
    valor: valor
  }
}
export function clearAsiento () {
  return {
    type: ASIENTO_CLEAR,
  }
}

export function resetDataPasajeros () {
  return {
    type: GET_RIDER_CARPOOLING_DATA_RESET
  }
}

export function limpiarPsalida () {
  return {
    type: LIMPIAR_PSALIDA
  }
}

export function limpiarPllegada () {
  return {
    type: LIMPIAR_PLLEGADA
  }
}
export function info_user(lugar, punto) {
  return {
    type: INFO_USER,
    lugar: lugar,
    punto: punto
  }
}

export function sites_user() {
  return {
    type: SITES_USER
  }
}
export function sendNotification(to, msn) {
  return {
    type: SEND_NOTIFICICATION,
    to: to,
    msn: msn
  }
}

export function end_solicitud_carpooling (id, estado) {
  return {
    type: END_SOLICTUD_CARPOOLING,
    id: id,
    estado: estado
  }
}
export function sendApplication(idViaje, pago) {
    return {
    type: SEND_APPLICATION_CARPOOLING,
    idViaje: idViaje,
    pago: pago
  }
}

export function trip_for_edit (data) {
  return {
    type: TRIP_FOR_EDIT,
    data: data
  }
}

export function patchTrip (id, data) {
  return {
    type: PATCH_TRIP_CARPOOLING,
    id: id,
    data: data
  }
}

export function limpiarEstadoViajePatch () {
  return {
    type: CLEAR_STATE_TRIP_PATCH
  }
}

export function get_pagos_trip (id) {
  return {
    type: GET_PAY_TRIP_PRODESO,
    id: id
  }
}

export function patch_estado_pago (id, data) {
  return{
    type: PATCH_ESTADO_PAGO_TRIP,
    id: id,
    data: data
  }
}
export function reset_patch_pago_ok () {
  return{
    type: RESET_PAGO_OK
  }
}

export function guardar_comentario (data) {
  return{
    type: SAVE_COMMENT_CARPOOLING,
    data: data
  }
}

export function save_state_trip_rider (data) {
  return{
    type: SAVE_STATE_TRIP_RIDE_SELECT,
    data: data
  }
}

export function getDataPago (id) {
  return{
    type: GET_DATA_PAGO,
    id: id
  }
}

export function patch__img () {
  return{
    type: PATCH_IMG
  }
}

export function patch__calificacion () {
  return{
    type: PATCH_CALIFICACIONES
  }
}

export function trip_end () {
  return{
    type: TRIP_END_CARPOOLING
  }
}

export function bringAvailableAppointments () {
  return{
    type: BRING_APPOINTMENTS
  }
}

export function send_answers (data) {
  return{
    type: SEND_ANSWERS_THEORY,
    data : data
  }
}

export function send_schedule (data) {
  return{
    type: SEND_SCHEDULE,
    data : data
  }
}

export function cancel_schedule (data) {
  return{
    type: CANCEL_SCHEDULE,
    data : data
  }
}

export function change_carpooling_drawer (name) {
  return{
    type: SET_CARPOOLING_DRAWER,
    payload : name
  }
}

export function ask_roles () {
  return{
    type:  GET_ROLES_CARPOOLING,
  }
}

export function save_km_to_points (km) {
  return{
    type:  SET_KM_TO_SAVE_POINTS,
    payload : km
  }
}

export function patch_vehiculos_carpooling (data) {
  return{
    type:  PATCH_VEHICULO_CARPOOLING,
    payload : data
  }
}

export function reset__patch_veh() {
  return{
    type:  PATCH_RESET_VEHICULO_CARPOOLING,
    payload : null
  }
} 

export function patch_conductor_carpooling (data) {
  return{
    type:  PATCH_CONDUCTOR_CARPOOLING,
    payload : data
  }
}

export function reset__patch_cond() {
  return{
    type:  PATCH_RESET_CONDUCTOR_CARPOOLING,
    payload : null
  }
}

//progreso logros
export function logro_progreso_solicitud_viaje() {
  console.log('logro_prograso_solicitud_viaje en action')
  return{
    type:  LOGRO_PROGRESO_SOLICITUD_VIAJE
  }
}

export function logro_progreso_viaje_compartido_pasajero() {
  console.log('logro_progreso_viaje_compartido_pasajero en action')
  return{
    type:  LOGRO_PROGRESO_VIAJE_COMPARTIDO_PASAJERO
  }
}

export function sendGroupNotification(data) {
  return {
    type: SEND_GROUP_NOTIFICATION,
    recipients: data.recipients,  // Array de emails
    message: data.message,
    chatId: data.chatId,
    senderEmail: data.senderEmail,
    senderName: data.senderName
  }
}