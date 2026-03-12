import {
  GET_STATIONS_BEGIN,
  GET_STATIONS_SUCCESS,
  UPDATE_STATIONS,
  VALIDATE_PENALTY_BEGIN,
  VALIDATE_PENALTY_SUCCESS,
} from '../types/types';

const initialState = {
  bikes: [
    {
      latitude: '',
      longitude: '',
      battery: '',
      type: '',
      tripCount: 0,
      state: '',
      number: 0,
      organizationId: '',
      lockId: '',
      stationId: '',
    },
  ],
  //stations: [{id, tooltip: true / false}],
  stations: [],
  userLocation: '',
  message: '',
  loading: false,
  penalty:false,
  estaciones5gCargadas: false,
};

export default mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STATIONS_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case GET_STATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        stations: action.payload,
        estaciones5gCargadas: true
      };
    case VALIDATE_PENALTY_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case VALIDATE_PENALTY_SUCCESS:
      return {
        ...state,
        loading: false,
        penalty:action.payload
      };
    case UPDATE_STATIONS:
      return {
        ...state,
        loading: false,
        stations: action.payload,
        estaciones5gCargadas: true
      };
    default:
      return state;
  }
};
