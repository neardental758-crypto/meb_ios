/*eslint-disable */
import { sagas as userSagas } from './userSaga';
import { all } from 'redux-saga/effects'
import { sagas as otherSagas } from './othersSaga';
import { sagas as rideSagas } from './rideSaga';
import { sagas as globalSagas } from './globalSagas';
import { sagas as submitSagas } from './submitSagas';
import { sagas as validationSagas } from './validationSagas';
import { sagas as g3Sagas } from './g3Sagas';
import { sagas as sagasCarpooling } from './sagasCarpooling';
import { sagas as tripSagas } from './tripSagas';
import { sagas as sagasPerfil } from './sagasPerfil';
import { sagas as sagasParqueadero } from './sagasParqueadero';
import movilidad5gSaga from './movilidad5gSaga';
import { takeLatest, select, put, delay } from 'redux-saga/effects';
import { APP_INIT, LOCATION_CHANGE, appTypes } from '../types/types';
import { ROUTE_PICKDEVICE, ROUTE_PICKDEVICE_DONE } from '../types/othersTypes';
import { setItem, getItem } from '../Services/storage.service';
import { loginUser } from '../actions/actions';
import { api } from '../api/api.service';

function* initSagas() {
  yield takeLatest(APP_INIT, function* appInit(action) {
    //const navigation = yield select((state) => state.globalReducer.nav._navigation);
    yield put({ type: appTypes.setLoadingLogin, payload: true });
    const user = yield getItem('user');
    const token = yield getItem('token');
    if (user && token) {
      yield put(loginUser(user.email, user.password));

      if (user.error) {
        if (user.length > 0) {
          //navigation.navigate('AuthNavigation')
          console.log('desde rootSaga errores ?? ', user.error)
        } else {
          console.log('navigate error')
        }
      }
    } else {
      yield put({ type: appTypes.setLoadingLogin, payload: false });
    }
  });
}

function* routeToPickDeviceScreen() {
  yield takeLatest(ROUTE_PICKDEVICE, function* routeToPickDevice(action) {
    yield put({ type: ROUTE_PICKDEVICE_DONE, payload: { code: action.code, type: action.codetype } });
  });
}

function* routingSaga() {
  yield takeLatest(LOCATION_CHANGE, function* routing(action) {
    if (action.action.routeName) {
      console.log(action.action.routeName)
      setItem('lastLocation', action.action.routeName)
    }
  });
}
const sagas = [initSagas(), routingSaga(), routeToPickDeviceScreen()]

export default function* rootSaga() {
  yield all([...userSagas, ...otherSagas, ...sagas, ...globalSagas, ...rideSagas, ...validationSagas, ...submitSagas, ...g3Sagas, ...sagasCarpooling, ...tripSagas, ...sagasPerfil, ...sagasParqueadero, movilidad5gSaga()]);
}