/* eslint-disable prettier/prettier */
import { getItem, setItem } from '../Services/storage.service';
import { Env } from "../Utils/enviroments";
import { fetch } from '../Services/refresh.service';
import { fetchJSON } from 'refresh-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = Env.apiUrl;
const URLMysql = Env.apiUrlMysql //prod

const get_tabla_cc = async (tabla, cc) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + cc;
    console.log('parqueo APi url', url);
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const save = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('guardando url parqueo:', url);
    console.log('guardando data parqueo:', data);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const changeEstadoLugar = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url parqueo:', url);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const patchEstadoLugar = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para cambiar estado lugar parqueo', url)
    console.log('la data para cambiar estado lugar parqueo', data)
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const patchHoras = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para cambiar estado lugar parqueo', url)
    console.log('la data para cambiar estado lugar parqueo', data)
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const validarQR = async (tabla, qr) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + qr;
    console.log('lugar parqueo con parqueadero', url);
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//validar horarios
const ejecutarHorario = (arrayhora) => {
    let horaActual = new Date().getHours();
    console.log('LA HORA ACTUAL EN PARQUEO ES ', horaActual)
    console.log('LA HORA ACTUAL EN PARQUEO ES -5horas ', Number(horaActual - 5));
    horaActual_5 = Number(horaActual - 5);
    let horaIni = arrayhora.substr(3,2)
    let horaFin = arrayhora.substr(6,5)
    if (horaActual_5 >= horaIni && horaActual_5 <= horaFin) {
        return true
    }else{
        return false
    }
}

const validar_horario_parqueo = async (tabla, id) => {
    let url = URLMysql + tabla + '/' + id;
    console.log(':: URL validando horario para parqueadero :::: ', url)
    try {
        let res = await fetch(url);
        console.log('la data de horario hoy es ::parqueo:::', res.body.data[0])
        let hoy = new Date().toUTCString().substr(0,3);
        console.log('HOY ES ', hoy)
        let hora = '';
        let dia = '';
        
        switch(hoy) {
            case res.body.data[0].hor_mon.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_mon);
                dia = hoy
                break;
            case res.body.data[0].hor_tue.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_tue);
                dia = hoy
                break;
            case res.body.data[0].hor_wed.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_wed);
                dia = hoy
                break;
            case res.body.data[0].hor_thu.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_thu);
                dia = hoy
                break;
            case res.body.data[0].hor_fri.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_fri);
                dia = hoy
                break;
            case res.body.data[0].hor_sat.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_sat);
                dia = hoy
                break;
            case res.body.data[0].hor_sun.substr(0,3):
                hora = ejecutarHorario(res.body.data[0].hor_sun);
                dia = hoy
                break;
            default:
                console.log('No se encontro el dia')
                hora = false;
                dia = false;
        }
        let data = {
            "hora": hora,
            "dia": dia
        }

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const viewLugaresParq = async (tabla, id) => {
    let url = URLMysql + tabla + '/' + id;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const guardandoReserva = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para guardar reserva es:', url);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}
const changeVehiculo = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url al cambiar estado vehiculo:', url);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const temporizadorReserva = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url temporizador', url);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const get_tabla_cc_sinid = async (tabla, cc) => {
    const token = await getItem('token')
    console.log('tokennnn', token);
    console.log('cc', cc);
    if (cc === undefined) {
        console.log('la CC undefined');
        return;
    }
    let url = URLMysql + tabla + '/' + cc;
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}


const saveComentarios = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url comentarios parqueo', url)
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const viewLugar = async (tabla, id) => {
    let url = URLMysql + tabla + '/' + id;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const cancelarReserva = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para cancelar reserva es:', url);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const updateLugar = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para cambiar estado lugar es:', url);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}


export const api = {
    get_tabla_cc_sinid,
    get_tabla_cc,
    save,
    changeEstadoLugar,
    validarQR,
    validar_horario_parqueo,
    patchEstadoLugar,
    patchHoras,
    viewLugaresParq,
    guardandoReserva,
    temporizadorReserva,
    changeVehiculo,
    saveComentarios,
    viewLugar,
    cancelarReserva,
    updateLugar
}