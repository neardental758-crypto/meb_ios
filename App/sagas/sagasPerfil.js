/*eslint-disable */
import { 
    GET_PUNTOS_PERFIL,
    GET_PUNTOS_PERFIL_OK,
    GET_ESTACIONES_BC,
    GET_ESTACIONES_BC_OK,
    GET_EMPRESA_BC,
    GET_EMPRESA_BC_OK,
    GET_PRODUCTOS,
    GET_DESAFIOS,
    GET_LOGROS,
    GET_DESAFIOS_SUCCESS,
    GET_LOGROS_SUCCESS,
    GET_TRIP_BC,
    GET_TRIP_BC_DATA,
    GET_PRODUCTOS_SUCCESS,
    GET_LOGROS_PROGRESO,
    GET_LOGROS_PROGRESO_SUCCESS,
    SAVE_PROGRESO_LOGROS,
    SAVE_PROGRESO_LOGROS_OK,
    CHANGE_PROGRESO,
    CHANGE_PROGRESO_OK,
    GET_DESAFIOS_PROGRESO,
    GET_DESAFIOS_PROGRESO_SUCCESS,
    SAVE_PROGRESO_DESAFIOS,
    SAVE_PROGRESO_DESAFIOS_OK,
    CHANGE_PROGRESO_DESAFIO,
    CHANGE_PROGRESO_DESAFIOS_OK,
    CHANGE_ESTADO_DESAFIO,
    CHANGE_ESTADO_DESAFIO_OK,
    CHANGE_PROGRESO_ESTADO_DESAFIO,
    CHANGE_PROGRESO_ESTADO,
    GET_TRIP_3G,
    GET_INDICADORES_TRIP_ID,
    GET_INDICADORES_TRIP_ID_OK,
    GET_INDICADORES_TRIP_ID_FAIL,
    GET_USER_MYSQL,
    GET_USER_MYSQL_OK,
    GENERAR_CODIGO_REFERIDO,
    BUSCAR_CODIGO_REFERIDO,
    BUSCAR_CODIGO_REFERIDO_SUCCESS,
    OTORGAR_PUNTOS_REFERENTE,
    OTORGAR_PUNTOS_REFERENTE_SUCCESS
} from '../types/perfil';
import { all, call, put, select, takeEvery, takeLatest, delay } from 'redux-saga/effects';
import { api } from '../api/apiCarpooling';
import { apiPerfil } from '../api/apiPerfil';
import { push } from '../api/notificacionesPush';
import { getItem } from '../Services/storage.service';
import { changeEmail } from '../actions/actions';
import * as RootNavigation from '../RootNavigation';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeProgresoEstado } from '../actions/actionPerfil';

//patch calificaciones en bc_usuarios
function* get_puntos(action) {
    const user = yield getItem('user');
    let tabla = 'bc_puntos/usuario/';
    let getPuntos = yield api.get_id(tabla, user.idNumber);
  
    if (getPuntos && getPuntos.data) {
        const puntos = getPuntos.data.map(item => parseFloat(item.pun_puntos));
        const totalPuntos = puntos.reduce((sum, pun_puntos) => sum + pun_puntos, 0);
        console.log('Total puntos:', totalPuntos);
        yield put({ type: GET_PUNTOS_PERFIL_OK, payload: totalPuntos});
    }
};

function* getpuntos() {
	yield takeLatest(GET_PUNTOS_PERFIL, get_puntos);
};
function* getProductos() {
	yield takeLatest(GET_PRODUCTOS, get_productos);
};
function* getDesafios() {
	yield takeLatest(GET_DESAFIOS, get_desafios);
};


//get estaciones
function* get_estaciones(action) {
    let tablaEs = 'bc_estaciones/estaciones/'+action.empresa;
    let getEstaciones = yield apiPerfil.get__est(tablaEs);
    if (getEstaciones) {
        yield put({ type: GET_ESTACIONES_BC_OK, payload: getEstaciones.body, empresa: action.empresa});
    }
};

function* get_productos(action) {
    
    let tabla = 'productos/empresa/' + action.emp;
    let getProductos = yield apiPerfil.get__(tabla);
    console.log("getProductos en cataaaaaaalogo" , getProductos.data)
    if (getProductos) {
        yield put({ type: GET_PRODUCTOS_SUCCESS, payload: getProductos.data, nivel: action.nivel});
    }
}
function* get_desafios(action) {
    try {
        let tabla = 'desafios/estado/' + action.estado;
        let getDesafios = yield apiPerfil.get__(tabla);

        if (getDesafios) {
            yield put({ type: GET_DESAFIOS_SUCCESS, payload: getDesafios.data });
        }
    } catch (error) {
        console.error('Error fetching desafios:', error);
        // Manejo de errores opcional
    }
}
function* get_logros(action) {
    try {
        //let tabla = 'logros/estado/' + action.estado;
        let tabla = 'empresa_logro/empresa/' + action.emp;
        let getLogros = yield apiPerfil.get__(tabla);
        console.log("getLogros con descripcion" , getLogros.data)
        if (getLogros) {
            yield put({ type: GET_LOGROS_SUCCESS, payload: getLogros.data });
        }
    } catch (error) {
        console.error('Error fetching logros:', error);
        // Manejo de errores opcional
    }
}
function* get_progreso_logros(action) {
    try {
        const user = yield getItem('user');
        let tabla = 'progreso_logros/usuario_id/' ;
        let getProgreso = yield api.get_id(tabla, user.idNumber);
        console.log('progreso logro por usuario xxx',getProgreso);
        //console.log("en la saga de get progreso logros")
        //console.log(getProgreso)
        if (getProgreso) {
            yield put({ type: GET_LOGROS_PROGRESO_SUCCESS, payload: getProgreso.data });
        }
    } catch (error) {
        console.error('Error fetching logros:', error);
        // Manejo de errores opcional
    }
}

function* get_progreso_desafios(action) {
    console.log("en la saga de getProgresoDesafios")
    try {
        const user = yield getItem('user');
        let tabla = 'progreso_desafios/usuario_id/' ;
        let getProgreso = yield api.get_id(tabla, user.idNumber);
        console.log('LA DATA DE PROGRESO DESAFIOS AAAAAAAAAAAAAAAAAAAA', getProgreso);
        //console.log("en la saga de get progreso logros")
        //console.log(getProgreso)
        if (getProgreso) {
            yield put({ type: GET_DESAFIOS_PROGRESO_SUCCESS, payload: getProgreso.data });
        }
    } catch (error) {
        console.error('Error fetching logros:', error);
        // Manejo de errores opcional
    }
}
function* saveProgresoLogro(action) {
    try {
        let data = action.data;
        let tabla = 'progreso_logros/registrar';
        let saveProgreso = yield (apiPerfil.guardandoProgresoLogro(tabla, data)); // Usa `call` para consistencia
        if (saveProgreso && !saveProgreso.error) {
            yield put({ type: SAVE_PROGRESO_LOGROS_OK });
        } else {
            console.log('ERROR DE LA SAGA PERFIL: ', saveProgreso.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error capturado en la saga:', error.message || error);
    }
}

function* saveProgresoLogros() {
	yield takeLatest(SAVE_PROGRESO_LOGROS, saveProgresoLogro);
}
function* saveProgresoDesafios(action) {
    try {
        console.log("en la saga saveProgresoDesafio")
        let data = action.data;
        console.log(data)
        let tabla = 'progreso_desafios/registrar';
        let saveProgresoDesafio = yield (apiPerfil.guardandoProgresoDesafio(tabla, data)); // Usa `call` para consistencia
        console.log("valor de saveProgreso");
        console.log(saveProgresoDesafio);
        if (saveProgresoDesafio && !saveProgresoDesafio.error) {
            yield put({ type: SAVE_PROGRESO_DESAFIOS_OK });
        } else {
            console.log('ERROR DE LA SAGA PERFIL: ', saveProgreso.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error capturado en la saga:', error.message || error);
    }
}

function* saveProgresoDesafio() {
	yield takeLatest(SAVE_PROGRESO_DESAFIOS, saveProgresoDesafios);
}


function* calcularNivelUsuario() {
    let puntosUsuario = get_puntos();
    console.log("en la funcion de calcular nivel " + puntosUsuario)
   
};

function* getestaciones() {
	yield takeLatest(GET_ESTACIONES_BC, get_estaciones);
};
function* getproductos() {
	yield takeLatest(GET_PRODUCTOS, get_productos);
};
function* getdesafios() {
	yield takeLatest(GET_DESAFIOS, get_desafios);
};
function* getlogros() {
	yield takeLatest(GET_LOGROS, get_logros);
};
function* getprogresologros() {
	yield takeLatest(GET_LOGROS_PROGRESO, get_progreso_logros);
};
function* getprogresodesafios() {
	yield takeLatest(GET_DESAFIOS_PROGRESO, get_progreso_desafios);
};



//get empresa
/*function* get_empresa(action) {
    const user = yield getItem('user');
    let organizacion = user.organizationId;
    console.log('get_empresa organizacion: ', organizacion);
    let tablaEmpresa = 'bc_empresas/email/'+action.email;
    let getEmpresa = yield apiPerfil.get__(tablaEmpresa);
    console.log('get_empresa la empresa que llega eslelelelellel:  ', getEmpresa);
    if (getEmpresa) {
        yield put({ type: GET_EMPRESA_BC_OK, payload: getEmpresa.data, empresa: getEmpresa.data[0].emp_nombre});
    }
};*/

function* get_empresa(action) {
    const user = yield getItem('user');
    let organizacion = user.organizationId;

    let tablaEmpresa = 'bc_empresas/email/' + action.email;
    let getEmpresa = yield apiPerfil.get__(tablaEmpresa);

    if (getEmpresa && getEmpresa.data) {
        const empresaFiltrada = getEmpresa.data.find(item => item.emp_id === organizacion);
        if (empresaFiltrada) {
            yield put({
                type: GET_EMPRESA_BC_OK,
                payload: [empresaFiltrada],
                empresa: empresaFiltrada.emp_nombre
            });
        } else {
            console.warn('No se encontró una empresa con emp_id igual a organizationId');
        }
    }
}

function* getempresa() {
	yield takeLatest(GET_EMPRESA_BC, get_empresa);
};

function* cambiarEmail() {
    const userState = yield select((state) => state.globalReducer.user);

    let patch = yield api.patchField("users", userState.id, {
        email: userState.email
    })
    if (!!patch) {
        yield delay(100);
        Alert.alert('Alert', 'Error inesperado, vuelva a intentar más tarde'); //pendiente
    } else {
        yield delay(100);
        Alert.alert('Alert', 'El correo se ha cambiado exitosamente'); //pendiente
        //const navigation = yield select((state) => state.globalReducer.nav._navigation);

        yield put(changeEmail(userState.email));
       // RootNavigation.navigate("Ride", 'Inicio')
    }
}
function* cambiarProgreso(action) {
	let data = action.data;
	let tabla = 'progreso_logros/';
	let cambiov = yield apiPerfil.changeProgreso(tabla, data);
	if (!cambiov.error) {
		yield put({ type: CHANGE_PROGRESO_OK});
	} else {
		console.log('ERROR DE LA SAGA PERFIL: ', cambiov.error)
	}
}
function* cambiarProgresoDesafio(action) {
	let data = action.data;
	let tabla = 'progreso_desafios/';
	let cambiov = yield apiPerfil.changeProgreso(tabla, data);
	if (!cambiov.error) {
		yield put({ type: CHANGE_PROGRESO_DESAFIOS_OK});
	} else {
		console.log('ERROR DE LA SAGA PERFIL: ', cambiov.error)
	}
}
function* cambiarEstadoProgreso(action) {
	let data = action.data;
	let tabla = 'progreso_logros/updateEstado';
	let cambiov = yield apiPerfil.changeProgresoEstado(tabla, data);
	if (!cambiov.error) {
		yield put({ type: CHANGE_PROGRESO_ESTADO_OK});
	} else {
		console.log('ERROR DE LA SAGA PERFIL: ', cambiov.error)
	}
}

function* cambiarEstadoProgresoDesafio(action) {
	let data = action.data;
	let tabla = 'progreso_desafios/updateEstado';
	let cambiov = yield apiPerfil.changeProgresoDesafioEstado(tabla, data);
	if (!cambiov.error) {
		yield put({ type: CHANGE_PROGRESO_ESTADO_DESAFIOS_OK});
	} else {
		console.log('ERROR DE LA SAGA PERFIL: ', cambiov.error)
	}
}
function* cambiarEstadoDesafio(action) {
	let data = action.data;
	let tabla = 'desafios/updateEstado';
	let cambiov = yield apiPerfil.changeEstadoDesafio(tabla, data);
	if (!cambiov.error) {
		yield put({ type: CHANGE_ESTADO_DESAFIO_OK});
	} else {
		console.log('ERROR DE LA SAGA PERFIL: ', cambiov.error)
	}
}
function* changeProgreso() {
	yield takeLatest(CHANGE_PROGRESO, cambiarProgreso);
}
function* changeProgresoDesafio() {
	yield takeLatest(CHANGE_PROGRESO_DESAFIO, cambiarProgresoDesafio);
}
function* changeProgresoDesafioEstado() {
	yield takeLatest(CHANGE_PROGRESO_ESTADO_DESAFIO, cambiarEstadoProgresoDesafio);
}
function* changeEstadoDesafio() {
	yield takeLatest(CHANGE_ESTADO_DESAFIO, cambiarEstadoDesafio);
}
function* changeProgresoLogrosEstado() {
	yield takeLatest(CHANGE_PROGRESO_ESTADO, cambiarEstadoProgreso);
}



//GET indicadores por id viaje
function* getIndicadoresTrip__(action) {
    let tablaIndicadorTrip = 'bc_indicadores_trip/trip/'+action.id;
    let get_ind = yield apiPerfil.get__indicadores(tablaIndicadorTrip);
    
    if (get_ind) {
        // Si la respuesta tiene registros
        yield put({ type: GET_INDICADORES_TRIP_ID_OK, payload: get_ind });
    } else {
        // Si la respuesta no tiene registros
        yield put({ type: GET_INDICADORES_TRIP_ID_FAIL });
        console.log('No tiene indicadores');
    }
};

function* getIndicadoresTrip() {
	yield takeLatest(GET_INDICADORES_TRIP_ID, getIndicadoresTrip__);
};


//GET_USER_MYSQL

function* get_user_mysql__(action) {
    let tabla = 'bc_usuarios';
    let user = yield getItem('user');
    let get_mysql_user = yield apiPerfil.get_user__mysql(tabla, user.idNumber);
    
    if (get_mysql_user) {
        yield put({ type: GET_USER_MYSQL_OK, payload: get_mysql_user.data });
    } else {
        // Si la respuesta no tiene registros
        console.log('No se encontró el usuario en la tabla de usuarios');
    }
};

function* get_user_mysql() {
	yield takeLatest(GET_USER_MYSQL, get_user_mysql__);
};


//CREAR codigo referido

function* generar_cod_ref__(action) {
    try {
        const user = yield getItem('user');
        
        let tabla = 'bc_usuarios_referidos/registrar';
        let data = {
            "usuario": user.idNumber,
            "codigo": action.cod,
            "fecha_creacion": action.fecha,
            "referente": "NULL"
        }
        console.log('data de cod:', data);
        
        let save_cod = yield apiPerfil.guardandoCodigo(tabla, data);
        console.log('Respuesta del servidor:', save_cod);
        
        if (save_cod === 'ok') {
            // Éxito - puedes disparar una acción de éxito
            yield put({ type: 'GENERAR_CODIGO_REFERIDO_SUCCESS', payload: { codigo: action.cod } });
            console.log('Código de referidos guardado exitosamente');
        } else {
            throw new Error('Respuesta inesperada del servidor');
        }
    } catch (error) {
        console.log('Error en generar_cod_ref__:', error);
        yield put({ type: 'GENERAR_CODIGO_REFERIDO_ERROR', payload: error.message });
    }
}

function* generar_cod_ref() {
	yield takeLatest(GENERAR_CODIGO_REFERIDO, generar_cod_ref__);
};


//BSUCAR codigo referido

function* buscar_cod_ref__(action) {
    try {
        const user = yield getItem('user');
        console.log('cc user', user.idNumber);
        
        let tabla = 'bc_usuarios_referidos/usuario/' + user.idNumber;
        
        let response = yield apiPerfil.get__(tabla);
        console.log('Respuesta del servidor buscando cod:', response);
        
        // Verificar si la respuesta tiene datos
        if (response && response.data && response.data.length > 0) {
            // Existe código - disparar acción de éxito
            const codigoData = response.data[0]; // Tomar el primer registro
            yield put({ 
                type: BUSCAR_CODIGO_REFERIDO_SUCCESS, 
                payload: codigoData
            });
            console.log('Código de referidos encontrado:', codigoData.codigo);
            return codigoData; // Retornar los datos para el componente
        } else {
            // No se encontró código
            console.log('No se encontró código de referidos para el usuario');
            return null;
        }
    } catch (error) {
        console.log('Error en buscar_cod_ref__:', error);
        return null;
    }
}

function* buscar_cod_ref() {
	yield takeLatest(BUSCAR_CODIGO_REFERIDO, buscar_cod_ref__);
};


//Buscar por codigo al usuario
function* buscar_user_ref_cod__(action) {
    try {
        const user = yield getItem('user');
        console.log('cc user', user.idNumber);
        
        let tabla = 'bc_usuarios_referidos/cod/' + action.cod;
        
        let response = yield apiPerfil.get__(tabla);
        console.log('Respuesta del servidor buscando USER:', response.data.usuario);

        if (response) {
            let data = {
                "pun_id": uuidv4(),
                "pun_usuario": response.data.usuario,
                "pun_modulo": 'Referidos',
                "pun_fecha": new Date().toJSON(),
                "pun_puntos": "200",
                "pun_motivo": "Por referir a RIDE al usuario " + user.idNumber
            };
            console.log('la data para 200 puntos', data)
            let tabla = 'bc_puntos/registrar';
            let savePunto = yield apiPerfil.guardandoCodigo(tabla, data);
            console.log('Guardando los 200 puntos de rferidos', savePunto);

            if (savePunto === 'ok') {
                let data = {
                    "pun_id": uuidv4(),
                    "pun_usuario": user.idNumber,
                    "pun_modulo": 'Referidos',
                    "pun_fecha": new Date().toJSON(),
                    "pun_puntos": "200",
                    "pun_motivo": "Por ingresar el codigo del referente del usuario " + response.data.usuario
                };
                console.log('la data para 200 puntos', data)
                let tabla = 'bc_puntos/registrar';
                let savePuntoRef = yield apiPerfil.guardandoCodigo(tabla, data);
                console.log('Guardando los 200 puntos de rferidos', savePuntoRef);

                if (savePuntoRef === 'ok') {
                    let data = {
                        "usuario": user.idNumber,
                        "referente": response.data.usuario
                    }
                    let tabla = 'bc_usuarios_referidos/';
                    let updateReferente = yield apiPerfil.patch__(tabla, data);
                    console.log('update referente',updateReferente)
                    if (updateReferente.status === 200) {
                        yield put({ 
                            type: OTORGAR_PUNTOS_REFERENTE_SUCCESS
                        });
                    }
                }
            }

        }
        
    } catch (error) {
        console.log('Error en guardar puntos referido:', error);
        yield put({ 
            type: 'BUSCAR_CODIGO_REFERIDO_ERROR', 
            payload: error.message 
        });
        return null;
    }
}

function* buscar_user_ref_cod() {
	yield takeLatest(OTORGAR_PUNTOS_REFERENTE, buscar_user_ref_cod__);
};

export const sagas = [
    getpuntos(),
    getestaciones(),
    getempresa(),
    getproductos(),
    getdesafios(),
    getlogros(),
    calcularNivelUsuario(),
    saveProgresoLogros(),
    getprogresologros(),
    changeProgreso(),
    changeProgresoDesafio(),
    changeProgresoEstado(),
    saveProgresoDesafio(),
    changeEstadoDesafio(),
    changeProgresoDesafioEstado(),
    changeEstadoDesafio(),
    getprogresodesafios(),
    //get_productos()
    //cambiarEmail()
    getIndicadoresTrip(),
    get_user_mysql(),
    generar_cod_ref(),
    buscar_cod_ref(),
    buscar_user_ref_cod()
];