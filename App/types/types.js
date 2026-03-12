export const FETCH_ERROR = '[general] fetch error';
export const APP_INIT = '[general] app init';
export const LOCATION_CHANGE = '[general] location change';
export const NAVIGATION_LOGIN = 'NAVIGATION_LOGIN'
export const NAVIGATION_NEWTICKET = 'NAVIGATION_NEWTICKET'

export const SET_TOKEN = 'SET_TOKEN';
export const GET_USER_DATA = 'GET_USER_DATA';
export const VALIDATE_USER = 'VALIDATE_USER';
export const SAVE_USER = 'SAVE_USER';
export const SAVE_USER_LOGIN = 'SAVE_USER_LOGIN';
export const VALIDATE_LOGIN = 'VALIDATE_LOGIN';
export const LOGIN_USER = 'LOGIN_USER';


export const ROUTING_IF_HAS_TRIP = 'ROUTING_IF_HAS_TRIP';
export const VALIDATE_EMAIL_PASSWORD = 'VALIDATE_EMAIL_PASSWORD';
export const CHANGE_FORGOT_PASSWORD = 'CHANGE_FORGOT_PASSWORD';

export const VALIDATE_PASSWORD = 'VALIDATE_PASSWORD';
export const SET_PASSWORD_ERROR = 'SET_PASSWORD_ERROR';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

export const GET_STATIONS_BEGIN = 'GET_STATIONS_BEGIN';
export const GET_STATIONS_BEGIN_B = 'GET_STATIONS_BEGIN_B';
export const GET_STATIONS_SUCCESS = 'GET_STATIONS_SUCCESS';
export const UPDATE_STATIONS = '[map] update stations info';
export const VALIDATE_PENALTY_BEGIN = 'VALIDATE_PENALTY_BEGIN';
export const VALIDATE_PENALTY_SUCCESS = 'VALIDATE_PENALTY_SUCCESS';

export const SOCKET_INIT = '[chat] socket conection';
export const SOCKET_DESCONECTION = '[chat] socket desconection';
export const SOCKET_RECEIVE_UPDATE_STATION = '[chat] socket updateStation';

export const GET_ACTIVE_TRIP_BEGIN = 'GET_ACTIVE_TRIP_BEGIN';
export const GET_ACTIVE_TRIP_SUCCESS = 'GET_ACTIVE_TRIP_SUCCESS';
export const CALCULATE_TRIP_TIME = 'CALCULATE_TRIP_TIME';
export const END_CALCULATE_TIME = 'END_CALCULATE_TIME';
export const START_CALCULATE_TIME = 'START_CALCULATE_TIME';
export const SET_TRIP_TIME = 'SET_TRIP_TIME';
export const GET_GEOLOCATION_PERMISSIONS = 'GET_GEOLOCATION_PERMISSIONS';
export const NOTIFICATION_PERMISSIONS = 'NOTIFICATION_PERMISSIONS';

export const RECORD_TRIP_BEGIN = 'RECORD_TRIP_BEGIN';
export const RECORD_TRIP_SUCCESS = 'RECORD_TRIP_SUCCESS';

export const appTypes = {
	getCurrentLocation: '[global] getCurrentLocation',
	validationEndTrip: '[global] validationEndTrip',
	endTrip: '[global] endTrip',
	endTripValidationError: '[global] endTripValidationError',
	setLoadingEnd: '[global] setLoadingEnd',
	setLoadingResume: '[global] setLoadingResume',
	setLoadingLogin: '[global] setLoadingLogin',
	toggleDrawer: '[global] toggleDrawer',
	onSelectPhoto: '[global] onSelectPhoto',
	setBluetoothLoader: '[global] setBluetoothLoader',
}

export const CHANGE_NEED_RECORD = 'CHANGE_NEED_RECORD';

export const GET_ACTIVE_FINISHING_TRIPS = 'GET_ACTIVE_FINISHING_TRIPS';
export const SET_CURRENT_TRIP = 'SET_CURRENT_TRIP';
export const SET_FEEDBACK = 'SET_FEEDBACK';
export const CLEAR_ACTUAL_TRIP = 'CLEAR_ACTUAL_TRIP';
export const POST_USER_FEEDBACK = 'POST_USER_FEEDBACK';
export const VALIDATE_INFO_USER_EXPERIENCE = 'VALIDATE_INFO_USER_EXPERIENCE';
export const POST_IMG_EXPERIENCE = 'postImgExperience';

export const SET_NEW_TRIP = 'SET_NEW_TRIP';
export const SET_STATUS_LOCK_OPEN = 'SET_STATUS_LOCK_OPEN';
export const RESET_IMG_EXPERIENCE = 'RESET_IMG_EXPERIENCE';