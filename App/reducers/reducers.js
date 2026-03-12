import {
  APP_INIT,
  SAVE_USER_LOGIN,
  //SET_PASSWORD_ERROR, 
  SET_TOKEN
} from '../types/types';

import { LOGOUT } from '../types/userTypes';
import { combineReducers } from 'redux';
import layoutReducer from './layoutReducer';
import mapReducer from './mapReducer';
import othersReducer from './othersReducer';
import rideReducer from './rideReducer';
import userReducer from './userReducer';
import reducer3G from './reducer3G';
import reducerParqueadero from './reducerParqueadero';
import reducerCarpooling from './reducerCarpooling';
import reducerPerfil from './reducerPerfil';
import tripReducer from './tripReducer';
import movilidad5gReducer from './movilidad5gReducer';

const initialState = {
  //nav: null,
  token: '',
  user: {},
  /*errorChangePassword: {
    equal: true,
    paswordLength: true,
    errorMessage: "",
  },*/
};

export const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    /*case APP_INIT:
      return {
        ...state,
        nav: action.navigation,
      };*/
    case SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case SAVE_USER_LOGIN:
      return {
        ...state,
        user: action.user,
      };
    /*case SET_PASSWORD_ERROR:
      return {
        ...state,
        errorChangePassword: action.errorChangePassword,
      };*/
    default:
      return state;
  }
};

const rootReducer = {
  userReducer,
  othersReducer,
  globalReducer,
  layoutReducer,
  rideReducer,
  mapReducer,
  reducer3G,
  reducerParqueadero,
  reducerCarpooling,
  reducerPerfil,
  tripReducer,
  movilidad5gReducer
}
export default rootReducer;