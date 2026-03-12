/*eslint-disable */
import { fetch } from '../Services/refresh.service';
import { Env } from "../Utils/enviroments";
import { getItem, setItem } from '../Services/storage.service';

const URLMysql = Env.apiUrlMysql

const get = async (tabla, filter) => {
    let url = URLMysql + tabla;
    const fullUrl = url + '?filter=' + JSON.stringify(filter);
    const request = {
        method: 'GET',
    };
    return fetch(fullUrl, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
};

const saveTrip = async (tabla, data) => {
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
};

const addCar = async (tabla, data) => {
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
};

const addAplication = async (tabla, data) => {
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
};

const addUserRider = async (tabla, data) => {
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
};

const getVehicules = async (tabla, userAuth) => {
    let url = URLMysql + tabla + userAuth;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}


const getConfirmation = async (tabla, userAuth, tripId) => {
    let url = URLMysql + tabla + userAuth + "/" +tripId;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getRiders = async (tabla, tripId) => {
    let url = URLMysql + tabla + tripId;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getAplication = async (tabla, tripId) => {
    let url = URLMysql + tabla + tripId;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getActiveTrip = async (tabla) => {
    let url = URLMysql + tabla ;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getActiveTripRider = async (tabla, userId) => {
    let url = URLMysql + tabla + userId;
    try {
        let res = await fetch(url);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get_id = async (tabla, userId) => {
    let url = URLMysql + tabla + userId;
    try {
        const request = {
            method: 'GET'
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        return error;
    }
}

const get_id_with_page = async (tabla, { documento, page, limit , offset }) => {
    // Crear la URL con los parámetros de página y límite
    const url = `${URLMysql}${tabla}${documento}?page=${page}&limit=${limit}&offset=${offset}`;
    try {
        const request = {
            method: 'GET',
        };
        const res = await fetch(url, request);
        return res.body;
    } catch (error) {
        return { error: error.message };  // Retornar el error si ocurre uno
    }
};

const get_id_filtered_with_page = async (tabla, { documento, page, limit , pago, transporte, fechaInicio, position1, position2 }) => {
    const pagoQuery = pago.length > 0 ? pago.join(',') : '';
    const transporteQuery = transporte.length > 0 ? transporte.join(',') : '';
    const url = `${URLMysql}${tabla}${documento}?page=${page}&limit=${limit}&pago=${pagoQuery}&transporte=${transporteQuery}&fechaInicio=${fechaInicio}&position1=${position1}&position2=${position2}`;
    try {
        const request = {
            method: 'GET',
        };
        const res = await fetch(url, request);
        return res.body;
    } catch (error) {
        // Manejo de errores
        return { error: error.message };  // Retornar el error si ocurre uno
    }
};


const get_rider = async (tabla, id) => {
    let url = URLMysql + tabla + id; 
    try {
        const request = {
            method: 'GET'
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get_active_trips = async (tabla, userId) => {
    let url = URLMysql + tabla + userId;
    try {
        const request = {
            method: 'GET'
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get_active_trips_filtered = async (tabla, userId, { page , limit = 10 }) => {
    const url = `${URLMysql}${tabla}${userId}?page=${page}&limit=${limit}`;
    try {
        const request = {
            method: 'GET'
        };
        let res = await fetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get_tabla_cc = async (tabla, cc) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + '/id/' + cc;
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

const get_tabla_documento = async (tabla, cc) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + '/documento/' + cc;
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

const post__ = async (tabla, data) => {
    let url = URLMysql + tabla;
    console.log('data conductos tyc', data)
    try {
        const request = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        let res = await fetch(url, request);
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
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const patchField = async (table, id, parameters) => {
    const token = await getItem('token')
    const request = {
        method: 'PATCH',
        body: JSON.stringify(parameters),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        }
    };
    const endPoint = `${URL}${table}/${id}`;
    return fetchJSON(endPoint, request).then(response => { return response.body }).catch((err) => { console.log("ERROR PATCHHHHHH " + table + JSON.stringify(err)) });
}

const patch_logro = async (table, id, parameters) => {
    const token = await getItem('token')
    const request = {
        method: 'PATCH',
        body: JSON.stringify(parameters),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        }
    };
    const endPoint = `${URL}${table}/${id}`;
    return fetch(endPoint, request).then(response => { return response.body }).catch((err) => { console.log("ERROR PATCHHHHHH " + table + JSON.stringify(err)) });
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


export const api = {
    //enviar
    get,
    saveTrip,
    addCar,
    addAplication,
    addUserRider,
    //recibir
    getVehicules,
    getConfirmation,
    getRiders,
    getAplication,
    getActiveTrip,
    getActiveTripRider,
    get_tabla_documento,
    get_id,
    get_id_with_page,
    get_id_filtered_with_page,
    post__,
    get_active_trips,
    get_active_trips_filtered,
    patch__,
    get_rider,
    patchField,
    patch_logro,
    get_tabla_cc,
    get_logro_progreso
}