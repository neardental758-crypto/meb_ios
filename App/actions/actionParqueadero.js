import { Alert } from 'react-native';
import {
    VALIDATE_TYC,
    ACCEPT_TYC,
    SAVE_VEL, 
    VALIDATE_QR_PARQUEADEROS,
    RESET_ERROR_PARQUEO,
    VALIDATE_QR_PARQUEADEROS_ERROR,
    RESET_QR_PARQUEO,
    SAVE_PARQUEO,
    BUSCAR_PARQUEO_ACTIVO,
    BUSCAR_PARQUEO_ACTIVO_PARQUEADERO,
    FINALIZAR_PARQUEO,
    VIEW_PARQUEADEROS,
    GET_LUGARES_PARQUEAERO,
    SAVE_RESERVA_PARQUEO,
    RESERVE_ACTIVE_PARQUEO,
    SAVE_COMENTARIO_PARQUEO,
    RESET_PARQUEO,
    CANCELAR_RESERVA_PARQUEO,
    SELECCIONAR_HORAS_PARQUEO,
    CONECTIVIDAD_INTERNET
} from '../types/parqueoTypes';


export function validate_tyc() {
  return {
    type: VALIDATE_TYC
  };
}

export function accept_tyc() {
  return {
    type: ACCEPT_TYC
  }
}

export function save_vel(id){
  return {
    type: SAVE_VEL,
    id: id
  }
}

export function validate_qr(qr, tipo, reserva) {
  return {
    type: VALIDATE_QR_PARQUEADEROS,
    qr: tipo === 'scaner' ? qr : qr.data,
    reserva: reserva
  }
} 

export function reset_error_parqueo() {
  return {
    type: RESET_ERROR_PARQUEO
  }
}

export function sin_cupo() {
  return {
    type: VALIDATE_QR_PARQUEADEROS_ERROR,
    payload: 'Lamentamos no haya cupo disponible. Gracias por tu retroalimentación'
  }
}

export function reset_qr() {
  return {
    type: RESET_QR_PARQUEO
  }
}

export function savePrestamo(data, dataVehiculo, dataParqueo, horasParquear, saldo) {
  return {
    type: SAVE_PARQUEO,
    data: data,
    dataVehiculo: dataVehiculo,
    dataParqueo: dataParqueo,
    horasParquear: horasParquear,
    saldo: saldo
  }
}

export function buscar_parqueo_activo() {
  return {
    type: BUSCAR_PARQUEO_ACTIVO
  }
}

export function buscar_parqueo_activo_parqueadero() {
  return {
    type: BUSCAR_PARQUEO_ACTIVO_PARQUEADERO
  }
}

export function finalizar_parqueo(data, modulo) {
  return {
    type: FINALIZAR_PARQUEO,
    data: data,
    modulo: modulo
  }
}

export function viewParqueaderos(emp) {
  return {
    type: VIEW_PARQUEADEROS,
    emp: emp
  }
}

export function viewLugares(id) {
  return {
    type: GET_LUGARES_PARQUEAERO,
    id: id
  };
}

export function saveReservaParqueo(data, fecha, duracion, lugar) {
  return {
    type: SAVE_RESERVA_PARQUEO,
    data: data,
    fecha: fecha,
    duracion: duracion,
    lugar: lugar
  };
}

export function reserveActive(cc) {
  return {
    type: RESERVE_ACTIVE_PARQUEO,
    cc: cc
  };
}

export function saveComentarioParqeuo(data) {
  return {
    type: SAVE_COMENTARIO_PARQUEO,
    data: data
  }
}

export function resetParqueo() {
  return {
    type: RESET_PARQUEO
  }
}

export function cancelar_reserva_(id, lugar) {
  return {
    type: CANCELAR_RESERVA_PARQUEO,
    id: id,
    lugar: lugar
  }
}

export const horas_parqueo = (horas, estado) => {
  return {
    type: SELECCIONAR_HORAS_PARQUEO,
    horas: horas,
    estado: estado
  }
}

export const conectividad = (state) => {
  return {
    type: CONECTIVIDAD_INTERNET,
    state: state
  }
}

