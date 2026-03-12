/* eslint-disable prettier/prettier */
import { Alert, Linking, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
	VALIDATE_TYC,
    VALIDATE_TYC_OK,
	ACCEPT_TYC,
	ACCEPT_TYC_OK,
	SAVE_VEL,
	SAVE_VEL_OK,
	VALIDATE_QR_PARQUEADEROS,
	VALIDATE_QR_PARQUEADEROS_OK,
	VALIDATE_QR_PARQUEADEROS_ERROR,
	SAVE_PARQUEO,
	SAVE_PARQUEO_OK,
	BUSCAR_PARQUEO_ACTIVO,
	BUSCAR_PARQUEO_ACTIVO_PARQUEADERO,
	PARQUEO_ACTIVO_OK,
	FINALIZAR_PARQUEO,
	FINALIZAR_PARQUEO_OK,
	FINALIZAR_PARQUEADERO_OK,
	VIEW_PARQUEADEROS,
	FETCH_PARQUEADEROS_EMPRESA,
	GET_LUGARES_PARQUEAERO,
	FETCH_LUGARES_PARQUEADERO,
	SAVE_RESERVA_PARQUEO,
	SAVE_RESERVA_PARQUEO_OK,
	FETCH_SUCCESS_RESERVE_PARQUEO,
	RESERVE_ACTIVE_PARQUEO,
	SAVE_TIME_REST,
	FETCH_FAILD_RESERVE_PARQUEO,
	SAVE_COMENTARIO_PARQUEO,
	SAVE_COMENTARIO_PARQUEO_OK,
	CANCELAR_RESERVA_PARQUEO,
	CANCELAR_RESERVA_PARQUEO_OK
} from '../types/parqueoTypes'
import { all, call, put, select, takeEvery, takeLatest, delay, cancel } from 'redux-saga/effects'
import { getItem } from '../Services/storage.service';
import { api } from '../api/apiParqueo';
import { apiservice } from '../api/api.service';
import * as RootNavigation from '../RootNavigation';

//validar tyc
function* validate_tyc__(action) {
	let user = yield getItem('user');
	console.log('USUARIO desde parqueadero saga', user.idNumber)
    let tabla = 'parqueo_tyc/usuario/';
	let tyc_parqueo = yield api.get_tabla_cc(tabla, user.idNumber);
    console.log('respuesta desde la api', tyc_parqueo.response);
    console.log('respuesta desde la api', tyc_parqueo);
    
    if (!tyc_parqueo.error) {
		if (tyc_parqueo.response === 1) {
			console.log('respuesta desde la api ultimo vehiculo', tyc_parqueo.data.ultimo_vehiculo);
			yield put({ type: VALIDATE_TYC_OK, payload: tyc_parqueo.data.ultimo_vehiculo, data: tyc_parqueo.data});
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', register.error)
	}
	//yield put({ type: SUBIR_FOTO_AVION, eventImage: vpPhoto, data: data, tabla: tabla });
}

function* validate_tyc() {
	yield takeLatest(VALIDATE_TYC, validate_tyc__);
}


//aceptar tyc
function* aceptar_tyc__(action) {
	let user = yield getItem('user');
	let now = new Date();
	let data = {
		"usuario": user.idNumber, 
		"fecha_inscripcion": now,
		"ultimo_vehiculo": "sin vehiculo",
		"telefono": user.phoneNumber,
		"email": user.email,
		"saldo": 0,
	}
    let tabla = 'parqueo_tyc/registrar';
	let tyc_accept = yield api.save(tabla, data);
    console.log('respuesta desde la api', tyc_accept);
    if (!tyc_accept.error) {
		console.log('ok accept tyc')
		if (tyc_accept.message === 'ok') {
			yield put({ type: ACCEPT_TYC_OK, payload: tyc_accept.data});
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', register.error)
	}
	//yield put({ type: SUBIR_FOTO_AVION, eventImage: vpPhoto, data: data, tabla: tabla });
}

function* aceptar_tyc() {
	yield takeLatest(ACCEPT_TYC, aceptar_tyc__);
}

//guardar id vehiculo en parqueo_tyc
function* save_vel__(action) {
	let user = yield getItem('user');
	let tabla = 'parqueo_tyc/update_vel';
	let data = {
		"usuario": user.idNumber,
		"ultimo_vehiculo": action.id
	}
	let cambio = yield api.changeVehiculo(tabla, data);
    console.log('respuesta desde la api cambio de ultimo vehiculo', cambio);
    if (!cambio.error) {
		console.log('ok accept tyc')
		if (cambio.message === 'ok') {
			yield put({ type: SAVE_VEL_OK, payload: action.id});
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', register.error)
	}
}

function* save_vel() {
	yield takeLatest(SAVE_VEL, save_vel__);
}

//validando qr
// Fórmula haversine para calcular la distancia entre dos coordenadas
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const rad = Math.PI / 180; // Conversión de grados a radianes
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en metros
}

function* validando_qr__(action) {
	let user = yield getItem('user');
	let qr = action.qr;
	console.log('QR en asaga', qr)
	console.log('reserva en saga', action.reserva)
	
	//Si tenemos una reserva activa, primero vamos a pasar ese lugar de reservado a Disponible  para que sea encontrado. ya que filtra solo lugares disponibles
	if (action.reserva === 'conreserva') {
		let data_lugar = {
			"qr": qr,
			"estado": 'DISPONIBLE'
		};
		let tabla_lugar = 'parqueo_lugar/updateEstadoQr';
		let actLugar = yield api.patchEstadoLugar(tabla_lugar, data_lugar);
		console.log('Se actualizo el lugar de reservado a disponible', actLugar);
	}

	let tabla = 'parqueo_lugar/qr/';
	console.log('en la sage validando qr el user', user);
	let usuario_mysql = yield api.get_tabla_cc('bc_usuarios/id/', user.idNumber)
	let lugar_parqueo = yield api.validarQR(tabla, qr);
	console.log('la data lugar parqueo', lugar_parqueo);

    if (!lugar_parqueo.error) {
		//Alert.alert('sin errores en lugar arqueo')
		if (lugar_parqueo.response === 0) {
			console.log('respuesta cero 0 en la if ')
			//Alert.alert('respuesta cero o en if')
			yield put({ type: VALIDATE_QR_PARQUEADEROS_ERROR, payload: 'QR no se encontró:' + qr});
			return
		}
		if (lugar_parqueo.response === 1) {
			//validacion misma organización
			if (lugar_parqueo.data.parqueo_parqueadero.empresa !== usuario_mysql.data.usu_empresa) {
				yield put({ type: VALIDATE_QR_PARQUEADEROS_ERROR, payload: 'El usuario no pertenece a la misma organización del parqueadero.'});
				return
			}

			if (lugar_parqueo.data.parqueo_parqueadero.empresa === usuario_mysql.data.usu_empresa) {
				console.log('Organización correcta')

				let id_parqueadero = lugar_parqueo.data.parqueo_parqueadero.id;
				let tabla = 'parqueo_horarios/parqueadero'
				let horarios = yield api.validar_horario_parqueo(tabla, id_parqueadero);

				if (!horarios.error) {
					if (horarios.hora) {
						//vamos a enviar que true listo para conectar e intentar ocupar parqueadero
						yield put({ type: VALIDATE_QR_PARQUEADEROS_OK, payload: lugar_parqueo.data
						});
					}else {
						yield put({ type: VALIDATE_QR_PARQUEADEROS_ERROR, payload: 'Horario no permitido' });
					}
				} else {
					console.log('ERROR DE LA SAGA 3G: ', horarios.error)
				}

			}
		}
	} else {
		console.log('ERROR DE LA SAGA parqeuo: ', lugar_parqueo.error)
	}
}

function* validando_qr() {
	yield takeLatest(VALIDATE_QR_PARQUEADEROS, validando_qr__);
}


function* save_parqueo__(action) {
	let user = yield getItem('user');
	let tabla = 'parqueo_renta/registrar';
	console.log('DATA PARA PRESTAMo PARQUEO :::::', action.data);
	let prestamo = yield api.save(tabla, action.data);
	console.log('PRESTAMO:::::', prestamo);
	if (!prestamo.error) {
		if (prestamo === 'ok') {
			let data2 = {
				"id": action.dataParqueo.id,
				"estado": 'OCUPADO'
			};
			let tabla2 = 'parqueo_lugar/updateEstado';
			console.log('El PRESTAMO SE guardo OKOKOKOK', prestamo);
			let cambioEstadoParqueo = yield api.patchEstadoLugar(tabla2, data2);
			console.log('cambio estado parqueo gggg', cambioEstadoParqueo);
			if (cambioEstadoParqueo === 'ok') {
				let url = 'parqueo_tyc/update_saldo';
				console.log('en la saga ver saldo', action.saldo)
				console.log('en la saga ver horas', action.horasParquear)
				let newHoras = {
					"usuario": user.idNumber,
					"saldo": Number(action.saldo - action.horasParquear)
				};
				let updateHoras = yield api.patchHoras(url, newHoras);
				if (updateHoras.message === 'ok') {
					yield put({ type: SAVE_PARQUEO_OK, payload: action.data });
					console.log('se guardo el prestamo del parqueo OK')
				}	
			}
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', prestamo.error)
	}
}
function* saveParqueo() {
	yield takeLatest(SAVE_PARQUEO, save_parqueo__);
}



function* buscarParqueoActivo__(action) {
	let user = yield getItem('user');
	let tabla = 'parqueo_renta/prestamoActivo/';
	let parqueo_activo = yield api.get_tabla_cc(tabla, user.idNumber);
	console.log('PARQUEO ACTIVO _:::::', parqueo_activo);
	//console.log('PARQUEO ACTIVO data_:::::', parqueo_activo.data[0].parqueo_lugar);
	if (!parqueo_activo.error) {
		if (parqueo_activo.data.length === 1) {
			yield put({ type: PARQUEO_ACTIVO_OK, payload: parqueo_activo.data });
			console.log('tenemos un prestamo activo');
			RootNavigation.navigate('ParqueoActivo');
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', prestamo.error)
	}
}
function* buscarParqueoActivo() {
	yield takeLatest(BUSCAR_PARQUEO_ACTIVO, buscarParqueoActivo__);
}

function* buscarParqueoActivo__parqueadero(action) {
	let user = yield getItem('user');
	let tabla = 'parqueo_renta/prestamoActivo/';
	let parqueo_activo = yield api.get_tabla_cc(tabla, user.idNumber);
	console.log('PARQUEO ACTIVO _:::::', parqueo_activo);
	//console.log('PARQUEO ACTIVO data_:::::', parqueo_activo.data[0].parqueo_lugar);
	if (!parqueo_activo.error) {
		if (parqueo_activo.data.length === 1) {
			yield put({ type: PARQUEO_ACTIVO_OK, payload: parqueo_activo.data });
			console.log('tenemos un prestamo activo');
			RootNavigation.navigate('ParqueoActivo_parqueadero');
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', prestamo.error)
	}
}
function* buscarParqueoActivo_parqeuadero() {
	yield takeLatest(BUSCAR_PARQUEO_ACTIVO_PARQUEADERO, buscarParqueoActivo__parqueadero);
}

function* finalizarParqueoActivo__(action) {
	console.log('finalizar parqueo activo saga id del parqueo', action.data.id);
	let data = {
		"id": action.data.lugar_parqueo,
		"estado": 'DISPONIBLE'
	};
	let tabla = 'parqueo_lugar/updateEstado';
	let cambioEstadoLugar = yield api.patchEstadoLugar(tabla, data);
	console.log('cambio estado parqueo gggg', cambioEstadoLugar);
	let data2 = {
		"id": action.data.id,
		"estado": 'FINALIZADA'
	};
	let tabla2 = 'parqueo_renta/updateEstado';
	let cambioEstadoRenta = yield api.patchEstadoLugar(tabla2, data2);
	console.log('cambio estado parqueo gggg', cambioEstadoRenta);
	if (cambioEstadoLugar === 'ok' && cambioEstadoRenta === 'ok') {
		if (action.modulo === 'parqueadero') {
			yield put({ type: FINALIZAR_PARQUEADERO_OK });
		}

		if (action.modulo === 'electrohub') {
			yield put({ type: FINALIZAR_PARQUEO_OK });
		}
		
		console.log('se cambio el parqueo a disponible');
	}
}
function* finalizarParqueoActivo() {
	yield takeLatest(FINALIZAR_PARQUEO, finalizarParqueoActivo__);
}


//mostrar parqueaderos
function* mostrar_parqueaderos__(action) {
	console.log('la data para ver parqueadero', action.emp);
	let tabla = 'parqueo_parqueaderos/empresa/';
	let parquederos = yield api.get_tabla_cc(tabla, action.emp);
	console.log('data parqueooooo', parquederos);
	if (!parquederos.error) {
		yield put({ type: FETCH_PARQUEADEROS_EMPRESA, payload: parquederos});
	} else {
		console.log('ERROR DE LA SAGA 3G: ', parquederos.error)
	}
}
function* mostrar_parqueaderos() {
	yield takeLatest(VIEW_PARQUEADEROS, mostrar_parqueaderos__);
}


//get lugares por parqueadero
function* viewLugaresParqueadero__(action) {
	let tabla = 'parqueo_lugar/parqueaderoAll'
	let lugares = yield api.viewLugaresParq(tabla, action.id);
	console.log('lugares para parquear', lugares);
	if (!lugares.error) {
		yield put({ type: FETCH_LUGARES_PARQUEADERO, payload: lugares});
	} else {
		console.log('ERROR DE LA SAGA 3G: ', lugares.error)
	}
}
function* viewLugaresParqueadero() {
	yield takeLatest(GET_LUGARES_PARQUEAERO, viewLugaresParqueadero__);
}

//reservas parqueo
function* saveReserva__parqueo(action) {
	let user = yield getItem('user');
	console.log('USUARIO', user.idNumber)
	let data = action.data;
	let tabla = 'parqueo_reservas/registrar';
	let data_lugar = {
		"id": data.lugar_parqueo,
		"estado": 'RESERVADO'
	}
	let tabla_lugar = 'parqueo_lugar/updateEstado';
	
	let reserva = yield api.guardandoReserva(tabla, data);
	console.log('QUE TRAE CUANDO SE RESERVÓ ==============>>>>>>>>>>>>>>',reserva);

	let data_temp = {
		"duracion": action.duracion,
		"lugar": action.lugar,
		"usuario":  user.idNumber
	}

	let temporizador = yield api.temporizadorReserva( 'parqueo_reservas/temporizador', data_temp);
	console.log('inicio temporizador desde la saga', temporizador);

	if (!reserva.error) {
		if (reserva === 'ok') {
			console.log('la reserva se guardo OK despues de IF que es tiene respuesta OK');

			let cambio = yield api.changeEstadoLugar(tabla_lugar, data_lugar);
			console.log('QUE TRAE CUANDO CAMBIO ESTADO LUGAR ==============>>>>>>>>>>>>>>',cambio)
			if (cambio === 'ok') {
				yield put({ type: SAVE_RESERVA_PARQUEO_OK});

				let fechaVencimiento = action.fecha;
				console.log('la fecha de vencimiento desde SAGAes ::::', fechaVencimiento)
				const fechaLimite = new Date(fechaVencimiento).getTime();

				const now = new Date().getTime();
				const tiempo = Math.floor(fechaLimite - now);
				const days = Math.floor(tiempo / (24*60*60*1000));
				const hours = Math.floor((tiempo % (24*60*60*1000)) / (1000*60*60));
				const minutes = Math.floor((tiempo % (60*60*1000)) / (1000*60));
				const seconds = Math.floor((tiempo % (60*1000)) / (1000));

				if(tiempo < 0){
					console.log('SE VENCIO EN TIEMPO DE LA RESERVA DESDE LA SAGA');
				}else{
					console.log('RESERVA CON TIMEPPO PARA RENTAR DESDE LA SAGA', days, hours, minutes, seconds)
					const restante = { diasR : days,  horasR : hours,  minutosR : minutes, segundosR: seconds }
					yield put({ type: SAVE_TIME_REST, payload: restante});
				}
			}
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', reserva.error)
	}
}
function* saveReservaParqueo() {
	yield takeLatest(SAVE_RESERVA_PARQUEO, saveReserva__parqueo);
}


//reservas activas
function* reserveActive__parqueo(action) {
	let cc = action.cc;
	let tabla = 'parqueo_reservas/usuario'
	let reserva = yield api.get_tabla_cc_sinid(tabla, cc);
	console.log('la data de la reserva del parqueo', reserva)
	if (!reserva.error) {
		if (reserva.data.length === 1) {
			
			let fechaInicio = reserva.data[0].fecha;  // Ej: "2025-05-21"
			let horaFin = reserva.data[0].hora_fin;          // Ej: "18:00:00"
			let horaInicio = reserva.data[0].hora_inicio;    // Opcional, si la necesitas

			// Combinar fecha + hora para tener fecha completa de vencimiento
			let fechaHoraFin = new Date(`${fechaInicio}T${horaFin}`); // "2025-05-21T18:00:00"
			let ahora = new Date(); // Hora actual

			let tiempoRestante = fechaHoraFin.getTime() - ahora.getTime(); 

			const days = Math.floor(tiempoRestante / (24 * 60 * 60 * 1000));
			const hours = Math.floor((tiempoRestante % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
			const minutes = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (1000 * 60));
			const seconds = Math.floor((tiempoRestante % (60 * 1000)) / 1000);

			if(tiempoRestante < 0){
				//yield put({ type: RESERVA_VENCIDA });
			}else{
				//console.log('RESERVA CON TIMEPPO PARA RENTAR DESDE LA SAGA', days, hours, minutes, seconds)
				const restante = { "diasR": days, "horasR": hours, "minutosR": minutes, "segundosR": seconds }
				yield put({ type: SAVE_TIME_REST, payload: restante});
			}
			console.log('lugar reservadooooo', reserva.data[0].lugar_parqueo)
			let lugarReserva = reserva.data[0].lugar_parqueo
			let numLugar = yield api.viewLugar('parqueo_lugar/id', lugarReserva);
			console.log('num Lugar', numLugar);
			//yield put({ type: ADD_VEHICULO_RESERVA, payload: numVehiculos.data.bic_numero, data: numVehiculos.data});

			//let estacion = reserva.data[0].res_estacion;
			
			//let verVehiculos = yield api.validationVerVehiculos('bc_bicicletas/estacion', estacion);
			//let verEstacion = yield api.viewEstacion('bc_estaciones/nombre', estacion)
			//console.log('data estacion mmmmmmm: ::::::', verEstacion);
			//let distanciaRenta = verEstacion.data[0].est_horario;
			//console.log('la distancia para la renta: ::::::', distanciaRenta);
			//yield put({ type: ADD_DISTANCIA_RENTA, payload: distanciaRenta});//cargar en state global la distancia para renta
			//yield put({ type: ADD_VEHICULOS_ESTACION, payload: verVehiculos});
			//yield put({ type: ADD_LATLNG_ESTACION, payload: verEstacion });
			yield put({ type: FETCH_SUCCESS_RESERVE_PARQUEO, payload: reserva, tiempoRestante: 24, lugar: numLugar.data.numero, qr: numLugar.data.qr});
		}else{
			yield put({ type: FETCH_FAILD_RESERVE_PARQUEO });
		}
		
	} else {
		console.log('ERROR DE LA SAGA 3G: ', reserva.error)
	}
}
function* reserveActiveParqueo() {
	yield takeLatest(RESERVE_ACTIVE_PARQUEO, reserveActive__parqueo);
}

//save comentario
function* save_comentario_parqueo__(action) {
	let data = action.data;
	let tabla = 'parqueo_feedback/registrar';
	let saveComentario = yield api.saveComentarios(tabla, data);
	if (!saveComentario.error) {
		console.log('en la saga despues de save el pcomentario sin errores')
		yield put({ type: SAVE_COMENTARIO_PARQUEO_OK});
			
	} else {
		console.log('ERROR DE LA SAGA 3G: ', saveComentario.error)
	}
}
function* save_comentario_parqueo() {
	yield takeLatest(SAVE_COMENTARIO_PARQUEO, save_comentario_parqueo__);
}
////////////////////////////////////////////////////////////////////


//cancelar reserva
function* cancelar_reserva_parqueo__(action) {
	let tabla = 'parqueo_reservas/updateEstado';
	let data = {
		"id": action.id,
		"estado": 'CANCELADA'
	}
	let delRese = yield api.cancelarReserva(tabla, data);
	if (!delRese.error) {
		console.log('en la saga despues de save el pcomentario sin errores', delRese)
		if (delRese = 'ok') {
			let data2 = {
				"id": action.lugar,
				"estado": 'DISPONIBLE'
			}
			let tabla2 = 'parqueo_lugar/updateEstado';
			let dispPunto = yield api.updateLugar(tabla2, data2);
			console.log('actualizano punto a disponible', dispPunto)
			if (dispPunto = 'ok') {
				yield put({ type: CANCELAR_RESERVA_PARQUEO_OK});
				//Alert.alert("Reserva cancelada", "✅ La reserva se canceló exitosamente");
				//RootNavigation.navigate('Home');
			}
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', delRese.error)
	}
}
function* cancelar_reserva_parqueo() {
	yield takeLatest(CANCELAR_RESERVA_PARQUEO, cancelar_reserva_parqueo__);
}
////////////////////////////////////////////////////////////////////



export const sagas = [
	validate_tyc(),
	aceptar_tyc(),
	save_vel(),
	validando_qr(),
	saveParqueo(),
	buscarParqueoActivo(),
	buscarParqueoActivo_parqeuadero(),
	finalizarParqueoActivo(),
	mostrar_parqueaderos(),
	viewLugaresParqueadero(),
	saveReservaParqueo(),
	reserveActiveParqueo(),
	save_comentario_parqueo(),
	cancelar_reserva_parqueo()
];