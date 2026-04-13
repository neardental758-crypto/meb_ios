/* eslint-disable prettier/prettier */
import { getItem, setItem } from '../Services/storage.service'
import { Env } from "../Utils/enviroments";
import { fetch as customFetch } from '../Services/refresh.service';
import { fetchJSON } from 'refresh-fetch';

const URL = Env.apiUrl;
const URLMysql = Env.apiUrlMysql

const guardandoIndicadores = async (tabla, data) => {
    const token = await getItem('token')
    let url = URLMysql + tabla;
    console.log('url mysql para indicadores', url);
    console.log('data mysql para indicadores', data);
    const request = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    try {
        let res = await customFetch(url, request);
        console.log('response mysql para indicadores en el try', res);
        return res.body;
    } catch (error) {
        return error;
    }
}

const guardandoPreoperacionales = async (tabla, data) => {
    const token = await getItem('token')
    let url = URLMysql + tabla;
    console.log('url mysql para preoperacionales', url);
    console.log('data mysql para preoperacionales', data);
    const request = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    try {
        let res = await customFetch(url, request);
        console.log('response mysql para preoperacionales en el try', res);
        return res.body;
    } catch (error) {
        return error;
    }
}

const validateTrip = async (qrNumber, organizationId, userId, userCompany) => {
    let url = URLMysql + "bc_candados/verifyData5g";
    let body = {
        qrNumber, organizationId, userId, userCompany
    };
    const request = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
        }
    };
    try {
        let res = await customFetch(url, request);
        return res.body;
    } catch (error) {
        return error;
    }
}

const validationEndTrip = async (trip, currentLocation) => {
    let url = URL + "validationEndTrip";
    let body = {
        trip, currentLocation
    };
    const request = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
        }
    };
    try {
        let res = await customFetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const validationEndTripC = async (trip, currentLocation) => {
    let url = URL + "validationEndTripC";
    let body = {
        trip, currentLocation
    };
    const request = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
        }
    };
    try {
        let res = await customFetch(url, request);
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const endTrip = async (trip, endStationId, userTripInformation) => {
    try {
        console.log('🏁 Arrancando fin de viaje 5G manual...', trip.pre_id);

        let fechaFin = new Date();
        fechaFin.setHours(fechaFin.getHours() - 5); // Timezone adjustment for DB if needed
        const fechaFinISO = fechaFin.toISOString();

        // 1. Actualizar el Prestamo
        const urlPrestamo = URLMysql + "bc_prestamos/" + trip.pre_id;
        const bodyPrestamo = {
            pre_id: trip.pre_id,
            pre_estado: 'FINALIZADA',
            pre_devolucion_fecha: fechaFinISO,
            pre_duracion: '0'
        };
        const requestPrestamo = {
            method: 'PATCH',
            body: JSON.stringify(bodyPrestamo),
            headers: { "Content-Type": "application/json", Accept: "*/*" }
        };

        console.log('🏁 endTrip 5G enviando prestamo:', bodyPrestamo);
        let resPrestamo = await customFetch(urlPrestamo, requestPrestamo);
        console.log('🏁 endTrip 5G prestamo response:', JSON.stringify(resPrestamo?.body));

        // 2. Actualizar la Bicicleta
        const urlBicicleta = URLMysql + "bc_bicicletas/updateEstado";
        const bodyBicicleta = {
            bic_id: trip.pre_bicicleta || trip.bikeId,
            bic_estado: 'DISPONIBLE'
        };
        const requestBicicleta = {
            method: 'POST', // Este endpoint /updateEstado usa POST
            body: JSON.stringify(bodyBicicleta),
            headers: { "Content-Type": "application/json", Accept: "*/*" }
        };

        console.log('🏁 endTrip 5G enviando bici:', bodyBicicleta);
        let resBicicleta = await customFetch(urlBicicleta, requestBicicleta);
        console.log('🏁 endTrip 5G bici response:', JSON.stringify(resBicicleta?.body));

        return { success: true, message: 'Viaje finalizado correctamente' };
    } catch (error) {
        console.log('❌ endTrip 5G error:', JSON.stringify(error));
        return { success: false, error: JSON.stringify(error) };
    }
}

const getUserLoggedApi = async (id) => {
    let property = "id";
    let table = "users";
    const url = `${URL}${table}/?filter={"where":{"${property}":"${id}"}}`;
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}

const getChallengeInformation = async (id) => {
    let property = "id";
    let table = "challenges";
    const url = `${URL}${table}/?filter={"where":{"${property}":"${id}"},"include": [{ "relation": "userTrackings" }]}`;
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}

const getChallengeInformationSurvey = async (id) => {
    let table = "challenge-survey";
    const url = `${URL}${table}/${id}`;
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}

const pickDevice = async (polarUserInfo) => {
    const url = URL + "polar/tokenEndpoint";
    const request = {
        method: 'POST',
        body: JSON.stringify(polarUserInfo)
    };
    return customFetch(url, request)
        .then(response => { return response.body });
}

// =====================================================================
// FUNCIONES ANTIGUAS DE MONGODB - COMENTADAS (migración a solo MySQL)
// Se conservan por referencia histórica
// =====================================================================

// const postUser_MONGO = async (user) => {
//     console.log('se envio postUser')
//     try {
//         const url = URL + "users/login";
//         const request = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ "user": "admin-bc@gmail.com", "password": "5555" })
//         };
//         let response = await fetch(url, request);
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         const tokenToUse = data.token;
//         if (tokenToUse) {
//             const urlSendUser = URL + "users";
//             const requestSendUser = {
//                 method: 'POST',
//                 body: JSON.stringify(user),
//                 headers: { Authorization: `Bearer ${tokenToUse}` }
//             };
//             let response = await customFetch(urlSendUser, requestSendUser);
//             return response.body;
//         }
//     } catch (error) { return JSON.stringify(error); }
// }

// const postUserExtended_MONGO = async (user) => {
//     try {
//         const url = URL + "users/login";
//         const request = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ "user": "admin-bc@gmail.com", "password": "5555" })
//         };
//         let response = await fetch(url, request);
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         const tokenToUse = data.token;
//         if (tokenToUse) {
//             const urlSendUser = `${URLMysql}bc_usuarios/registrar`;
//             const requestSendUser = {
//                 method: 'POST',
//                 body: JSON.stringify(user),
//                 headers: {
//                     "Content-type": "application/json; charset=UTF-8",
//                     Authorization: `Bearer ${tokenToUse}`
//                 }
//             };
//             return fetch(urlSendUser, requestSendUser)
//                 .then(response => response.ok)
//                 .catch((err) => console.log("error" + JSON.stringify(err)));
//         }
//     } catch (error) { return JSON.stringify(error); }
// }

// const deleteUser_MONGO = async (userId) => {
//     try {
//         const url = URL + "users/login";
//         const request = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ "user": "admin-bc@gmail.com", "password": "5555" })
//         };
//         let response = await fetch(url, request);
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         const tokenToUse = data.token;
//         if (tokenToUse) {
//             const urlDeleteUser = `${URL}users/${userId}`;
//             const requestDeleteUser = {
//                 method: 'DELETE',
//                 headers: { Authorization: `Bearer ${tokenToUse}` }
//             };
//             let response = await customFetch(urlDeleteUser, requestDeleteUser);
//             return response.body;
//         }
//     } catch (error) { return JSON.stringify(error); }
// }

// =====================================================================
// NUEVA FUNCIÓN - Registro directo en MySQL (sin MongoDB)
// Escribe en bc_registro_ext, bc_usuarios y bc_usuarios_roles en una
// sola transacción del lado del servidor
// =====================================================================
const registerUserMySQL = async (userData) => {
    console.log('[REGISTRO MySQL] Enviando datos de registro...');
    try {
        const urlRegister = `${URLMysql}bc_usuarios/registrar`;
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(userData)
        };
        let response = await fetch(urlRegister, request);
        console.log('[REGISTRO MySQL] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[REGISTRO MySQL] Error response:', errorText);
            return { error: true, message: errorText, status: response.status };
        }

        const responseText = await response.text();
        console.log('[REGISTRO MySQL] Registro exitoso:', responseText);
        return { ok: true, data: responseText };
    } catch (error) {
        console.error('[REGISTRO MySQL] Error:', error);
        return { error: true, message: error.message };
    }
}


const linkPolar = async (polarUserInfo) => {
    console.log(polarUserInfo, "info de polar..");
    const url = URL + "polar/link";
    const request = {
        method: 'POST',
        body: JSON.stringify(polarUserInfo)
    };
    return customFetch(url, request)
        .then(response => { return response.body });
}

const garminAuth = async () => {
    const url = URL + "garmin/auth";
    let ts = {};
    const request = {
        method: 'POST',
        body: JSON.stringify(ts)
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("err", err) });
}

const garminSaveInfo = async (data) => {
    const url = URL + "garmin/accessToken";
    const request = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("err", JSON.stringify(err)) });
}

const authSuunto = async (codeSuunto) => {
    const url = URL + "suunto/auth";
    const request = {
        method: 'POST',
        body: JSON.stringify(codeSuunto)
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("err", JSON.stringify(err)) });
}

const getStationsByFilter = async (organizationId) => {
    //console.log('el IIIIIIIIDDDDDDDD para filtrar estaciones', organizationId)
    const url = URL + `stations/?filter={"where": {"organizationId": "${organizationId}", "state": "true"}}`;
    const request = {
        method: 'GET',
    }
    return customFetch(url, request).then((res) => {
        //console.log('dato serializable? ::', res.body)
        return res.body
    }).catch((err) => {
        console.log("err", JSON.stringify(err))
    });
}

const postPolarUser = async (polarUser) => {
    console.log(polarUser, "inRequest123");
    const url = URL + "polar/users";
    const request = {
        method: 'POST',
        body: JSON.stringify(polarUser)
    };
    console.log(request, "request124");
    return customFetch(url, request)
        .then(response => { return response.body });
}

const getEventsClub = async (id) => {
    let property = "id";
    let table = "clubs/" + id + "/event-users";
    const url = `${URL}${table}/?filter={"include": [{ "relation": "challenge" }]}`;
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}


const getUsers = async () => {
    const url = URL + "users";
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const getSubscriptions = async () => {
    const url = URL + "subscriptions";
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const getUserInfos = async () => {
    const url = URL + "user-infos";
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};
const getUserTrackings = async (user, device) => {
    const token = await getItem('token');
    const url = `${URL}user-trackings?filter={"where":{"userId":"${user}","deviceId":"${device}","challengeId":{"exists":false}},"limit":10,"order":"created_at DESC"}`;
    const request = {
        method: 'GET',
        //Authorization: `Bearer ${token}`,
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};
const sendMail = async (mailobj) => {
    const url = URL + "sendmail";
    const request = {
        method: 'POST',
        body: JSON.stringify(mailobj)
    };
    return customFetch(url, request)
        .then(response => { return response.body });
}

const getUsersByFilter = async (filterUsers) => {
    if (filterUsers) {
        filterUsers = filterUsers.replace('*', '')
        let encodeFilter = encodeURIComponent(filterUsers);
        var filterWhere = {
            where: {
                name: { like: encodeFilter, options: "i" }
            }
        }
        var filterWhereStr = JSON.stringify(filterWhere);
    }
    const url = `${URL}user-infos/?filter=${filterWhereStr}`;
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const getUsersByMail = async (filterUsers) => {
    if (filterUsers) {
        filterUsers = filterUsers.replace('*', '')
        let encodeFilter = encodeURIComponent(filterUsers);
        var filterWhere = {
            where: {
                email: { like: encodeFilter, options: "i" },
            },
            include: [{
                relation: "userInfo"
            }]
        }
        var filterWhereStr = JSON.stringify(filterWhere);
    }
    const url = `${URL}users/?filter=${filterWhereStr}`;
    const request = {
        method: 'GET',
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const getUserWithRole = async (id_user) => {
    const token = await getItem('token')
    const request = {
        method: 'GET',
    };
    var filter = {
        where: {
            id: id_user,
        },
        include: [{
            relation: "userRoles"
        }]
    }
    var filterWhere = JSON.stringify(filter);
    const endPoint = `${URL}users/?filter=${filterWhere}`;
    return customFetch(endPoint, request).then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}

const getByFilter = async (id_user) => {
    const token = await getItem('token')
    const request = {
        method: 'GET',
    };
    var filter = {
        where: {
            id: id_user,
        },
        include: [{
            relation: "userRoles"
        }]
    }
    var filterWhere = JSON.stringify(filter);
    const endPoint = `${URL}users/?filter=${filterWhere}`;
    return customFetch(endPoint, request).then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}

const getByFilterOrder = async (table, filter, property) => {
    const request = {
        method: 'GET',
    };
    const endPoint = `${URL}${table}/?filter={"where":{"${property}":"${filter}"},"order":["updated_at DESC"]}`;
    return customFetch(endPoint, request).then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
}
const updateUserInfos = async (user, userId) => {
    const token = await getItem('token')
    const url = URL + "user-infos/" + userId;
    if (user.photo) user.photo = user.photo.replace(/\?.+/g, "$'")
    const request = {
        method: 'PUT',
        body: JSON.stringify(user),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const postImgFile = async (formData, type = null) => {
    let url = URLMysql + "upload";
    if (type) {
        url += `?type=${type}`;
    }
    try {
        let res = await fetch(url, {
            method: 'POST',
            body: formData
            // Let React Native fetch auto-generate the Content-Type header with the boundary
        });
        return await res.json();
    } catch (err) {
        console.error("Error en postImgFile local:", err);
        return { error: err };
    }
}

const createConfig = async (newConfig) => {
    const url = URL + "configurations";
    const request = {
        method: 'POST',
        body: JSON.stringify(newConfig),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const createUserEvent = async (newEventUser) => {
    const url = URL + "event-users";
    const request = {
        method: 'POST',
        body: JSON.stringify(newEventUser),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const sendNotification = async (notification) => {
    const url = URL + "notifications";
    const request = {
        method: 'POST',
        body: JSON.stringify(notification),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};



const createUserInfo = async (newUser) => {
    console.log(newUser, "33jjnn")
    const url = URL + "user-infos";
    if (newUser.photo) newUser.photo = newUser.photo.split('?')[0]
    const request = {
        method: 'POST',
        body: JSON.stringify(newUser),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)); return { error: err } });
};


const createChallenge = async (newChallenge) => {
    const url = URL + "challenges";
    const request = {
        method: 'POST',
        body: JSON.stringify(newChallenge),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const createClub = async (newClub) => {
    const url = URL + "clubs";
    const request = {
        method: 'POST',
        body: JSON.stringify(newClub),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const createAward = async (newAward) => {
    const url = URL + "awards";
    const request = {
        method: 'POST',
        body: JSON.stringify(newAward),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};


const createCustomerPayu = async (name, email) => {
    let bod = {
        "fullName": name,
        "email": email
    }
    const url = URL + "crearCliente";
    const request = {
        method: 'POST',
        body: JSON.stringify(bod),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("ERROR PAYUUUU HERE USER CREATE CUSTOMER" + JSON.stringify(err)) });
};

const createTargetPayu = async (id, rest) => {
    const url = URL + "crearTarjetaCredito/" + id;
    const request = {
        method: 'POST',
        body: JSON.stringify(rest),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const createSubscriptionPayu = async (rest, userId) => {
    const url = URL + "crearSuscripcionElementosExistentes/" + userId;
    const request = {
        method: 'POST',
        body: JSON.stringify(rest),
    };
    return customFetch(url, request)
        .then(response => { return response.body }).catch((err) => { console.log("error" + JSON.stringify(err)) });
};

const registerConfiguration = async (config, token) => {
    const url = URL + "configurations";
    const request = {
        method: 'POST',
        body: JSON.stringify(config),
    };
    return customFetch(url, request)
        .then(response => { return response.json() });
};


/**
* Petition POST with Headers "Bearer auth"
* @param
*/
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

    return customFetch(url, request).then(response => {
        console.log('la response _____________', response);
        return response.body ? response.body : response
    }).catch((err) => { console.log("error post file Headers ", err) });
}


const get = async (url, filter) => {
    const request = {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    };
    let endPoint = `${URL}${url}`;
    if (!!filter) endPoint += `?filter=${JSON.stringify(filter)}`;
    return customFetch(endPoint, request).then(response => { return response.body }).catch((err) => {
        console.log(JSON.stringify(err));
        return { error: err.message || 'Unknown error' };
    });
}

const getCount = async (url, where) => {
    const token = await getItem('token')
    const request = {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            //Authorization: "Bearer " + token.token
        }
    };
    const endPoint = `${URL}${url}?where=${JSON.stringify(where)}`;
    return customFetch(endPoint, request).then(response => { return response.body });
}


export const setTokenToUser = async phoneToken => {
    const user = await getItem('user');
    await setItem('tokenUser', phoneToken,);
    let body = {
        user_id: user.id,
        token: phoneToken,
        created_at: new Date(),
        updated_at: new Date()
    }
    const ur = `${URL}tokens`;
    return customFetch(ur, {
        method: 'POST',
        body: JSON.stringify(body),
    }).then(response => { return response }).catch((err) => { console.log(err); return err });
};


export const deleteToken = async () => {
    let user = await getItem('user');
    let tokenuser = await getItem('tokenUser');
    console.log(tokenuser);
    const URLGET = `${URL}tokens?filter={"where":{"user_id":"${user.id}","token":"${tokenuser}"}}`;
    return customFetch(URLGET, {
        method: "GET",
    })
        .then(response => response.body)
        .then((resp) => {
            console.log(resp, "this resp");
            if (resp) {
                console.log("traido");
                console.log(resp);
                const URLD = `${URL}tokens/${resp[0].id}`;
                customFetch(URLD, {
                    method: 'DELETE',
                }).then((res) => { return res.body }).catch((err) => { console.log("Error con token firebase") });
            }
        })

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

const patchFieldMysql = async (table, id, parameters) => {
    const token = await getItem('token');
    const request = {
        method: 'PATCH',
        body: JSON.stringify(parameters),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        }
    };
    const endPoint = `${URLMysql}${table}/${id}`;
    return fetchJSON(endPoint, request).then(response => { return response.body }).catch((err) => { console.log("ERROR PATCH MYSQL " + table + JSON.stringify(err)) });
}

const patchField_sin_token = async (table, id, parameters) => {

    try {
        const url = URL + "users/login";
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "user": "admin-bc@gmail.com", "password": "5555" })
        };
        let response = await fetch(url, request);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const tokenToUse = data.token;
        console.log('nuevo token para cambio contrasena con admmin-bc@gmail.com')
        if (tokenToUse) {
            try {
                const request = {
                    method: 'PATCH',
                    body: JSON.stringify(parameters),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        Authorization: `Bearer ${tokenToUse}`,
                    }
                };
                const endPoint = `${URL}${table}/${id}`;
                return fetchJSON(endPoint, request)
                    .then(response => {
                        console.log('los parametros son la password random', parameters)
                        console.log('la respuesta al cambiar password//', response)
                        return {
                            ok: response.response.ok,
                            status: response.response.status,
                            body: response.body
                        };
                    })
                    .catch((err) => { console.log("ERROR PATCHHHHHH " + table + JSON.stringify(err)) });
            }
            catch (error) {
                return JSON.stringify(error);
            }
        }
    } catch (error) {
        return JSON.stringify(error);
    }
}

const enviar_recuperacion_password = async (table, email, password) => {
    try {
        const url = URL + "users/login";
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "user": "admin-bc@gmail.com", "password": "5555" })
        };
        let response = await fetch(url, request);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const tokenToUse = data.token;
        console.log('nuevo token para cambio contrasena con admmin-bc@gmail.com')
        if (tokenToUse) {
            try {
                let msn_data = {
                    "email": email,
                    "password": password
                }
                const request = {
                    method: 'POST',
                    body: JSON.stringify(msn_data),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        Authorization: `Bearer ${tokenToUse}`,
                    }
                };
                const endPoint = `${URLMysql}/${table}`;
                console.log('endPoint', endPoint);
                return fetchJSON(endPoint, request)
                    .then(response => {
                        console.log('la respuesta en CORREO', response)
                    })
                    .catch((err) => { console.log("ERROR PATCHHHHHH " + table + JSON.stringify(err)) });
            }
            catch (error) {
                return JSON.stringify(error);
            }
        }
    } catch (error) {
        return JSON.stringify(error);
    }
}

const putItem = async (table, id, parameters) => {
    delete parameters.deleted_at;
    const request = {
        method: 'PUT',
        body: JSON.stringify(parameters),
        /*headers: {
            "Content-type": "application/json; charset=UTF-8",
        }*/
    };
    const endPoint = `${URL}/${table}/${id}`;
    return customFetch(endPoint, request).then(response => { return true }).catch((err) => { console.log(JSON.stringify(err)) });
}

const postData = async (table, body) => {
    delete body.deleted_at;
    console.log('INTENTANDO GUARDAR REG INICIAL ACA TABLA_::::::', table);
    console.log('INTENTANDO GUARDAR REG INIICIAL ESTO ES EL BODY::::::', body);
    const request = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    };
    const endPoint = `${URL}/${table}`;
    return customFetch(endPoint, request).then(response => {
        return response.body
    }).catch((err) => {
        console.log('ESTOOOOOOOOOO sera que error ::::::;;::;', err)
    });
}

const post = async (urlApi, dataInfo) => {
    const url = URL + urlApi;
    let data = dataInfo
    if (!data.createdAt && !data.updatedAt) {
        data.createdAt = new Date();
        data.updatedAt = data.createdAt;
    }
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return customFetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
};

const postMysql = async (urlApi, dataInfo) => {
    const url = URLMysql + urlApi;
    const request = {
        method: 'POST',
        body: JSON.stringify(dataInfo),
    };
    return customFetch(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
};

const validationUserDocument = async (tabla, cc) => {
    try {
        const urlLogin = URLMysql + "bc_usuarios/login_app";
        const loginRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: "admin-bc@gmail.com", password: "5555" })
        };



        const loginResponse = await fetch(urlLogin, loginRequest);
        if (!loginResponse.ok) {
            console.error('Error en el login de validación de usuario');
            return false;
        }

        const loginData = await loginResponse.json();
        const tokenToUse = loginData.token;

        if (tokenToUse) {
            const urlValidateUser = `${URLMysql}${tabla}/id/${cc}`;
            console.log('Validando usuario en:', urlValidateUser);

            const requestSendUser = {
                method: 'GET',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${tokenToUse}`
                }
            };

            const validateResponse = await fetch(urlValidateUser, requestSendUser);
            console.log('Respuesta de validación recibida:', validateResponse.status);
            if (!validateResponse.ok) {
                console.error('Error en la respuesta de validación');
                return false;
            }

            const data = await validateResponse.json();
            console.log('Datos de validación JSON:', data);
            const user = data.data; // Accede al objeto user
            const extended = data.dataRegisterExtended; // Accede al objeto extended
            const rol = data.dataRol; // Accede al objeto rol (añadido recientemente)

            // Si todos son null, el usuario NO existe (puede registrarse) -> true
            if (user === null && extended === null && rol === null) {
                console.log('Usuario no existe en ninguna tabla, validación exitosa');
                return true;
            } else {
                console.log('Usuario ya existe o tiene registros huérfanos, validación fallida', { user, extended, rol });
                return false;
            }

        } else {
            console.error('No se obtuvo token de validación');
            return false;
        }
    } catch (error) {
        console.error("Error en validationUserDocument:", error);
        return false;
    }
}



export const api = {
    post,
    createUserInfo,
    getUsers,
    createChallenge,
    validationEndTripC,
    postFileHeaders,
    getUserWithRole,
    getByFilter,
    authSuunto,
    pickDevice,
    postPolarUser,
    createAward,
    createConfig,
    updateUserInfos,
    getUsersByFilter,
    getUsersByMail,
    registerConfiguration,
    createClub,
    patchField,
    patchField_sin_token,
    createUserEvent,
    getChallengeInformation,
    getChallengeInformationSurvey,
    sendMail,
    getSubscriptions,
    get,
    getCount,
    putItem,
    getEventsClub,
    getUserLoggedApi,
    sendNotification,
    createCustomerPayu,
    createTargetPayu,
    getByFilterOrder,
    createSubscriptionPayu,
    linkPolar,
    garminAuth,
    garminSaveInfo,
    // postUser, // COMENTADO - migración a MySQL
    getUserTrackings,
    validateTrip,
    validationEndTrip,
    endTrip,
    postData,
    getStationsByFilter,
    validationUserDocument,
    // postUserExtended, // COMENTADO - migración a MySQL
    // deleteUser, // COMENTADO - migración a MySQL
    registerUserMySQL,
    guardandoIndicadores,
    guardandoPreoperacionales,
    enviar_recuperacion_password,
    postMysql,
    postImgFile,
    patchFieldMysql
}


