/*eslint-disable */
// import { fetch } from '../Services/refresh.service';
import { Env } from "../Utils/enviroments";
import { getItem, setItem } from '../Services/storage.service';
import { fetch3g } from '../Services/refresh.service';

const URLMysql = Env.apiUrlMysql

const get__ = async (tabla) => {
    const token = await getItem('token');
    const url = `${URLMysql}${tabla}`;
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        const response = await fetch(url, request);
        if (!response) {
            return { error: 'No response received from fetch' };
        }
        if (!response.ok) {
            return { 'data' : {} } ;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        // Captura errores en el fetch
        console.error('Fetch error:', error);
        return { error: error.message };
    }
};


const get__empresa = async (tabla) => {
    const token = await getItem('token');
    const user = await getItem('user'); // <- Asegúrate de traer el user desde storage
    const organizacion = user.organizationId;

    const url = `${URLMysql}${tabla}`;
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };

        const response = await fetch(url, request);
        if (!response) {
            return { error: 'No response received from fetch' };
        }

        if (!response.ok) {
            return { data: {} };
        }

        const data = await response.json();

        // Filtrar por emp_id
        const empresaFiltrada = data.data.find(item => item.emp_id === organizacion);

        return {
            data: empresaFiltrada ? [empresaFiltrada] : []
        };

    } catch (error) {
        console.error('Fetch error:', error);
        return { error: error.message };
    }
};

const get__indicadores = async (tabla) => {
    const token = await getItem('token');
    const url = `${URLMysql}${tabla}`;
    console.log('url logros', url)
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        const res = await fetch(url, request);

        // Validar si la respuesta tiene un código de estado exitoso
        if (!res.ok) {
            console.error(`Error HTTP: ${res.status} - ${res.statusText}`);
            throw new Error(`Error HTTP: ${res.status}`);
        }

        // Intentar procesar la respuesta JSON
        const data = await res.json();
        console.log("Datos procesados:", data);
        return data;
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error; // Lanza el error para manejarlo en la saga
    }
};


const get__est = async (tabla) => {
    let url = URLMysql + tabla;
    try {
        const request = {
            method: 'GET'
        };
        let res = await fetch(url, request);
        return res;
    } catch (error) {
        return error;
    }
}



const get_tabla_cc = async (tabla, cc) => {
    const token = await getItem('token')
    let url = URLMysql + tabla + '/id/' + cc;
    console.log('la url de mysviajes ', url)
    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        conso
        return res.body;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const get_user__mysql = async (tabla, cc) => {
    const token = await getItem('token');
    let url = URLMysql + tabla + '/id/' + cc;
    console.log('URL get_tabla_cc:', url);

    try {
        const request = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };

        let res = await fetch(url, request);

        if (!res.ok) {
            // Manejar errores HTTP
            console.error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
            return null;
        }

        // Procesar el cuerpo de la respuesta
        const data = await res.json();
        console.log('Datos del usuario desde MySQL:', data);

        return data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
};

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
    console.log('url::', url)
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

const guardandoCodigo = async (tabla, data) => {
    // Obtener el token del storage
    const token = await getItem('token'); // O como tengas guardado tu token
    
    let url = URLMysql + tabla;
    console.log('la url para guardarcodigo es:', url);
    
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}`, // Incluir el token
        },
    };
    
    return fetch(url, request)
        .then(response => {
            console.log('res status:', response.status);
            console.log('res ok:', response.ok);
            
            if (response.ok) {
                return response.text(); // Tu API devuelve 'ok' como string
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log('Respuesta exitosa:', data);
            return data;
        })
        .catch((err) => {
            console.log("Error en guardandoCodigo:", JSON.stringify(err));
            throw err; // Re-lanzar el error para manejarlo en la saga
        });
}

const patch__ = async (tabla, data) => {
    const token = await getItem('token')
    let url = URLMysql + tabla;
    console.log('url patch referido', url)
    try {
        const request = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            }
        };
        let res = await fetch(url, request);
        console.log("Respuesta de la APIIIIIIII:", res);
        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const guardandoProgresoLogro = async (tabla, data) => {
    const url = URLMysql + tabla;

    const request = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            // Authorization: `Bearer ${token}`, // Descomenta si usas tokens
        },
    };

    try {
        const response = await fetch(url, request);

        if (!response.ok) {
            // Manejo de errores HTTP
            console.error("Error HTTP:", response.status, response.statusText);
            return { error: `HTTP ${response.status} - ${response.statusText}` };
        }

        // Detectar el tipo de contenido de la respuesta
        const contentType = response.headers.get("Content-Type");

        let responseData;
        if (contentType && contentType.includes("application/json")) {
            // Analizar como JSON si el contenido es JSON
            responseData = await response.json();
        } else {
            // Devolver texto plano si no es JSON
            responseData = await response.text();
        }
        // Devuelve la respuesta procesada (puede ser texto o JSON)
        return responseData;
    } catch (err) {
        console.error("Error en la solicitud:", err);
        return { error: "Error en la solicitud", details: err.message };
    }
};
const guardandoProgresoDesafio = async (tabla, data) => {
    const url = URLMysql + tabla;
    const request = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            // Authorization: `Bearer ${token}`, // Descomenta si usas tokens
        },
    };

    try {
        const response = await fetch(url, request);

        if (!response.ok) {
            // Manejo de errores HTTP
            console.error("Error HTTP:", response.status, response.statusText);
            return { error: `HTTP ${response.status} - ${response.statusText}` };
        }

        // Detectar el tipo de contenido de la respuesta
        const contentType = response.headers.get("Content-Type");

        let responseData;
        if (contentType && contentType.includes("application/json")) {
            // Analizar como JSON si el contenido es JSON
            responseData = await response.json();
        } else {
            // Devolver texto plano si no es JSON
            responseData = await response.text();
        }
        // Devuelve la respuesta procesada (puede ser texto o JSON)
        return responseData;
    } catch (err) {
        console.error("Error en la solicitud:", err);
        return { error: "Error en la solicitud", details: err.message };
    }
};




const changeProgreso = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // Asegura el tipo de contenido
        body: JSON.stringify(data), // Serializa correctamente el cuerpo
    };

    try {
        const response = await fetch(url, request);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text(); // Obtén detalles del error si no es exitoso
            console.error("Error en la API:", errorText);
            return { error: `Error ${response.status}: ${errorText}` };
        }

        // Parsear el cuerpo como JSON solo si es exitoso
        const jsonData = await response.json();
        return { error: null, data: jsonData };
    } catch (err) {
        console.error("Error en changeProgreso:", err);
        return { error: err.message };
    }
};
const changeProgresoEstado = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // Asegura el tipo de contenido
        body: JSON.stringify(data), // Serializa correctamente el cuerpo
    };

    try {
        const response = await fetch(url, request);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text(); // Obtén detalles del error si no es exitoso
            console.error("Error en la API:", errorText);
            return { error: `Error ${response.status}: ${errorText}` };
        }

        // Parsear el cuerpo como JSON solo si es exitoso
        const jsonData = await response.json();
        return { error: null, data: jsonData };
    } catch (err) {
        console.error("Error en changeProgresoEstado:", err);
        return { error: err.message };
    }
};
const changeProgresoDesafioEstado = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // Asegura el tipo de contenido
        body: JSON.stringify(data), // Serializa correctamente el cuerpo
    };

    try {
        const response = await fetch(url, request);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text(); // Obtén detalles del error si no es exitoso
            console.error("Error en la API:", errorText);
            return { error: `Error ${response.status}: ${errorText}` };
        }

        // Parsear el cuerpo como JSON solo si es exitoso
        const jsonData = await response.json();
        return { error: null, data: jsonData };
    } catch (err) {
        console.error("Error en changeProgresoDesafioEstado:", err);
        return { error: err.message };
    }
};
const changeEstadoDesafio = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // Asegura el tipo de contenido
        body: JSON.stringify(data), // Serializa correctamente el cuerpo
    };

    try {
        const response = await fetch(url, request);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text(); // Obtén detalles del error si no es exitoso
            console.error("Error en la API:", errorText);
            return { error: `Error ${response.status}: ${errorText}` };
        }

        // Parsear el cuerpo como JSON solo si es exitoso
        const jsonData = await response.json();
        return { error: null, data: jsonData };
    } catch (err) {
        console.error("Error en changeEstadoDesafio:", err);
        return { error: err.message };
    }
};


const savePuntos = async (tabla, data) => {
    let url = URLMysql + tabla;
    const request = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    return fetch3g(url, request)
        .then(response => {
            return response.body
        }).catch((err) => {
            console.log("error" + JSON.stringify(err))
        });
}


export const apiPerfil = {
    get_tabla_cc,
    get_tabla_documento,
    get__,
    get__empresa,
    get__est,
    patch__,
    post__,
    guardandoProgresoLogro,
    guardandoProgresoDesafio,
    changeProgreso,
    changeEstadoDesafio,
    changeProgresoEstado,
    changeProgresoDesafioEstado,
    get__indicadores,
    get_user__mysql,
    guardandoCodigo,
    savePuntos
}