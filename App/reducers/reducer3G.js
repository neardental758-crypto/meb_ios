import {
  SAVE_REGISTER_EXT_OK,
  SAVE_DATA_USER_OK,
  SAVE_DATA_CRONO_OK,
  RENT_ACTIVE,
  FETCH_SUCCESS_RENT,
  FETCH_SUCCESS_RENT_PP,
  FETCH_FAILD_RENT_PP,
  FETCH_SUCCESS_FAllAS,
  FETCH_SUCCESS_USERR,
  FETCH_NULL_USERR,
  ADD_CLAVE_BICICLETERO,
  ADD_LATLNG_ESTACION,
  FETCH_FAILD_RENT,
  FETCH_SUCCESS_HORARIOS,
  FETCH_SUCCESS_RESERVE,
  FETCH_FAILD_RESERVE,
  ADD_VEHICULOS_ESTACION,
  REGISTER_PENALIZATION,
  RESULT_COORDENADAS,
  FETCH_ESTACIONES_EMPRESA,
  FETCH_VEHICULOS_ESTACION,
  SAVE_RESERVA_OK,
  CHANGE_VEHICULO_ESTADO_OK,
  VERIFICAR_REGISTRO_FINALIZADO,
  SAVE_PENALIZATION_OK,
  CHANGE_VEHICULO_RESERVA_OK,
  SAVE_PRESTAMO_OK,
  CHANGE_ESTADO_RESERVA_OK,
  CHANGE_ESTADO_PRESTAMO_OK,
  SAVE_HIST_CLAVES_OK,
  SAVE_COMENTARIO_OK,
  SAVE_PUNTOS_OK,
  CHANGE_CLAVE_OK,
  SAVE_TIME_REST,
  SAVE_CRONO_RENTA,
  RESERVA_VENCIDA,
  GET_TYPE_VP_OK,
  SAVE_VP_USUARIO_OK,
  CREAR_MAS_VEH,
  GET_MY_VEHICLES_OK,
  VALIDATE_VEHICLE_OK,
  SAVE_VP_VIAJE_OK,
  RESTART_VP_VIAJE_OK,
  VALIDATE_VEHICLE_SINMYSQL_OK,
  REINICIAR_QR_OK,
  DECREMENT_SEG_OK,
  RESETEO_CAMBIO_VEHICULO_RESERVA,
  SAVE_STATE_BICICLETERO_OK,
  ADD_DISTANCIA_RENTA,
  ADD_VEHICULO_RESERVA,
  SAVE_VEHICLE_SELECT_OK,
  VERIFY_TRIP_ACTIVE_VP_OK,
  TRIP_END_VP_OK,
  SAVE_FOTO_TICKET,
  DELETE_FOTO_VEH,
  VERIFICAR_RECORRIDO_UNDEFINED,
  VERIFICAR_RECORRIDO_OK,
  VERIFICAR_RECORRIDO_VACIO,
  VERIFICAR_ESTADO_USER_3G,
  BUSCAR_PUNTOS_TOTAL,
  MIS_VIAJES_TOTAL,
  MIS_VIAJES_KMS,
  RESET_DATA_RENTA_RIDE,
  RESET_REGISTER_VP,
  SAVE_COMENTARIOS_VP_OK,
  CLEAR_STATE_VP,
  FETCH_ERROR_RENT,
  INDICADORES_TRIP,
  SALIENDO_MODULO,
  ENTRANDO_MODULO,
  GET_VEHYCLE_ID_FETCH,
  GET_EMPRESAS_OK,
  RESET_APP_OK,
  SAVE_REGISTRO_PP_OK,
  RESET_PP,
  BICICLETA_YA_PRESTADA,
  RESET_BICICLETA_YA_PRESTADA,
  VALIDATE_BIKE_AVAILABILITY,
  VALIDATE_BIKE_AVAILABILITY_OK,
  RESET_VERIFICACIONES
} from '../types/G3types';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialState = {
  saveRegsiterExt: false,
  DataUser: '',
  CronometroStorageVP: '',
  docUsuario: '',
  usuarioRecorrido: '',
  empresaUsuario: '',
  usuarioValido: null,
  prestamo: false,
  prestamoPP: false,
  prestamoActivo: false,
  prestamoActivoPP: false,
  prestamoError: false,
  prestamoSave: false,
  fallas: false,
  fallasCargadas: false,
  clave: null,
  descripcionVehiculo: null,
  fechaVecimiento: null,
  estacionPrestamo: null,
  vehiculoPrestamo: null,
  estaciones: [],
  estacionex: [],
  estacionesCargadas: false,
  latEstacion: '',
  lngEstacion: '',
  horarios: [
    {
      Empresa: '',
      fri: 'null',
      id: '',
      mon: 'null',
      sat: 'null',
      sun: 'null',
      thu: 'null',
      tue: 'null',
      wed: 'null',
    },
  ],
  reservas: 0,
  tiempoRestante: 24,
  reservaSave: false,
  resevaCancelada: false,
  bicicletas: null,
  bicicletasCargadas: false,
  penalizaciones: null,
  penalizacionSave: false,
  distanciaMt: '',
  vehDisponible: false,
  registroFinalizado: false,
  cambioVehiculo: false,
  histClaves: false,
  saveComentario: false,
  savePuntos: false,
  changeKeyOK: false,
  DevolucionExitosa: false,
  diaResta: '',
  horasResta: '',
  minutosResta: '',
  segundosResta: '',
  diaRentaTrans: '',
  horasRentaTrans: '',
  minutosRentaTrans: '',
  segundosRentaTrans: '',
  reservaVencida: false,
  tipoVPCargadas: false,
  tiposVP: false,
  registerVPU_save: false,
  myVehiclesVP: null,
  myVehiclesVPCargados: false,
  newVPregistrado: false,
  estadoCodigoQR: false,
  inicioviaje: false,
  cronometroVP: false,
  codViajeVP: '',
  idBicicletero: '',
  distanciaRenta: '',
  vehiculoReserva: '',
  dataVehiculoReserva: [],
  vehiculoReservaCargada: false,
  myVehicleSelect: '',
  myVehicleSelectOK: false,
  tripActive: [],
  tripActiveOK: false,
  tripEnd: false,
  cargandoFinalizar: false,
  ticketUser: {
    assets: {},
  },
  recorrido: 'sin validar',
  estadoUser: '',
  puntosSum: '',
  viajesVP: [],
  viajesVpcargados: false,
  viajesTotalVP: '',
  viajesTotalVPkms: '',
  viajes3G: [],
  viajes3Gcargados: false,
  viajesTotal3G: '',
  viajesTotal5G: '',
  viajes5Gcargados: false,
  viajes5G: [],
  viajes4G: [],
  viajes4Gcargados: false,
  viajesTotal4G: '',
  viajesTotalCarpooling: '',
  viajesCarpoolingcargados: false,
  viajesCarpooling: [],
  tokenInvalido: false,
  saveTripVP: false,
  dataTripVP: [],
  saveComentariosVp: false,
  indicadores_: null,
  saliendo_mod: null,
  vel_select: [],
  vel_select_cargado: false,
  empresas_mysql: [],
  empresas_mysql_cargadas: false,
  dataRentaVerificada: false,
  dataReservaVerificada: false,
  saveRegPP: false,
  bicicletaYaPrestada: false
};

export default reducer3G = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_REGISTER_EXT_OK:
      AsyncStorage.removeItem('user2');
      AsyncStorage.removeItem('tokenOut');
      AsyncStorage.removeItem('refresh2');
      AsyncStorage.removeItem('refresh');
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
      return {
        ...state,
        saveRegsiterExt: true,
      };
    case SAVE_DATA_USER_OK:
      return {
        ...state,
        DataUser: action.payload,
      };

    case SAVE_DATA_CRONO_OK:
      return {
        ...state,
        CronometroStorageVP: action.payload,
      };

    case RENT_ACTIVE:
      return {
        ...state,
        loader: action.loader,
      };

    case FETCH_SUCCESS_RENT:
      return {
        ...state,
        prestamo: action.payload,
        prestamoActivo: true,
        dataRentaVerificada: true
      };
    case FETCH_SUCCESS_RENT_PP:
      return {
        ...state,
        prestamoPP: action.payload,
        prestamoActivoPP: true,
      };
    case FETCH_ERROR_RENT:
      return {
        ...state,
        prestamoError: true
      }

    case FETCH_FAILD_RENT:
      return {
        ...state,
        prestamo: [{ pre_retiro_estacion: '', pre_bicicleta: '' }],
        dataRentaVerificada: true
      };
    case FETCH_FAILD_RENT_PP:
      return {
        ...state,
        prestamoActivoPP: false
      };

    case FETCH_SUCCESS_FAllAS:
      return {
        ...state,
        fallas: action.payload,
        fallasCargadas: true,
      };

    case FETCH_SUCCESS_USERR:
      return {
        ...state,
        docUsuario: action.payload.data.usu_documento,
        usuarioRecorrido: action.payload.data.usu_recorrido,
        empresaUsuario: action.payload.data.usu_empresa,
        usuarioValido: action.payload.data.usu_habilitado === 1 ? true : false,
      };

    case FETCH_NULL_USERR:
      return {
        ...state,
        usuarioValido: null,
      };

    case ADD_CLAVE_BICICLETERO:
      return {
        ...state,
        clave: action.payload,
        estacionPrestamo: action.estacion,
        vehiculoPrestamo: action.vehiculo,
        descripcionVehiculo: action.descripcionVehiculo,
        fechaVecimiento: action.fechaVence
      };

    case ADD_LATLNG_ESTACION:
      return {
        ...state,
        latEstacion: action.payload.data[0].est_latitud,
        lngEstacion: action.payload.data[0].est_longitud,
      };

    case FETCH_SUCCESS_HORARIOS:
      return {
        ...state,
        horarios: action.payload,
      };

    case FETCH_SUCCESS_RESERVE:
      return {
        ...state,
        reservas: action.payload,
        tiempoRestante: action.tiempoRestante,
        reservaSave: true,
        dataReservaVerificada: true,
      };

    case FETCH_FAILD_RESERVE:
      return {
        ...state,
        reservas: 0,
        dataReservaVerificada: true,
      };

    case ADD_VEHICULOS_ESTACION:
      return {
        ...state,
        bicicletas: action.payload,
        bicicletasCargadas: true,
      };

    case REGISTER_PENALIZATION:
      return {
        ...state,
        penalizaciones: action.payload,
      };

    case RESULT_COORDENADAS:
      return {
        ...state,
        distanciaMt: action.payload,
      };

    case FETCH_ESTACIONES_EMPRESA:
      return {
        ...state,
        estacionex: action.payload,
        estacionesCargadas: true,
      };

    case FETCH_VEHICULOS_ESTACION:
      return {
        ...state,
        bicicletas: action.payload,
        bicicletasCargadas: true,
      };

    case SAVE_RESERVA_OK:
      return {
        ...state,
        reservaSave: true,
      };

    case VERIFICAR_REGISTRO_FINALIZADO:
      return {
        ...state,
        registroFinalizado: true,
      };

    case SAVE_PENALIZATION_OK:
      return {
        ...state,
        penalizacionSave: true,
      };

    case CHANGE_VEHICULO_RESERVA_OK:
      return {
        ...state,
        cambioVehiculo: true,
      };

    case CHANGE_VEHICULO_ESTADO_OK:
      return {
        ...state,
      };
    case SAVE_PRESTAMO_OK:
      return {
        ...state,
        prestamoActivo: true,
        prestamoSave: true,
      };

    case CHANGE_ESTADO_RESERVA_OK:
      return {
        ...state,
        reservas: 0,
        reservaSave: false,
        //cuando se cancela la reserva, limpiamos bicis y estaciones
        bicicletas: null,
        bicicletasCargadas: false,
        estaciones: [],
        estacionex: [],
        estacionesCargadas: false,
        resevaCancelada: true,
        diaRentaTrans: '',
        horasRentaTrans: '',
        minutosRentaTrans: '',
        segundosRentaTrans: '',
        // Limpiando datos de reserva 4G para que no se muestre al volver al Home
        vehiculoReserva: '',
        dataVehiculoReserva: [],
        vehiculoReservaCargada: false,
      };

    case CHANGE_ESTADO_PRESTAMO_OK:
      return {
        ...state,
        prestamoActivo: false,
        DevolucionExitosa: true,
      };

    case SAVE_HIST_CLAVES_OK:
      return {
        ...state,
        histClaves: true,
      };

    case SAVE_COMENTARIO_OK:
      return {
        ...state,
        saveComentario: true,
      };

    case SAVE_PUNTOS_OK:
      return {
        ...state,
        savePuntos: true,
      };

    case CHANGE_CLAVE_OK:
      return {
        ...state,
        changeKeyOK: true,
        clave: null,
        descripcionVehiculo: null,
        fechaVecimiento: null,
        bicicletas: null,
        bicicletasCargadas: false,
        reservas: 0,
        reservaSave: false,
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

    case SAVE_CRONO_RENTA:
      return {
        ...state,
        diaRentaTrans: action.payload.diasR,
        horasRentaTrans: action.payload.horasR,
        minutosRentaTrans: action.payload.minutosR,
        segundosRentaTrans: action.payload.segundosR,
      }

    case RESERVA_VENCIDA:
      return {
        ...state,
        reservaVencida: true,
      };

    case GET_TYPE_VP_OK:
      return {
        ...state,
        tipoVPCargadas: true,
        tiposVP: action.payload,
      };

    case SAVE_VP_USUARIO_OK:
      return {
        ...state,
        registerVPU_save: true,
      };
    case RESET_REGISTER_VP:
      return {
        ...state,
        registerVPU_reset: false,
        registerVPU_save: false,
      }

    case CREAR_MAS_VEH:
      return {
        ...state,
        registerVPU_save: false,
      }

    case GET_MY_VEHICLES_OK:
      return {
        ...state,
        myVehiclesVP: action.payload,
        myVehiclesVPCargados: true,
        newVPregistrado: true
      };

    case VALIDATE_VEHICLE_OK:
      return {
        ...state,
        estadoCodigoQR: true,
      };

    case SAVE_VP_VIAJE_OK:
      return {
        ...state,
        saveTripVP: true,
        dataTripVP: action.payload
        //inicioviaje: true,
        //cronometroVP: true,
        //codViajeVP: action.payload,
      };

    case RESTART_VP_VIAJE_OK:
      return {
        ...state,
        inicioviaje: true,
        cronometroVP: true
      };

    case VALIDATE_VEHICLE_SINMYSQL_OK: //sin conexion mysql
      return {
        ...state,
        estadoCodigoQR: true,
      };

    case REINICIAR_QR_OK: //sin conexion mysql
      return {
        ...state,
        estadoCodigoQR: false,
        tripEnd: false,
        myVehicleSelectOK: false,
        inicioviaje: false,
        cargandoFinalizar: false,
      };

    case DECREMENT_SEG_OK:
      return {
        ...state,
        segundosResta: action.payload,
      };
    case RESETEO_CAMBIO_VEHICULO_RESERVA:
      return {
        ...state,
        cambioVehiculo: false,
      };
    case SAVE_STATE_BICICLETERO_OK:
      return {
        ...state,
        idBicicletero: action.payload,
      }
    case ADD_DISTANCIA_RENTA:
      return {
        ...state,
        distanciaRenta: action.payload,
      }
    case ADD_VEHICULO_RESERVA:
      return {
        ...state,
        vehiculoReserva: action.payload,
        dataVehiculoReserva: action.data,
        vehiculoReservaCargada: true
      }
    case SAVE_VEHICLE_SELECT_OK:
      return {
        ...state,
        myVehicleSelect: action.payload,
        myVehicleSelectOK: true,
      }
    case VERIFY_TRIP_ACTIVE_VP_OK:
      return {
        ...state,
        tripActive: action.payload,
        tripActiveOK: true,
        estadoCodigoQR: true,
      }
    case TRIP_END_VP_OK:
      return {
        ...state,
        tripActiveOK: false,
        estadoCodigoQR: false,
        tripEnd: true,
        cargandoFinalizar: true,
        inicioviaje: false,
        CronometroStorageVP: {
          dataCronoCargada: false,
          CronometroStorageVP: {
            segundos: 0,
            minutos: 0,
            horas: 0,
            latAct: 0,
            lngActual: 0
          }
        }
      }

    case SAVE_FOTO_TICKET:
      return {
        ...state,
        ticketUser: action.document,
      };

    case DELETE_FOTO_VEH:
      return {
        ...state,
        ticketUser: {
          assets: {},
        },
      };

    case VERIFICAR_RECORRIDO_UNDEFINED:
      return {
        ...state,
        tokenInvalido: true,
      }

    case VERIFICAR_RECORRIDO_OK:
      return {
        ...state,
        recorrido: 'ok'
      }
    case VERIFICAR_RECORRIDO_VACIO:
      return {
        ...state,
        recorrido: 'vacio'
      }
    case VERIFICAR_ESTADO_USER_3G:
      return {
        ...state,
        estadoUser: action.payload
      }
    case BUSCAR_PUNTOS_TOTAL:
      return {
        ...state,
        puntosSum: action.payload
      }
    case MIS_VIAJES_TOTAL:
      return {
        ...state,
        viajesTotalVP: action.payload,
        viajesVP: action.misviajesVP,
        viajesVpcargados: true,
        viajesTotal3G: action.cantidadV3g,
        viajes3G: action.misViajes3G,
        viajes3Gcargados: true,
        viajes4G: action.misViajes4G,
        viajes4Gcargados: true,
        viajesTotal4G: action.totalViajes4G,
        viajesTotal5G: action.totalViajes5G,
        viajes5Gcargados: true,
        viajes5G: action.misViajes5G,
        viajesTotalCarpooling: action.totalViajesCarpooling,
        viajesCarpoolingcargados: true,
        viajesCarpooling: action.misViajesCarpooling,
      }
    case MIS_VIAJES_KMS:
      return {
        ...state,
        viajesTotalVPkms: action.payload,
      }
    case RESET_DATA_RENTA_RIDE:
      AsyncStorage.multiRemove([
        'rutaCoordinates',
        'distanciaRecorrida',
        'elapsedTime',
        'isTrackingActive',
        'posicionInicial',
        'startTime',
        'indicadores'
      ]);
      return {
        ...state,
        prestamo: false,
        prestamoActivo: false,
        prestamoActivoPP: false,
        prestamoPP: false,
        prestamoSave: false,
        dataRentaVerificada: false,
        dataReservaVerificada: false
      }
    case SAVE_COMENTARIOS_VP_OK:
      return {
        ...state,
        saveComentariosVp: true
      }
    case CLEAR_STATE_VP:
      return {
        ...state,
        saveComentariosVp: false,
        savePuntos: false,
        saveTripVP: false,
      }
    case INDICADORES_TRIP:
      return {
        ...state,
        indicadores_: action.data
      }
    case SALIENDO_MODULO:
      return {
        ...state,
        saliendo_mod: true,
      }
    case ENTRANDO_MODULO:
      return {
        ...state,
        saliendo_mod: false,
      }
    case GET_VEHYCLE_ID_FETCH:
      return {
        ...state,
        vel_select: action.payload,
        vel_select_cargado: true
      }
    case GET_EMPRESAS_OK:
      return {
        ...state,
        empresas_mysql: action.payload,
        empresas_mysql_cargadas: true
      }
    case RESET_APP_OK:
      return {
        state: undefined // Esto reinicia todo el store
      }
    case SAVE_REGISTRO_PP_OK:
      return {
        ...state,
        saveRegPP: true
      }
    case RESET_PP:
      return {
        ...state,
        ssaveRegPP: false,
        puntosCargados: false
      }
    case BICICLETA_YA_PRESTADA:
      return {
        ...state,
        bicicletaYaPrestada: true
      }
    case RESET_BICICLETA_YA_PRESTADA:
      return {
        ...state,
        bicicletaYaPrestada: false
      }
    case VALIDATE_BIKE_AVAILABILITY_OK:
      return {
        ...state,
        bicicletaYaPrestada: action.payload // true si ya está prestada, false si está disponible
      }
    case RESET_VERIFICACIONES:
      return {
        ...state,
        dataRentaVerificada: false,
        dataReservaVerificada: false
      }

    default:
      return state;
  }
};
