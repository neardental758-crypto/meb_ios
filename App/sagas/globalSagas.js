import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
  CALCULATE_TRIP_TIME,
  CHANGE_FORGOT_PASSWORD,
  CHANGE_NEED_RECORD,
  CHANGE_PASSWORD,
  END_CALCULATE_TIME,
  GET_ACTIVE_TRIP_BEGIN,
  GET_ACTIVE_TRIP_SUCCESS,
  GET_GEOLOCATION_PERMISSIONS,
  NOTIFICATION_PERMISSIONS,
  GET_STATIONS_BEGIN,
  GET_STATIONS_SUCCESS,
  GET_USER_DATA,
  LOGIN_USER,
  NAVIGATION_LOGIN,
  NAVIGATION_NEWTICKET,
  RECORD_TRIP_BEGIN,
  RECORD_TRIP_SUCCESS,
  ROUTING_IF_HAS_TRIP,
  SAVE_USER_LOGIN,
  SET_GEOLOCATION,
  SET_TOKEN,
  SET_TRIP_TIME,
  SOCKET_INIT,
  SOCKET_RECEIVE_UPDATE_STATION,
  START_CALCULATE_TIME,
  UPDATE_STATION,
  UPDATE_STATIONS,
  VALIDATE_EMAIL_PASSWORD,
  VALIDATE_LOGIN,
  VALIDATE_PENALTY_BEGIN,
  VALIDATE_PENALTY_SUCCESS,
  VALIDATE_USER,
  appTypes,
  GET_ACTIVE_FINISHING_TRIPS,
  SET_CURRENT_TRIP,
  POST_USER_FEEDBACK,
  POST_IMG_EXPERIENCE,
  SET_NEW_TRIP,
  GET_STATIONS_FROM_ORGANIZATION
} from '../types/types';
import { VERIFY_LOCK_STATUS_TRIP, SET_STATUS_LOCK } from '../types/tripTypes';
import {
  all,
  call,
  delay,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { clearToken, login } from '../Services/refresh.service';
import { getItem, setItem } from '../Services/storage.service';
import { useState, useEffect, useContext } from 'react';
import Geolocation from 'react-native-geolocation-service';
import Moment from 'moment';
import { PhoneTokenService } from '../Services/PhoneToken.service';
//import SocketService from '../Services/socket.service';
import { api } from '../api/api.service';
import { noapi } from '../api/noauthapi.service';
import { validate } from 'validate.js';
import { validateLogin } from '../Utils/validation';
import * as RootNavigation from '../RootNavigation';
import { AuthContext } from '../AuthContext';
import { Env } from "../Utils/enviroments";

//Function to save token on storage
//
const saveToken = async (token) => {
  return await setItem(COOKIE_NAME, token);
};

function* getUserData(action) {
  const user = yield api.getUserWithRole(action.userId); //get to user table with include of userRole
  const roles = yield api.get('roles', {}).then((roles) => roles); //get to the role table (we get all the roles)

  yield put({
    type: VALIDATE_USER,
    user: user,
    roles: roles,
    password: action.password,
    token: action.token,
  });
}

function* validateUser(action) {
  /* Validate that a user exists and that the roles have been loaded */
  //console.log('validando usuario :::::::::', action)
  const navigation = yield select(
    (state) => state
  );
  //console.log('lo que viene en navigation', navigation)

  if (action.user) {
    console.log('entrando a action.user ttttttttttt :::', action.user)
    if (action.roles && action.user.length > 0) {
      console.log('ACA VAMOS 1.....', action.user[0].userRoles)
      let appAccess = false;
      action.user[0].userRoles.forEach((userRole) => {
        let typeRole = action.roles.filter(
          (role) => role.id == userRole.roleId,
        );
        if (typeRole[0].name == 'usuario final') {
          console.log('USUARIO FINALLLLLLLLLLL');
          appAccess = true;
        }
      });
      let organizations = [
        //temporary fix of organizations
        'empresa1',
        'empresa2',
        'empresa3',
        'empresa4',
        'empresa5',
      ];
      const organizationAccess = organizations.find(
        (organization) => organization == 'empresa3',
      );

      console.log('que tiene la variable organizationAccess :::', organizationAccess)

      if (appAccess && organizationAccess) {
        //When the user is registered in the role of the app
        console.log('ACA VAMNOS 22222 : :::::')
        if (action.token === 'token') {
          yield setItem('user', {
            ...action.user[0],
            email: action.user[0].email,
            password: action.password,
          }); //save username and password in stora
        }

        if (action.token === 'tokenOut') {
          yield setItem('user2', {
            ...action.user[0],
            email: action.user[0].email,
            password: action.password,
          }); //save username and password in stora
        }

        //PhoneTokenService.updatePhoneToken(true);
        const token = yield select((state) => state.globalReducer.token);
        console.log('Que token tenemos ::::: ', token);
        yield put({ type: SAVE_USER_LOGIN, user: action.user[0] });
        yield setItem(action.token, token); //el nombre que viene de la action
        //navigation.navigate('DrawerHomeScreen');
        //RootNavigation.navigate('HomeScreen');
        if (action.token === 'token') {
          RootNavigation.navigate('IsLoginScreen');
        }
        yield delay(300);
        yield put({ type: appTypes.setLoadingLogin, payload: false });
      } else {
        yield put({ type: SET_TOKEN, token: '' });
        yield delay(100);
        Alert.alert('No tiene cuenta creada en la app');
      }
    } else {
      yield put({ type: appTypes.setLoadingLogin, payload: false });
      yield delay(100);
      Alert.alert('El usuario no existe');
    }
  } else {
    console.log('NOS VOLVEMOS A LOGIN')
    yield put({ type: appTypes.setLoadingLogin, payload: false });
    yield delay(100);
    Alert.alert('Su sesión ha finalizado');
    yield clearToken();
    navigation.navigate('LoginScreen');
  }
}

/* validate that username and password are correctly written */
function* validationLogin(action) {
  console.log('estamos en globalSagas ::::', action)
  var errors = validateLogin(action.login);
  console.log('estamos en globalSagas los errores : ', errors)
  if (errors.length == 0) {
    console.log('En globalSagas errores igual a cero')
    if (action.login.token === 'token') {
      //Si el tipo de token es para login setLoadingLogin es true para la animación
      yield put({ type: appTypes.setLoadingLogin, payload: true })
    }
    yield put({
      type: LOGIN_USER,
      email: action.login.email,
      password: action.login.password,
      token: action.login.token, //pasamos por las action el tipo de token
    });

  } else {
    console.log('En globalSagas con errorres')
    yield delay(100);
    Alert.alert('Usuario o contraseña inválido');
  }
}

function* loginUser(action) {
  /* Login via MySQL - retorna token + datos del usuario directamente */
  const data = yield login(action.email, action.password, action.token);
  if (data && data.token) {
    yield put({ type: SET_TOKEN, token: data.token });

    // Guardar usuario en storage con los datos que vienen del MySQL login
    const userToStore = {
      ...data.user,
      email: action.email,
      password: action.password,
    };

    if (action.token === 'token') {
      yield setItem('user', userToStore);
    } else if (action.token === 'tokenOut') {
      yield setItem('user2', userToStore);
    }

    yield setItem(action.token, data.token);
    yield put({ type: SAVE_USER_LOGIN, user: data.user });

    if (action.token === 'token') {
      RootNavigation.navigate('IsLoginScreen');
    }
    yield delay(300);
    yield put({ type: appTypes.setLoadingLogin, payload: false });
  } else {
    yield put({ type: appTypes.setLoadingLogin, payload: false });
    yield delay(500);
    Alert.alert('Alerta', 'Usuario o contraseña incorrecto, Intente de nuevo');
  }
}

/*function* changeForgotPassword(action) {
  console.log('action->', action);
  let forgot = yield noapi.postForgotEmail(action.email);
  console.log('forgot', forgot);
  if (!forgot.error) {
    Alert.alert(
      'Alerta',
      'Te hemos enviado un correo con instrucciones para reestablecer tu contraseña',
    );
  } else {
    Alert.alert('Alerta', 'El usuario no existe');
  }
}*/

// función para generar clave temporal random de 4 dígitos
const generarClaveTemporal = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

function* changeForgotPassword(action) {
  console.log('action->', action);
  let forgot = yield noapi.postForgotEmail(action.email);
  console.log('forgot', forgot);
  console.log('documento', forgot.idNumber);

  const tempPass = generarClaveTemporal();
  if (!forgot.error) {
    let request = {
      //'password': action.clave,
      'password': tempPass,
    }
    let updateUser = yield api.patchField_sin_token('users', forgot.id, request);

    if (updateUser && updateUser.ok && (updateUser.status === 200 || updateUser.status === 204)) {
      // ✅ Aquí fue exitoso el cambio → ahora llamar fetch para enviar correo
      yield api.enviar_recuperacion_password('bc_usuarios/correo_password_ride', forgot.email, request.password);

      Alert.alert(
        'Alerta',
        'Tu nueva contraseña se envió al correo registrado.',
      );
    } else {
      Alert.alert('Error', 'No se pudo actualizar la contraseña.');
    }
  } else {
    Alert.alert('Alerta', 'El usuario no existe');
  }
}

function* getStationsFunction(action) {
  let user = yield getItem('user');
  //console.log('BUSCANDO ESTACIONES POR ORGANIZACION _____________::en globalsagas::_______________', action)
  //let userData = yield select((state) => state.tripReducer.newTrip[0].organizationId);
  //console.log('esto es lo que se va para traer estaciones en getStationFunction:: 644940fbd1dc6d02b890c728', userData);
  //console.log('DATA USER DESDE AUTCONTEXT _____________::::_______________', infoUser)

  //let org = action.orgID
  let stations = yield api.getStationsByFilter(user.organizationId);

  // Evitar error de Redux "A non-serializable value was detected"
  if (stations && stations.error) {
    stations = { error: 'Network request failed o error de conexión MongoDB' };
  }

  yield put({ type: GET_STATIONS_SUCCESS, payload: stations });
}


function* validatePenaltyFunction() {
  let today = new Date();
  let user = yield getItem('user');
  let penalties = yield api.get('penalties', {
    where: {
      and: [
        { userId: user.id },
        { startDate: { lt: today } },
        { endDate: { gt: today } },
      ],
    },
  });
  let needPenalty = false;
  if (penalties.length == 0) {
    needPenalty = false;
  } else {
    needPenalty = true;
  }
  yield put({ type: VALIDATE_PENALTY_SUCCESS, payload: needPenalty });
}

function* activeTripFunction() {
  let today = new Date();
  let user = yield getItem('user');
  let trip = [];
  trip = yield api.get('trips', {
    where: { and: [{ userId: user.id }, { state: 'active' }] },
  });
  if (trip.length == 0) {
    //const navigation = yield select((state) => state.globalReducer.nav._navigation,);
    //navigation.goBack();
    RootNavigation.goBack();
  } else {
    yield put({ type: GET_ACTIVE_TRIP_SUCCESS, payload: trip[0] });
    if (!trip[0].lockOpenConfirmation) {
      yield put({ type: SET_STATUS_LOCK, statusLock: { lockStatus: "closed" } })
      yield put({ type: VERIFY_LOCK_STATUS_TRIP });
    } else {
      yield put({ type: SET_STATUS_LOCK, statusLock: { lockStatus: "open" } })
    }

  }
}

function* sendCoordinate(coordinate) {
  let user = yield getItem('user');
  let actualTrip = yield select((state) => state.userReducer.actualTrip);
  let data = {
    latitude: String(coordinate.latitude),
    longitude: String(coordinate.longitude),
    date: new Date(coordinate.date),
    userId: user.id,
    tripId: actualTrip.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  let send = yield api.postData('coordinates', data);
}
const getUserLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (location) => resolve(location),
      (error) => reject(error),
      Platform.OS == 'android'
        ? {
          enableHighAccuracy: true,
          timeout: 20000,
        }
        : {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0,
        },
    );
  });

function* getPermissionsFunction() {
  if (Platform.OS == 'android') {
    try {
      const granted = yield PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Need access location',
          message: 'Needs access' + 'location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      /*const grantedNotifications = yield PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
            title: "Bycycle APP permisos de Notications",
            message: "Para poder utilizar la función de Noticicaciones, debe aceptar los permisos",
            buttonNeutral: "Pregúntame luego",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
        }
      );*/

      if (granted === PermissionsAndroid.RESULTS.GRANTED /*&&
            grantedNotifications === PermissionsAndroid.RESULTS.GRANTED*/) {
        console.log('permisos correctamente de localizacion');
      } else {
        yield put({ type: GET_GEOLOCATION_PERMISSIONS });
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    // Geolocation.requestAuthorization();
    // if (Platform.OS === 'ios') {
    //   try {
    //     const res = yield Geolocation.requestAuthorization('always');
    //     console.log(`Respuesta IOS ${res}`);
    //   } catch (err) {
    //     console.warn(err);
    //   }
    // }
  }
}

function* notificationPermissionsFunction() {
  if (Platform.OS == 'android') {
    try {
      const grantedNotifications = yield PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Bycycle APP permisos de Notications",
          message: "Para poder utilizar la función de Noticicaciones, debe aceptar los permisos",
          buttonNeutral: "Pregúntame luego",
          buttonNegative: "Cancelar",
          buttonPositive: "Aceptar"
        }
      );

      if (grantedNotifications === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permisos correctamente de notificaciones');
      } else {
        yield put({ type: NOTIFICATION_PERMISSIONS });
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    // Geolocation.requestAuthorization();
    // if (Platform.OS === 'ios') {
    //   try {
    //     const res = yield Geolocation.requestAuthorization('always');
    //     console.log(`Respuesta IOS ${res}`);
    //   } catch (err) {
    //     console.warn(err);
    //   }
    // }
  }
}

function* calculateTripTimeFunction() {
  const trip = yield select((state) => state.userReducer.actualTrip);
  const needInterval = yield select((state) => state.userReducer.needInterval);
  if (needInterval) {
    let actualTime = Moment(new Date());
    tripTime = Moment(trip.startDate);
    let difference = actualTime.diff(tripTime, 'seconds');
    d = difference;
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    h = h <= 9 ? (h = '0' + h) : h;
    m = m <= 9 ? (m = '0' + m) : m;
    s = s <= 9 ? (s = '0' + s) : s;
    let finalReturn = h + ':' + m + ':' + s;
    yield put({ type: SET_TRIP_TIME, payload: finalReturn, minutes: m });
    yield delay(500);
    yield put({ type: CALCULATE_TRIP_TIME });
  }
}

//Socket listener to update reducer
function* receiveSocketUpdateSagas() {
  yield takeEvery(
    SOCKET_RECEIVE_UPDATE_STATION,
    function* receiveMessage(action) {
      let stations = yield select((state) => state.mapReducer.stations);
      const newStations = stations.map((station) => {
        if (station.id == action.station?.id) {
          station = action.station;
          return station;
        } else {
          station = station;
          return station;
        }
      });
      yield put({ type: UPDATE_STATIONS, payload: newStations });
    },
  );
}

function* postImgExperience_tablet() {
  console.log('estamo en atablet en globalsagas')
  const s3Route = 'Viaje finalizado desde tablet__'
  yield put({ type: POST_USER_FEEDBACK, urlImg: s3Route });
}

function* postImgExperience() {
  const documentPhoto = yield select((state) => state.userReducer.documentUser);
  yield put({ type: appTypes.setLoadingEnd, payload: true });
  const s3Route = yield uploadImageS3(documentPhoto.assets, "users");
  if (s3Route) {
    yield put({ type: POST_USER_FEEDBACK, urlImg: s3Route });
  } else {
    Alert.alert('Error', "Error al cargar imagen")
    yield put({ type: appTypes.setLoadingEnd, payload: false });
  }
}
function* uploadImageS3(image, table) {
  const formData = new FormData();
  const fileName = Math.random()
    .toString(36)
    .slice(2);
  image = image[0]
  const file = {
    uri: image.uri,
    name: fileName + '.jpg',
    type: image.type ? image.type : "image/jpg",
  };
  formData.append('upload', file);
  console.log('la data que va pra feedback :::::::::::feedback::::', formData);
  const result = yield api.postFileHeaders(table, "upload", formData)
  if (result.error == null) {
    if (result.files[0] != null) {
      return result.files[0].location;
    }
  }
}

function* postUserFeedback(action) {
  const { feedback } = yield select((state) => state.othersReducer.feedback);
  console.log('FEEDBACK EN GLOBALSAGAS::::', feedback);
  const currentTrip = yield select((state) => state.othersReducer.currentTrip);
  console.log('CURRENTETRINP EN GLOBALSAGAS::::', currentTrip);
  if (feedback.actualTrip && typeof feedback.actualTrip === 'number') {
    // 5G Flow
    const newFeedback = {
      com_usuario: feedback.document,
      com_prestamo: feedback.actualTrip,
      com_fecha: new Date().toISOString(),
      com_comentario: feedback.comment,
      com_calificacion: String(feedback.rating),
      com_estado: 'ACTIVO',
      img: action.urlImg,
    };
    yield api.postMysql('bc_comentarios_rentas/registrar', newFeedback);
  } else {
    // Legacy Flow (3G/4G)
    const newFeedback = {
      ...feedback,
      img: action.urlImg,
      tripId: currentTrip.id,
    };
    yield api.post('feedbacks', newFeedback);
    yield api.patchField('trips', currentTrip.id, { state: 'finished' });
  }

  //const navigation = yield select((state) => state.globalReducer.nav._navigation,);
  yield put({ type: appTypes.setLoadingEnd, payload: false });

  if (Env.modo === 'movil') {
    RootNavigation.navigate('Home');
  }
  //RootNavigation.navigate('Home');
}

function* validateEmailPassword(action) {
  let request = {
    email: action.email.toLowerCase(),
  };

  var constraints = {
    email: {},
  };
  /* Check that the email is well written */
  emailValidation(constraints);
  var validationResults = validate(request, constraints) || [];
  printError(validationResults);

  if (validationResults.length == 0) {
    yield put({ type: CHANGE_FORGOT_PASSWORD, email: request });
  }
}

function emailValidation(constraints) {
  constraints.email = {
    presence: { message: '^(*) ' + 'Email_Field' },
    email: {
      message: '^(*) ' + 'Valid_Email',
    },
  };
  return constraints;
}

function printError(obj) {
  var valtoPrint = '';
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      valtoPrint = valtoPrint.concat(JSON.stringify(obj[p][0]).slice(1, -1));
      valtoPrint = valtoPrint.concat('\n');
    }
  }
  if (valtoPrint.length != 0) {
    Alert.alert('Alert', valtoPrint);
  }
}

function* navigationLogin() {
  //const navigation = yield select((state) => state.globalReducer.nav._navigation,);
  //RootNavigation.navigate('HomeScreen');
  yield clearToken();
  //dataUser();
}

function* navigationNewTicket() {
  //const navigation = yield select((state) => state.globalReducer.nav._navigation,);
  RootNavigation.navigate('NewTicketScreen');
}

function* getActiveFinishingTrips() {
  //const navigation = yield select((state) => state.globalReducer.nav._navigation);
  //let userData = yield select((state) => state.globalReducer.user);
  let userData = yield getItem('user');
  let trips = yield api.get('trips', {
    where: {
      and: [
        { userId: userData.id },
        { state: { inq: ['active', 'finishing'] } },
      ]
    },
  });
  let activeCount = 0;
  let finishingCount = 0;
  trips.forEach((trip) => { if (trip.state == "active") { activeCount = activeCount + 1 } })
  trips.forEach((trip) => { if (trip.state == "finishing") { finishingCount = finishingCount + 1 } })
  if (trips.length == 0) {
    RootNavigation.navigate('Home');
  } else if (activeCount == 1) {
    if (finishingCount > 0) {
      //enviar correo de error
    }
    navigation.navigate('TripScreen');
  } else if (finishingCount == 1 && activeCount == 0) {
    yield put({ type: SET_CURRENT_TRIP, payload: trips[0] });
  } else if (activeCount > 1) {
    //enviar correo de error
    navigation.navigate('TripScreen');
  } else if (finishingCount > 1) {
    yield put({ type: SET_CURRENT_TRIP, payload: trips[0] });
    //enviar correo de error
  }
}

function* getUserDataSaga() {
  yield takeLatest(GET_USER_DATA, getUserData);
}


function* routingHasTrip() {
  yield takeLatest(ROUTING_IF_HAS_TRIP, function* routingHasTripFunction() {
    let user = yield getItem('user');
    let trip = yield api.get('trips', {
      where: { and: [{ userId: user.id }, { state: { inq: ['active', 'finishing'] } }] },
    });
    let safeTripList = Array.isArray(trip) ? trip : [];

    let tripActive = safeTripList.find((t) => t.state == "active");
    let tripFinishing = safeTripList.find((t) => t.state == "finishing");

    console.log('DATA USuARIO ESSESESES::::: USER::::', user)
    console.log('DATA DEL TRIPPPPPP ESS :::::trip:::..', trip)
    //let navigation = yield select((state) => state.globalReducer.nav._navigation,);
    if (tripActive) {
      console.log("Encontró viaje activo");
      yield put({ type: SET_NEW_TRIP, payload: trip });
      RootNavigation.navigate("TripScreen");
    } else if (tripFinishing) {
      RootNavigation.navigate("travelExperienceScreen");
    } else {
      yield put({ type: appTypes.setLoadingEnd, payload: false });
    }
  })
}

function* validateUserSaga() {
  yield takeLatest(VALIDATE_USER, validateUser);
}

function* postUserFeedbackSaga() {
  yield takeLatest(POST_USER_FEEDBACK, postUserFeedback);
}

function* getActiveFinishingTripsSaga() {
  yield takeLatest(GET_ACTIVE_FINISHING_TRIPS, getActiveFinishingTrips);
}

function* validateLoginSaga() {
  yield takeLatest(VALIDATE_LOGIN, validationLogin);
}
/*function* postImgExperienceSaga() {
  yield takeLatest(POST_IMG_EXPERIENCE, Env.modo === 'tablet' ?  postImgExperience_tablet : postImgExperience);
}*/

function* postImgExperienceSaga() {
  yield takeLatest(POST_IMG_EXPERIENCE, function* () {
    if (Env.modo === 'tablet') {
      yield call(postImgExperience_tablet);
    } else {
      yield call(postImgExperience);
    }
  });
}

function* loginUserSaga() {
  yield takeLatest(LOGIN_USER, loginUser);
}

function* validateEmailPasswordSaga() {
  yield takeLatest(VALIDATE_EMAIL_PASSWORD, validateEmailPassword);
}

function* changeForgotPasswordSaga() {
  yield takeLatest(CHANGE_FORGOT_PASSWORD, changeForgotPassword);
}

function* navigationLoginSaga() {
  yield takeLatest(NAVIGATION_LOGIN, navigationLogin);
}
function* navigationNewTicketSaga() {
  yield takeLatest(NAVIGATION_NEWTICKET, navigationNewTicket);
}
function* getStations() {
  yield takeLatest(GET_STATIONS_BEGIN, getStationsFunction);
}

function* validatePenaltySaga() {
  yield takeLatest(VALIDATE_PENALTY_BEGIN, validatePenaltyFunction);
}

function* validateActiveTripSaga() {
  yield takeLatest(GET_ACTIVE_TRIP_BEGIN, activeTripFunction);
}

function* calculateTripTimeSaga() {
  yield takeLatest(CALCULATE_TRIP_TIME, calculateTripTimeFunction);
}

function* endCalculateTimeSaga() {
  yield take(END_CALCULATE_TIME);
}

function* startCalculateTimeSaga() {
  yield take(START_CALCULATE_TIME);
}

function* getPermissionsSaga() {
  yield takeLatest(GET_GEOLOCATION_PERMISSIONS, getPermissionsFunction);
}

function* notificactionPermissionsSaga() {
  yield takeLatest(NOTIFICATION_PERMISSIONS, notificationPermissionsFunction);
}

function* recordTripSaga() {
  yield takeLatest(RECORD_TRIP_BEGIN, function* recordFunction(action) {
    console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjj aca el error??')
    yield put({ type: CHANGE_NEED_RECORD, payload: action.start });
    let needRecord = yield select((state) => state.userReducer.needRecord);
    console.log('el needRecord', needRecord);
    //const navigation = yield select((state) => state.globalReducer.nav._navigation,);
    if (needRecord) {

      const location = yield call(getUserLocation);
      const { latitude, longitude } = location.coords;
      let coordinates = yield select((state) => state.userReducer.coordinates);
      console.log('lassss coordenadas son::::', coordinates)
      if (coordinates.length == 5) {
        yield all(
          coordinates.map((coordinate) => call(sendCoordinate, coordinate)),
        );
        coordinates = coordinates.splice(4, coordinates.length);
        yield put({ type: RECORD_TRIP_SUCCESS, coordinate: coordinates });
      }
      coordinates.push({ latitude, longitude, date: new Date() });
      console.log(coordinates, "Location que se van a enviar");
      yield put({ type: RECORD_TRIP_SUCCESS, coordinate: coordinates });
      yield delay(5000);
      yield put({ type: RECORD_TRIP_BEGIN, start: true });
    } else {
      let coordinates = yield select((state) => state.userReducer.coordinates);
      //SEND COORDINATES IF FINISH AND NOT HAVE 5 ON STORE
      if (coordinates.length != 0) {
        yield all(
          coordinates.map((coordinate) => call(sendCoordinate, coordinate)),
        );
        console.log(coordinates)
        coordinates = [];
        yield put({ type: RECORD_TRIP_SUCCESS, coordinate: coordinates });
      }
    }
  });
}

/*function* socketConectionSagas() {
  yield takeLatest(SOCKET_INIT, function* socketConection(action) {
    SocketService.socketInstance.socketConection(action.props);
  });
}*/

function logDev(info, data) {
  let shouldLog = true;
  if (shouldLog) {
    console.log(info, data);
  }
}

export const sagas = [
  getActiveFinishingTripsSaga(),
  postUserFeedbackSaga(),
  postImgExperienceSaga(),
  recordTripSaga(),
  navigationNewTicketSaga(),
  getUserDataSaga(),
  endCalculateTimeSaga(),
  getPermissionsSaga(),
  notificactionPermissionsSaga(),
  startCalculateTimeSaga(),
  calculateTripTimeSaga(),
  validateActiveTripSaga(),
  //socketConectionSagas(),
  navigationLoginSaga(),
  validateUserSaga(),
  getStations(),
  validateLoginSaga(),
  validatePenaltySaga(),
  loginUserSaga(),
  validateEmailPasswordSaga(),
  changeForgotPasswordSaga(),
  receiveSocketUpdateSagas(),
  routingHasTrip(),
];
