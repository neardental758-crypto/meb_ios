/* eslint-disable prettier/prettier */
import { Alert, Linking, Platform } from 'react-native';
import {
	SAVE_REGISTER_EXT,
	SAVE_REGISTER_EXT_OK,
	SAVE_DATA_USER,
	SAVE_DATA_CRONO,
	SAVE_DATA_USER_OK,
	SAVE_DATA_CRONO_OK,
	RENT_ACTIVE,
	FETCH_SUCCESS_RENT,
	FETCH_SUCCESS_RENT_PP,
	RENT_ACTIVE_PP,
	FETCH_FAILD_RENT_PP,
	FETCH_NULL_USERR,
	GET_FALLAS,
	FETCH_SUCCESS_FAllAS,
	VALIDATE_USER_RENTA,
	FETCH_SUCCESS_USERR,
	ADD_CLAVE_BICICLETERO,
	ADD_LATLNG_ESTACION,
	FETCH_FAILD_RENT,
	VALIDATE_HORARIOS_EMPRESA,
	FETCH_SUCCESS_HORARIOS,
	RESERVE_ACTIVE,
	FETCH_SUCCESS_RESERVE,
	FETCH_FAILD_RESERVE,
	ADD_VEHICULOS_ESTACION,
	VIEW_PENALIZATION,
	REGISTER_PENALIZATION,
	CALCULATE_DIST,
	RESULT_COORDENADAS,
	GET_ESTACIONES,
	FETCH_ESTACIONES_EMPRESA,
	GET_VEHICULOS_ESTACION,
	FETCH_VEHICULOS_ESTACION,
	SAVE_RESERVA_BC,
	SAVE_RESERVA_OK,
	CHANGE_VEHICULO_ESTADO,
	VALIDATE_USER_REGISTER,
	VERIFICAR_REGISTRO_FINALIZADO,
	SAVE_PENALIZATION_BC,
	SAVE_PENALIZATION_OK,
	CHANGE_VEHICULO_RESERVA,
	CHANGE_VEHICULO_ESTADO_OK,
	SAVE_PRESTAMO_BC,
	SAVE_PRESTAMO_OK,
	CHANGE_ESTADO_RESERVA_BC,
	CHANGE_ESTADO_RESERVA_OK,
	CHANGE_ESTADO_PRESTAMO_BC,
	CHANGE_ESTADO_PRESTAMO_OK,
	CHANGE_ESTADO_PRESTAMO_RIDE,
	CHANGE_ESTADO_PRESTAMO_RIDE_OK,
	SAVE_HIST_CLAVES_BC,
	SAVE_HIST_CLAVES_OK,
	SAVE_COMENTARIO_BC,
	SAVE_COMENTARIO_OK,
	SAVE_PUNTOS_BC,
	SAVE_PUNTOS_BC_SINUSUARIO,
	RESTAR_PUNTOS_BC,
	SAVE_PUNTOS_OK,
	CHANGE_CLAVE_BC,
	CHANGE_CLAVE_OK,
	SAVE_TIME_REST,
	RESERVA_VENCIDA,
	GET_TYPE_VP,
	GET_TYPE_VP_OK,
	SAVE_VP_USUARIO,
	SAVE_VP_USUARIO_OK,
	GET_MY_VEHICLES,
	GET_MY_VEHICLES_OK,
	VALIDATE_VEHICLE,
	VALIDATE_VEHICLE_OK,
	SAVE_VP_VIAJE,
	SAVE_VP_VIAJE_OK,
	SAVE_VP_VIAJE_FAILURE,
	VALIDATE_VEHICLE_SINMYSQL,
	VALIDATE_VEHICLE_SINMYSQL_OK,
	REINICIAR_QR,
	REINICIAR_QR_OK,
	DECREMENT_SEG,
	DECREMENT_SEG_OK,
	CHANGE_VEHICULO_RESERVA_OK,
	RESETEO_CAMBIO_VEHICULO,
	RESETEO_CAMBIO_VEHICULO_RESERVA,
	SAVE_STATE_BICICLETERO,
	SAVE_STATE_BICICLETERO_OK,
	ADD_DISTANCIA_RENTA,
	ADD_VEHICULO_RESERVA,
	SAVE_VEHICLE_SELECT,
	SAVE_VEHICLE_SELECT_OK,
	VERIFY_TRIP_ACTIVE_VP,
	VERIFY_TRIP_ACTIVE_VP_CACHE,
	VERIFY_TRIP_ACTIVE_VP_OK,
	RESTART_VP_VIAJE,
	RESTART_VP_VIAJE_OK,
	TRIP_END_VP,
	TRIP_END_VP_OK,
	SAVE_CRONO_RENTA,
	VERIFICAR_RECORRIDO,
	VERIFICAR_RECORRIDO_OK,
	VERIFICAR_RECORRIDO_VACIO,
	VERIFICAR_RECORRIDO_UNDEFINED,
	ACT_DIRECCION,
	VERIFICAR_ESTADO_USER_3G,
	BUSCAR_PUNTOS,
	BUSCAR_PUNTOS_TOTAL,
	MIS_VIAJES,
	MIS_VIAJES_TOTAL,
	MIS_VIAJES_KMS,
	SUBIR_FOTO_VP,
	SAVE_COMENTARIO_VP,
	SAVE_COMENTARIOS_VP_OK,
	START_TRIP_BACKGROUND,
	SUBIR_FOTO_AVION,
	SAVE_VP_VIAJE_AVION,
	FETCH_ERROR_RENT,
	SAGA_CANCELLED,
	GET_VEHYCLE_ID,
	GET_VEHYCLE_ID_FETCH,
	INDICADORES_TRIP,
	GET_EMPRESAS,
	GET_EMPRESAS_OK,
	CALIFICACION_EXITOSA,
	RESET_APP,
	RESET_APP_OK,
	COMPLETAR_PROGRESO_LOGRO,
	SAVE_REGISTRO_PP,
	SAVE_REGISTRO_PP_OK,
	BICICLETA_YA_PRESTADA,
	VALIDATE_BIKE_AVAILABILITY,
	VALIDATE_BIKE_AVAILABILITY_OK,
	FINALIZAR_VIAJE_3G,
	FINALIZAR_VIAJE_3G_OK
} from '../types/G3types'
import { all, call, put, select, takeEvery, takeLatest, delay, cancel } from 'redux-saga/effects'
import { getItem } from '../Services/storage.service';
import { api } from '../api/api3g.service';
import { apiservice } from '../api/api.service';
import { v4 as uuidv4 } from 'uuid';
import * as RootNavigation from '../RootNavigation';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bleManager = new BleManager();
////////////////////////////////////////////////////////////////calculando cuenta regresiva
function* save_register_ext_3g(action) {
	let dataUser = action.dataRext;
	let saveUser = yield api.guardandoRegistroExt('bc_usuarios/registrar', dataUser);
	if (!saveUser.error) {
		yield put({ type: SAVE_REGISTER_EXT_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(saveUser.error))
	}
}
function* save_register_ext() {
	yield takeLatest(SAVE_REGISTER_EXT, save_register_ext_3g);
}
////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
function* saveDataUser_Global(action) {
	console.log('funciona la saga rrrrrrrrrrrrrrrrrrrrrrrrrrr', action);
	yield put({ type: SAVE_DATA_USER_OK, payload: action.data });
}
function* saveDataUserGlobal() {
	yield takeLatest(SAVE_DATA_USER, saveDataUser_Global);
}
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
function* saveDataCrono_Global(action) {
	yield put({ type: SAVE_DATA_CRONO_OK, payload: action.data });
}
function* saveDataCronoGlobal() {
	yield takeLatest(SAVE_DATA_CRONO, saveDataCrono_Global);
}
///////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////bc_estaciones
function* viewRentActive3g(action) {
	let user = yield getItem('user');
	if (!user) {
		console.log('Usuario no encontrado en storage');
		return;
	}
	console.log('USUARIO', user.idNumber)
	if (user.idNumber) {
		let cc = action.cc;
		let tabla = 'bc_prestamos/prestamoActivo'
		let rent = yield api.get_tabla_cc_sinid(tabla, user.idNumber);
		//console.log('RENTA :::::::::::::::::::::::::::', rent);
		if (rent && !rent.error) {
			if (rent.data.length === 1) {
				//Para cronometro cuando viaje en progreso
				let fechaInicioRenta = rent.data[0].pre_retiro_fecha;
				console.log('la fecha de inicio de renta ::::', fechaInicioRenta)
				const fechaInicio = new Date(fechaInicioRenta).getTime();
				const now = new Date().getTime();
				const tiempo = Math.floor(now - fechaInicio);
				const days = Math.floor(tiempo / (24 * 60 * 60 * 1000));
				const hours = Math.floor((tiempo % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
				const minutes = Math.floor((tiempo % (60 * 60 * 1000)) / (1000 * 60));
				const seconds = Math.floor((tiempo % (60 * 1000)) / (1000));

				console.log('Tiempo transcurrido desde la renta', days, hours, minutes, seconds)
				//Tiempo transcurrido desde la renta 38965 19 8 53
				const tiempoTranscurrido = { "diasR": days, "horasR": hours, "minutosR": minutes, "segundosR": seconds }
				yield put({ type: SAVE_CRONO_RENTA, payload: tiempoTranscurrido });
				//////////////////////////////////////////

				let estacion = rent.data[0].pre_retiro_estacion;
				let vehiculo = rent.data[0].pre_bicicleta;
				let clave = yield api.viewKeyBicicletero('bc_bicicleteros/estacion', estacion, vehiculo);
				let verEstacion = yield api.viewEstacion('bc_estaciones/nombre', estacion);

				let numVehiculos = yield api.viewBicy('bc_bicicletas/id', vehiculo);
				yield put({ type: ADD_CLAVE_BICICLETERO, payload: clave.data[0].bro_clave, estacion: estacion, vehiculo: numVehiculos.data.bic_numero, descripcionVehiculo: numVehiculos.data.bic_descripcion });
				yield put({ type: ADD_LATLNG_ESTACION, payload: verEstacion });
				yield put({ type: FETCH_SUCCESS_RENT, payload: rent });

				let distanciaRenta = verEstacion.data[0].est_horario;
				console.log('la distancia para la renta: ::::::', distanciaRenta);
				yield put({ type: ADD_DISTANCIA_RENTA, payload: distanciaRenta });//cargar en state global la distancia para renta
			} else if (rent.data.length > 1) {
				Alert.alert('Tienes un error en el último viaje, comunícate con soporte.');
				yield put({ type: FETCH_ERROR_RENT, payload: rent });
			} else {
				yield put({ type: FETCH_FAILD_RENT })
			}

		} else {
			console.log('ERROR DE LA SAGA 3G:')
		}
	} else {
		console.log('Usuario no ha iniciado sesión')
	}
}
function* viewRentActive() {
	yield takeLatest(RENT_ACTIVE, viewRentActive3g);
}

///RENTAS ACIVAS PP
/////////////////////////////////////////////////////////////bc_estaciones
function* viewRentActive3gPP(action) {
	let user = yield getItem('user');
	if (!user) {
		console.log('Usuario no encontrado en storage');
		return;
	}
	console.log('USUARIO', user.idNumber)
	if (user.idNumber) {
		let cc = action.cc;
		let tabla = 'bc_prestamos/prestamoActivoPP'
		let rent = yield api.get_tabla_cc_sinid(tabla, user.idNumber);
		console.log('RENTA PP:::::::::::::::::::::::::::', rent);
		if (rent && !rent.error) {
			if (rent.data.length === 1) {
				yield put({ type: FETCH_SUCCESS_RENT_PP, payload: rent });
			} else if (rent.data.length > 1) {
				Alert.alert('Tienes un error en el último viaje, comunícate con soporte.');
				yield put({ type: FETCH_ERROR_RENT, payload: rent });
			} else {
				yield put({ type: FETCH_FAILD_RENT })
			}

		} else {
			console.log('ERROR DE LA SAGA 3G:')
		}
	} else {
		console.log('Usuario no ha iniciado sesión')
	}
}
function* viewRentActivePP() {
	yield takeLatest(RENT_ACTIVE_PP, viewRentActive3gPP);
}


////////////////////////////////////////////////////////////
function* viewFallasNow() {
	let tabla = 'bc_fallas'
	let fallas = yield api.getFallas(tabla);
	if (!fallas.error) {
		yield put({ type: FETCH_SUCCESS_FAllAS, payload: fallas });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(fallas.error))
	}
}
function* viewFallas() {
	yield takeLatest(GET_FALLAS, viewFallasNow);
}
/////////////////////////////////////////////////////////////
function* validateUserNow(action) {
	console.log('data de user hoyyyyyyyyy', action)
	let cc = action.cc;
	let tabla = 'bc_usuarios'
	let user = yield api.get_tabla_cc(tabla, cc);
	console.log('EL USER QUE ESTADO TIENE? :::::::::USER::::::', user);
	if (!user.error) {
		if (user.data !== null) {
			yield put({ type: FETCH_SUCCESS_USERR, payload: user });
		} else {
			yield put({ type: FETCH_NULL_USERR });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(user.error))
	}
}
function* validateUser() {
	yield takeLatest(VALIDATE_USER_RENTA, validateUserNow);
}
//////////////////////////////////////////////////////////////
function* validateHorariosEmpresa(action) {
	let empresa = action.empresa;
	let tabla = 'bc_horarios/empresa'
	let horarios = yield api.validationHorarios(tabla, empresa);
	console.log('horaRIOS:::', horarios)
	if (!horarios.error) {
		yield put({ type: FETCH_SUCCESS_HORARIOS, payload: horarios });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(horarios.error))
	}
}
function* validateHorarios() {
	yield takeLatest(VALIDATE_HORARIOS_EMPRESA, validateHorariosEmpresa);
}
/////////////////////////////////////////////////////////////////calculando cuneta regresiva
function* reserveActive3g(action) {
	let cc = action.cc;
	let tabla = 'bc_reservas/usuario'
	let reserva = yield api.get_tabla_cc_sinid(tabla, cc);
	if (reserva && !reserva.error) {
		if (reserva.data.length === 1) {

			let fechaInicio = reserva.data[0].res_fecha_inicio;  // Ej: "2025-05-21"
			let horaFin = reserva.data[0].res_hora_fin;          // Ej: "18:00:00"
			let horaInicio = reserva.data[0].res_hora_inicio;    // Opcional, si la necesitas

			// Combinar fecha + hora para tener fecha completa de vencimiento
			let fechaHoraFin = new Date(`${fechaInicio}T${horaFin}`); // "2025-05-21T18:00:00"
			let ahora = new Date(); // Hora actual

			let tiempoRestante = fechaHoraFin.getTime() - ahora.getTime();

			const days = Math.floor(tiempoRestante / (24 * 60 * 60 * 1000));
			const hours = Math.floor((tiempoRestante % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
			const minutes = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (1000 * 60));
			const seconds = Math.floor((tiempoRestante % (60 * 1000)) / 1000);

			if (tiempoRestante < 0) {
				//console.log('SE VENCIO EN TIEMPO DE LA RESERVA DESDE LA SAGA');
				//setState({ ...state, reservaVencida: true})
				//cambiarEstadoReserva('VENCIDA', props.dataRent.reservas.data[0].res_id);
				yield put({ type: RESERVA_VENCIDA });
				//penal()

			} else {
				//console.log('RESERVA CON TIMEPPO PARA RENTAR DESDE LA SAGA', days, hours, minutes, seconds)
				const restante = { "diasR": days, "horasR": hours, "minutosR": minutes, "segundosR": seconds }
				yield put({ type: SAVE_TIME_REST, payload: restante });
			}

			let vehiculoReserva = reserva.data[0].res_bicicleta
			let numVehiculos = yield api.viewBicy('bc_bicicletas/id', vehiculoReserva);
			console.log('numVehiculo', numVehiculos);
			yield put({ type: ADD_VEHICULO_RESERVA, payload: numVehiculos.data.bic_numero, data: numVehiculos.data });

			let estacion = reserva.data[0].res_estacion;

			let verVehiculos = yield api.validationVerVehiculos('bc_bicicletas/estacion', estacion);
			let verEstacion = yield api.viewEstacion('bc_estaciones/nombre', estacion)
			//console.log('data estacion mmmmmmm: ::::::', verEstacion);
			let distanciaRenta = verEstacion.data[0].est_horario;
			//console.log('la distancia para la renta: ::::::', distanciaRenta);
			yield put({ type: ADD_DISTANCIA_RENTA, payload: distanciaRenta });//cargar en state global la distancia para renta
			yield put({ type: ADD_VEHICULOS_ESTACION, payload: verVehiculos });
			yield put({ type: ADD_LATLNG_ESTACION, payload: verEstacion });
			yield put({ type: FETCH_SUCCESS_RESERVE, payload: reserva, tiempoRestante: verEstacion.data[0].est_last_conect });
		} else {
			yield put({ type: FETCH_FAILD_RESERVE });
		}

	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(reserva.error))
	}
}
function* reserveActive() {
	yield takeLatest(RESERVE_ACTIVE, reserveActive3g);
}
/////////////////////////////////////////////////////////////////
function* viewPenalizations3g(action) {
	let cc = action.cc;
	let tabla = 'bc_penalizaciones/usuario'
	let penalizaciones = yield api.get_tabla_cc_sinid(tabla, cc);
	if (penalizaciones && !penalizaciones.error) {
		yield put({ type: REGISTER_PENALIZATION, payload: penalizaciones.data.length });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(penalizaciones.error))
	}
}
function* viewPenalizations() {
	yield takeLatest(VIEW_PENALIZATION, viewPenalizations3g);
}
////////////////////////////////////////////////////////////////////////////////

function* calcularDistanciaCoord(action) {
	let coor = action.coordenadas;
	// Convertir todas las coordenadas a radianes
	const lat1 = (coor.lat1);
	const lon1 = (coor.lng1);
	const lat2 = (coor.lat2);
	const lon2 = (coor.lng2);
	// Aplicar fórmula

	const R = 6371; // Radio de la Tierra en km
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = (R * c) * 1000; // Distancia en km
	/*const radioTierra = 6371;
	const diferenciaLon = (lon2 - lon1);
	const diferenciaLat = (lat2 - lat1);
    
	let a = Math.pow(Math.sin(diferenciaLat / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaLon / 2.0), 2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let result = (radioTierra * c);
	*/

	//console.log('RESULT CAL DISTANCIA', distance);
	yield put({ type: RESULT_COORDENADAS, payload: Math.floor(distance) });
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}

function* calcularDistancia() {
	yield takeLatest(CALCULATE_DIST, calcularDistanciaCoord);
}
///////////////sagas para reservas/////////////////////
function* verEstacionesEmpresa3g(action) {
	let empresa = action.empresa;
	let tabla = 'bc_estaciones/empresa'
	let estaciones = yield api.viewEstacionEmpresa(tabla, empresa);
	console.log('estaciones en la saga', estaciones);
	if (!estaciones.error) {
		yield put({ type: FETCH_ESTACIONES_EMPRESA, payload: estaciones });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(estaciones.error))
	}
}
function* verEstacionesEmpresa() {
	yield takeLatest(GET_ESTACIONES, verEstacionesEmpresa3g);
}
////////////////////////////////////////////////////////////////
function* viewVehiculoEstacion3g(action) {
	let estacion = action.estacion;
	//let tabla = 'bc_bicicletas/estacion'
	let tabla = 'bc_bicicletas/flota'
	let vehiculo = yield api.viewVehiculosEst(tabla, estacion);
	console.log('vehiculos kkkkk', vehiculo);
	if (!vehiculo.error) {
		yield put({ type: FETCH_VEHICULOS_ESTACION, payload: vehiculo });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(vehiculo.error))
	}
}
function* viewVehiculoEstacion() {
	yield takeLatest(GET_VEHICULOS_ESTACION, viewVehiculoEstacion3g);
}
////////////////////////////////////////////////////////////////calculando cuenta regresiva
function* saveReservaBC3g(action) {
	let user = yield getItem('user');
	console.log('USUARIO', user.idNumber)
	let data = action.data;
	let tabla = 'bc_reservas/registrar';
	let data2 = {
		"bic_id": data.res_bicicleta,
		"bic_estado": 'RESERVADA'
	}
	let tabla2 = 'bc_bicicletas/updateEstado';

	let reserva = yield api.guardandoReserva(tabla, data);
	console.log('QUE TRAE CUANDO RESERVO ==============>>>>>>>>>>>>>>', reserva);

	let data_temp = {
		"duracion": action.duracion,
		"bici": action.bici,
		"res_usuario": user.idNumber
	}

	let temporizador = yield api.temporizadorReserva('bc_reservas/temporizador', data_temp);
	console.log('inicio temporizador desde la saga', temporizador);

	if (!reserva.error) {
		if (reserva === 'ok') {
			console.log('la reserva se guardo OK despues de IF que es tiene respuesta OK');

			let cambio = yield api.changeVehiculo(tabla2, data2);
			console.log('QUE TRAE CUANDO CAMBIO BICI ==============>>>>>>>>>>>>>>', cambio)
			if (cambio === 'ok') {
				yield put({ type: SAVE_RESERVA_OK });

				let fechaVencimiento = action.fecha;
				console.log('la fecha de vencimiento desde SAGAes ::::', fechaVencimiento)
				const fechaLimite = new Date(fechaVencimiento).getTime();

				const now = new Date().getTime();
				const tiempo = Math.floor(fechaLimite - now);
				const days = Math.floor(tiempo / (24 * 60 * 60 * 1000));
				const hours = Math.floor((tiempo % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
				const minutes = Math.floor((tiempo % (60 * 60 * 1000)) / (1000 * 60));
				const seconds = Math.floor((tiempo % (60 * 1000)) / (1000));

				if (tiempo < 0) {
					console.log('SE VENCIO EN TIEMPO DE LA RESERVA DESDE LA SAGA');
					//setState({ ...state, reservaVencida: true})
					//cambiarEstadoReserva('VENCIDA', props.dataRent.reservas.data[0].res_id);
					//penal()

				} else {
					console.log('RESERVA CON TIMEPPO PARA RENTAR DESDE LA SAGA', days, hours, minutes, seconds)
					const restante = { diasR: days, horasR: hours, minutosR: minutes, segundosR: seconds }
					yield put({ type: SAVE_TIME_REST, payload: restante });
				}
			}
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(reserva.error))
	}
}
function* saveReservaBC() {
	yield takeLatest(SAVE_RESERVA_BC, saveReservaBC3g);
}
////////////////////////////////////////////////////////////////
function* changeVehiculoEstado3g(action) {
	let data = action.data;
	let tabla = 'bc_bicicletas/updateEstado';
	let cambiov = yield api.changeVehiculo(tabla, data);
	if (!cambiov.error) {
		yield put({ type: CHANGE_VEHICULO_ESTADO_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(cambiov.error))
	}
}
function* changeVehiculoEstado() {
	yield takeLatest(CHANGE_VEHICULO_ESTADO, changeVehiculoEstado3g);
}
////////////////////////////////////////////////////////////////
function* validateRegisterEnd3g(action) {
	let cc = action.cc;
	let tabla = 'bc_usuarios';
	let register = yield api.get_tabla_cc(tabla, cc);
	console.log('mostrando la data del usuario ::: desde HOME :::', register);
	if (!register.error) {
		if (register.data !== null) {
			yield put({ type: VERIFICAR_REGISTRO_FINALIZADO, payload: register });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(register.error))
	}
}
function* validateRegisterEnd() {
	yield takeLatest(VALIDATE_USER_REGISTER, validateRegisterEnd3g);
}
////////////////////////////////////////////////////////////////
function* savePenalizateBC3g(action) {
	let data = action.data;
	let tabla = 'bc_penalizaciones/registrar';
	let data2 = {
		"bic_id": action.vehiculo,
		"bic_estado": 'VENCIDA'
	}
	let tabla2 = 'bc_bicicletas/updateEstado';
	let data3 = {
		"res_id": action.reservaId,
		"estado": 'VENCIDA'
	}
	let tabla3 = 'bc_reservas/updateEstado';

	let penalizacion = yield api.guardandoPenalizacion(tabla, data);
	if (!penalizacion.error) {
		if (penalizacion === 'ok') {
			let cambioVehiculo = yield api.changeVehiculo(tabla2, data2);
			let cambioReserva = yield api.changeEstadoReserva(tabla3, data3);
			yield put({ type: SAVE_PENALIZATION_OK });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(penalizacion.error))
	}
}
function* savePenalizateBC() {
	yield takeLatest(SAVE_PENALIZATION_BC, savePenalizateBC3g);
}
////////////////////////////////////////////////////////////////
function* changeVehicleResrve3g(action) {
	let data = action.data;
	let tabla = 'bc_reservas/updateVehiculo';
	let tabla2 = 'bc_reservas/usuario';
	let changeVeh = yield api.cambiarVehiculoReserva(tabla, data);
	if (!changeVeh.error) {
		let tabla3 = 'bc_bicicletas/updateEstado';
		let data3 = {
			"bic_id": action.veh,
			"bic_estado": 'RESERVADA'
		}
		let cambio = yield api.changeVehiculo(tabla3, data3);
		let reserva = yield api.validationReserve(tabla2, action.doc);
		console.log('la data de la reserva :::::', reserva);
		console.log('el tamaño de la reserva', reserva.data.length);
		yield put({ type: CHANGE_VEHICULO_RESERVA_OK });
		if (!reserva.data.length === 1) {
			yield put({ type: FETCH_SUCCESS_RESERVE, payload: reserva });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(changeVeh.error))
	}
}
function* changeVehicleResrve() {
	yield takeLatest(CHANGE_VEHICULO_RESERVA, changeVehicleResrve3g);
}
////////////////////////////////////////////////////////////////
function* savePrestamoBC3g(action) {
	let data = action.data;
	let tabla = 'bc_prestamos/registrar';

	console.log('DATA PARA PRESTAMO:::::', data);

	let prestamo = yield api.guardandoPrestamo(tabla, data);
	console.log('PRESTAMO:::::', prestamo);

	if (prestamo.response) {
		if (prestamo.response.status === 200) {
			console.log('El PRESTAMO SE guardo OKOKOKOK', prestamo);

			//agregar preoperacional
			let user = yield getItem('user');
			let preoperacionales = yield select((state) => state.reducerPerfil.form_preoperacional);

			let tabla = 'bc_prestamos/prestamoActivo'
			let rentID = yield api.get_tabla_cc_sinid(tabla, user.idNumber);

			console.log('la renta ya guardada', rentID);

			let formPre = {
				"id": new Date().getTime(),
				"usuario": user.idNumber,
				"idViaje": rentID.data[0].pre_id,
				"modulo": '3G-4G',
				"respuestas": preoperacionales.respuestas,
				"comentario": preoperacionales.comentario
			}
			console.log('ANtes de guardar preoperacional', formPre)
			//Acá agregamos el registro de preoperacional
			let preoperacional = yield api.guardandoPreoperacionales('bc_preoperacionales/registrar', formPre);
			console.log('UUUUU la respuesta de preoperacionales al guaradr', preoperacional)

			let estacion = action.estacion;
			let vehiculo = action.vehiculo;
			let clave = yield api.viewKeyBicicletero('bc_bicicleteros/estacion', estacion, vehiculo);
			console.log('clave de bicicletero', clave);
			//let verEstacion = yield api.viewEstacion('bc_estaciones/nombre', estacion);
			let numVehiculos = yield api.viewBicy('bc_bicicletas/id', vehiculo);
			console.log('numVehiculo  KKKK', numVehiculos);
			console.log('numVehiculo  KKKK descripcion', numVehiculos.data.bic_descripcion);
			console.log('FECHA VVVVENVVVVIIMIENTO', action.fechavence);
			yield put({ type: ADD_CLAVE_BICICLETERO, payload: clave.data[0].bro_clave, estacion: estacion, vehiculo: numVehiculos.data.bic_numero, descripcionVehiculo: numVehiculos.data.bic_descripcion, fechaVence: action.fechavence });
			//yield put({ type: ADD_LATLNG_ESTACION, payload: verEstacion });
			let data2 = {
				"bic_id": action.vehiculo,
				"bic_estado": 'PRESTADA'
			};
			let tabla2 = 'bc_bicicletas/updateEstado';
			let cambioVehiculo = yield api.changeVehiculo(tabla2, data2);

			if (action.reservaId !== 'sinreserva') {
				let data3 = {
					"res_id": action.reservaId,
					"estado": 'FINALIZADA'
				};
				let tabla3 = 'bc_reservas/updateEstado';
				let cambioReserva = yield api.changeEstadoReserva(tabla3, data3);
			}

			if (cambioVehiculo === 'ok') {
				yield put({ type: SAVE_PRESTAMO_OK });
				console.log('se guardo el prestamo OK')
			}
		} else {
			// ❌ otro error
		}
	} else if (prestamo.error) {
		if (prestamo.error.status === 409 && !prestamo.error.body.success) {
			// ⚠️ usuario ya tiene préstamo
			Alert.alert(prestamo.error.body.message);
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(prestamo.error))
	}
}
function* savePrestamoBC() {
	yield takeLatest(SAVE_PRESTAMO_BC, savePrestamoBC3g);
}
////////////////////////////////////////////////////////////////
// Validar disponibilidad de bicicleta antes de seleccionar
function* validateBikeAvailability3g(action) {
	const bicicletaId = action.bicicletaId;
	console.log('Validando disponibilidad de bicicleta:', bicicletaId);

	try {
		// Obtener préstamos activos
		let prestamosActivos = yield api.get__('bc_prestamos/prestamoActivos');
		console.log('Préstamos activos:', prestamosActivos);

		// Verificar si la bicicleta ya está prestada
		const bicicletaYaPrestada = prestamosActivos.data?.some(
			prestamo => prestamo.pre_bicicleta === bicicletaId
		);

		// Enviar resultado al reducer
		yield put({
			type: VALIDATE_BIKE_AVAILABILITY_OK,
			payload: bicicletaYaPrestada
		});
	} catch (error) {
		console.log('Error al validar disponibilidad de bicicleta:', error);
		// En caso de error, asumimos que está disponible
		yield put({
			type: VALIDATE_BIKE_AVAILABILITY_OK,
			payload: false
		});
	}
}
function* validateBikeAvailability() {
	yield takeLatest(VALIDATE_BIKE_AVAILABILITY, validateBikeAvailability3g);
}
////////////////////////////////////////////////////////////////
function* changeReservaBc3g(action) {
	let data = action.data;
	let tabla = 'bc_reservas/updateEstado';
	let data2 = {
		"bic_id": action.vehiculo,
		"bic_estado": 'DISPONIBLE'
	}
	let tabla2 = 'bc_bicicletas/updateEstado';
	let cambioEstadoReserva = yield api.changeEstadoReserva(tabla, data);
	if (!cambioEstadoReserva.error) {
		let cambio = yield api.changeVehiculo(tabla2, data2);
		if (cambio === 'ok') {
			yield put({ type: CHANGE_ESTADO_RESERVA_OK });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(cambioEstadoReserva.error))
	}
}
function* changeReservaBc() {
	yield takeLatest(CHANGE_ESTADO_RESERVA_BC, changeReservaBc3g);
}
////////////////////////////////////////////////////////////////////
function* finalizarViaje3gSaga(action) {
	try {
		const {
			pre_id,
			pre_devolucion_fecha,
			vehiculo,
			estadoV,
			historialClaves,
			comentario,
			puntos,
			claveData
		} = action.data;

		console.log('🏁 Iniciando proceso atómico de finalización 3G para préstamo:', pre_id);

		// 1. Cambiar estado del préstamo
		const tablaPrestamo = 'bc_prestamos/' + pre_id;
		const dataPrestamo = {
			pre_id: pre_id,
			pre_devolucion_fecha: pre_devolucion_fecha,
			pre_duracion: '0',
			pre_estado: 'FINALIZADA',
			...(action.nuevaEstacion ? { pre_devolucion_estacion: action.nuevaEstacion } : {})
		};
		const resPrestamo = yield call(api.patchEstadoPrestamo, tablaPrestamo, dataPrestamo);
		if (resPrestamo.error) throw new Error('Error al finalizar el préstamo: ' + JSON.stringify(resPrestamo.error));

		// 2. Cambiar estado del vehículo
		const tablaVehiculo = 'bc_bicicletas/updateEstado';
		const dataVehiculo = {
			bic_id: vehiculo,
			bic_estado: estadoV
		};
		const resVehiculo = yield call(api.changeVehiculo, tablaVehiculo, dataVehiculo);
		if (resVehiculo !== 'ok') throw new Error('Error al actualizar estado del vehículo');

		// 3. Guardar historial de claves (si aplica)
		if (historialClaves) {
			const resHist = yield call(api.saveHistorialClaves_, 'bc_historial_claves/registrar', historialClaves);
			if (resHist.error) throw new Error('Error al guardar historial de claves');
		}

		// 4. Guardar comentario
		if (comentario) {
			const resCom = yield call(api.saveComentarios, 'bc_comentarios_rentas/registrar', comentario);
			if (resCom.error) throw new Error('Error al guardar comentario');
		}

		// 5. Guardar puntos
		if (puntos) {
			const resPuntos = yield call(api.savePuntos, 'bc_puntos/registrar', puntos);
			if (resPuntos.error) throw new Error('Error al guardar puntos');
		}

		// 6. Cambiar clave del bicicletero (Crucial)
		if (claveData) {
			const resClave = yield call(api.changeClave, 'bc_bicicleteros/changeKey', claveData);
			if (resClave.error) throw new Error('Error al cambiar la clave del bicicletero');
		}

		// Si todo salió bien
		yield put({ type: FINALIZAR_VIAJE_3G_OK });
		yield put({ type: CHANGE_ESTADO_PRESTAMO_OK }); // Mantener compatibilidad con reducers actuales

		console.log('✅ Finalización 3G completada exitosamente');

	} catch (error) {
		console.log('❌ ERROR EN finalizarViaje3gSaga:', error.message);
		const errorMessage = typeof error === 'string' ? error : error.message;
		Alert.alert('Error al finalizar viaje', errorMessage || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.');
		yield put({ type: FETCH_ERROR_RENT, error: errorMessage });
	}
}

function* watchFinalizarViaje3g() {
	yield takeLatest(FINALIZAR_VIAJE_3G, finalizarViaje3gSaga);
}

////////////////////////////////////////////////////////////////////
function* changePrestamoBc3g(action) {
	let data = action.data;
	let tabla = 'bc_prestamos/updateEstado';
	let data2 = {
		"bic_id": action.vehiculo,
		"bic_estado": action.estadoV
	}
	let tabla2 = 'bc_bicicletas/updateEstado';
	let cambioEstadoPrestamo = yield api.changeEstadoPrestamo(tabla, data);
	if (!cambioEstadoPrestamo.error) {
		let cambio = yield api.changeVehiculo(tabla2, data2);
		if (cambio === 'ok') {
			yield put({ type: CHANGE_ESTADO_PRESTAMO_OK });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(cambioEstadoPrestamo.error))
	}
}
function* changePrestamoBc() {
	yield takeLatest(CHANGE_ESTADO_PRESTAMO_BC, changePrestamoBc3g);
}
////////////////////////////////////////////////////////////////////
function* changePrestamoRide3g(action) {
	let data = action.data;
	let tabla = 'bc_prestamos/' + action.data.pre_id;
	let data2 = {
		"bic_id": action.vehiculo,
		"bic_estacion": action.nuevaEstacion,
		"bic_estado": action.estadoV
	}
	let tabla2 = 'bc_bicicletas/updateEstado';
	let cambioEstadoPrestamo = yield api.patchEstadoPrestamo(tabla, data);
	if (!cambioEstadoPrestamo.error) {
		let cambio = yield api.changeVehiculo(tabla2, data2);
		if (cambio === 'ok') {
			yield put({ type: CHANGE_ESTADO_PRESTAMO_OK });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(cambioEstadoPrestamo.error))
	}
}
function* changePrestamoRide() {
	yield takeLatest(CHANGE_ESTADO_PRESTAMO_RIDE, changePrestamoRide3g);
}
////////////////////////////////////////////////////////////////////
function* saveHistClavesBc3g(action) {
	let data = action.data;
	let tabla = 'bc_historial_claves/registrar';
	let saveClave = yield api.saveHistorialClaves_(tabla, data);
	console.log('saveClave:', saveClave); // Log para inspeccionar el retorno
	if (saveClave && !saveClave.error) {
		yield put({ type: SAVE_HIST_CLAVES_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(saveClave.error))
	}
}
function* saveHistClavesBc() {
	yield takeLatest(SAVE_HIST_CLAVES_BC, saveHistClavesBc3g);
}

function* cancelar_sagas__() {
	console.log('cancelando sagas');
	yield cancel();
}
function* cancelar_sagas() {
	yield takeLatest(SAGA_CANCELLED, cancelar_sagas__);
}
////////////////////////////////////////////////////////////////////
function* saveComentarioBc3g(action) {
	let data = action.data;
	let tabla = 'bc_comentarios_rentas/registrar';
	let saveComentario = yield api.saveComentarios(tabla, data);
	if (!saveComentario.error) {
		yield put({ type: SAVE_COMENTARIO_OK });

	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(saveComentario.error))
	}
}
function* saveComentarioBc() {
	yield takeLatest(SAVE_COMENTARIO_BC, saveComentarioBc3g);
}
////////////////////////////////////////////////////////////////////
function* savePuntosBc3g(action) {
	//let user = yield getItem('user');
	let data = action.data;
	let tabla = 'bc_puntos/registrar';
	let savePunto = yield api.savePuntos(tabla, data);
	if (!savePunto.error) {
		yield put({ type: SAVE_PUNTOS_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(savePunto.error))
	}
}
function* savePuntosBc() {
	yield takeLatest(SAVE_PUNTOS_BC, savePuntosBc3g);
}


////// puntos sin usuario
function* savePuntosBc3g__sinusuario(action) {
	const user = yield getItem('user');
	const datapun = {
		...action.data,
		"pun_usuario": user.idNumber
	};
	let tabla = 'bc_puntos/registrar';
	let savePunto = yield api.savePuntos(tabla, datapun);
	if (!savePunto.error) {
		yield put({ type: SAVE_PUNTOS_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(savePunto.error))
	}
}
function* savePuntosBc_sinusuario() {
	yield takeLatest(SAVE_PUNTOS_BC_SINUSUARIO, savePuntosBc3g__sinusuario);
}

//restar puntos
function* restarPuntosBc3g(action) {
	let user = yield getItem('user');
	let data = action.data;
	let tabla = 'bc_puntos/registrar';
	let savePunto = yield api.savePuntos(tabla, data);
	if (!savePunto.error) {
		yield put({ type: SAVE_PUNTOS_OK });
		yield api.correo_recompnesas('bc_puntos/correo_recompensas', user.email, action.data.pun_motivo);
		Alert.alert(
			'🎉 Recompensa',
			'¡Felicidades! Has obtenido una recompensa en RIDE. Revisa tu correo para más detalles. Nuestro equipo de soporte también se pondrá en contacto contigo para completar el proceso.'
		);
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(savePunto.error))
	}
}
function* restarPuntosBc() {
	yield takeLatest(RESTAR_PUNTOS_BC, restarPuntosBc3g);
}

function* save_comentarios_vp(action) {
	let data = action.data;
	let tabla = 'vp_comentarios/registrar';
	let savePunto = yield api.saveComentarios(tabla, data);
	if (!savePunto.error) {
		yield put({ type: SAVE_COMENTARIOS_VP_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(savePunto.error))
	}
}
function* saveComentarioVP() {
	yield takeLatest(SAVE_COMENTARIO_VP, save_comentarios_vp);
}
////////////////////////////////////////////////////////////////////
function* changeClaveBc3g(action) {
	let data = action.data;
	let tabla = 'bc_bicicleteros/changeKey';
	let cambioKey = yield api.changeClave(tabla, data);
	if (!cambioKey.error) {
		yield put({ type: CHANGE_CLAVE_OK });

	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(cambioKey.error))
	}
}
function* changeClaveBc() {
	yield takeLatest(CHANGE_CLAVE_BC, changeClaveBc3g);
}
////////////////////////////////////////////////////////////////////
//////////////  SAGAS VEHICULOS PARTICULARES   /////////////////////
////////////////////////////////////////////////////////////////////
function* get_tipos_v_p(action) {
	console.log('tipo v sagas')
	let tabla = 'vp_tipo_vehiculos';
	let tvp = yield api.get_tipo_vp(tabla);
	console.log('tipo v saga api', tvp)
	if (!tvp.error) {
		yield put({ type: GET_TYPE_VP_OK, payload: tvp });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(tvp.error))
	}
}
function* get_tipos() {
	yield takeLatest(GET_TYPE_VP, get_tipos_v_p);
}
//////////////////Guardar registro vp con foto////////////////////////
function* save_vp_usuario(action) {
	let data = action.data;
	let tabla = 'vp_vehiculos_usuario/registrar';

	const vpPhoto = yield select((state) => state.userReducer.documentUser);
	console.log('FOTO VEHICULO', vpPhoto)
	yield put({ type: SUBIR_FOTO_VP, eventImage: vpPhoto, data: data, tabla: tabla });
}

function* saveVPusuario() {
	yield takeLatest(SAVE_VP_USUARIO, save_vp_usuario);
}

function* uploadImageS3(image, table) {
	console.log('probando uploadImagenS3 _____unage', image);
	console.log('probando uploadImagenS3 _____tabla', table);
	const formData = new FormData();
	const fileName = Math.random()
		.toString(36)
		.slice(2);
	image = image[0]
	const file = {
		uri: image.uri,
		name: fileName + '.jpg',
		type: image.type ? image.type : "image/jpeg",
	};
	formData.append('image', file);
	const result = yield api.postImgFile(formData, table);
	console.log('Respuesta carga imagen local VP:', result);
	if (result && !result.error && result.imageUrl) {
		return result.imageUrl;
	}
	return null;
}

function* uploadEventImage(action) {
	console.log('llegando al uploadEventImagen VP', action)
	console.log('llegando al uploadEventImagen VPeventImage.assets', action.eventImage.assets)
	if (action.eventImage.assets) {
		console.log('entrando al IIIIIFFFFFFFFF ', action.eventImage.assets);
		//aca se rompe
		try {
			const s3Route = yield uploadImageS3(action.eventImage.assets, "vp_vehiculos_usuario");
			console.log('los que trae s3Route y enviar a save', s3Route)
			if (s3Route) {
				let newData = {
					...action.data,
					"vus_img": s3Route,
				}
				let regVP = yield api.saveVP(action.tabla, newData);
				if (!regVP.error) {
					if (regVP === 'ok') {
						yield put({ type: SAVE_VP_USUARIO_OK });
					}
				} else {
					console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(regVP.error))
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
}

function* uploadEventImageSaga() {
	yield takeLatest(SUBIR_FOTO_VP, uploadEventImage);
}
/////////////////////////////////////////////////////////////////////
function* get_myvehicles_v_p(action) {
	let data = action.data
	let tabla = 'vp_vehiculos_usuario/usuario';
	let mvp = yield api.get_my_vehicles_vp(tabla, data);
	if (!mvp.error) {
		yield put({ type: GET_MY_VEHICLES_OK, payload: mvp });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(mvp.error))
	}
}
function* get_myvehicles() {
	yield takeLatest(GET_MY_VEHICLES, get_myvehicles_v_p);
}
////////////////////////////////////////////////////////////////////
function* validata_vehicle_vp(action) {
	let cod = action.cod;
	let user = action.user;
	let tabla = 'vp_vehiculos_usuario';
	let resp = yield api.getValidateVehicleUser(tabla, cod, user);
	console.log('ACTION LA SAGA::: ', action);
	console.log('VALIDATION DESDE LA SAGA::: ', resp);
	if (!resp.error) {

		if (resp.data.length === 1) {
			yield put({ type: VALIDATE_VEHICLE_OK });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(resp.error))
	}
}
function* validata_vehicle() {
	yield takeLatest(VALIDATE_VEHICLE, validata_vehicle_vp);
}
///////////////////////////////////////////////////////////////////
function* save_vp_trip_user(action) {
	let data = action.data;
	let tabla = 'vp_viajes/registrar';
	console.log('La data para el viaje en la SAGA', data);
	let resp_trip = yield api.save_trip_vp(tabla, data);
	console.log('resp_trip:::::', resp_trip)
	if (resp_trip && !resp_trip.error) {
		yield put({ type: SAVE_VP_VIAJE_OK, payload: data });
	} else {
		console.log('ERROR DE LA SAGA GUARDANDO VIAJE: ', resp_trip?.error || 'Unknown error');
		yield put({ type: SAVE_VP_VIAJE_FAILURE });
	}
}
function* save_vp_trip() {
	yield takeLatest(SAVE_VP_VIAJE, save_vp_trip_user);
}
///////////////////////////////////////////////////////////////////
function* restart_vp_trip_vp() {
	yield put({ type: RESTART_VP_VIAJE_OK });
}
function* restart_vp_trip() {
	yield takeLatest(RESTART_VP_VIAJE, restart_vp_trip_vp);
}
///////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////
function* validarSin_Mysql() {
	yield put({ type: VALIDATE_VEHICLE_SINMYSQL_OK });
}
function* validarSinMysql() {
	yield takeLatest(VALIDATE_VEHICLE_SINMYSQL, validarSin_Mysql);
}
///////////////////////////////////////////////////////////////////
function* reiniciar_qr() {
	yield put({ type: REINICIAR_QR_OK });
}
function* reiniciarqr() {
	yield takeLatest(REINICIAR_QR, reiniciar_qr);
}
///////////////////////////////////////////////////////////////////
function* decrementar_Segundos(action) {
	yield put({ type: DECREMENT_SEG_OK, payload: action.seg });
}
function* decrementarSegundos() {
	yield takeLatest(DECREMENT_SEG, decrementar_Segundos);
}
///////////////////////////////////////////////////////////////////

function* reset_cambio_veh_reserva(action) {
	yield put({ type: RESETEO_CAMBIO_VEHICULO_RESERVA });
}
function* reset_cambio_veh() {
	yield takeLatest(RESETEO_CAMBIO_VEHICULO, reset_cambio_veh_reserva);
}
///////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
function* save_state_bicicletero_3g(action) {
	console.log('id del bicicletero en saga', action.id);
	yield put({ type: SAVE_STATE_BICICLETERO_OK, payload: action.id });
	//let bicicletero = yield api.viewKeyBicicletero('bc_bicicleteros/estacion', action.estacion, action.veh);
	/*if (!bicicletero.error) {
		console.log('id de la BICI::::', bicicletero)
		let idBicicletero = bicicletero.data[0].bro_id;
		yield put({ type: SAVE_STATE_BICICLETERO_OK, payload: idBicicletero});		
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(bicicletero.error))
	}*/
}
function* save_state_bicicletero() {
	yield takeLatest(SAVE_STATE_BICICLETERO, save_state_bicicletero_3g);
}
////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

function* save_veh_select(action) {
	yield put({ type: SAVE_VEHICLE_SELECT_OK, payload: action.veh });
	if (action.veh === 'avion') {
		RootNavigation.navigate('AvionScreen');
	} else {
		RootNavigation.navigate('StartTripScreen');
	}

}
function* save_veh_sel() {
	yield takeLatest(SAVE_VEHICLE_SELECT, save_veh_select);
}
///////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////bc_estaciones
function* verify_trip_active_vp(action) {
	let user = action.user;
	let tabla = 'vp_viajes/viajeActivo'
	let trip = yield api.validationTripActiveVP(tabla, user);
	console.log('trip active VP :::::::::::::::::::::::::::', trip);
	if (!trip.error) {
		if (trip.data.length === 1) {
			yield put({ type: VERIFY_TRIP_ACTIVE_VP_OK, payload: trip });
		} else {
			console.log('no tenemos viajes activos')
		}
	} else {
		console.log('ERROR DE LA SAGA 3G EN TRIP ACTIVE: ', trip.error)
	}
}
function* verify_trip_active() {
	yield takeLatest(VERIFY_TRIP_ACTIVE_VP, verify_trip_active_vp);
}

//en CACHE
function* verify_trip_active_vp_cache(action) {
	let trip = yield getItem('viajeVPactivo');
	console.log('trip active VP EN CACHE ::: CACHE :::', trip);
	if (trip === undefined) {
		console.log('viaje de vp indefinido no tenemos nada de viaje ');
	} else {
		if (!trip.error) {
			yield put({ type: VERIFY_TRIP_ACTIVE_VP_OK, payload: trip });
		} else {
			console.log('ERROR DE LA SAGA 3G EN TRIP ACTIVE: ', trip.error)
		}
	}
}
function* verify_trip_active_cache() {
	yield takeLatest(VERIFY_TRIP_ACTIVE_VP_CACHE, verify_trip_active_vp_cache);
}
////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
function* end_vp_trip_user(action) {
	let data = action.data;
	let tabla = 'vp_viajes/updateTrip';
	let end_trip = yield api.end_trip_vp(tabla, data);
	if (end_trip && !end_trip.error) {
		yield put({ type: TRIP_END_VP_OK });
	} else {
		console.log('ERROR DE LA SAGA FINALIZANDO VIAJE: ', end_trip?.error || 'Unknown error');
	}
}
function* end_vp_trip() {
	yield takeLatest(TRIP_END_VP, end_vp_trip_user);
}
///////////////////////////////////////////////////////////////////

function* verificar_recorrido_user(action) {
	let user = yield getItem('user');
	console.log('para buscar si user ingreso direccion :::: dir:::', user.idNumber)
	let tabla = 'bc_usuarios'
	let datamysql = yield api.get_tabla_cc(tabla, user.idNumber);

	if (!datamysql.error) {
		let estadoUser = datamysql.data.usu_habilitado;
		if (estadoUser === undefined) {
			yield put({ type: VERIFICAR_RECORRIDO_UNDEFINED });
		} else {
			yield put({ type: VERIFICAR_ESTADO_USER_3G, payload: estadoUser });
			if (datamysql.data.usu_recorrido !== '') {
				yield put({ type: VERIFICAR_RECORRIDO_OK });
			} else {
				yield put({ type: VERIFICAR_RECORRIDO_VACIO });
			}
		}

	} else {
		console.log('ERROR DE LA SAGA VERIFICANDO RECORRIDO: ', datamysql.error)
	}
}
function* verificar_recorrido() {
	yield takeLatest(VERIFICAR_RECORRIDO, verificar_recorrido_user);
}
///////////////////////////////////////////////////////////////////
function* act_recorrido_user(action) {
	let user = yield getItem('user');
	console.log('para buscar si user ingreso direccion', user.idNumber);
	let tabla = 'bc_usuarios';
	let data = action.data;
	console.log('la data para el patch recorrido ', data);
	let data_act = yield api.patch_recorrido(tabla, user.idNumber, data);
	console.log('se act el usu new data :', data_act)
	if (!data_act.error) {
		if (data_act.usu_recorrido !== '') {
			console.log('se act el usu new data :', data_act.usu_recorrido);
			Alert.alert(
				"Datos se actualizaron correctamente",
				":)",
				[
					{ text: "OK", onPress: () => console.log('ok') }
				]
			);
			yield put({ type: VERIFICAR_RECORRIDO_OK });

		} else {
			yield put({ type: VERIFICAR_RECORRIDO_VACIO });
		}
	} else {
		console.log('ERROR DE LA SAGA VERIFICANDO RECORRIDO: ', data_act.error)
	}
}
function* act_recorrido() {
	yield takeLatest(ACT_DIRECCION, act_recorrido_user);
}
///////////////////////////

function* buscar_puntos_mysql(action) {
	let user = yield getItem('user');
	let tabla = 'bc_puntos/usuario'
	let puntos = yield api.get_tabla_cc_sinid(tabla, user.idNumber);

	console.log('Estos son los puntos del usuarios ::::', puntos);
	if (!puntos.error) {
		let totalPuntos = 0;
		puntos.data.forEach((punto) => {
			totalPuntos = totalPuntos + Number(punto.pun_puntos);
		})
		yield put({ type: BUSCAR_PUNTOS_TOTAL, payload: totalPuntos });

	} else {
		console.log('ERROR DE LA SAGA VERIFICANDO RECORRIDO: ', puntos.error)
	}
}
function* buscar_puntos() {
	yield takeLatest(BUSCAR_PUNTOS, buscar_puntos_mysql);
}

///////////////////////////

function* mis_viajes_all(action) {
	let user = yield getItem('user');
	console.log('user _id: ' + user.id);

	// Viajes 3g, 4g y 5g unificados en bc_prestamos
	let tabla3G4G5G = 'bc_prestamos/prestamoUsuario';
	let viajesBC = yield api.get_tabla(tabla3G4G5G, user.idNumber);

	// Viajes vehiculo particulares
	let tablaVP = 'vp_viajes';
	let viajesVP = yield api.get_tabla_cc(tablaVP, user.idNumber);

	// Viajes carpooling
	let url_carpooling = 'compartidoViajeActivo/viajeTerminado';
	let viajeCarpooling = yield api.get_tabla(url_carpooling, user.idNumber);

	console.log('viajesBC (3G/4G/5G)', viajesBC);
	console.log('viajesVP', viajesVP);
	console.log('viajescarpooling', viajeCarpooling.data);

	if (!viajesVP.error && !viajesBC.error && !viajeCarpooling.error) {
		// Categorizar viajes de bc_prestamos por modulo
		const misViajes3G = viajesBC.data?.filter(v => v.pre_modulo === '3g' || v.pre_modulo === '') || [];
		const misViajes4G = viajesBC.data?.filter(v => v.pre_modulo === '4g') || [];
		const misViajes5G = viajesBC.data?.filter(v => v.pre_modulo === '5g') || [];

		yield put({
			type: MIS_VIAJES_TOTAL,
			payload: viajesVP.data.length,
			misviajesVP: viajesVP.data,
			cantidadV3g: misViajes3G.length,
			misViajes3G: misViajes3G,
			totalViajes4G: misViajes4G.length,
			misViajes4G: misViajes4G,
			totalViajes5G: misViajes5G.length,
			misViajes5G: misViajes5G,
			totalViajesCarpooling: viajeCarpooling.data.length,
			misViajesCarpooling: viajeCarpooling.data
		});

		let totalkms = 0;
		if (viajesVP.data) {
			viajesVP.data.forEach((viaje) => {
				totalkms = totalkms + Number(viaje.via_kilometros);
			});
		}
		yield put({ type: MIS_VIAJES_KMS, payload: totalkms });
	} else {
		const errorMsg = viajesVP.error || viajesBC.error || viajeCarpooling.error;
		console.log('ERROR DE LA SAGA VERIFICANDO VIAJES: ', JSON.stringify(errorMsg));
	}
}
function* mis_viajes() {
	yield takeLatest(MIS_VIAJES, mis_viajes_all);
}


//////////////////Guardar viaje vp con foto////////////////////////

function* save_viaje_vp_avion__(action) {
	let data = action.data;
	let tabla = 'vp_viajes/registrar';

	const vpPhoto = yield select((state) => state.reducer3G.ticketUser);
	console.log('FOTO VEHICULO', vpPhoto)
	yield put({ type: SUBIR_FOTO_AVION, eventImage: vpPhoto, data: data, tabla: tabla });
}

function* save_viaje_vp_avion() {
	yield takeLatest(SAVE_VP_VIAJE_AVION, save_viaje_vp_avion__);
}

function* save_foto_avion__(action) {
	console.log('llegando al uploadEventImagen VP', action)
	console.log('llegando al uploadEventImagen VPeventImage.assets', action.eventImage.assets)
	if (action.eventImage.assets) {
		console.log('entrando al IIIIIFFFFFFFFF ', action.eventImage.assets);
		//aca se rompe
		try {
			const s3Route = yield uploadImageS3(action.eventImage.assets, "users");
			console.log('los que trae s3Route y enviar a save', s3Route)
			if (s3Route) {
				let newData = {
					...action.data,
					"via_img": s3Route,
				}
				let resp_trip = yield api.save_trip_vp(action.tabla, newData);
				console.log('resp_trip:::::', resp_trip)
				if (!resp_trip.error) {
					if (resp_trip === 'ok') {
						yield put({ type: SAVE_VP_VIAJE_OK, payload: newData });
					}
				} else {
					console.log('ERROR DE LA SAGA GUARDANDO VIAJE: ', resp_trip.error)
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
}

function* save_foto_avion() {
	yield takeLatest(SUBIR_FOTO_AVION, save_foto_avion__);
}
/////////////////////////////////////////////////////////////////////

function* progreso_logro_cinco_viajes__() {
	const user = yield getItem('user');
	const idLogro = 205;

	// Paso 1: obtener todos los logros activos del usuario
	const logrosActivos = yield api.get_tabla('logros', idLogro);
	const logro = logrosActivos.find(l => l.id_logro === idLogro && l.estado === 'ACTIVO');

	if (!logro) {
		console.log('⛔ No se encontró un logro activo con ID 205.');
		return;
	}

	const fechaInicio = new Date(logro.fecha_inicio);
	const fechaFin = new Date(logro.fecha_fin);
	const fechaActual = new Date();

	// Normalizar horas
	fechaInicio.setHours(0, 0, 0, 0);
	fechaFin.setHours(23, 59, 59, 999);

	console.log(`📅 Rango del logro: ${fechaInicio.toISOString()} - ${fechaFin.toISOString()}`);
	console.log(`📅 Fecha del viaje actual: ${fechaActual.toISOString()}`);

	if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
		// El viaje es válido, verificar progreso del logro
		const data_logro = {
			usuario_id: user.idNumber,
			logro_id: idLogro,
			estado: 'INCOMPLETO',
		};

		let get_progreso_logro = yield api.get_logro_progreso('progreso_logros/logro_progreso', data_logro);
		const progreso_actual = get_progreso_logro?.data ?? [];

		if (progreso_actual.length === 1) {
			const progreso = progreso_actual[0];
			const meta = progreso.logro.meta; // Suponiendo que el backend devuelve la meta

			const nuevo_progreso = progreso.progreso + 1;
			const estado_final = nuevo_progreso >= meta ? 'COMPLETADO' : 'INCOMPLETO';

			const update_data = {
				id: progreso.id,
				usuario_id: user.idNumber,
				progreso: nuevo_progreso,
				estado: estado_final,
				ultima_actualizacion: new Date(),
			};

			yield api.patch__('progreso_logros/' + progreso.id, update_data);
			console.log('✅ Progreso actualizado a:', nuevo_progreso, '| Estado:', estado_final);
			Alert.alert('✅ Progreso actualizado a:', nuevo_progreso, '| Estado:', estado_final);
		}

		if (progreso_actual.length === 0) {
			console.log('❌ No se encontró progreso para este logro. Se va a crear uno nuevo.');
			const nuevo_logro = {
				id: uuidv4(),
				usuario_id: user.idNumber,
				logro_id: idLogro,
				progreso: 1,
				estado: 'INCOMPLETO',
				ultima_actualizacion: new Date(),
			};

			yield api.post__('progreso_logros/registrar', nuevo_logro);
			console.log('✅ Nuevo progreso de logro creado:', nuevo_logro);
		}
	} else {
		console.log('⛔ La fecha del viaje no está dentro del rango del logro.');
	}
}

function* progreso_logro_distancia_10k__(distancia) {
	if (distancia >= 1000) {
		const idLogro = 202; // ID del logro de los 10 km
		const data_logro = {
			"usuario_id": user.idNumber,
			"logro_id": idLogro,
			"estado": "COMPLETADO",
		};
		let get_progreso_logro = yield api.get_logro_progreso('progreso_logros/logro_progreso', data_logro);

		const progreso_actual = get_progreso_logro?.data ?? [];

		console.log('✔ Progreso consulta tamaño:', progreso_actual.length);

		if (progreso_actual.length === 1) {
			console.log('✔ Ya completó este logro de 10 km:', progreso_actual);
		}

		if (progreso_actual.length === 0) {
			console.log('❌ No se encontró progreso para el logro especificado. Tenemos que crear uno nuevo.');
			const nuevo_logro = {
				"id": uuidv4(),
				"usuario_id": user.idNumber,
				"logro_id": idLogro,
				"progreso": 10,
				"estado": "COMPLETADO",
				"ultima_actualizacion": new Date(),
			};
			yield api.post__('progreso_logros/registrar', nuevo_logro);
			console.log('✅ Nuevo logro creado:', nuevo_logro);
		}
	}
}

function* progreso_logro_co2__() {
	let user = yield getItem('user');
	let tablaCo2 = 'bc_indicadores_trip/usuario';
	let co2Indicadores = yield api.get_tabla(tablaCo2, user.idNumber);
	console.log('los indicadores por usuario para ver Co2 acomulado', co2Indicadores);

	const totalCO2 = co2Indicadores.reduce((sum, item) => sum + parseFloat(item.ind_co2 || '0'), 0);

	console.log(`✅ Total CO2 acumulado: ${totalCO2}`);

	if (totalCO2 >= 1000) {
		const idLogro = 204; // Puedes definir el ID específico del logro para CO2 aquí
		const data_logro = {
			usuario_id: user.idNumber,
			logro_id: idLogro,
			estado: 'COMPLETADO',
		};

		const get_progreso_logro = yield api.get_logro_progreso('progreso_logros/logro_progreso', data_logro);
		const progreso_actual = get_progreso_logro?.data ?? [];

		console.log('✔ Progreso consulta tamaño:', progreso_actual.length);

		if (progreso_actual.length === 1) {
			console.log('✔ Ya completó este logro de CO₂:', progreso_actual);
		}

		if (progreso_actual.length === 0) {
			console.log('❌ No se encontró progreso para el logro de CO₂. Se creará uno nuevo.');

			const nuevo_logro = {
				id: uuidv4(),
				usuario_id: user.idNumber,
				logro_id: idLogro,
				progreso: 1000, // Puedes registrar el progreso equivalente si deseas
				estado: 'COMPLETADO',
				ultima_actualizacion: new Date(),
			};

			yield api.post__('progreso_logros/registrar', nuevo_logro);
			console.log('✅ Nuevo logro CO₂ creado:', nuevo_logro);

		}
	} else {
		console.log('⛔ CO₂ acumulado insuficiente para el logro.');
	}
}

function* indicadores_prestamo__(action) {
	let user = yield getItem('user');
	console.log('id del usuario en indicadores', user.idNumber);
	let indicadores = yield getItem('indicadores');
	console.log('indicadores', indicadores);
	let modulo = action.mod;
	let idTrip_ = action.idTrip
	let indicador_ = JSON.parse(action.indicador)
	console.log('indicadores modulo', modulo);
	console.log('indicadores id trip', idTrip_);
	console.log('indicadores ', indicador_);
	console.log('indicadores modulo duracion', indicador_.duracion);
	console.log('indicadores modulo distancia', indicador_.distancia);
	console.log('indicadores modulo calorias', indicador_.calorias);
	console.log('indicadores modulo co2', indicador_.co2);
	let data_ind = {
		"ind_id": uuidv4(),
		"ind_usuario": user.idNumber,
		"ind_viaje": idTrip_,
		"ind_modulo": modulo,
		"ind_duracion": indicador_?.duracion ?? null, // Validación con optional chaining
		"ind_distancia": indicador_?.distancia ?? null,
		"ind_calorias": indicador_?.calorias ?? null,
		"ind_co2": indicador_?.co2 ?? null
	};
	let tabla = 'bc_indicadores_trip/registrar';
	console.log('la data_ind: ', data_ind);
	let saveIndicadores = yield api.guardandoIndicadores(tabla, data_ind);
	console.log('Se guardó el indicador');
}
function* indicadores_prestamo() {
	yield takeLatest(INDICADORES_TRIP, indicadores_prestamo__);
}


function* completar_logro_progreso__(action) {
	let id = action.id;
	let user = yield getItem('user');
	//let tabla = 'bc_bicicletas/estacion'
	const update_data = {
		estado: 'RECLAMADO',
		ultima_actualizacion: new Date(),
	};

	yield api.patch__('progreso_logros/usuario/' + user.idNumber + '/logro/' + id, update_data);
	console.log('✅ Progreso actualizado y teminado');

}
function* completar_logro_progreso() {
	yield takeLatest(COMPLETAR_PROGRESO_LOGRO, completar_logro_progreso__);
}



function* get_vehycle_id_vp__(action) {
	let vp_id = action.id;
	//let tabla = 'bc_bicicletas/estacion'
	let tabla = 'vp_vehiculos_usuario/id'
	let vehiculo = yield api.viewVehiculosId(tabla, vp_id);
	console.log('vehiculos Electrico liviano seleccionado', vehiculo);
	console.log('vehiculos Electrico liviano seleccionado tamano', vehiculo.data);
	if (!vehiculo.error) {
		if (vehiculo.data !== null) {
			yield put({ type: GET_VEHYCLE_ID_FETCH, payload: vehiculo });
		}
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(vehiculo.error))
	}
}
function* get_vehycle_id_vp() {
	yield takeLatest(GET_VEHYCLE_ID, get_vehycle_id_vp__);
}

//get empresas Mysql
function* get__empresas__(action) {
	let tabla = 'bc_empresas/'
	let empresas = yield api.getEmpresas(tabla);
	//console.log('la res de la api de empresas', empresas);
	if (empresas) {
		yield put({ type: GET_EMPRESAS_OK, payload: empresas });
	} else {
		console.log('ERROR DE LA SAGA 3G GET EMPRESAS: ', empresas.error)
	}
}
function* get__empresas() {
	yield takeLatest(GET_EMPRESAS, get__empresas__);
}


//calificacion exitosa progreso logro
function* progreso_logro_calificacion_exitosa__(action) {
	const user = yield getItem('user');
	const idLogro = 203;
	//funcion para verificar si ya existe el progreso del logro
	//si no existe se crea uno nuevo
	//si existe se actualiza el progreso y el estado
	//si el progreso es igual a la meta se cambia el estado a completado
	//si el progreso es menor a la meta se cambia el estado a incompleto
	const data_logro = {
		"usuario_id": user.idNumber,
		"logro_id": idLogro,
		"estado": "INCOMPLETO",
	};
	let get_progreso_logro = yield api.get_logro_progreso('progreso_logros/logro_progreso', data_logro);

	const progreso_actual = get_progreso_logro?.data ?? [];

	console.log('✔ Progreso consulta tamaño:', progreso_actual.length);

	if (progreso_actual.length === 1) {
		console.log('✔ Progreso actual:', progreso_actual);
		const progreso = progreso_actual[0];
		const meta = progreso.logro.meta;
		const nombre_logro_progreso = progreso.logro.descripcion;

		console.log('✔ Meta del logro:', meta);
		console.log('✔ Progreso actual:', progreso.progreso);


		const nuevo_progreso = progreso.progreso + 1;
		const estado_final = nuevo_progreso == meta ? 'COMPLETADO' : 'INCOMPLETO';

		const update_data = {
			usuario_id: user.idNumber,
			progreso: nuevo_progreso,
			estado: estado_final,
			ultima_actualizacion: new Date(),
		};

		yield api.patch__('progreso_logros/' + progreso.id, update_data);
		console.log('✅ Progreso actualizado a:', nuevo_progreso, '| Estado:', estado_final);
		//Alert.alert('Progreso Logro actualizado', `Progreso: ${nuevo_progreso} de ${meta} | logro: ${nombre_logro_progreso}`);
	}

	if (progreso_actual.length === 0) {
		console.log('❌ No se encontró progreso para el logro especificado. Tenemos que crear uno nuevo.');
		const nuevo_logro = {
			"id": uuidv4(),
			"usuario_id": user.idNumber,
			"logro_id": idLogro,
			"progreso": 1,
			"estado": "INCOMPLETO",
			"ultima_actualizacion": new Date(),
		};
		yield api.post__('progreso_logros/registrar', nuevo_logro);
		console.log('✅ Nuevo logro creado:', nuevo_logro);

	}
}
function* progreso_logro_calificacion_exitosa() {
	yield takeLatest(CALIFICACION_EXITOSA, progreso_logro_calificacion_exitosa__);
}

//reset app
function* reset_app__(action) {
	try {
		// 1. Desconectar todos los dispositivos conectados
		const connectedDevices = yield call([bleManager, bleManager.connectedDevices], []);
		for (const device of connectedDevices) {
			try {
				yield call([device, device.cancelConnection]);
				console.log(`Dispositivo ${device.id} desconectado.`);
			} catch (e) {
				console.log(`Error desconectando ${device.id}:`, e.message);
			}
		}

		// 2. Limpiar AsyncStorage
		yield call(AsyncStorage.clear);

		// 3. Resetear el store de Redux
		yield put({ type: RESET_APP_OK });

	} catch (error) {
		console.error('Error al reiniciar la app:', error);
	}
}
function* reset_app() {
	yield takeLatest(RESET_APP, reset_app__);
}

// Guardar reg pp
function* save_register_pp__(action) {
	let data = action.data;
	console.log('data pp', data);
	let saveregpp = yield api.guardandoRegistroExt('bc_registros_pp/registrar', data);
	console.log('saveregpp', saveregpp)
	if (!saveregpp.error) {
		yield put({ type: SAVE_REGISTRO_PP_OK });
	} else {
		console.log('ERROR DE LA SAGA 3G: ', JSON.stringify(saveregpp.error))
	}
}
function* save_register_pp() {
	yield takeLatest(SAVE_REGISTRO_PP, save_register_pp__);
}

export const sagas = [
	save_register_ext(),
	save_register_pp(),
	saveDataUserGlobal(),
	saveDataCronoGlobal(),
	viewRentActive(),
	viewFallas(),
	validateUser(),
	validateHorarios(),
	reserveActive(),
	viewRentActivePP(),
	viewPenalizations(),
	calcularDistancia(),
	verEstacionesEmpresa(),
	viewVehiculoEstacion(),
	saveReservaBC(),
	changeVehiculoEstado(),
	validateRegisterEnd(),
	savePenalizateBC(),
	changeVehicleResrve(),
	savePrestamoBC(),
	changeReservaBc(),
	watchFinalizarViaje3g(),
	changePrestamoBc(),
	changePrestamoRide(),
	saveHistClavesBc(),
	saveComentarioBc(),
	savePuntosBc(),
	restarPuntosBc(),
	changeClaveBc(),
	decrementarSegundos(),
	reset_cambio_veh(),
	save_state_bicicletero(),
	verificar_recorrido(),
	act_recorrido(),
	//VP
	get_tipos(),
	saveVPusuario(),
	uploadEventImageSaga(),
	get_myvehicles(),
	validata_vehicle(),
	save_vp_trip(),
	restart_vp_trip(),
	validarSinMysql(),
	reiniciarqr(),
	save_veh_sel(),
	verify_trip_active(),
	verify_trip_active_cache(),
	end_vp_trip(),
	buscar_puntos(),
	mis_viajes(),
	saveComentarioVP(),
	save_viaje_vp_avion(),
	save_foto_avion(),
	cancelar_sagas(),
	indicadores_prestamo(),
	get_vehycle_id_vp(),
	get__empresas(),
	progreso_logro_calificacion_exitosa(),
	reset_app(),
	completar_logro_progreso(),
	savePuntosBc_sinusuario(),
	validateBikeAvailability()
];
