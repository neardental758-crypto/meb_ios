import { Alert } from 'react-native';
import { put, takeLatest, select, delay } from 'redux-saga/effects';

import {
    CHANGE_PASSWORD
} from '../types/types'
import { api } from '../api/api.service';
import { clearToken } from '../Services/refresh.service'
import { loginUser } from '../actions/actions';
import * as RootNavigation from '../RootNavigation';

function* changePassword() {
    const userState = yield select((state) => state.globalReducer.user);

    let patch = yield api.patchField("users", userState.id, {
        password: userState.password
    })
    if (!!patch) {
        yield delay(100);
        Alert.alert('Alert', 'Error inesperado, vuelva a intentar más tarde'); //pendiente
    } else {
        yield delay(100);
        Alert.alert('Alert', 'La contraseña se ha cambiado exitosamente'); //pendiente
        //const navigation = yield select((state) => state.globalReducer.nav._navigation);

        yield put(loginUser(userState.email, userState.password));
        RootNavigation.navigate("Ride", 'Inicio')
    }
}

function* changePasswordSaga() {
    yield takeLatest(CHANGE_PASSWORD, changePassword);
}

export const sagas = [
    changePasswordSaga(),
]