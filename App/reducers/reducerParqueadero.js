import {
    VALIDATE_TYC_OK,
    ACCEPT_TYC_OK,
    SAVE_VEL_OK,
    VALIDATE_QR_PARQUEADEROS_ERROR,
    RESET_ERROR_PARQUEO,
    VALIDATE_QR_PARQUEADEROS_OK,
    RESET_QR_PARQUEO,
    SAVE_PARQUEO_OK,
    PARQUEO_ACTIVO_OK,
    FINALIZAR_PARQUEO_OK,
    FINALIZAR_PARQUEADERO_OK,
    FETCH_PARQUEADEROS_EMPRESA,
    FETCH_LUGARES_PARQUEADERO,
    SAVE_RESERVA_PARQUEO_OK,
    SAVE_TIME_REST,
    FETCH_SUCCESS_RESERVE_PARQUEO,
    FETCH_FAILD_RESERVE_PARQUEO,
    SAVE_COMENTARIO_PARQUEO_OK,
    RESET_PARQUEO,
    CANCELAR_RESERVA_PARQUEO_OK,
    SELECCIONAR_HORAS_PARQUEO,
    CONECTIVIDAD_INTERNET
  } from '../types/parqueoTypes';
  import { Alert } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateQr } from '../actions/rideActions';
  
  export const initialState = {
    verify_tyc: false,
    save_tyc: false,
    ultimo_vehiculo: '',
    dataTyC: {},
    mensaje_error: false,
    mensage_qr: '',
    lugar_parqueo: {},
    validate_Qr: false,
    seParqueo: false,
    parqueo_activo: {},
    si_parqueo_activo: false,
    parqueo_finalizado: false,
    parqueadero_finalizado: false,
    parqueaderosx: [],
    parqueaderosCargadas: false,
    lugares: null,
    lugaresCargados: false,
    reservas: 0,
    reservaSave: false,
    lugarReservado: '',
    qrReservado: '',
    diaResta: '',
    horasResta: '',
    minutosResta: '',
    segundosResta: '',
    diaRentaTrans: '',
    horasRentaTrans: '',
    minutosRentaTrans: '',
    segundosRentaTrans: '',
    tiempoRestante: '',
    okComentarioParqueo: false,
    horasSeleccionadasParqueo: false,
    horasSeleccionadas: 4,
    conectividad_net: false
  };
  
  export default reducerParqueadero = (state = initialState, action) => {
    switch (action.type) {
        case VALIDATE_TYC_OK:
          return {
            ...state,
            verify_tyc: true,
            ultimo_vehiculo: action.payload,
            dataTyC: action.data
          };
        case ACCEPT_TYC_OK:
          return { 
            ...state,
            save_tyc: true,
          }   
        case SAVE_VEL_OK:
          return {
            ...state,
            verify_tyc: true,
            ultimo_vehiculo: action.payload
          } 
        case VALIDATE_QR_PARQUEADEROS_ERROR:
          return {
            ...state,
            mensaje_error: true,
            mensage_qr: action.payload,
          }
        case RESET_ERROR_PARQUEO:
          return {
            ...state,
            mensaje_error: false,
            mensage_qr: '',
            verify_tyc: false,
          }
        case VALIDATE_QR_PARQUEADEROS_OK:
          return {
            ...state,
            lugar_parqueo: action.payload,
            validate_Qr: true,
          }
        case RESET_QR_PARQUEO:
          return {
            ...state,
            lugar_parqueo: {},
            validate_Qr: false,
          }
        case SAVE_PARQUEO_OK:
          return {
            ...state,
            lugar_parqueo: action.payload,
            seParqueo: true
          }
        case PARQUEO_ACTIVO_OK:
          return {
            ...state,
            parqueo_activo: action.payload,
            si_parqueo_activo: true
          }
        case FINALIZAR_PARQUEO_OK:
          return {
            ...state,
            parqueo_finalizado: true
          }
        case FINALIZAR_PARQUEADERO_OK:
          return {
            ...state,
            parqueadero_finalizado: true
          }
        case FETCH_PARQUEADEROS_EMPRESA:
          return {
            ...state,
            parqueaderosx: action.payload,
            parqueaderosCargadas: true,
          };
        case FETCH_LUGARES_PARQUEADERO:
          return {
            ...state,
            lugares: action.payload,
            lugaresCargados: true,
          };
        case SAVE_RESERVA_PARQUEO_OK:
          return {
            ...state,
            reservaSave: true,
          };
        case SAVE_TIME_REST:
          return {
            ...state,
            diaResta: action.payload.diasR,
            horasResta: action.payload.horasR,
            minutosResta: action.payload.minutosR,
            segundosResta: action.payload.segundosR,
            reservaVencida: false,
          };

        case FETCH_SUCCESS_RESERVE_PARQUEO:
          return {
            ...state,
            reservas: action.payload,
            tiempoRestante: action.tiempoRestante,
            reservaSave: true,
            lugarReservado: action.lugar,
            qrReservado: action.qr
          };
        case CANCELAR_RESERVA_PARQUEO_OK:
          return {
            ...state,
            reservas: 0,
            tiempoRestante: '',
            reservaSave: false,
            lugarReservado: '',
            qrReservado: ''
          };
        case FETCH_FAILD_RESERVE_PARQUEO:
          return {
            ...state,
            reservas: 0,
          };
        case SAVE_COMENTARIO_PARQUEO_OK:
          return {
            ...state,
            okComentarioParqueo: true
          };
        case SELECCIONAR_HORAS_PARQUEO:
          return {
            ...state,
            horasSeleccionadasParqueo: action.estado,
            horasSeleccionadas: action.horas
          }
        case CONECTIVIDAD_INTERNET:
          return {
            ...state,
            conectividad_net: action.state
          };
        case RESET_PARQUEO:
          return {
            ...state,
            verify_tyc: false,
            save_tyc: false,
            ultimo_vehiculo: '',
            mensaje_error: false,
            mensage_qr: '',
            lugar_parqueo: {},
            validate_Qr: false,
            seParqueo: false,
            si_parqueo_activo: false,
            parqueo_finalizado: false,
            parqueadero_finalizado: false,
            parqueaderosx: [],
            parqueaderosCargadas: false,
            lugares: null,
            lugaresCargados: false,
            reservas: 0,
            reservaSave: false,
            lugarReservado: '',
            qrReservado: '',
            diaResta: '',
            horasResta: '',
            minutosResta: '',
            segundosResta: '',
            diaRentaTrans: '',
            horasRentaTrans: '',
            minutosRentaTrans: '',
            segundosRentaTrans: '',
            tiempoRestante: '',
            okComentarioParqueo: false,
            horasSeleccionadasParqueo: false,
            horasSeleccionadas: 4
          }

        default:
            return state;
    }
  };
  