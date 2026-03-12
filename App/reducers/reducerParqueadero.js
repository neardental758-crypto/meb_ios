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
    FINALIZAR_PARQUEO_OK    
  } from '../types/parqueoTypes';
  import { Alert } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateQr } from '../actions/rideActions';
  
  export const initialState = {
    verify_tyc: false,
    save_tyc: false,
    ultimo_vehiculo: '',
    mensaje_error: false,
    mensage_qr: '',
    lugar_parqueo: {},
    validate_Qr: false,
    seParqueo: false,
    parqueo_activo: {},
    parqueo_finalizado: false
  };
  
  export default reducerParqueadero = (state = initialState, action) => {
    switch (action.type) {
        case VALIDATE_TYC_OK:
          return {
            ...state,
            verify_tyc: true,
            ultimo_vehiculo: action.payload
          };
        case ACCEPT_TYC_OK:
          return { 
            ...state,
            save_tyc: true,
          }   
        case SAVE_VEL_OK:
          return {
            ...state,
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
          console.log('reset qr en reducer')
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
            parqueo_activo: action.payload
          }
        case FINALIZAR_PARQUEO_OK:
          return {
            ...state,
            parqueo_finalizado: true
          }
        
        default:
            return state;
    }
  };
  