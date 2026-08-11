import { Env } from "../Utils/enviroments";
import { getItem } from '../Services/storage.service';
import { fetch as customFetch } from '../Services/refresh.service';

const URL_BASE = Env.apiUrlMysql;

/**
 * Obtener listado de submódulos con su estado y disponibilidad
 */
export const getModulosMovilidad = async () => {
    try {
        const token = await getItem('token');
        const url = `${URL_BASE}introduccion-movilidad/modulos`;
        const request = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };
        const res = await customFetch(url, request);
        return res.body;
    } catch (error) {
        console.error('Error al obtener submódulos:', error);
        return { error: 'Error de conexión al obtener submódulos' };
    }
};

/**
 * Obtener detalle de un submódulo (video y preguntas)
 */
export const getModuloDetalle = async (idModulo) => {
    try {
        const token = await getItem('token');
        const url = `${URL_BASE}introduccion-movilidad/modulos/${idModulo}`;
        const request = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };
        const res = await customFetch(url, request);
        return res.body;
    } catch (error) {
        console.error('Error al obtener detalle del submódulo:', error);
        return { error: 'Error de conexión al obtener detalle del submódulo' };
    }
};

/**
 * Enviar respuestas del cuestionario para validación en el backend
 */
export const finalizarModulo = async (idModulo, respuestas) => {
    try {
        const token = await getItem('token');
        const url = `${URL_BASE}introduccion-movilidad/modulos/${idModulo}/finalizar`;
        const request = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ respuestas, plantilla: Env.plantilla })
        };
        const res = await customFetch(url, request);
        return res.body;
    } catch (error) {
        console.error('Error al finalizar el submódulo:', error);
        return { error: 'Error de conexión al enviar cuestionario' };
    }
};
