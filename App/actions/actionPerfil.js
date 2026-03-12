import {
    GET_PUNTOS_PERFIL,
    GET_ESTACIONES_BC,
    GET_EMPRESA_BC,
    GET_PRODUCTOS,
    GET_LOGROS,
    GET_DESAFIOS,
    SAVE_PROGRESO_LOGROS,
    GET_LOGROS_PROGRESO,
    GET_DESAFIOS_PROGRESO,
    CHANGE_PROGRESO_OK,
    CHANGE_PROGRESO,
    GET_TRIP_BC,
    CHANGE_PROGRESO_ESTADO,
    CHANGE_PROGRESO_DESAFIO,
    CHANGE_PROGRESO_ESTADO_DESAFIO,
    SET_DISTANCE_NATIVE,
    SAVE_PROGRESO_DESAFIOS,
    CHANGE_ESTADO_DESAFIO,
    CHANGE_ESTADO_DESAFIO_OK,
    GET_INDICADORES_TRIP_ID,
    GET_USER_MYSQL,
    SAVE_FORM_PREOPERACIONAL,
    GENERAR_CODIGO_REFERIDO,
    BUSCAR_CODIGO_REFERIDO,
    OTORGAR_PUNTOS_REFERENTE,
    RESET_PREOPERACIONALES
} from '../types/perfil'

export function getPuntos() {
    return {
     type: GET_PUNTOS_PERFIL,
   };
}
export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email: email,
    token: 'token',
  };
}
export function getProductos(emp) {
  return {
    type: GET_PRODUCTOS,
    emp: emp
  };
}
export function getDesafios(estado) {
  return {
    type: GET_DESAFIOS,
    estado: estado
  };
}
export function getLogros(emp) {
  console.log('en actionnnnn emp', emp)
  return {
    type: GET_LOGROS,
    emp: emp
  };
}
export function getLogrosProgreso() {
  return {
    type: GET_LOGROS_PROGRESO
  };
}
export function getDesafiosProgreso() {
  return {
    type: GET_DESAFIOS_PROGRESO
  };
}
export function getempresa(email) {
    return {
     type: GET_EMPRESA_BC,
     email: email,
   };
}

export function getEstaciones(empresa) {
  return {
   type: GET_ESTACIONES_BC,
   empresa: empresa,
 };
}
export function saveProgresoLogro(data) {
  return {
    type: SAVE_PROGRESO_LOGROS,
    data: data
  };
}

export function getTrip(modulo) {
  return {
    type: GET_TRIP_BC,
    modulo: modulo,
  }
}
export function changeProgreso(data) {
  return {
    type: CHANGE_PROGRESO,
    data: data
  };
}
export function changeProgresoEstado(data) {
  return {
    type: CHANGE_PROGRESO_ESTADO,
    data: data
  };
}
export function changeEstadoDesafio(data) {
  return {
    type: CHANGE_ESTADO_DESAFIO,
    data: data
  };
}
export function changeProgresoDesafio(data) {
  return {
    type: CHANGE_PROGRESO_DESAFIO,
    data: data
  };
}
export function changeProgresoEstadoDesafio(data) {
  return {
    type: CHANGE_PROGRESO_ESTADO_DESAFIO,
    data: data
  };
}
export const setDistanceProgreso = (distance) => (
  {
  type: SET_DISTANCE_NATIVE,
  payload: distance,
});
export function saveProgresoDesafio(data) {
  return {
    type: SAVE_PROGRESO_DESAFIOS,
    data: data
  };
}

export function get_indicadores_trip(id) {
  return {
    type: GET_INDICADORES_TRIP_ID,
    id: id
  }
}

export function get_user_mysql() {
  return {
    type: GET_USER_MYSQL
  }
}

export function saveFormPreoperacional(form) {
  return {
    type: SAVE_FORM_PREOPERACIONAL,
    form: form
  }
} 

export function generar_cod_ref(cod,fecha) {
  return {
    type: GENERAR_CODIGO_REFERIDO,
    cod: cod,
    fecha: fecha
  }
} 

export function buscar_cod_ref() {
  return {
    type: BUSCAR_CODIGO_REFERIDO
  }
} 

export function otorgarPuntosReferente(cod) {
  console.log('se esta action para otorgar puntos al referente')
  return {
    type: OTORGAR_PUNTOS_REFERENTE,
    cod: cod
  }
} 

export function reset_preoperacional() {
  return {
    type: RESET_PREOPERACIONALES
  }
}


