/* eslint-disable prettier/prettier */
import { getItem, setItem } from '../Services/storage.service';
import { Env } from "../Utils/enviroments";
import { fetch } from '../Services/refresh.service';
import { fetchJSON } from 'refresh-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = Env.apiUrl;
const URLMysql = Env.apiUrlMysql //prod

const guardandoRegistroExt = async (tabla, data) => {
    const token = await getItem('token')
    let url = URLMysql + tabla;
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + token,
            }
        }
    };
    return fetch(url, request)
        .then(response => {
            console.log('response', response)
            return response.body
        }).catch((err) => {
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });

}

/*const validationRent = async (tabla, cc) => {
    let url = URLMysql + tabla + '/' + cc;
    console.log('URL VER RENTA::: ', url)
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}*/

const getFallas = async (tabla) => {
    let url = URLMysql + tabla;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get__ = async (tabla) => {
    let url = URLMysql + tabla;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

/*const validationUser = async (tabla, cc) => {
    console.log('ESTAMOS EN LA APIIIIIIIIIIIIIIIIIIIIII', tabla + ' - ', cc)
    let url = URLMysql + tabla + '/' + cc;
    console.log('EN ESTA ES LA URL QUE ESTAMOS CONSUMIENDO DATA :::::::RUTA:::::::', url);
    try {
        let res = await fetch(url);
        console.log('ENTRANDA A TRYYYYYYYYYYYYYYYYY EN API',res)
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}*/










const viewKeyBicicletero = async (tabla, estacion, vehiculo) => {
    let url = URLMysql + tabla + '/' + estacion + '/bicicleta/' + vehiculo;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const viewEstacion = async (tabla, estacion) => {
    let url = URLMysql + tabla + '/' + estacion;
    try {
        let res = await fetch(url);
        return res.body;
        console.log('data estaciones:::::::::::::::', res.body);
    } catch (error) {
        console.log(error);
        return error;
    }
}

const viewEstacionEmpresa = async (tabla, empresa) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + '/' + empresa;
    console.log('URL VER ESTACION EMPRESA::::::::::URL::::::::::: api ', url)
    try {
        const request = {
            method: 'GET',
            /*headers: {
                "Content-type": "application/json; charset=UTF-8",
                //Authorization: "Bearer " + token,
            }*/
        };
        let res = await fetch(url, request);
        console.log('data estaciones::::::::::::::::::::::::::', res.body);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const ejecutarHorario = (arrayhora) => {
    let horaActual = new Date().getHours();
    let horaIni = arrayhora.substr(3, 2)
    let horaFin = arrayhora.substr(6, 5)
    if (horaActual >= horaIni && horaActual <= horaFin) {
        return true
    } else {
        return false
    }
}

const validationHorarios = async (tabla, empresa) => {
    let url = URLMysql + tabla + '/' + empresa;
    console.log(':: validar horario en 3g :::: ', url)
    try {
        /*let request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        };
        let res = await fetch(url, request);*/

        let res = await fetch(url);
        console.log('la data de horario hoy es ::', res.body.data[0].hor_mon)
        let hoy = new Date().toUTCString().substr(0, 3);
        let hora = '';
        let dia = '';

        switch (hoy) {
            case res.body.data[0].hor_mon.substr(0, 3):
                hora = ejecutarHorario(res.body.data[0].hor_mon);
                dia = hoy
                break;
            case res.body.data[0].hor_tue.substr(0, 3):
                hora = ejecutarHorario(res.body.data[0].hor_tue);
                dia = hoy
                break;
            case res.body.data[0].hor_wed.substr(0, 3):
                hora = ejecutarHorario(res.body.data[0].hor_wed);
                dia = hoy
                break;
            case res.body.data[0].hor_thu.substr(0, 3):
                hora = ejecutarHorario(res.body.data[0].hor_thu);
                dia = hoy
                break;
            case res.body.data[0].hor_fri.substr(0, 3):
                hora = ejecutarHorario(res.body.data[0].hor_fri);
                dia = hoy
                break;
            case res.body.data[0].hor_sat.substr(0, 3):
                hora = ejecutarHorario(res.body.data[0].hor_sat);
                dia = hoy
                break;
            case res.body.data[0].hor_sun.substr(0, 3):
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

/*const validationReserve = async (tabla, cc) => {
    let url = URLMysql + tabla + '/' + cc;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}*/


const validationVerVehiculos = async (tabla, estacion) => {
    let url = URLMysql + tabla + '/' + estacion;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}


/*const validationPenalizations = async (tabla, cc) => {
    let url = URLMysql + tabla + '/' + cc;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}*/










const viewVehiculosEst = async (tabla, estacion) => {
    let url = URLMysql + tabla + '/' + estacion;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const viewVehiculosId = async (tabla, id) => {
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

const changeEstadoReserva = async (tabla, data) => {
    let url = URLMysql + tabla;
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

/*const verificarRegistro = async (tabla, cc) => {
    let url = URLMysql + tabla + "/" + cc;
    console.log('validando si registro en true ::::rutareg::::', url)
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}*/

const guardandoPenalizacion = async (tabla, data) => {
    let url = URLMysql + tabla;
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

const cambiarVehiculoReserva = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url cambio de vehiculo', url);
    console.log('data cambio de vehiculo', data);
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

const guardandoPrestamo = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            console.log('ELLLLLLLLLL RESpoNSe', response)
            return response
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const guardandoPreoperacionales = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url mysql para preoperacionales', url);
    console.log('data mysql para preoperacionales', data);
    const request = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    try {
        let res = await fetch(url, request);
        console.log('response mysql para preoperacionales en el try', res);
        return res;
    } catch (error) {
        return error;
    }
}

const changeEstadoPrestamo = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para cambiar estado prestamo', url)
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

const patchEstadoPrestamo = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('la url para cambiar estado prestamo', url)
    const request = {
        method: 'PATCH',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

/*const saveHistorialClaves_ = async (tabla, data) => {
    let url = URLMysql + tabla;
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
}*/
const saveHistorialClaves_ = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
            return { error: err }
        });
}

const saveComentarios = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url comentarios', url)
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

const savePuntos = async (tabla, data) => {
    let url = URLMysql + tabla;
    let token = await getItem('token')
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
        /*headers: {
            "Content-type": "application/json; charset=UTF-8",
            //Authorization: `Bearer ${token}`,
        }*/
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const changeClave = async (tabla, data) => {
    let url = URLMysql + tabla;
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


////// API VEHICULOS PARTICULARES ///////
const get_tipo_vp = async (tabla) => {
    console.log('desde la api para tipo vehiculo', tabla)
    let url = URLMysql + tabla;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}
const saveVP = async (tabla, data) => {
    let url = URLMysql + tabla;
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

const get_my_vehicles_vp = async (tabla, cc) => {
    let url = URLMysql + tabla + '/' + cc;
    console.log('la url MVP::', url);
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getValidateVehicleUser = async (tabla, cod, user) => {
    let url = URLMysql + tabla + '/id/' + cod + '/usu/' + user;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const save_trip_vp = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url saveTripVP', url);
    console.log('data saveTripVP', data);
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            console.log(response.body)
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}

const verBicicletero = async (tabla, data) => {
    let url = URLMysql + tabla;
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

const viewBicy = async (tabla, id) => {
    let url = URLMysql + tabla + '/' + id;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const validationTripActiveVP = async (tabla, user) => {
    let url = URLMysql + tabla + '/' + user;
    console.log('URL VER TRIP ACTIVE::: ', url)
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}
/////////////////////////////////////////

const end_trip_vp = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url', url);
    console.log('data', data);
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

const patch_recorrido = async (tabla, cc, data) => {
    console.log('ESTAMOS EN LA API PATCH recorrido tabla', tabla + ' - ', cc)
    console.log('ESTAMOS EN LA API PATCH recorrido data', data)
    let url = URLMysql + tabla + '/' + cc;
    console.log('URL RECORRIDO :::::::RUTA:::::::', url);

    const request = {
        method: 'PATCH',
        body: JSON.stringify(data),
    };
    return fetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
    /*try {
        let res = await fetch(url);
        console.log('ENTRANDA A TRYYYYYYYYYYYYYYYYY EN API',res)
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }*/
}

const get_tabla = async (tabla, cc) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + '/' + cc;
    console.log('url get_tabla', url);
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        console.log('res.body', res.body);
        return res.body;
    } catch (error) {
        console.log(error);
        return { error: error.message || String(error) };
    }
}

const get_tabla_cc = async (tabla, cc) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + '/id/' + cc;
    console.log('url get_tabla_cc tTTTTTTTTTTTTT', url);
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        console.log('LA RESPUESTA ESEESESESESES', res.body);
        return res.body;
    } catch (error) {
        console.log(error);
        return { error: error.message || String(error) };
    }
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
    console.log('url get_tabla_cc_sinid', url);
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
        return { error: error.message || String(error) };
    }
}

const post__ = async (tabla, data) => {
    let url = URLMysql + tabla;
    try {
        const request = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const postFileHeaders = async (urlF, fileRoute, data) => {
    console.log('ahora por aca en la function postFileHeaders, ________urlF:', urlF);
    console.log('ahora por aca en la function postFileHeaders, ________fileRoute:', fileRoute);
    console.log('ahora por aca en la function postFileHeaders, ________data:', data);
    console.log('ahora por aca en la function postFileHeaders, ________data._part:', data._parts);
    const url = URL + urlF + "/" + fileRoute;
    console.log('la url aca en la function postFileHeaders, ________url', url)
    const request = {
        method: 'POST',
        body: data,
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        },
    };

    return fetch(url, request).then(response => {
        console.log('la response _____________', response);
        return response.body ? response.body : response
    }).catch((err) => { console.log("error post file Headers ", err) });
}
const guardandoIndicadores = async (tabla, data) => {
    let url = URLMysql + tabla;
    try {
        const request = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const viajes_5g = async (url) => {
    let url_5g = URL + url;
    console.log('url para viajes 5g', url_5g);
    try {
        const request = {
            method: 'GET'
        };
        let res = await fetch(url_5g, request);
        console.log('res de viajes 5G en api3G', res);
        return res.body;
    } catch (error) {
        console.log(error);
        return { error: error.message || String(error) };
    }
}

const getEmpresas = async (tabla) => {
    let url = URLMysql + tabla;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get_logro_progreso = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url get_logro_progreso', url);
    console.log('data get_logro_progreso', data);
    try {
        const request = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        let res = await fetch(url, request);
        console.log('res get_logro_progreso', res);
        return res.body;
    } catch (error) {
        return error;
    }
}

const patch__ = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('url patch', url);
    console.log('data patch', data);
    try {
        const request = {
            method: 'PATCH',
            body: JSON.stringify(data),
        };
        let res = await fetch(url, request);
        console.log('res patch', res);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const correo_recompnesas = async (table, email, data) => {
    try {
        let msn_data = {
            "email": email,
            "data": data
        }
        const request = {
            method: 'POST',
            body: JSON.stringify(msn_data),
        };
        let endPoint = URLMysql + table;
        console.log('endPoint correo', endPoint);
        return fetchJSON(endPoint, request)
            .then(response => {
                console.log('la respuesta en CORREO', response)
            })
            .catch((err) => { console.log("ERROR CORREO RECOMPENSAS " + table + JSON.stringify(err)) });
    }
    catch (error) {
        return JSON.stringify(error);
    }
}

const postImgFile = async (formData, type = null) => {
    let url = URLMysql + "upload";
    if (type) {
        url += `?type=${type}`;
    }
    try {
        let res = await global.fetch(url, {
            method: 'POST',
            body: formData
        });
        return await res.json();
    } catch (err) {
        console.error("Error en postImgFile local3G:", err);
        return { error: err };
    }
}

export const api = {
    guardandoRegistroExt,
    postImgFile,
    //validationRent,
    getFallas,
    //validationUser,
    viewKeyBicicletero,
    viewEstacion,
    validationHorarios,
    //validationReserve,
    validationVerVehiculos,
    //validationPenalizations,
    viewEstacionEmpresa,
    viewVehiculosEst,
    viewVehiculosId,
    guardandoReserva,
    changeVehiculo,
    changeEstadoReserva,
    //verificarRegistro,
    guardandoPenalizacion,
    cambiarVehiculoReserva,
    guardandoPrestamo,
    changeEstadoPrestamo,
    patchEstadoPrestamo,
    saveHistorialClaves_,
    saveComentarios,
    savePuntos,
    changeClave,
    get_tipo_vp,
    saveVP,
    get_my_vehicles_vp,
    getValidateVehicleUser,
    save_trip_vp,
    verBicicletero,
    viewBicy,
    validationTripActiveVP,
    end_trip_vp,
    patch_recorrido,
    get_tabla,
    get_tabla_cc,
    get_tabla_cc_sinid,
    post__,
    postFileHeaders,
    guardandoIndicadores,
    viajes_5g,
    getEmpresas,
    get_logro_progreso,
    patch__,
    temporizadorReserva,
    guardandoPreoperacionales,
    correo_recompnesas,
    get__
}


