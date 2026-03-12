/*eslint-disable */

import { saveProgresoDesafio } from '../actions/actionPerfil';
import { 
    GET_PUNTOS_PERFIL_OK,
    GET_ESTACIONES_BC_OK,
    GET_EMPRESA_BC_OK,
    GET_PRODUCTOS,
    GET_DESAFIOS,
    GET_DESAFIOS_SUCCESS,
    GET_PRODUCTOS_SUCCESS,
    GET_LOGROS,
    GET_LOGROS_SUCCESS,
    SAVE_PROGRESO_LOGROS,
    SAVE_PROGRESO_LOGROS_OK,
    GET_LOGROS_PROGRESO,
    GET_LOGROS_PROGRESO_SUCCESS,
    CHANGE_PROGRESO_OK,
    CHANGE_PROGRESO_ESTADO_OK,
    SET_DISTANCE_NATIVE,
    GET_DESAFIOS_PROGRESO,
    GET_DESAFIOS_PROGRESO_SUCCESS,
    CHANGE_PROGRESO_DESAFIOS_OK,
    CHANGE_PROGRESO_ESTADO_DESAFIOS_OK,
    SAVE_PROGRESO_DESAFIOS_OK,
    CHANGE_ESTADO_DESAFIO,
    CHANGE_ESTADO_DESAFIO_OK,
    GET_INDICADORES_TRIP_ID_OK,
    GET_INDICADORES_TRIP_ID_FAIL,
    GET_USER_MYSQL_OK,
    SAVE_FORM_PREOPERACIONAL,
    BUSCAR_CODIGO_REFERIDO_SUCCESS,
    OTORGAR_PUNTOS_REFERENTE_SUCCESS,
    RESET_PREOPERACIONALES
} from '../types/perfil';

export const initialState = {
  puntos: null,
  puntosCargados: false,
  estaciones: {},
  estacionesCargadas: false,
  empresa: null,
  dataempresa: {},
  dataProducto: {},
  dataDesafios:{},
  dataLogros:{},
  dataProgresoLogros:{},
  dataProgresoDesafios:{},
  productosCargados: false,
  desafiosCargados: false,
  logrosCargados: false,
  progresoLogrosCargados: false,
  progresoDesafiosCargados: false,
  saveProgreso: false,
  saveProgresoDesafio:false,
  id: null,
  empresaCargadas: false,
  cambioProgreso: false,
  cambioProgresoDesafio: false,
  cambioEstadoProgreso: false,
  cambioEstadoDesafio:false,
  cambioEstadoProgresoDesafio:false,
  distanceNative: 0,
  indicadores_trip: {},
  cargado_indicadores_trip: false,
  data_user_mysql: {},
  cargado_user_mysql: false,
  form_preoperacional: {},
  form_preoperacional_estado: false,
  codigoReferido: null,
  loading: false,
  error: null,
  hasCode: false,
  otorgoOK: false
};

export default reducerPerfil = (state = initialState, action) => {
    switch (action.type) {
        
        case GET_PUNTOS_PERFIL_OK:
          return {
            ...state,
            puntos: action.payload,
            puntosCargados: true
          };
       
        case GET_ESTACIONES_BC_OK:
          return {
            ...state,
            estaciones: action.payload,
            estacionesCargadas: true,
            empresa: action.empresa
          }
        case GET_EMPRESA_BC_OK:
          return {
            ...state,
            dataempresa: action.payload,
            empresaCargadas: true,
            empresa: action.empresa
          }
        case GET_PRODUCTOS:
          return {
            ...state,
            dataProducto: action.payload,
            productosCargados: true,
            id: action.id
          }
        case GET_PRODUCTOS_SUCCESS:
          return {
            ...state,
            dataProducto: action.payload,
            productosCargados: true,
          }
        case GET_DESAFIOS:
          return {
            ...state,
            dataDesafios: action.payload,
            desafiosCargados: true,
            id: action.id
          }
        case GET_DESAFIOS_SUCCESS:
          return {   
            ...state,
            dataDesafios: action.payload,
            desafiosCargados: true,
          };
        case GET_LOGROS:
          return {
            ...state,
            dataLogros: action.payload,
            logrosCargados: true,
            id: action.id
        }
        case GET_LOGROS_SUCCESS:
          return {   
              ...state,
              dataLogros: action.payload,
              logrosCargados: true,
              };
        case SAVE_PROGRESO_LOGROS_OK:
          return {
            ...state,
            saveProgreso: true,
        };  
        case GET_LOGROS_PROGRESO:
          return {
            ...state,
            dataProgresoLogros: action.payload,
            progresoLogrosCargados: true,
            id: action.id
          };
        case GET_LOGROS_PROGRESO_SUCCESS:
          return {
            ...state,
            dataProgresoLogros: action.payload,
            progresoLogrosCargados: true,
          };
        case CHANGE_PROGRESO_OK:
          return {
            ...state,
            cambioProgreso: true,
          };
        case CHANGE_PROGRESO_ESTADO_OK:
          return {
            ...state,
            cambioEstadoProgreso: true,
          };
        case CHANGE_ESTADO_DESAFIO_OK:
          return {
            ...state,
            cambioEstadoDesafio: true,
          };       
        case SET_DISTANCE_NATIVE:
          return {
            ...state, 
            distanceNative: action.payload 
          };
        case SAVE_PROGRESO_DESAFIOS_OK:
          return {
              ...state,
              saveProgresoDesafio: true,
          };  
        case GET_DESAFIOS_PROGRESO:
          return {
            ...state,
            dataProgresoDesafios: action.payload,
            progresoDesafiosCargados: true,
            id: action.id
          };
        case GET_DESAFIOS_PROGRESO_SUCCESS:
          return {
            ...state,
            dataProgresoDesafios: action.payload,
            progresoDesafiosCargados: true,
          };
        case CHANGE_PROGRESO_DESAFIOS_OK:
          return {
            ...state,
            cambioProgresoDesafio: true,
          };
        case CHANGE_PROGRESO_ESTADO_DESAFIOS_OK:
          return {
            ...state,
            cambioEstadoProgresoDesafio: true,
          };
        case GET_INDICADORES_TRIP_ID_OK:
          return {
            ...state,
            indicadores_trip: action.payload,
            cargado_indicadores_trip: true
          }; 
        case GET_INDICADORES_TRIP_ID_FAIL:
          return {
            ...state,
            cargado_indicadores_trip: false
          }   
        case GET_USER_MYSQL_OK:
          return {
            ...state,
            data_user_mysql: action.payload,
            cargado_user_mysql: true
          };    
        case SAVE_FORM_PREOPERACIONAL:
          return {
            ...state,
            form_preoperacional: action.form,
            form_preoperacional_estado: true
          };
        case RESET_PREOPERACIONALES:
          return {
            ...state,
            form_preoperacional: {},
            form_preoperacional_estado: false
          };
        case BUSCAR_CODIGO_REFERIDO_SUCCESS:
          return {
            ...state,
            codigoReferido: action.payload,
            loading: false,
            error: null,
            hasCode: true,
          }

        case OTORGAR_PUNTOS_REFERENTE_SUCCESS:
          return {
            ...state,
            otorgoOK: true,
          }
        default:
          return state;
    }
}