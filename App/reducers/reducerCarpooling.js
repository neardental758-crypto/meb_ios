/*eslint-disable */
import { 
    FETCH_SUCCESS_TRIP,
    FETCH_SUCCESS_ADD_CAR,
    FETCH_SUCCESS_SIT_APLICATE,
    FETCH_SUCCESS_ADD_RIDER,
    FETCH_SUCCESS_VEHICULES,
    FETCH_SUCCESS_CONFIRMATION,
    FETCH_SUCCESS_RIDERS,
    FETCH_SUCCESS_APLICATION,
    FETCH_SUCCESS_ACTIVE_TRIP,
    FETCH_SUCCESS_ACTIVE_TRIP_RIDER,
    FETCH_SUCCESS_ACTIVE_TRIP_DRIVER,
    RESET_TYC,
    DRIVER_CARPOOLING_OK,
    DRIVER_ROL_CARPOOLING_OK,
    RIDER_CARPOOLING_OK,
    SAVE_VEHICLE_CARPOOLING_OK,
    CREAR_MAS_VEH_CAR,
    CLEAR_TRIP_ESTADO,
    SAVE_TRIP_CP_OK,
    GET_MY_VEHICLES_CARPOOLING_OK,
    SELECT_TRIP_CARPOOLING,
    SELECT_TRIP_CARPOOLING_RESET,
    SELECT_TRIP_DRIVER_CARPOOLING_DATA,
    SELECT_TRIP_RIDER_CARPOOLING_DATA,
    INIT_TRIP_CARPOOLING_OK,
    END_TRIP_CARPOOLING_OK,
    GET_RIDER_CARPOOLING_DATA,
    GET_RIDER_CARPOOLING_DATA_RESET,
    GET_RIDERLIST_CARPOOLING_DATA,
    ACCEPT_SOLICITUD_CARPOOLING_OK,
    SAVE_TRIP_STATE,
    REDEFINIR_ROL,
    ASIENTO_SELECT,
    ASIENTO_CLEAR,
    SAVE_PAGO_CARPOOLING_OK,
    RESET_STATE_PAGO,
    LIMPIAR_PSALIDA,
    LIMPIAR_PLLEGADA,
    GET_SITES_USER,
    INFO_USER_DIR_CASA_SALIDA,
    INFO_USER_DIR_TRABAJO_SALIDA,
    INFO_USER_DIR_CASA_LLEGADA,
    INFO_USER_DIR_TRABAJO_LLEGADA,
    END_SOLICTUD_CARPOOLING_OK,
    SEND_APPLICATION_CARPOOLING_OK,
    TRIP_FOR_EDIT,
    PATCH_TRIP_CARPOOLING_OK,
    CLEAR_STATE_TRIP_PATCH,
    GET_PAY_TRIP_PRODESO_OK,
    PATCH_ESTADO_PAGO_TRIP_OK,
    RESET_PAGO_OK,
    SAVE_STATE_TRIP_RIDE_SELECT,
    GET_DATA_PAGO_OK,
    TRIP_SELECT_FOR_SOL,
    TRIP_SELECT_SOLICITUD_RESET,
    PATCH_CALIFICACIONES_OK,
    TRIP_END_CARPOOLING_OK,
    BRING_APPOINTMENTS_OK,
    FETCH_SUCCESS_USER_PRACTICE,
    FETCH_SUCCESS_USER_THEORETICAL,
    SEND_SCHEDULE_OK,
    CANCEL_SCHEDULE_OK,
    SET_CARPOOLING_DRAWER,
    SET_SUCCESS_USER_THEORETICAL,
    SET_KM_TO_SAVE_POINTS,
    PATCH_VEHICULO_CARPOOLING_OK,
    PATCH_RESET_VEHICULO_CARPOOLING,
    PATCH_CONDUCTOR_CARPOOLING_OK,
    PATCH_RESET_CONDUCTOR_CARPOOLING
  } from '../types/typesCarpooling';

export const initialState = {
  vehiculeObject : {},
  confirmationObject : {},
  ridersObject : {},
  aplicationSuccess : {},
  activeTrips : {},
  activeTripsLoader : false,
  activeTripsRiderUser : {},
  activeTripsDriverUser : {},
  tyc: false,
  registerCPU_save: false,
  myVehiclesCP: null,
  myVehiclesCPCargados: false,
  newVPregistrado: false,
  saveTripCarpooling: false,
  tripSelect: null,
  tripSelectCargada: false,
  dataTripSelect: null,
  dataTripSelectCargada: false,
  dataTripPatch: false,
  dataPasajeros: null,
  dataPasajerosCargada: false,
  patchSolicitud: false,
  tripEstado: null,
  rol: null,
  tripsActiveToRider: {},
  riderList : {},
  asientoSelect: '',
  pagoCreado: false,
  directionUser: null,
  directionNameUser: '',
  dirSalida: 'vacio',
  dirLLegada: 'vacio',
  coorSalida: {lat: '',lng: ''},
  coorDestino: {lat: '',lng: ''},
  applicationOk: false,
  trip_edit: {},
  trip_edit_cargado: false,
  patchTripCarpooling: false,
  pagosViajeCargada: false,
  pagosViaje: {},
  patch_pago_ok: false,
  dataTripSelectRideCarggada: false,
  dataTripSelectRide: {},
  pagoPasajeroCargada: false,
  dataPago: {},
  dataPagoCargada: false,
  tripSelectSolicitud: null,
  tripSelectSolicitudCargada: true,
  calificacionPromedioUser: null,
  promedioCargado: false,
  tripEnd: null,
  tripEndCargada: false,
  activePractices : {},
  userPractise : false,
  userTheoretical : false,
  userPractise_isValidated: false,
  userTheoretical_isValidated: false,
  activeSchedule : {},
  carpoolingDrawer : 'Compartir',
  carpoolingCanDrive : true,
  carpoolingCanRide : true,
  kmToSavePoints : 0,
  conductorUpdateCarpooling: false,
  vehiculoUpdateCarpooling: false,
};

export default reducerCarpooling = (state = initialState, action) => {
    switch (action.type) {
        
        case FETCH_SUCCESS_ADD_CAR:
            return {
              ...state,
              vehiculeData: vehiculeData
            };
        case FETCH_SUCCESS_SIT_APLICATE:
            return {
              ...state,
            };
        case FETCH_SUCCESS_ADD_RIDER:
            return {
              ...state,
            };
        case FETCH_SUCCESS_VEHICULES:
            return {
              ...state,
              vehiculeObject : action.payload
            };
        case FETCH_SUCCESS_CONFIRMATION:
            return {
              ...state,
              confirmationObject : action.payload
            };
        case FETCH_SUCCESS_RIDERS:
            return {
              ...state,
              ridersObject : action.payload
            };        
        case FETCH_SUCCESS_APLICATION:
            return {
              ...state,
              aplicationSuccess : action.payload
            };        
        case FETCH_SUCCESS_ACTIVE_TRIP:
            return {
              ...state,
              activeTrips : action.payload
            };        
        case FETCH_SUCCESS_ACTIVE_TRIP_RIDER:
            return {
              ...state,
              activeTripsRiderUser : action.payload
            };        
        case FETCH_SUCCESS_ACTIVE_TRIP_DRIVER:
            return {
              ...state,
              activeTripsDriverUser : action.payload,
              tyc: true
            };
        case DRIVER_CARPOOLING_OK:
            return {
              ...state,
              tyc: true,
            }
        case DRIVER_ROL_CARPOOLING_OK:
          return {
            ...state,
            carpoolingCanDrive: false
          }
        case RIDER_CARPOOLING_OK:
          return {
            ...state,
            carpoolingCanRide: false
          }
        case RESET_TYC:
          return {
            ...state,
            tyc: false,
            rol: action.rol,
            
          };
        case FETCH_SUCCESS_TRIP:
          return {
            ...state,
            activeTrips : action.payload,
            activeTripsLoader : true,
          };
        case SAVE_VEHICLE_CARPOOLING_OK:
          return {
            ...state,
            registerCPU_save: true,
          };
        case CREAR_MAS_VEH_CAR:
          return {
            ...state,
            registerCPU_save: false,
          }
        case CLEAR_TRIP_ESTADO:
          return {
            ...state,
            saveTripCarpooling: false
          }
        case SAVE_TRIP_CP_OK:
          return {
            ...state,
            saveTripCarpooling: true
          }
        case GET_MY_VEHICLES_CARPOOLING_OK:
          return {
            ...state,
            myVehiclesCP: action.payload,
            myVehiclesCPCargados: true,
            newVPregistrado: true,
          };
        case SELECT_TRIP_CARPOOLING:
          return {
            ...state,
            tripSelect: action.data,
            tripEstado: 'ACTIVA',
            tripSelectCargada: true,
            rol: action.rol
          }
        case SELECT_TRIP_CARPOOLING_RESET:
          return {
            ...state,
            tripSelect: null,
            tripEstado: null,
            tripSelectCargada: false,
            rol: null
          }
        case SAVE_TRIP_STATE:
          return {
            ...state,
            tripEstado: action.payload,
          }
        case SELECT_TRIP_DRIVER_CARPOOLING_DATA:
          return {
            ...state,
            dataTripSelect: action.payload,
            dataTripSelectCargada: true,
          }
        case SELECT_TRIP_RIDER_CARPOOLING_DATA:
          return {
            ...state,
            tripsActiveToRider: action.payload
          }
        case REDEFINIR_ROL:
          return {
            ...state,
            rol: action.payload,
          }
        case INIT_TRIP_CARPOOLING_OK:
          return {
            ...state,
            dataTripSelect: action.payload,
            dataTripPatch: true,
          }
        case END_TRIP_CARPOOLING_OK:
          return {
            ...state,
            dataTripSelect: null,
            dataTripPatch: false,
            tripEstado: null,
          }
        case GET_RIDER_CARPOOLING_DATA: 
          return {
            ...state,
            dataPasajeros: action.payload,
            dataPasajerosCargada: true,
          }
        case GET_RIDER_CARPOOLING_DATA_RESET: 
          return {
            ...state,
            dataPasajeros: null,
            dataPasajerosCargada: false,
          }
        case GET_RIDERLIST_CARPOOLING_DATA:
          return {
            ...state,
            riderList: action.payload,
          }
        case ACCEPT_SOLICITUD_CARPOOLING_OK:
          return {
            ...state,
            patchSolicitud: true,
            dataPasajerosCargada: false
          }
        case ASIENTO_SELECT:
          return {
            ...state,
            asientoSelect: action.valor
          }
        case ASIENTO_CLEAR:
          return { 
            ...state,
            asientoSelect: ''
          }
        case SAVE_PAGO_CARPOOLING_OK:
          return {
            ...state,
            pagoCreado: true
          }
        case RESET_STATE_PAGO:
          return {
            ...state,
            pagoCreado: false
          }
        case LIMPIAR_PSALIDA:
          return {
            ...state,
            dirSalida: 'vacio',
            coorSalida: {lat: '',lng: ''}
          }
        case LIMPIAR_PLLEGADA:
          return {
            ...state,
            dirLLegada: 'vacio',
            coorDestino: {lat: '',lng: ''}
          }
        case GET_SITES_USER:
          return {
            ...state,
            directionUser: action.direction,
            directionNameUser: action.nameDirection
          }
        case INFO_USER_DIR_CASA_SALIDA:
          return {
            ...state,
            dirSalida: action.payload.usu_dir_casa,
            coorSalida: action.payload.coorCasa
          }
        case INFO_USER_DIR_TRABAJO_SALIDA:
          return {
            ...state,
            dirSalida: action.payload.usu_dir_trabajo,
            coorSalida: action.payload.coorTrabajo
          }
        case INFO_USER_DIR_CASA_LLEGADA:
          return {
            ...state,
            dirLLegada: action.payload.usu_dir_casa,
            coorDestino: action.payload.coorCasa
          }
        case INFO_USER_DIR_TRABAJO_LLEGADA:
          return {
            ...state,
            dirLLegada: action.payload.usu_dir_trabajo,
            coorDestino: action.payload.coorTrabajo
          }
        case END_SOLICTUD_CARPOOLING_OK:
          return {
            ...state,
            riderList: {}
          }
        case SEND_APPLICATION_CARPOOLING_OK:
          return {
            ...state,
            applicationOk: true,
          }        
        case TRIP_FOR_EDIT:
          return {
            ...state,
            trip_edit: action.data,
            trip_edit_cargado: true
          }
        case PATCH_TRIP_CARPOOLING_OK: 
          return {
            ...state,
            patchTripCarpooling: true
          }
        case CLEAR_STATE_TRIP_PATCH:
          return {
            ...state,
            patchTripCarpooling: false
          }
        case  GET_PAY_TRIP_PRODESO_OK:
          return {
            ...state,
            pagosViajeCargada: true,
            pagosViaje: action.payload
          }
        case PATCH_ESTADO_PAGO_TRIP_OK:
          return {
            ...state,
            patch_pago_ok: true
          }
        case RESET_PAGO_OK:
          return {
            ...state,
            patch_pago_ok: false
          }
        case SAVE_STATE_TRIP_RIDE_SELECT:
          return {
            ...state,
            dataTripSelectRideCarggada: true,
            dataTripSelectRide: action.data
          }
        case GET_DATA_PAGO_OK:
          return {
            ...state,
            dataPago: action.payload,
            dataPagoCargada: true,
          }
        case TRIP_SELECT_FOR_SOL:
          return {
            ...state,
            tripSelectSolicitud: action.data,
            tripSelectSolicitudCargada: true,
          }
        case TRIP_SELECT_SOLICITUD_RESET:
          return {
            ...state,
            tripSelectSolicitud: null,
            tripSelectSolicitudCargada: false,
          }
        case PATCH_CALIFICACIONES_OK: 
          return {
            ...state,
            calificacionPromedioUser: action.payload,
            promedioCargado: true
          }  
        case TRIP_END_CARPOOLING_OK:
          return {
            ...state,
            tripEnd: action.payload,
            tripEndCargada: true,
          }
        case BRING_APPOINTMENTS_OK:
          return {
            ...state,
            activePractices: action.payload,
          }
        case FETCH_SUCCESS_USER_PRACTICE:
          return {
            ...state,
            userPractise: action.payload,
            userPractise_isValidated: action.isValidated,
          }
        case FETCH_SUCCESS_USER_THEORETICAL:
          return {
            ...state,
            userTheoretical: action.payload,
            userTheoretical_isValidated: action.isValidated,
          }
        case SET_SUCCESS_USER_THEORETICAL:
          return {
            ...state,
            userTheoretical: true,
          }
        case SEND_SCHEDULE_OK:
          return {
            ...state,
            activeSchedule: action.payload,
          }
        case CANCEL_SCHEDULE_OK:
          return {
            ...state,
            activeSchedule: {},
          }
        case SET_CARPOOLING_DRAWER:
          return {
            ...state,
            carpoolingDrawer: action.payload,
          }
        case SET_KM_TO_SAVE_POINTS:
          return {
            ...state,
            kmToSavePoints: action.payload,
          }
        case PATCH_VEHICULO_CARPOOLING_OK:
          return {
            ...state, 
            vehiculoUpdateCarpooling: true,
          } 
        case PATCH_RESET_VEHICULO_CARPOOLING:
          return {
            ...state, 
            vehiculoUpdateCarpooling: false,
          }
        case PATCH_CONDUCTOR_CARPOOLING_OK:
          return {
            ...state, 
            conductorUpdateCarpooling: true,
          }
        case PATCH_RESET_CONDUCTOR_CARPOOLING:
          return {
            ...state, 
            conductorUpdateCarpooling: false,
          }

        default:
          return state;
    }
}