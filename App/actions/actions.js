import {
  APP_INIT,
  CALCULATE_TRIP_TIME,
  CHANGE_PASSWORD,
  END_CALCULATE_TIME,
  GET_ACTIVE_TRIP_BEGIN,
  GET_GEOLOCATION_PERMISSIONS,
  NOTIFICATION_PERMISSIONS,
  GET_STATIONS_BEGIN,
  GET_STATIONS_BEGIN_B,
  GET_USER_DATA,
  LOCATION_CHANGE,
  LOGIN_USER,
  NAVIGATION_LOGIN,
  RECORD_TRIP_BEGIN,
  ROUTING_IF_HAS_TRIP,
  SAVE_USER_LOGIN,
  SET_PASSWORD_ERROR,
  SET_TOKEN,
  SOCKET_INIT,
  SOCKET_RECEIVE_UPDATE_STATION,
  START_CALCULATE_TIME,
  VALIDATE_EMAIL_PASSWORD,
  VALIDATE_LOGIN,
  VALIDATE_PASSWORD,
  VALIDATE_PENALTY_BEGIN,
  VALIDATE_USER,
  appTypes,
  GET_ACTIVE_FINISHING_TRIPS,
  SET_CURRENT_TRIP,
  SET_FEEDBACK,
  CLEAR_ACTUAL_TRIP,
  VALIDATE_INFO_USER_EXPERIENCE,
  POST_USER_FEEDBACK,
  POST_IMG_EXPERIENCE,
  RESET_IMG_EXPERIENCE
} from '../types/types.js';

import {
  FETCH_DEVICE_CONFIGURATION_BEGIN,
  FETCH_SUPPORT_BEGIN,
  FETCH_SYNC_BEGIN,
  FETCH_CREATE_CLUB_BEGIN,
  FETCH_UPLOAD_CLUB_IMAGE_BEGIN,
  FETCH_FILTER_CLUB_MEMBER_BEGIN,
  FETCH_FILTER_CLUB_ADMIN_BEGIN,
  FETCH_USER_CONFIGURATION_BEGIN,
  PATCH_CHANGE_LANGUAGE_CONFIGURATION_BEGIN,
  PATCH_CHANGE_UNITS_CONFIGURATION_BEGIN,
  PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_BEGIN,
  PUT_EMAILANDPASS_BEGIN,
  FETCH_FORGOT_PASSWORD_BEGIN,
  FETCH_NOTIFICATION_BEGIN,
  FETCH_LOAD_CLUB_BEGIN,
  FETCH_DELETE_CLUB_BEGIN,
  CLEAR_CLUBINFO,
  FETCH_CLUB_INFO_BEGIN,
  FETCH_CLUB_MEMBER_INFO,
  FETCH_EDIT_CLUB_BEGIN,
  CHANGE_NOTIFICATION_BEGIN,
  FETCH_SUBSCRIPTION_BEGIN,
  ACCEPT_TERMS,
  ROUTE_PICKDEVICE,
  SET_APP_CONNECTION_STATUS,

  SET_ACTIVE_TRIPS_BOOLEAN,
  SET_MASTER_LIST_TICKET_DATA,
  GET_MASTER_LIST_DATA,
  VALIDATE_TICKET_FORM,
  SEND_FORM_DATE,
  GET_ACTIVE_TRIPS,
  SET_USER_HAS_TRIP,
} from '../types/othersTypes.js';

import {
  CLEAR_CREATECHALLENGE,
  FETCH_EVENTAWARD_CREATE_BEGIN,
  FETCH_EVENTUSER_SUBSCRIPTION_BEGIN,
  FETCH_EVENT_CREATE_BEGIN,
  FETCH_UPLOAD_EVENTTRACK_IMAGE_BEGIN,
  FETCH_UPLOAD_EVENT_IMAGE_BEGIN,
  FETCH_UPLOAD_TRACKINGS_EVENT_BEGIN,
} from '../types/eventTypes.js';

import {
  FETCH_IMAGE_PROFILE_BEGIN,
  FETCH_USER_BEGIN,
  FETCH_USER_EVENT_BEGIN,
  FETCH_USER_GET_BEGIN,
  FETCH_USER_LOGIN_BEGIN,
  FETCH_USER_PROFILE_BEGIN,
  FETCH_USER_REGISTER_BEGIN,
  GET_API_DEVICES_BEGIN,
  GET_CURRENT_EVENT,
  GET_DEVICE_TRACKINGS,
  GET_USER_EVENTS,
  GET_USER_PROGRESS,
  GO_GARMIN_BEGIN,
  GO_SUUNTO_BEGIN,
  LOGOUT,
  POST_PHOTO,
  POST_USER,
  POST_USER_TRACKINGS,
  ROUTE_LOGIN_BEGIN,
  ROUTE_LOGIN_FAILURE,
  ROUTE_LOGIN_SUCCESS,
  ROUTING,
  SAVE_CIVIL_STATE,
  SAVE_COMPANY_TYPE,
  SAVE_CURRENT_EVENT,
  SAVE_DOCUMENT_USER,
  SAVE_FORM_REGISTER,
  SAVE_GENDER,
  SAVE_ID_TYPE,
  SAVE_LOADER,
  SAVE_REGISTER_SELECTORS,
  SAVE_RESIDENT_TYPE,
  SAVE_TOKEN,
  SAVE_TRANSPORTATION_MODE,
  SAVE_USER,
  SAVE_USER_SUBSCRIPTION,
  SAVE_USER_TRACKINGS,
  SAVE_WORK_STATUS,
  VALIDATE_FORM,
  GUARDAR_FORM,
  UPDATE_FORM,
  VALIDATE_USER_PAY,
  GET_STATIONS,
  EDITAR_PERFIL_USER,
  EDITAR_PHOTO_PERFIL_USER,
  RESET__PROFILE,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_OK,
} from '../types/userTypes.js';

export function socketConection(props) {
  return {
    type: SOCKET_INIT,
    props,
  };
}


export function setMasterListTicketData(masterListTicketData) {
  return {
    type: SET_MASTER_LIST_TICKET_DATA,
    masterListTicketData: masterListTicketData
  }
}

export function getMasterListData() {
  return {
    type: GET_MASTER_LIST_DATA,
  }
}
export function validateTicketForm(ticketForm) {
  return {
    type: VALIDATE_TICKET_FORM,
    ticketForm: ticketForm
  }
}
export function sendFormData(ticketForm) {
  return {
    type: SEND_FORM_DATE,
    ticketForm: ticketForm
  }
}
export function getActiveTrips() {
  return {
    type: GET_ACTIVE_TRIPS,
  }
}
export function setUserHasTrip(userHasTrip) {
  return {
    type: SET_USER_HAS_TRIP,
    userHasTrip: userHasTrip
  }
}


export function setToken(token) {
  return {
    type: SET_TOKEN,
    token: token
  }
}
export function updateStation(station) {
  return {
    type: SOCKET_RECEIVE_UPDATE_STATION,
    station,
  };
}


export function validatePassword(passwords) {
  return {
    type: VALIDATE_PASSWORD,
    passwords: passwords,
  };
}

export function validateEmailPassword(email) {
  return {
    type: VALIDATE_EMAIL_PASSWORD,
    email: email,
  };
}

export function changeForgotPassword(email) {
  return {
    type: CHANGE_FORGOT_PASSWORD,
    email: email,
  };
}

export function navigationLogin() {
  return {
    type: NAVIGATION_LOGIN,
  };
}

export function navigationNewTicket() {
  return {
    type: NAVIGATION_NEWTICKET,
  }
}

export function loginUser(email, password) {
  return {
    type: LOGIN_USER,
    email: email,
    password: password,
    token: 'token',
  };
}

export function validateLogin(login) {
  return {
    type: VALIDATE_LOGIN,
    login: login,
  };
}

export function getUserData(userId, password) {
  return {
    type: GET_USER_DATA,
    userId: userId,
    password: password,
  };
}

export function validateUser(user, roles, password) {
  return {
    type: VALIDATE_USER,
    user: user,
    roles: roles,
    password: password,
  };
}

export function saveUserLogin(user) {
  return {
    type: SAVE_USER_LOGIN,
    user: user,
  };
}

//fin global action

export function saveDocumentUser(document) {
  return {
    type: SAVE_DOCUMENT_USER,
    document: document,
  };
}

export function saveRegisterSelectors() {
  return {
    type: SAVE_REGISTER_SELECTORS,
  };
}

export function saveWorksStatus(worksStatus) {
  return {
    type: SAVE_WORK_STATUS,
    worksStatus: worksStatus,
  };
}

export function saveCompanyType(companyType) {
  return {
    type: SAVE_COMPANY_TYPE,
    companyType: companyType,
  };
}
export function saveTransportationMode(transportationMode) {
  return {
    type: SAVE_TRANSPORTATION_MODE,
    transportationMode: transportationMode,
  };
}
export function saveCivilStates(civilStates) {
  return {
    type: SAVE_CIVIL_STATE,
    civilStates: civilStates,
  };
}

export function saveGender(genders) {
  return {
    type: SAVE_GENDER,
    genders: genders,
  };
}

export function saveResidentType(residentTypes) {
  return {
    type: SAVE_RESIDENT_TYPE,
    residentTypes: residentTypes,
  };
}

export function saveToken(token) {
  return {
    type: SAVE_TOKEN,
    token: token,
  };
}

export function saveUser(user) {
  return {
    type: SAVE_USER,
    user: user,
  };
}

/* export function loginUser(email,password) {
  return {
    type: LOGIN_USER,
    email:email,
    password:password
  }
} */
//loginuser ya existe se usa el que ya esta implementado

export function postUser(user) {
  return {
    type: POST_USER,
    user: user,
  };
}

export function postPhoto(Photo) {
  return {
    type: POST_PHOTO,
    Photo: Photo,
  };
}

export function validateForm(formRegister) {
  return {
    type: VALIDATE_FORM,
    formRegister: formRegister,
  };
}

export function guardarForm(formRegister) {
  return {
    type: GUARDAR_FORM,
    formRegister: formRegister,
  };
}
export function updateForm(updateForm) {
  return {
    type: UPDATE_FORM,
    formRegister: updateForm,
  };
}
export function getStationsMysl(organizationId) {
  return {
    type: GET_STATIONS,
    organizationId: organizationId,
  };
}
/*export function setPasswordError(errorChangePassword) {
  return {
    type: SET_PASSWORD_ERROR,
    errorChangePassword: errorChangePassword,
  };
}*/

export function changePassword() {
  return {
    type: CHANGE_PASSWORD,
  };
}

export function saveFormRegister(formRegister) {
  return {
    type: SAVE_FORM_REGISTER,
    formRegister: formRegister,
  };
}

export function saveIdTypes(idTypes) {
  return {
    type: SAVE_ID_TYPE,
    idTypes: idTypes,
  };
}

export function routing(component) {
  return {
    type: ROUTING,
    component: component,
  };
}

export function appInit(navigation) {
  return {
    type: APP_INIT,
    navigation: navigation,
  };
}

export function locationChange(action) {
  return {
    type: LOCATION_CHANGE,
    action: action,
  };
}

export function getClubInfo(id) {
  return {
    type: FETCH_CLUB_INFO_BEGIN,
    id: id,
  };
}

export function getMemberClubInfo(id) {
  return {
    type: FETCH_CLUB_MEMBER_INFO,
    id: id,
  };
}

export function gotoGarmin() {
  return {
    type: GO_GARMIN_BEGIN,
  };
}

export function gotoSuunto() {
  return {
    type: GO_SUUNTO_BEGIN,
  };
}

export function routeToPickDevice(code, type) {
  return {
    type: ROUTE_PICKDEVICE,
    code: code,
    codetype: type,
  };
}

export function changeNotification(noti, finish) {
  return {
    type: CHANGE_NOTIFICATION_BEGIN,
    notification: noti,
    finish: finish,
  };
}

export function setAppConnectionStatus(status) {
  return {
    type: SET_APP_CONNECTION_STATUS,
    status,
  };
}

export function logOut(navigation) {
  return {
    type: LOGOUT,
    navigation: navigation,
  };
}

export function doPayment(action) {
  return {
    type: FETCH_SUBSCRIPTION_BEGIN,
    action,
  };
}
//user actions
export function saveUserSubscription(subs) {
  return {
    type: SAVE_USER_SUBSCRIPTION,
  };
}

export function validateUserPay(userId) {
  return {
    type: VALIDATE_USER_PAY,
    userId,
  };
}

export function fetchData() {
  return {
    type: FETCH_USER_GET_BEGIN,
  };
}

export function addUser(newUser) {
  return {
    type: FETCH_USER_REGISTER_BEGIN,
    newUser: newUser,
  };
}

export function uploadProfileImage(image, id) {
  return {
    type: FETCH_IMAGE_PROFILE_BEGIN,
    image: image,
    id: id,
  };
}

export function updateEmailAndPass(emailUser, password) {
  return {
    type: PUT_EMAILANDPASS_BEGIN,
    emailUser: emailUser,
    password: password,
  };
}

export function updateLanguage(id, language) {
  return {
    type: PATCH_CHANGE_LANGUAGE_CONFIGURATION_BEGIN,
    id: id,
    language: language,
  };
}
export function updateUnits(id, units) {
  return {
    type: PATCH_CHANGE_UNITS_CONFIGURATION_BEGIN,
    id: id,
    units: units,
  };
}
export function updateNotifications(id, audio, push, email) {
  return {
    type: PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_BEGIN,
    id: id,
    audio: audio,
    push: push,
    email: email,
  };
}

export function routeLogin() {
  return {
    type: ROUTE_LOGIN_BEGIN,
  };
}

export function getUserLogged() {
  return {
    type: FETCH_USER_BEGIN,
  };
}

export function getNotifications() {
  return {
    type: FETCH_NOTIFICATION_BEGIN,
  };
}

export function editProfile(profileSettings, id, userId) {
  return {
    type: FETCH_USER_PROFILE_BEGIN,
    profileSettings: profileSettings,
    id: id,
    userId: userId,
  };
}

export function edit__Profile(profileSettings) {
  return {
    type: EDITAR_PERFIL_USER,
    profileSettings: profileSettings
  };
}

export function updatePassword(clave) {
  console.log('en actions password', clave);
  return {
    type: UPDATE_PASSWORD,
    clave: clave
  };
}

export function edit__password(profileSettings) {
  return {
    type: EDITAR_PERFIL_USER,
    profileSettings: profileSettings
  };
}


export function edit_photo_profile() {
  return {
    type: EDITAR_PHOTO_PERFIL_USER
  };
}

export function reset__Profile() {
  return {
    type: RESET__PROFILE
  };
}

export function getConfiguration(id) {
  return {
    type: FETCH_USER_CONFIGURATION_BEGIN,
    id,
  };
}

//others actions
export function addDeviceConfiguration(deviceCofiguration) {
  return {
    type: FETCH_DEVICE_CONFIGURATION_BEGIN,
    deviceCofiguration: deviceCofiguration,
  };
}
export function acceptTerms() {
  return {
    type: ACCEPT_TERMS,
  };
}
export function clearClubInfo() {
  return {
    type: CLEAR_CLUBINFO,
  };
}
export function supportRequest(requestSupport) {
  return {
    type: FETCH_SUPPORT_BEGIN,
    requestSupport: requestSupport,
  };
}
export function sycnAction(syncSettings) {
  return {
    type: FETCH_SYNC_BEGIN,
    syncSettings: syncSettings,
  };
}
export function createClub(newClub) {
  return {
    type: FETCH_CREATE_CLUB_BEGIN,
    newClub: newClub,
  };
}
export function deleteClub(clubInfo) {
  return {
    type: FETCH_DELETE_CLUB_BEGIN,
    clubInfo: clubInfo,
  };
}
export function editClub(clubEditInfo) {
  return {
    type: FETCH_EDIT_CLUB_BEGIN,
    clubEditInfo: clubEditInfo,
  };
}
export function filterClubMember(filter) {
  return {
    type: FETCH_FILTER_CLUB_MEMBER_BEGIN,
    filter: filter,
  };
}
export function filterClubAdmin(adminFilter) {
  return {
    type: FETCH_FILTER_CLUB_ADMIN_BEGIN,
    adminFilter: adminFilter,
  };
}
export function forgotPasswordAction(emailForgot) {
  return {
    type: FETCH_FORGOT_PASSWORD_BEGIN,
    emailForgot: emailForgot,
  };
}
export function loadClubInfo() {
  return {
    type: FETCH_LOAD_CLUB_BEGIN,
  };
}
export function getApiDevices() {
  return {
    type: GET_API_DEVICES_BEGIN,
  };
}

export function getDeviceTrackings(device) {
  return {
    type: GET_DEVICE_TRACKINGS,
    device: device,
  };
}

export function getUserCurrentEvents(date) {
  return {
    type: GET_USER_EVENTS,
    date: date,
  };
}

export function saveUserTrackings(id, parameters) {
  return {
    type: SAVE_USER_TRACKINGS,
    id: id,
    parameters: parameters,
  };
}

export function postUserTrackings(id, parameters) {
  return {
    type: POST_USER_TRACKINGS,
    id: id,
    parameters: parameters,
  };
}

export function getUserProgress() {
  return {
    type: GET_USER_PROGRESS,
  };
}

export function getEventUser(eventId) {
  return {
    type: GET_CURRENT_EVENT,
    eventId,
  };
}

export function getStations() {
  return {
    type: GET_STATIONS_BEGIN
    //orgID: orgID,
  };
}

export function getStations_b(org) {
  console.log('BUscando estaciones en action getStations_b', org)
  return {
    type: GET_STATIONS_BEGIN_B,
  };
}

export function validatePenalty() {
  return {
    type: VALIDATE_PENALTY_BEGIN,
  };
}

export function getActiveTrip() {
  return {
    type: GET_ACTIVE_TRIP_BEGIN,
  };
}

export function calculateTripTime() {
  return {
    type: CALCULATE_TRIP_TIME,
  };
}

export function endCalculateTime() {
  return {
    type: END_CALCULATE_TIME,
  };
}

export function startCalculateTime() {
  return {
    type: START_CALCULATE_TIME,
  };
}

export function notificationPermissions() {
  return {
    type: NOTIFICATION_PERMISSIONS
  }
}


export function getPermissions() {
  return {
    type: GET_GEOLOCATION_PERMISSIONS
  }
}

export function validateInfoUserExperience() {
  console.log('desde la acccion')
  return {
    type: VALIDATE_INFO_USER_EXPERIENCE
  }
}
export function postImgExperience() {
  return {
    type: POST_IMG_EXPERIENCE
  }
}
export function postUserFeedback(urlImg) {
  return {
    type: POST_USER_FEEDBACK,
    urlImg: urlImg
  }
}

export function recordCoordinate(start) {
  console.log('function action', start);
  return {
    type: RECORD_TRIP_BEGIN,
    start: start,
  };
}
export function saveLoader(loader) {
  console.log('probando guardar registro va en ACTION');
  return {
    type: SAVE_LOADER,
    loader: loader,
  };
}
//event actions
export function addEvent(newEvent) {
  return {
    type: FETCH_EVENT_CREATE_BEGIN,
    newEvent: newEvent,
  };
}
export function setCurrentTrip(currentTrip) {
  return {
    type: SET_CURRENT_TRIP,
    currentTrip: currentTrip,
  };
}
export function setFeedback(feedback) {
  console.log('en action ver data feeback', feedback);
  return {
    type: SET_FEEDBACK,
    feedback: feedback,
  };
}

export function clearActualTrip() {
  console.log('VAMOS A LIMPIAR EL USERREDUCER');
  return {
    type: CLEAR_ACTUAL_TRIP,
  };
}

export function clearCreateChallenge() {
  return {
    type: CLEAR_CREATECHALLENGE,
  };
}
export function getActiveFinishingTrips() {
  return {
    type: GET_ACTIVE_FINISHING_TRIPS,
  };
}
export function createUserEvent(newEventUser) {
  return {
    type: FETCH_USER_EVENT_BEGIN,
    newEventUser: newEventUser,
  };
}
export function loadTrackings() {
  return {
    type: FETCH_UPLOAD_TRACKINGS_EVENT_BEGIN,
  };
}
export function uploadEventImage(eventImage) {
  return {
    type: FETCH_UPLOAD_EVENT_IMAGE_BEGIN,
    eventImage: eventImage,
  };
}
export function uploadEventImageTrack(eventImageTrack) {
  return {
    type: FETCH_UPLOAD_EVENTTRACK_IMAGE_BEGIN,
    eventImageTrack: eventImageTrack,
  };
}
export function uploadClubImage(clubImage) {
  return {
    type: FETCH_UPLOAD_CLUB_IMAGE_BEGIN,
    clubImage: clubImage,
  };
}
export function addAward(newAward) {
  return {
    type: FETCH_EVENTAWARD_CREATE_BEGIN,
    newAward: newAward,
  };
}
export function addEventUserSubscription(newEventUserSubscription) {
  return {
    type: FETCH_EVENTUSER_SUBSCRIPTION_BEGIN,
    newEventUserSubscription: newEventUserSubscription,
  };
}

export function setLoadingLogin(state) {
  return {
    type: appTypes.setLoadingLogin,
    payload: state,
  };
}

export function routingIfHasTrip() {
  return {
    type: ROUTING_IF_HAS_TRIP,
  };
}

export function reset_img_experience() {
  return {
    type: RESET_IMG_EXPERIENCE
  }
}

export const appActions = {
  getCurrentLocation: function () {
    return {
      type: appTypes.getCurrentLocation,
    };
  },
  validationEndTrip: function (currentLocation) {
    return {
      type: appTypes.validationEndTrip,
      currentLocation: currentLocation,
    };
  },
  endTrip: function (trip, endStationId) {
    return {
      type: appTypes.endTrip,
      trip: trip,
      endStationId: endStationId,
    };
  },
  endTripValidationError: function (error) {
    return {
      type: appTypes.endTripValidationError,
      error: error,
    };
  },
  toggleDrawer: function () {
    return {
      type: appTypes.toggleDrawer,
    };
  },
  onSelectPhoto: function (state) {
    return {
      type: appTypes.onSelectPhoto,
      payload: state
    }
  },
  setBluetoothState: function (payload) {
    return {
      type: appTypes.setBluetoothState,
      payload
    }
  }
};
