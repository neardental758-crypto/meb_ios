import { getItem } from '../Services/storage.service'
import { fetch } from '../Services/refresh.service';
import { Env } from "../Utils/enviroments";

const URL = Env.apiUrl;

const getByFilter = async (table, filter, property) => {
    const token = await getItem('token')
    const request = {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    };
    const endPoint = `${URL}${table}/?filter={"where":{"${property}":"${filter}"}}`;
    return fetch(endPoint, request).then((res) => { return res.body[0] }).catch((error) => { console.log("fetchError", JSON.stringify(error)) });
}
export const get = {
    getByFilter,
}