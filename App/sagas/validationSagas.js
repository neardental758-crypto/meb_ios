import {
    CHANGE_PASSWORD,
    SAVE_USER_LOGIN,
    SET_PASSWORD_ERROR,
    VALIDATE_PASSWORD,
    VALIDATE_INFO_USER_EXPERIENCE,
    POST_IMG_EXPERIENCE
} from '../types/types'
import { put, select, takeLatest, delay } from 'redux-saga/effects';
import { Env } from "../Utils/enviroments";
/* eslint-disable prettier/prettier */
import { Alert } from 'react-native';
import { validate } from 'validate.js';

function* validatePassword(action) {
    let errorPasword = {
        equal: true,
        paswordLength: true,
        errorMessage: ""
    };
    if (action.passwords.password.length >= 4) {
        var constraints = {
            confirmPassword: {
                equality: "password"
            }
        };

        var validationResults = validate({ password: action.passwords.password, confirmPassword: action.passwords.repeatedPassword }, constraints);
        if (!validationResults) {
            const userState = yield select((state) => state.globalReducer.user);
            userState.password = action.passwords.password
            yield put({ type: SAVE_USER_LOGIN, user: userState });
            yield put({ type: CHANGE_PASSWORD });
        } else {
            yield delay(100);
            Alert.alert('Alert', 'las contraseñas no coinciden'); //pendiente
            errorPasword = {
                equal: false,
                paswordLength: true,
                errorMessage: "las contraseñas no coinciden"
            };
        }
    } else {
        yield delay(100);
        Alert.alert('Alert', 'La contraseñas debe tener 4 dígitos'); //pendiente
        errorPasword = {
            equal: true,
            paswordLength: false,
            errorMessage: "la contraseñas debe tener 4 dígitos"
        };
    }
    console.log('errorPasword->', errorPasword)
    yield put({ type: SET_PASSWORD_ERROR, errorChangePassword: errorPasword });
}

function* validateInfoUserExperience() {
    console.log('eeeeeeeeeeeeen validando experiencia')

    if (Env.modo === 'movil') {
        const documentPhoto = yield select((state) => state.userReducer.documentUser);

        if (documentPhoto.assets.length == 0) {
            error.push('* Debe tomar la foto de la bicicleta')
        }
    }

    const { feedback } = yield select((state) => state.othersReducer.feedback);
    let error = []

    if (!feedback.comment) {
        error.push('* Debe agregar un comentario sobre su experiencia')
    }
    if (!feedback.rating) {
        error.push('* La calificación de la experiencia es necesaria')
    }

    var valtoPrint = "";
    for (var p in error) {
        if (error.hasOwnProperty(p)) {
            valtoPrint = valtoPrint.concat(JSON.stringify((error[p])).slice(1, -1))
            valtoPrint = valtoPrint.concat("\n")
        }
    }
    if (valtoPrint.length != 0) {
        setTimeout(function () { Alert.alert('Verifica', valtoPrint); }, 100)
    }
    if (valtoPrint.length == 0) { yield put({ type: POST_IMG_EXPERIENCE }); }
}

function* validatePasswordSaga() {
    yield takeLatest(VALIDATE_PASSWORD, validatePassword);
}
function* validateInfoUserExperienceSaga() {
    yield takeLatest(VALIDATE_INFO_USER_EXPERIENCE, validateInfoUserExperience);
}

export const sagas = [
    validatePasswordSaga(),
    validateInfoUserExperienceSaga()
]