import {
  SAVE_REGISTER_EXT,
  SAVE_DATA_USER,
  SAVE_DATA_CRONO,
  RENT_ACTIVE,
  RENT_ACTIVE_PP,
  GET_FALLAS,
  VALIDATE_USER_RENTA,
  VALIDATE_HORARIOS_EMPRESA,
  RESERVE_ACTIVE,
  VIEW_PENALIZATION,
  CALCULATE_DIST,
  GET_ESTACIONES,
  GET_VEHICULOS_ESTACION,
  SAVE_RESERVA_BC,
  CHANGE_VEHICULO_ESTADO,
  VALIDATE_USER_REGISTER,
  SAVE_PENALIZATION_BC,
  CHANGE_VEHICULO_RESERVA,
  SAVE_PRESTAMO_BC,
  CHANGE_ESTADO_RESERVA_BC,
  CHANGE_ESTADO_PRESTAMO_BC,
  CHANGE_ESTADO_PRESTAMO_RIDE,
  SAVE_HIST_CLAVES_BC,
  SAVE_COMENTARIO_BC,
  SAVE_PUNTOS_BC,
  CHANGE_CLAVE_BC,
  GET_TYPE_VP,
  SAVE_VP_USUARIO,
  GET_MY_VEHICLES,
  VALIDATE_VEHICLE,
  SAVE_VP_VIAJE,
  RESTART_VP_VIAJE,
  VALIDATE_VEHICLE_SINMYSQL,
  REINICIAR_QR,
  DECREMENT_SEG,
  RESETEO_CAMBIO_VEHICULO,
  SAVE_STATE_BICICLETERO,
  SAVE_VEHICLE_SELECT,
  VERIFY_TRIP_ACTIVE_VP,
  VERIFY_TRIP_ACTIVE_VP_CACHE,
  TRIP_END_VP,
  SAVE_FOTO_TICKET,
  DELETE_FOTO_VEH,
  VERIFICAR_RECORRIDO,
  ACT_DIRECCION,
  BUSCAR_PUNTOS,
  MIS_VIAJES,
  CREAR_MAS_VEH,
  RESET_DATA_RENTA_RIDE,
  RESET_REGISTER_VP,
  SAVE_COMENTARIO_VP,
  CLEAR_STATE_VP,
  START_TRIP_BACKGROUND,
  SAVE_VP_VIAJE_AVION,
  INDICADORES_TRIP,
  SALIENDO_MODULO,
  ENTRANDO_MODULO,
  SAGA_CANCELLED,
  GET_VEHYCLE_ID,
  GET_EMPRESAS,
  CALIFICACION_EXITOSA,
  RESET_APP,
  COMPLETAR_PROGRESO_LOGRO,
  RESTAR_PUNTOS_BC,
  SAVE_PUNTOS_BC_SINUSUARIO,
  SAVE_REGISTRO_PP,
  RESET_PP,
  RESET_BICICLETA_YA_PRESTADA,
  VALIDATE_BIKE_AVAILABILITY
} from '../types/G3types';

export function saveRegisterExt(dataRex) {
  console.log('action de registro ext', dataRex);
  return {
    type: SAVE_REGISTER_EXT,
    dataRext: dataRex
  };
}

export function saveDataUser(data) {
  return {
    type: SAVE_DATA_USER,
    data: data
  };
}

export function saveDataCrono(data) {
  return {
    type: SAVE_DATA_CRONO,
    data: data
  };
}

export function rentActive(cc) {
  return {
    type: RENT_ACTIVE,
    cc: cc
  };
}

export function rentActivePP(cc) {
  return {
    type: RENT_ACTIVE_PP,
    cc: cc
  };
}

export function getFallas() {
  return {
    type: GET_FALLAS
  };
}

export function validateUser3g(cc) {
  return {
    type: VALIDATE_USER_RENTA,
    cc: cc
  };
}

export function validateHorarios(empresa) {
  return {
    type: VALIDATE_HORARIOS_EMPRESA,
    empresa: empresa
  };
}

export function reserveActive(cc) {
  return {
    type: RESERVE_ACTIVE,
    cc: cc
  };
}

export function viewPenalizaciones(cc) {
  return {
    type: VIEW_PENALIZATION,
    cc: cc
  }
}

export function calcularDistancia(coordenadas) {
  return {
    type: CALCULATE_DIST,
    coordenadas: coordenadas
  }
}

export function viewEstacion(empresa) {
  return {
    type: GET_ESTACIONES,
    empresa: empresa
  };
}

export function viewVehiculo(estacion) {
  console.log('la estacion ffff', estacion);
  return {
    type: GET_VEHICULOS_ESTACION,
    estacion: estacion
  };
}

export function saveReserva(data, fecha, duracion, bici) {
  return {
    type: SAVE_RESERVA_BC,
    data: data,
    fecha: fecha,
    duracion: duracion,
    bici: bici
  };
}

export function changeVehiculo(data) {
  return {
    type: CHANGE_VEHICULO_ESTADO,
    data: data
  };
}

export function validateRegister(cc) {
  return {
    type: VALIDATE_USER_REGISTER,
    cc: cc
  }
}

export function savePenalization(data, vehiculo, reservaId) {
  return {
    type: SAVE_PENALIZATION_BC,
    data: data,
    vehiculo: vehiculo,
    reservaId: reservaId,
  };
}

export function changeVehicleReserva(data, doc, veh) {
  console.log('el id del vehiculo nuevoooooooo', veh)
  return {
    type: CHANGE_VEHICULO_RESERVA,
    data: data,
    doc: doc,
    veh: veh
  };
}

export function savePrestamo(data, vehiculo, reservaId, estacion, fechavence) {
  console.log('haciendo prestamo data', data)
  console.log('haciendo prestamo vehiculo', vehiculo)
  console.log('haciendo prestamo reservaId', reservaId)
  console.log('haciendo prestamo estacion', estacion)
  console.log('haciendo prestamo fecha vence', fechavence)
  return {
    type: SAVE_PRESTAMO_BC,
    data: data,
    vehiculo: vehiculo,
    reservaId: reservaId,
    estacion: estacion,
    fechavence: fechavence
  };
}

export function cambiarEstadoReserva(data, vehiculo) {
  return {
    type: CHANGE_ESTADO_RESERVA_BC,
    data: data,
    vehiculo: vehiculo
  };
}

export function cambiarEstadoPrestamo(data, vehiculo, estadoV) {
  return {
    type: CHANGE_ESTADO_PRESTAMO_BC,
    data: data,
    vehiculo: vehiculo,
    estadoV: estadoV
  };
}

export function cambiarEstadoPrestamo_2(data, vehiculo, estadoV, nuevaEstacion) {
  return {
    type: CHANGE_ESTADO_PRESTAMO_RIDE,
    data: data,
    vehiculo: vehiculo,
    estadoV: estadoV,
    nuevaEstacion: nuevaEstacion
  };
}

export function reset_renta() {
  return {
    type: RESET_DATA_RENTA_RIDE
  }
}

export function cancelar__() {
  return {
    type: SAGA_CANCELLED
  }
}

export function saveHistorialClaves(data) {
  return {
    type: SAVE_HIST_CLAVES_BC,
    data: data
  };
}

export function saveComentario(data) {
  return {
    type: SAVE_COMENTARIO_BC,
    data: data
  };
}

export function saveComentarioVP(data) {
  return {
    type: SAVE_COMENTARIO_VP,
    data: data
  }
}

export function savePuntos(data) {
  console.log('la data en action de puntos', data)
  return {
    type: SAVE_PUNTOS_BC,
    data: data
  };
}

export function savePuntos_sinUsuario(data) {
  console.log('la data en action de puntos', data)
  return {
    type: SAVE_PUNTOS_BC_SINUSUARIO,
    data: data
  };
}

export function restarPuntos(data) {
  console.log('la data en action de restar puntos', data)
  return {
    type: RESTAR_PUNTOS_BC,
    data: data
  };
}

export function changeClave(data) {
  return {
    type: CHANGE_CLAVE_BC,
    data: data
  };
}

// actions vehículos particulares

export function getType_vp() {
  console.log('tipo v action')
  return {
    type: GET_TYPE_VP,
  }
}

export function register_vp(data) {
  return {
    type: SAVE_VP_USUARIO,
    data: data,
  };
}

export function crear_mas_veh() {
  return {
    type: CREAR_MAS_VEH,
  }
}

export function getVehicles(data) {
  return {
    type: GET_MY_VEHICLES,
    data: data,
  };
}

export function validateVehicle(cod, user) {
  return {
    type: VALIDATE_VEHICLE,
    cod: cod,
    user: user,
  };
}

export function startTrip_avion(data) {
  console.log('la data en action al ini viaje en avion', data);
  return {
    type: SAVE_VP_VIAJE_AVION,
    data: data,
  };
}

export function startTrip(data) {
  console.log('la data en action al ini viaje', data);
  return {
    type: SAVE_VP_VIAJE,
    data: data,
  };
}

export function restartTrip(data) {
  return {
    type: RESTART_VP_VIAJE
  };
}

export function validateVehicleSinMysql(data) {
  return {
    type: VALIDATE_VEHICLE_SINMYSQL,
  };
}

export function reiniciarQR() {
  return {
    type: REINICIAR_QR,
  };
}

export function decrementarSeg(seg) {
  return {
    type: DECREMENT_SEG,
    seg: seg
  };
}

export function reseteoCambioVehiculo() {
  return {
    type: RESETEO_CAMBIO_VEHICULO
  };
}

export function saveStateBicicletero(id) {
  console.log('ESTACION ACTION', id)
  return {
    type: SAVE_STATE_BICICLETERO,
    id: id,
  }
}

export function saveVehicleSelect(veh) {
  return {
    type: SAVE_VEHICLE_SELECT,
    veh: veh,
  }
}

export function verifyTripActive(user) {
  return {
    type: VERIFY_TRIP_ACTIVE_VP,
    user: user,
  }
}

export function verifyTripActiveCache() {
  console.log('entrando a ver trip en cache')
  return {
    type: VERIFY_TRIP_ACTIVE_VP_CACHE
  }
}

export function tripEnd(data) {
  console.log('entrando a trippppp')
  return {
    type: TRIP_END_VP,
    data: data,
  }
}

export function saveFotoTicket(document) {
  return {
    type: SAVE_FOTO_TICKET,
    document: document,
  };
}

export function deleteFoto() {
  return {
    type: DELETE_FOTO_VEH
  };
}

export function verificarRecorrido() {
  return {
    type: VERIFICAR_RECORRIDO
  };
}

export function actDireccion(data) {
  return {
    type: ACT_DIRECCION,
    data: data,
  };
}

export function buscarPuntos() {
  return {
    type: BUSCAR_PUNTOS
  }
}

export function misViajes() {
  return {
    type: MIS_VIAJES
  }
}

export function reset_register_vp() {
  return {
    type: RESET_REGISTER_VP
  }
}

export function clearStateVp() {
  return {
    type: CLEAR_STATE_VP
  }
}

export function indicadores_trip(mod, idTrip, indicador) {
  console.log('en action de indicadores____')
  return {
    type: INDICADORES_TRIP,
    mod: mod,
    idTrip: idTrip,
    indicador: indicador
  }
}

export function saliendo_modulo() {
  return {
    type: SALIENDO_MODULO
  }
}

export function entrando_modulo() {
  return {
    type: ENTRANDO_MODULO
  }
}

export function get_vehycle_id(id) {
  console.log('en action por get VEL ID')
  return {
    type: GET_VEHYCLE_ID,
    id: id
  }
}

export function get_empresas() {
  return {
    type: GET_EMPRESAS
  }
}

export function calificacion_exitosa(data) {
  return {
    type: CALIFICACION_EXITOSA,
    data: data
  }
}

export const resetApp = () => {
  return {
    type: RESET_APP,
  };
}

export const completar_progreso__logro = (id) => {
  return {
    type: COMPLETAR_PROGRESO_LOGRO,
    id: id
  };
}

export const save_reg_pp = (data) => {
  return {
    type: SAVE_REGISTRO_PP,
    data: data
  };
}

export const reset_pp = () => {
  return {
    type: RESET_PP
  }
}

export const resetBicicletaYaPrestada = () => {
  return {
    type: RESET_BICICLETA_YA_PRESTADA
  }
}

export const validateBikeAvailability = (bicicletaId) => {
  return {
    type: VALIDATE_BIKE_AVAILABILITY,
    bicicletaId: bicicletaId
  }
}
