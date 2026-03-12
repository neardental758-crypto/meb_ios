import { getItem } from '../Services/storage.service'
import { Env } from "../Utils/enviroments";

const URL = Env.apiUrl;
const postForgotEmail = async (email) => {
    const url = URL + "users/resetpassword";
    const request = {
        method: 'POST',
        body: JSON.stringify(email),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    };
    return fetch(url, request).then(response => { return response.json() }).catch((err) => { console.log("ERROR HERE " + err) });
};

const loginUserService = async (userCredentials) => {
    let user = {
        user: userCredentials.email,
        password: userCredentials.password,
    }
    const url = URL + "users/login";
    const request = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    };
    return fetch(url, request)
        .then(response => { return response.json() });
};

export const noapi = {
    postForgotEmail,
    loginUserService
}