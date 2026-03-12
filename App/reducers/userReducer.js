import {
  CHANGE_NEED_RECORD,
  END_CALCULATE_TIME,
  GET_ACTIVE_TRIP_BEGIN,
  GET_ACTIVE_TRIP_SUCCESS,
  RECORD_TRIP_BEGIN,
  RECORD_TRIP_SUCCESS,
  SET_GEOLOCATION,
  SET_TRIP_TIME,
  START_CALCULATE_TIME,
  RESET_IMG_EXPERIENCE,
} from '../types/types.js';
import {
  FETCH_CLUB_MEMBER_INFO_SUCCESS,
  ROUTE_PICKDEVICE,
  ROUTE_PICKDEVICE_DONE,
} from '../types/othersTypes.js';
import {
  FETCH_IMAGE_PROFILE_BEGIN,
  FETCH_IMAGE_PROFILE_FAILURE,
  FETCH_IMAGE_PROFILE_SUCCESS,
  FETCH_USER_BEGIN,
  FETCH_USER_EVENT_BEGIN,
  FETCH_USER_EVENT_FAILURE,
  FETCH_USER_EVENT_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_USER_GET_BEGIN,
  FETCH_USER_GET_FAILURE,
  FETCH_USER_GET_SUCCESS,
  FETCH_USER_LOGIN_BEGIN,
  FETCH_USER_LOGIN_FAILURE,
  FETCH_USER_LOGIN_SUCCESS,
  FETCH_USER_PROFILE_BEGIN,
  FETCH_USER_PROFILE_FAILURE,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_REGISTER_BEGIN,
  FETCH_USER_REGISTER_FAILURE,
  FETCH_USER_REGISTER_SUCCESS,
  FETCH_USER_SUCCESS,
  GET_API_DEVICES_FAILURE,
  GET_API_DEVICES_SUCCESS,
  GET_DEVICE_TRACKINGS_SUCCESS,
  GET_USER_EVENTS_SUCCESS,
  GO_GARMIN_BEGIN,
  GO_GARMIN_SUCCESS,
  GO_SUUNTO_BEGIN,
  GO_SUUNTO_SUCCESS,
  LOGOUT,
  LOGOUTSUCCESS,
  ROUTE_LOGIN_BEGIN,
  ROUTE_LOGIN_FAILURE,
  ROUTE_LOGIN_SUCCESS,
  ROUTING,
  SAVE_CIVIL_STATE,
  SAVE_COMPANY_TYPE,
  SAVE_CURRENT_EVENT,
  SAVE_DOCUMENT_USER,
  SAVE_FORM_REGISTER,
  GUARDAR_FORM_REGISTER,
  GUARDAR_FORM_REGISTER_FAILED,
  UPDATE_FORM_REGISTER,
  SAVE_GENDER,
  SAVE_ID_TYPE,
  SAVE_LOADER,
  SAVE_RESIDENT_TYPE,
  SAVE_TOKEN,
  SAVE_TRANSPORTATION_MODE,
  SAVE_USER,
  SAVE_USER_PROGRESS,
  SAVE_USER_TRACKINGS,
  SAVE_WORK_STATUS,
  SET_USER_STORE,
  VALIDATION_FAIL,
  CLEAR_ACTUAL_TRIP,
  GET_STATIONS,
  EDITAR_PERFIL_USER_OK,
  RESET__PROFILE,
  UPDATE_PASSWORD_OK
} from '../types/userTypes.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialState = {
  data: [],
  isFetching: false,
  error: false,
  authenticated: false,
  registerError: false,
  updateProfile: false,
  subscriptionsList: [],
  subscription: '',
  user: {
    id: '',
    username: '',
    email: '',
    password: '',
    created_at: new Date(),
    updated_at: new Date(),
  },
  userInfo: {
    id: '',
    name: '',
    lastname: '',
    userId: '',
    //created_at: new Date(),
    //updated_at: new Date(),
    created_at: '2023',
    updated_at: '2023',
  },
  dataUser: {},
  dataUserInfo: {},
  memberDataUserInfo: {},
  doingLogin: false,
  club: {},
  code: '',
  codetype: '',
  memberClub: {
    name: 'Super club',
  },
  notifications: [],
  uploadAvatar: false,
  updateProfile: false,
  userEventError: true,
  polarUser: {},
  polarTrackings: [],
  garminUser: {},
  garminTrackings: [],
  suuntoUser: {},
  suuntoTrackings: [],
  userEvents: [],
  userChallenges: [],
  userTrackings: [],
  userProgress: {},
  eventUser: false,
  routing: '',
  actualTrip: {},
  actualTripTime: '00:00:00',
  actualTripMinutes: '00',
  alertLimit: false,
  alertLimitExceeded: false,
  needInterval: true,
  coordinates: [],
  needRecord: true,
  //register
  idTypes: [
    /* 
    { id: 1, table: "users", field: "idType", value: "cedula" },
    { id: 2, table: "users", field: "idType", value: "cedula extrangera" },
    { id: 3, table: "users", field: "idType", value: "pasaporte" }
   */
  ],
  residentTypes: [
    /* { id: 1, table: "users", field: "residentType", value: "residente de ibague" },
    { id: 2, table: "users", field: "residentType", value: "residente menor de edad (+16) de ibague" },
    { id: 3, table: "users", field: "residentType", value: "visitante/turista" }
   */
  ],
  genders: [
    /* 
    { id: 1, table: "users", field: "gender", value: "femenino" },
    { id: 2, table: "users", field: "gender", value: "masculino" },
    { id: 3, table: "users", field: "gender", value: "otro" }
   */
  ],
  civilStates: [
    /* 
    { id: 1, table: "users", field: "civilState", value: "soltero" },
    { id: 2, table: "users", field: "civilState", value: "casado" },
    { id: 3, table: "users", field: "civilState", value: "otro" }
   */
  ],
  worksStatus: [
    // { id: 1, table: "users", field: "workStatus", value: "empleado" },
    // { id: 2, table: "users", field: "workStatus", value: "estudiante" },
    // { id: 3, table: "users", field: "workStatus", value: "desempleado" }
  ],
  companyType: [
    // { id: 1, table: "users", field: "workStatus", value: "empleado" },
    // { id: 2, table: "users", field: "workStatus", value: "estudiante" },
    // { id: 3, table: "users", field: "workStatus", value: "desempleado" }
  ],
  transportationMode: [
    // { id: 1, table: "users", field: "workStatus", value: "empleado" },
    // { id: 2, table: "users", field: "workStatus", value: "estudiante" },
    // { id: 3, table: "users", field: "workStatus", value: "desempleado" }
  ],
  formRegister: {},
  formRegisterGuardar: {},
  formRegisterGuardarOK: false,
  user: {},
  token: '',
  documentUser: {
    assets: {},
  },
  loader: false,
  loading: false,
  geolocation: {},
  stationsFromOrganization : [{
    label: "No hay estaciones disponibles",
    value: "No hay estaciones disponibles"
  }],
  porfile_update_ok: false,
  update_password_ok: false
};

export default userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_ACTUAL_TRIP:
      return {
        ...state,
        actualTrip: {},
      }
    case SAVE_LOADER:
      return {
        ...state,
        loader: action.loader,
      };

    case SAVE_DOCUMENT_USER:
      return {
        ...state,
        documentUser: action.document,
      };

    case SAVE_WORK_STATUS:
      return {
        ...state,
        worksStatus: action.worksStatus,
      };

    case SAVE_CIVIL_STATE:
      return {
        ...state,
        civilStates: action.civilStates,
      };
    case SAVE_COMPANY_TYPE:
      return {
        ...state,
        companyType: action.companyType,
      };
    case SAVE_TRANSPORTATION_MODE:
      return {
        ...state,
        transportationMode: action.transportationMode,
      };
    case SAVE_GENDER:
      return {
        ...state,
        genders: action.genders,
      };

    case SAVE_RESIDENT_TYPE:
      return {
        ...state,
        residentTypes: action.residentTypes,
      };

    case SAVE_ID_TYPE:
      return {
        ...state,
        idTypes: action.idTypes,
      };

    case SAVE_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };

    case SAVE_USER:
      return {
        ...state,
        user: action.payload.user,
      };

    case SAVE_FORM_REGISTER:
      return {
        ...state,
        formRegister: action.formRegister,
      };
    case GUARDAR_FORM_REGISTER:
        AsyncStorage.removeItem('user2');
        AsyncStorage.removeItem('tokenOut');
        AsyncStorage.removeItem('refresh2');
        AsyncStorage.removeItem('refresh');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('user');
      return {
        ...state,
        formRegister: action.formRegister,
        formRegisterGuardarOK: true,
      };
    case GET_STATIONS:
      return {
        ...state,
          stationsFromOrganization: action.stations,
      };
    case UPDATE_FORM_REGISTER:
      return {
        ...state,
        formRegister: action.formRegister,
      };
    case GUARDAR_FORM_REGISTER_FAILED:
      return {
        ...state,
        formRegisterGuardar: {},
        formRegisterGuardarOK: false,
      };

    case ROUTING:
      return {
        ...state,
      };
    case FETCH_USER_GET_BEGIN:
      return {
        ...state,
        data: [],
        isFetching: true,
      };
    case FETCH_USER_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload,
      };
    case FETCH_USER_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case ROUTE_PICKDEVICE:
      return {
        ...state,
      };
    case ROUTE_PICKDEVICE_DONE:
      return {
        ...state,
        code: action.payload.code,
        codetype: action.payload.type,
      };
    case GO_GARMIN_BEGIN:
      return {
        ...state,
      };
    case GO_GARMIN_SUCCESS:
      return {
        ...state,
      };
    case GO_SUUNTO_BEGIN:
      return {
        ...state,
      };
    case GO_SUUNTO_SUCCESS:
      return {
        ...state,
      };
    case FETCH_USER_EVENT_BEGIN:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_USER_EVENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case FETCH_USER_EVENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        userEventError: true,
      };
    case FETCH_USER_REGISTER_BEGIN:
      return {
        ...state,
        data: [],
        isFetching: true,
        doingLogin: true,
        registerError: false,
        error: false,
      };
    case FETCH_USER_REGISTER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        registerError: false,
        doingLogin: false,
        user: action.payload.user_res,
        userInfo: action.payload.userInfo_res,
        authenticated: true,
      };
    case FETCH_USER_REGISTER_FAILURE:
      return {
        ...state,
        isFetching: false,
        doingLogin: false,
        registerError: true,
      };
    case ROUTE_LOGIN_BEGIN:
      return {
        ...state,
        isFetching: true,
      };
    case ROUTE_LOGIN_SUCCESS:
      return {
        ...state,
        subscriptionsList: action.payload,
        isFetching: false,
      };
    case ROUTE_LOGIN_FAILURE:
      return {
        ...state,
        subscriptionsList: action.payload,
        isFetching: false,
      };
    case FETCH_USER_LOGIN_BEGIN:
      return {
        ...state,
        data: [],
        isFetching: true,
        doingLogin: true,
        error: false,
      };
    case SET_USER_STORE:
      return {
        ...state,
        dataUser: action.payload,
        subscription: action.subscription,
      };
    case FETCH_USER_LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        doingLogin: false,
        data: action.payload,
        authenticated: true,
        error: false,
      };
    case FETCH_USER_LOGIN_FAILURE:
      return {
        ...state,
        doingLogin: false,
        isFetching: false,
        error: true,
      };
    case FETCH_USER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        dataUser: action.payload,
        dataUserInfo: action.payload.userInfo,
        club: action.payload.userInfo.club,
        notifications: action.payload.userInfo.notifications,
        error: false,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case FETCH_IMAGE_PROFILE_BEGIN:
      return {
        ...state,
        uploadAvatar: true,
        error: false,
      };
    case FETCH_IMAGE_PROFILE_SUCCESS:
      return {
        ...state,
        uploadAvatar: false,
        error: false,
      };
    case FETCH_IMAGE_PROFILE_FAILURE:
      return {
        ...state,
        uploadAvatar: false,
        error: true,
      };
    case FETCH_USER_PROFILE_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: true,
        updateProfile: false,
      };
    case FETCH_USER_PROFILE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: true,
        updateProfile: true,
      };
    case FETCH_USER_PROFILE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        updateProfile: false,
      };
    case VALIDATION_FAIL:
      return {
        ...state,
        isFetching: false,
      };
    case LOGOUT:
      return initialState;
    case LOGOUTSUCCESS:
      return {
        ...state,
        authenticated: false,
      };
    case FETCH_CLUB_MEMBER_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        memberDataUserInfo: action.payload.info[0],
      };
    case GET_API_DEVICES_SUCCESS:
      return {
        ...state,
        polarUser: action.payload.polar,
        garminUser: action.payload.garmin,
        suuntoUser: action.payload.suunto,
      };
    case GET_DEVICE_TRACKINGS_SUCCESS:
      return {
        ...state,
        polarTrackings: action.payload.polar,
        garminTrackings: action.payload.garmin,
        suuntoTrackings: action.payload.suunto,
      };
    case GET_USER_EVENTS_SUCCESS:
      return {
        ...state,
        userEvents: action.payload.events,
        userChallenges: action.payload.challenges,
      };
    case SAVE_USER_TRACKINGS:
      return {
        ...state,
        userTrackings: [action.id, action.parameters],
      };
    case SAVE_USER_PROGRESS:
      return {
        ...state,
        userProgress: action.payload,
      };
    case SAVE_CURRENT_EVENT:
      return {
        ...state,
        eventUser: action.payload,
      };
    case GET_ACTIVE_TRIP_BEGIN:
      return {
        ...state,
        laoding: true,
      };
    case GET_ACTIVE_TRIP_SUCCESS:
      return {
        ...state,
        actualTrip: action.payload,
      };
    case SET_TRIP_TIME:
      return {
        ...state,
        actualTripTime: action.payload,
        actualTripMinutes: action.minutes,
      };
    case END_CALCULATE_TIME:
      return {
        ...state,
        needInterval: false,
      };
    case START_CALCULATE_TIME:
      return {
        ...state,
        needInterval: true,
      };
    case RECORD_TRIP_BEGIN:
      return {
        ...state,
      };
    case RECORD_TRIP_SUCCESS:
      return {
        ...state,
        coordinates: action.coordinate,
      };
    case SET_GEOLOCATION:
      return {
        ...state,
        geolocation: action.payload,
      };
    case CHANGE_NEED_RECORD:
      return {
        ...state,
        needRecord: action.payload,
      };
    case RESET_IMG_EXPERIENCE:
      return {
        ...state,
        documentUser: {
          assets: {},
        },
      }
    case EDITAR_PERFIL_USER_OK:
      return {
        ...state,
        porfile_update_ok: true
      }

    case UPDATE_PASSWORD_OK:
      return {
        ...state,
        update_password_ok: true
      }
    case RESET__PROFILE:
      return {
        ...state,
        porfile_update_ok: false
      }  

    default:
      return state;
  }
};
