import { getItem } from '../Services/storage.service'
import { Env } from "../Utils/enviroments";

const URL = Env.apiUrl;

export const _getToken = async (isFormData, token) => {
    const contentType = !isFormData ? 'application/json' : 'multipart/form-data';
    const accept = !isFormData ? 'application/json' : '*/*';
    return {
        Accept: accept,
        'Content-Type': contentType,
        Authorization: 'Bearer ' + token,
    };
};

const postForgotEmail = async (email) => {
    const url = URL + "users/resetpassword";
    const request = {
        method: 'POST',
        body: JSON.stringify(email),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    };
    return fetch(url, request).then(response => { return response.json() }).catch((err) => { console.log("ERROR HERE " + err) });
};

const createUser = async (newUser) => {
    const url = URL + "users";
    const request = {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    };
    return fetch(url, request)
        .then(response => response.json());
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
        headers: { "Content-type": "application/json; charset=UTF-8" }
    };
    return fetch(url, request)
        .then(response => { return response.json() });
};

export const noapi = {
    createUser,
    postForgotEmail,
    loginUserService
}