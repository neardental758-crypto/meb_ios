/* eslint-disable prettier/prettier */
import { Alert, Linking, Platform } from 'react-native';
//othersSaga
import {
	FETCH_CREATE_CLUB_BEGIN,
	FETCH_CREATE_CLUB_FAILURE,
	FETCH_CREATE_CLUB_SUCCESS,
	FETCH_DELETE_CLUB_BEGIN,
	FETCH_DELETE_CLUB_FAILURE,
	FETCH_DELETE_CLUB_SUCCESS,
	FETCH_DEVICE_CONFIGURATION_BEGIN,
	FETCH_DEVICE_CONFIGURATION_FAILURE,
	FETCH_DEVICE_CONFIGURATION_SUCCESS,
	FETCH_EDIT_CLUB_BEGIN,
	FETCH_EDIT_CLUB_FAILURE,
	FETCH_EDIT_CLUB_SUCCESS,
	FETCH_FILTER_CLUB_ADMIN_BEGIN,
	FETCH_FILTER_CLUB_ADMIN_FAILURE,
	FETCH_FILTER_CLUB_ADMIN_SUCCESS,
	FETCH_FILTER_CLUB_MEMBER_BEGIN,
	FETCH_FILTER_CLUB_MEMBER_FAILURE,
	FETCH_FILTER_CLUB_MEMBER_SUCCESS,
	FETCH_LOAD_CLUB_BEGIN,
	FETCH_LOAD_CLUB_FAILURE,
	FETCH_LOAD_CLUB_SUCCESS,
	FETCH_SUPPORT_BEGIN,
	FETCH_SUPPORT_FAILURE,
	FETCH_SUPPORT_SUCCESS,
	FETCH_SYNC_BEGIN,
	FETCH_SYNC_FAILURE,
	FETCH_SYNC_SUCCESS,
	FETCH_UPLOAD_CLUB_IMAGE_BEGIN,
	FETCH_UPLOAD_CLUB_IMAGE_FAILURE,
	FETCH_UPLOAD_CLUB_IMAGE_SUCCESS,
} from '../types/othersTypes'
//eventSaga
import {
	FETCH_EVENTAWARD_CREATE_BEGIN,
	FETCH_EVENTAWARD_CREATE_FAILURE,
	FETCH_EVENTAWARD_CREATE_SUCCESS,
	FETCH_EVENTUSER_SUBSCRIPTION_BEGIN,
	FETCH_EVENTUSER_SUBSCRIPTION_FAILURE,
	FETCH_EVENTUSER_SUBSCRIPTION_SUCCESS,
	FETCH_EVENT_CREATE_BEGIN,
	FETCH_EVENT_CREATE_FAILURE,
	FETCH_EVENT_CREATE_SUCCESS,
	FETCH_UPLOAD_EVENTTRACK_IMAGE_BEGIN,
	FETCH_UPLOAD_EVENTTRACK_IMAGE_FAILURE,
	FETCH_UPLOAD_EVENTTRACK_IMAGE_SUCCESS,
	FETCH_UPLOAD_EVENT_IMAGE_BEGIN,
	FETCH_UPLOAD_EVENT_IMAGE_FAILURE,
	FETCH_UPLOAD_EVENT_IMAGE_SUCCESS,
	FETCH_UPLOAD_TRACKINGS_EVENT_BEGIN,
	FETCH_UPLOAD_TRACKINGS_EVENT_FAILURE,
	FETCH_UPLOAD_TRACKINGS_EVENT_SUCCESS
} from '../types/eventTypes'
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
	GET_API_DEVICES_BEGIN,
	GET_API_DEVICES_FAILURE,
	GET_API_DEVICES_SUCCESS,
	GET_CURRENT_EVENT,
	GET_DEVICE_TRACKINGS,
	GET_DEVICE_TRACKINGS_SUCCESS,
	GET_USER_EVENTS,
	GET_USER_EVENTS_SUCCESS,
	GET_USER_PROGRESS,
	GO_GARMIN_BEGIN,
	GO_GARMIN_SUCCESS,
	GO_SUUNTO_BEGIN,
	GO_SUUNTO_SUCCESS,
	LOGOUT,
	LOGOUTSUCCESS,
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
	SAVE_FORM_REGISTER,
	SAVE_GENDER,
	SAVE_ID_TYPE,
	SAVE_LOADER,
	SAVE_REGISTER_SELECTORS,
	SAVE_RESIDENT_TYPE,
	SAVE_TRANSPORTATION_MODE,
	SAVE_USER_PROGRESS,
	SAVE_WORK_STATUS,
	SET_USER_STORE,
	VALIDATE_FORM,
	VALIDATE_USER_PAY,
	VALIDATION_FAIL,
	GUARDAR_FORM,
	GUARDAR_FORM_REGISTER,
	GUARDAR_FORM_REGISTER_FAILED,
	UPDATE_FORM_REGISTER,
	UPDATE_FORM,
	GET_STATIONS,
	EDITAR_PERFIL_USER,
	EDITAR_PERFIL_USER_OK,
	EDITAR_PHOTO_PERFIL_USER,
	UPDATE_PASSWORD,
	UPDATE_PASSWORD_OK
} from '../types/userTypes'
import { GET_USER_DATA, SET_TOKEN, VALIDATE_LOGIN, appTypes } from '../types/types';
import I18n, { setLocale } from '../Utils/language.utils';
import { all, call, put, select, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { clearClubInfo, clearCreateChallenge, getUserLogged, validateUserPay } from '../actions/actions'
import { getItem, removeAllItems, setItem } from '../Services/storage.service';
import {
	validateConfiguration,
	validateCreateProfile,
	validateLogin,
	validateRegister
} from '../Utils/validation';

import {
	validateCreateAward,
	validateCreateEvent,
	validateUserEventSubscription,
} from '../Utils/validation';
import {
	validateCreateClub,
	validateDeviceConfiguration,
	validateForgotPassword,
	validateSupport,
	validateSync,
} from '../Utils/validation';

import { LOGIN_USER } from '../types/types'
import UserInfo from '../Components/UserInfo';
import { api } from '../api/api.service';
import { apiPerfil } from '../api/apiPerfil';
import { login } from '../Services/refresh.service';
import moment from 'moment';
import { noapi } from '../api/noauthapi.service';
//import bcrypt from 'bcryptjs';
import * as RootNavigation from '../RootNavigation';

var RNFS = require('react-native-fs');

let formModel = {
	inputs: [
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "username",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "email",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "rol",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "password",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "created_at",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "updated_at",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "origin",
				targetModel: "user",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "gender",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "userId",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "name",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "category",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "created_at",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "updated_at",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "skills",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "achievement",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "photo",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "birthday",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "description",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "ranking",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "activity",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "clubId",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "locationId",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "averagePace",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "averageSpeed",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "careerModeCount",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "speedQuartile",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "totalAltitude",
				targetModel: "userInfo",
			},
		},
		{
			front: {},
			validate: {},
			modelInfo: {
				key: "totalDistance",
				targetModel: "userInfo",
			},
		},
	]
};

function* fetchData() {
	try {
		const data = yield api.getUsers();
		yield put({ type: FETCH_USER_GET_SUCCESS, payload: data });
	} catch (e) {
		yield put({ type: FETCH_USER_GET_FAILURE });
	}
}

function* addUser(action) {
	if (action.newUser.origin == 'correo') {
		var errors = validateRegister(action.newUser);
	} else {
		var errors = [];
	}
	if (errors.length == 0) {
		let form = {
			//user
			username: action.newUser.email,
			email: action.newUser.email,
			password: action.newUser.password,
			created_at: new Date(),
			updated_at: new Date(),
			origin: action.newUser.origin,
			rol: action.newUser.rol,
			//user info
			gender: action.newUser.gender,
			category: action.newUser.category,
			name: action.newUser.name,
			lastname: action.newUser.lastname,
			ranking: 0,
			skills: action.newUser.skills,
			achievement: action.newUser.achievement,
			birthday: action.newUser.birthday,
			photo: action.newUser.photo,
			averagePace: action.newUser.averagePace,
			averageSpeed: action.newUser.averageSpeed,
			careerModeCount: action.newUser.careerModeCount,
			speedQuartile: action.newUser.speedQuartile,
			totalAltitude: action.newUser.totalAltitude,
			totalDistance: action.newUser.totalDistance,
			locationId: action.newUser.locationId ? action.newUser.locationId : '',
			description: action.newUser.description ? action.newUser.description : '',
		}
		let user = {};
		let userInfo = {};
		formModel.inputs.forEach(input => {
			if (input.modelInfo.targetModel == "user") {
				user[input.modelInfo.key] = form[input.modelInfo.key];
			}
			if (input.modelInfo.targetModel == "userInfo") {
				userInfo[input.modelInfo.key] = form[input.modelInfo.key];
			}
		});
		try {
			const data = yield noapi.createUser(user);
			if (!data.error) {
				try {
					const datareslog = yield login(action.newUser.email, action.newUser.password);
					if (!datareslog.error) {
						userInfo.userId = data.id;
						userInfo.points = 0;
						let configForm = {
							language: "es",
							notifications: {
								audio: true,
								push: false,
								email: true,
							},
							units: "KM",
							created_at: new Date(),
							updated_at: new Date(),
							userId: data.id,
						}
						yield setItem('user', { ...data, password: action.newUser.password });
						const dataInfo = yield api.createUserInfo(userInfo);
						if (dataInfo.error) { console.log('user info error...', dataInfo.error) }
						try {
							const userInfoData = yield api.getByFilter("user-infos", data.id, "userId");
							if (userInfoData) {
								try {
									yield setItem('userInfo', userInfoData[0]);
								} catch (e) {
									console.log(e);
								}
							}
						} catch (e) {
							console.log(e);
						}
						yield routeLogin(data.id);
						const user = yield api.getByFilter('users', action.newUser.email.toLowerCase(), 'email');
						const userMember = yield api.getByFilter('user-subscriptions', user[0].id, 'userId');
						let memberName = ""
						if (userMember.length != 0) {
							//const memberType = yield api.getByFilter('subscriptions', userMember[0].subscriptionId, 'id');

						}
						yield put({ type: SET_USER_STORE, payload: user[0], subscription: memberName });
						yield put({ type: FETCH_USER_LOGIN_SUCCESS, payload: data });
						const dataConfing = yield api.registerConfiguration(configForm, datareslog.token);
						if (dataInfo && dataConfing) {
							let data_res = { user_res: data, userInfo_res: dataInfo };
							yield put({ type: FETCH_USER_REGISTER_SUCCESS, payload: data_res });
						} else {
							yield put({ type: FETCH_USER_REGISTER_FAILURE });
						}
					}
				} catch (e) {
					console.log(e);
					yield put({ type: FETCH_USER_REGISTER_FAILURE });
				}
			} else {
				let userToLogin = {
					userCredentials: action.newUser,
				}
				yield put({ type: FETCH_USER_REGISTER_FAILURE });
				yield loginUser(userToLogin);
			}
		} catch (e) {
			console.log(e);
			yield put({ type: FETCH_USER_REGISTER_FAILURE });
		}
	} else {
		yield put({ type: VALIDATION_FAIL });
		yield put({ type: FETCH_USER_REGISTER_FAILURE });
	}
}

function* loginUser(action) {
	console.log('estamos en userSagas')
	var errors = validateLogin(action.userCredentials);
	yield put({ type: VALIDATE_LOGIN, login: action.userCredentials });
	if (errors.length == 0) {
		try {
			const data = yield login(action.userCredentials.email, action.userCredentials.password);
			console.log('-->data.body', data.body)
			if (data.body.token) {
				yield put({ type: SET_TOKEN, token: data.body.token });
				yield put({ type: GET_USER_DATA, userId: data.body.id_user, password: action.userCredentials.password });
			} else {
				console.log('<----------------error------------------>')
				yield put({ type: FETCH_USER_LOGIN_FAILURE });
			}
		} catch (e) {
			console.log(e);
			console.log('<----------------error------------------>')
			yield put({ type: FETCH_USER_LOGIN_FAILURE });
		}
	}
	/* if (action.userCredentials.origin == 'correo') {
		var errors = validateLogin(action.userCredentials);
	} else {
		var errors = [];
	}
	if (errors.length == 0) {
		try {
			const data = yield login(action.userCredentials.email, action.userCredentials.password);
			if (data.body.token) {
				//yield setItem('token', data.token);
				const user = yield api.getByFilter('users', action.userCredentials.email.toLowerCase(), 'email');
				const userMember = yield api.getByFilter('user-subscriptions', user[0].id, 'userId');
				let memberName = JSON.stringify(userMember[0]?.subscriptionData.plan.planCode);
				if (!memberName) {
					const navigation = yield select((state) => state.globalReducer.nav._navigation);
					navigation.navigate("LoginScreen")
				}
				if (userMember.length != 0) {
					//const memberType = yield api.getByFilter('subscriptions', userMember[0].subscriptionId, 'id');


				}
				if (user[0].id) {
					yield setItem('user', { ...user[0], password: action.userCredentials.password });
					try {
						const userInfoDatal = yield api.getByFilter("user-infos", user[0].id, "userId");

						if (userInfoDatal) {
							try {
								yield setItem('userInfo', userInfoDatal[0]);
							} catch (e) {
								console.log(e);
							}
						}
					} catch (e) {
						console.log(e);
					}
					yield put({ type: SET_USER_STORE, payload: user[0], subscription: memberName });
					yield put({ type: FETCH_USER_LOGIN_SUCCESS, payload: data });
					yield routeLogin(user[0].id);
				} else {
					yield put({ type: FETCH_USER_LOGIN_FAILURE });
				}
			} else {
				yield put({ type: FETCH_USER_LOGIN_FAILURE });
			}
		} catch (e) {
			console.log(e);
			yield put({ type: FETCH_USER_LOGIN_FAILURE });
		}
	} else {
		yield put({ type: FETCH_USER_LOGIN_FAILURE });
	} */
}

function* dologOut() {
	console.log("HACIENDO LOGOUUR");
	yield put({ type: LOGOUTSUCCESS })
}

function* routeLogin(idUser) {
	const userLogg = yield select((state) => state.userReducer.dataUser);
	console.log('Tal vez login->', userLogg)
	if (userLogg.deleted_at) {
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		//navigation.navigate('LoginScreen');
		RootNavigation.navigate('LoginScreen')
		yield put({ type: LOGOUT })
	} else {
		var userSubscriptionL = yield api.getByFilter('user-subscriptions', idUser, 'userId');
		if (userSubscriptionL[0]) {
			userSubscriptionL = userSubscriptionL.sort(function (a, b) {
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or zero.
				return new Date(b.validUntil) - new Date(a.validUntil);
			});
			let validDate = new Date(userSubscriptionL[0].validUntil);
			let currentDate = new Date();
			if (validDate > currentDate) {
				//const navigation = yield select((state) => state.globalReducer.nav._navigation);
				let routeToPickNeeded = yield getItem("routeToPickDevice");
				let codetype = yield getItem("deviceConfigured");
				if ((routeToPickNeeded) && (routeToPickNeeded == "needToRoutePick")) {
					yield setItem("routeToPickDevice", "noNeedToRoutePick");
					const userReducer = yield select((state) => state.userReducer);
					console.log('codeType userReducer', userReducer.codetype)
					if (codetype && (codetype == 'polar')) {
						let objCode = {
							code: userReducer.code,
							userId: userReducer.dataUserInfo.userId
						};
						const codeResUser = yield api.linkPolar(objCode)
						if (!!codeResUser && !codeResUser.error) {
							//navigation.navigate('PickDeviceScreen');
							RootNavigation.navigate('LoginScreen')
							Alert.alert("Cuenta Polar vinculada.")
						} else if (!!codeResUser && codeResUser.error) {
							Alert.alert("Error", codeResUser.error)
						}
					}
					if (codetype && (codetype == 'suunto')) {
						let objCodeSuu = {
							code: userReducer.code,
							userId: userReducer.dataUserInfo.userId
						};
						const resTokenSuunto = yield api.authSuunto(objCodeSuu)
						if (!!resTokenSuunto && !resTokenSuunto.error) {
							navigation.navigate('PickDeviceScreen');
							Alert.alert("Cuenta Suunto vinculada.")
						} else if (!!resTokenSuunto && resTokenSuunto.error) {
							Alert.alert("Error", resTokenSuunto.error)
						}
					}
					if (codetype && (codetype == 'garmin')) {
						const tokenSecret = yield getItem('garmin_token_secret');
						const data = {
							token: userReducer.code.oauth_token.replace("%5C", ""),
							tokenSecret,
							userId: userReducer.dataUserInfo.userId,
							oauthVerifier: userReducer.code.oauth_verifier,
						}
						const garminSaveInfo = yield api.garminSaveInfo(data)
						if (!!garminSaveInfo && !garminSaveInfo.error) {
							navigation.navigate('PickDeviceScreen');
							Alert.alert("Cuenta Garmin vinculada.")
						} else if (!!garminSaveInfo && garminSaveInfo.error) {
							Alert.alert("Error", garminSaveInfo.error)
						}
					}

				} else {
					navigation.navigate('ProfileScreen');
				}
				const plansList = yield api.getSubscriptions();
				yield put({ type: ROUTE_LOGIN_SUCCESS, payload: plansList });
			} else {
				yield put(validateUserPay(idUser));
				const plansList = yield api.getSubscriptions();
				yield put({ type: ROUTE_LOGIN_FAILURE, payload: plansList });
			}
		} else {
			yield put(validateUserPay(idUser));
			const plansList = yield api.getSubscriptions();
			yield put({ type: ROUTE_LOGIN_FAILURE, payload: plansList });
		}
	}
}

function* editProfile(action) {
	let request = {
		'name': action.profileSettings.name,
		'description': action.profileSettings.description,
		'birthday': action.profileSettings.birthdayDate,
		'gender': action.profileSettings.gender,
		'skills': action.profileSettings.skills,
		'achievement': action.profileSettings.achievement
	}
	var errors = validateCreateProfile(request);
	if (errors.length == 0) {
		var lowerUsername = action.profileSettings.username.toLowerCase();
		const alredyUserName = yield api.getByFilter('users', lowerUsername, 'username');
		if ((alredyUserName.length == 0) || ((alredyUserName.length == 1) && (alredyUserName[0].id == action.userId))) {
			let update = api.patchField('user-infos', action.id, request);
			if (update) {
				let updateUser = api.patchField('users', action.userId, { 'username': lowerUsername });
				if (updateUser) {
					yield put({ type: FETCH_USER_PROFILE_SUCCESS, payload: update });
					yield getUserLoggedFunction();
				}
			} else {
				yield put({ type: FETCH_USER_PROFILE_FAILURE });
			}
		} else {
			yield put({ type: FETCH_USER_PROFILE_FAILURE });
			yield delay(100);
			Alert.alert(action.profileSettings.username + I18n('Alert_Username'));
		}
	} else {
		yield put({ type: FETCH_USER_PROFILE_FAILURE });
	}
}


function* uploadImageS3(image, table) {
	const startTime = Date.now();
	console.log('probando esta joda de uploadImagenS3 _____unage', image);
	console.log('probando esta joda de uploadImagenS3 _____tabla', table);
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
	const result = yield api.postFileHeaders(table, "upload", formData)
	const endTime = Date.now();
	console.log(` funcion uploadImageS3 total execution time: ${endTime - startTime} ms`);
	if (result.error == null) {
		if (result.files[0] != null) {
			return result.files[0].location;
		}

	}

}

function* getUserLoggedFunction() {
	const userInfoL = yield getItem('user');
	if (userInfoL) {
		const user = yield api.getUserLoggedApi(userInfoL.id);
		console.log('userinfo a consumir')
		console.log(user[0])
		//BIRTHDAY
		if (user[0].userInfo.birthday) {
			var hoy = new Date();
			var cumpleanos = new Date(user[0].userInfo.birthday);
			var edad = hoy.getFullYear() - cumpleanos.getFullYear();
			var m = hoy.getMonth() - cumpleanos.getMonth();

			if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
				edad--;
			}
			user[0].userInfo.age = edad;
		}
		//City
		if (user[0].userInfo.locationId) {
			let city = yield api.getByFilter('locations', user[0].userInfo.locationId, 'id');
			if (city[0]) {
				user[0].userInfo.locationId = city[0].name;
			} else {
				user[0].userInfo.locationId = "Desconocido";
			}
		} else {
			user[0].userInfo.locationId = "Desconocido";
		}
		//Club
		if (user[0].userInfo.clubId) {
			let club = yield api.getByFilter('clubs', user[0].userInfo.clubId, 'id');
			if (club[0]) {
				user[0].userInfo.clubId = club[0].name;
				user[0].userInfo.club = club[0];
			} else {
				user[0].userInfo.clubId = "Desconocido";
			}
		} else {
			user[0].userInfo.clubId = "Desconocido";
		}
		//Notificaciones
		if (user[0].userInfo.clubId) {
			let notifications = yield api.getByFilter('notifications', user[0].id, 'userId');
			if (notifications) {
				user[0].userInfo.notifications = notifications;
			} else {
				user[0].userInfo.notifications = [];
			}
		} else {
			user[0].userInfo.notifications = [];
		}
		//End saga
		if (user[0]) {
			yield put({ type: FETCH_USER_SUCCESS, payload: user[0] })
		} else {
			yield put({ type: FETCH_USER_FAILURE })
		}
	}
}

function* uploadEventImage(action) {
	if (action.eventImage.assets && action.eventImage.assets.length > 0) {
		try {
			// Create FormData locally identical to trip logic
			let formData = new FormData();
			const imageAsset = action.eventImage.assets[0];

			formData.append('image', {
				uri: imageAsset.uri,
				type: imageAsset.type,
				name: imageAsset.fileName || `profile_image_${Date.now()}.jpg`,
			});

			console.log('Subiendo imagen de perfil de usuario localmente...', formData);
			const uploadRes = yield api.postImgFile(formData, 'user');
			console.log('Respuesta de upload perfil:', uploadRes);

			if (uploadRes && !uploadRes.error && uploadRes.imageUrl) {
				const s3Route = uploadRes.imageUrl;
				console.log('Ruta de imagen generada (antes s3Route):', s3Route);

				let formUser = yield select((state) => state.userReducer.formRegister);
				yield put({ type: POST_USER, user: formUser, s3Route: s3Route });

			} else {
				yield put({ type: SAVE_LOADER, loader: false });
				yield put({ type: FETCH_UPLOAD_EVENT_IMAGE_FAILURE });
			}
		} catch (e) {
			console.log("Error al subir imagen de evento al API local:", e);
			yield put({ type: FETCH_UPLOAD_EVENT_IMAGE_FAILURE });
		}

	} else {
		yield put({ type: SAVE_LOADER, loader: false });
		yield put({ type: FETCH_UPLOAD_EVENT_IMAGE_FAILURE });
	}
}

function* uploadEventImageTrack(action) {
	if (action.eventImageTrack.uri) {
		try {
			const s3Route = yield uploadImageS3(action.eventImageTrack, "challenges");
			if (s3Route) {
				yield put({ type: FETCH_UPLOAD_EVENTTRACK_IMAGE_SUCCESS, payload: s3Route });
			} else {
				yield put({ type: FETCH_UPLOAD_EVENTTRACK_IMAGE_FAILURE });
			}
		} catch (e) {
			console.log(e);
			yield put({ type: FETCH_UPLOAD_EVENTTRACK_IMAGE_FAILURE });
		}

	} else {
		yield put({ type: FETCH_UPLOAD_EVENTTRACK_IMAGE_FAILURE });
	}
}

function* uploadProfileImage(action) {
	if (action.image.uri) {
		try {
			const imgInfo = { ...action.image }
			if (Platform.OS == 'android') {
				/* const realPath = yield RNGRP.getRealPathFromURI(action.image.uri);
				const file = yield RNFS.readFile(realPath, 'base64');
				imgInfo.uri = file */
			}
			const s3Route = yield uploadImageS3(imgInfo, "users");
			if (s3Route) {
				let request = { 'photo': s3Route };
				const changePhotoDb = yield api.patchField('user-infos', action.id, request);
				console.log(changePhotoDb, request)
				yield put({ type: FETCH_IMAGE_PROFILE_SUCCESS, payload: s3Route });
				yield getUserLoggedFunction();
			} else {
				yield put({ type: FETCH_IMAGE_PROFILE_FAILURE });
			}
		} catch (e) {
			yield put({ type: FETCH_IMAGE_PROFILE_FAILURE });
		}
	} else {
		yield put({ type: FETCH_IMAGE_PROFILE_FAILURE });
	}
}


//othersSaga
function* addDeviceConfiguration(action) {
	var errors = validateDeviceConfiguration(action.deviceCofiguration);
	if (errors.length == 0) {
		yield put({ type: FETCH_DEVICE_CONFIGURATION_SUCCESS });
	} else {
		yield put({ type: FETCH_DEVICE_CONFIGURATION_FAILURE });
	}
}
function* sycnAction(action) {
	console.log(action.syncSettings, "survey");
	var errors = validateSync(action.syncSettings);
	if (errors.length == 0) {
		yield put({ type: FETCH_SYNC_SUCCESS });
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		//navigation.navigate('ProfileScreen');
		RootNavigation.navigate('ProfileScreen')
		yield delay(100);
		Alert.alert(I18n('Survey_Sent'));
	} else {
		yield put({ type: FETCH_SYNC_FAILURE });
	}
}

function* createUserEvent(action) {
	let filterEventUser = {
		where: {
			userId: action.newEventUser.userId,
			eventId: action.newEventUser.eventId
		}
	}
	if (action.newEventUser.clubId) {
		filterEventUser = {
			where: {
				userId: action.newEventUser.userId,
				clubId: action.newEventUser.clubId,
				eventId: action.newEventUser.eventId,
			}
		}
	}
	const existingEventUser = yield api.get('event-users', filterEventUser);
	if (existingEventUser.length > 0) {
		Alert.alert(I18n('Previously_Registered'));
	} else {
		let nUserEvent = {
			points: 0,
			ranking: 0,
			created_at: new Date(),
			updated_at: new Date(),
			...action.newEventUser,
		}
		const userEvent = yield api.createUserEvent(nUserEvent)
		if (!userEvent.error) {
			yield put({ type: FETCH_USER_EVENT_SUCCESS });
			Alert.alert(I18n('Successfully_Registered'));
		} else {
			yield put({ type: FETCH_USER_EVENT_FAILURE });
			Alert.alert(I18n('Error'));
		}
	}
}

function* uploadClubImage(action) {
	if (action.clubImage.uri) {
		try {
			const s3Route = yield uploadImageS3(action.clubImage, "clubs");
			if (s3Route) {
				yield put({ type: FETCH_UPLOAD_CLUB_IMAGE_SUCCESS, payload: s3Route });
			} else {
				yield put({ type: FETCH_UPLOAD_CLUB_IMAGE_FAILURE });
			}
		} catch (e) {
			console.log(e);
			yield put({ type: FETCH_UPLOAD_CLUB_IMAGE_FAILURE });
		}

	} else {
		yield put({ type: FETCH_UPLOAD_CLUB_IMAGE_FAILURE });
	}
}
function* createClub(action) {
	var errors = validateCreateClub(action.newClub);
	if (errors.length == 0) {
		let adminsNotIds = [];
		let membersNotIds = [];
		for (var admnew of action.newClub.adminsIdsnotConfirmedSel) {
			adminsNotIds = adminsNotIds.concat([admnew.userId]);
		}
		for (var membernew of action.newClub.membersIdsnotConfirmedSel) {
			membersNotIds = membersNotIds.concat([membernew]);
		}
		action.newClub.admins.adminsIdsnotConfirmed = adminsNotIds;
		const userInfoClub = yield select((state) => state.userReducer.dataUserInfo);
		var clubForm = {
			image: action.newClub.imageS3,
			name: action.newClub.name,
			description: action.newClub.description,
			activity: action.newClub.userInfoInfo.activity,
			state: "noState",
			point: 0,
			ranking: 0,
			memberId: { membersNotConfirmed: membersNotIds },
			adminId: action.newClub.admins,
			created_at: new Date(),
			updated_at: new Date,
		}
		const data = yield api.createClub(clubForm);
		console.log('club', data);
		if (data && !data.error) {
			userInfoClub.clubId = data.id;
			if (userInfoClub.notifications || userInfoClub.age) {
				delete userInfoClub.notifications;
				delete userInfoClub.age;
			}
			api.updateUserInfos(userInfoClub, userInfoClub.id);
			for (var admitem of action.newClub.selectedAdmin) {
				admitem.clubId = data.id;
				if (admitem.photo) admitem.photo = admitem.photo.replace(/\?.+/g, "$'")
				console.log('user', admitem);
				if (admitem.notifications || admitem.age) {
					delete admitem.notifications;
					delete admitem.age;
				}
				yield api.putItem("user-infos", admitem.id, admitem);
			}
			if (action.newClub.selectedUsers.length > 0) {
				action.newClub.selectedUsers.forEach((user) => {
					user.clubId = data.id;
					if (user.notifications || user.age) {
						delete user.notifications;
						delete user.age;
					}
					api.updateUserInfos(user, user.id);
				});
			}

			//ADMINS NOTIFICATIONS
			const userNoti = yield select((state) => state.userReducer.dataUserInfo);
			for (let index = 0; index < action.newClub.admins.adminsIds.length; index++) {
				if (action.newClub.admins.adminsIds[index] != userNoti.userId) {
					let noti = yield api.sendNotification({
						type: "accept",
						message: "Ahora eres el admin del grupo " + action.newClub.name,
						state: "unread",
						action: {
							type: "admin",
							clubId: userInfoClub.clubId,
							userId: action.newClub.admins.adminsIds[index]
						},
						userId: action.newClub.admins.adminsIds[index],
						created_at: new Date(),
						updated_at: new Date()
					});
				}
			}
			//MEMBERS NOTIFICATIONS
			for (let index = 0; index < action.newClub.membersIdsnotConfirmedSel.length; index++) {
				if (action.newClub.membersIdsnotConfirmedSel[index].userId != userNoti.id) {
					console.log("membernoti");
					let noti = yield api.sendNotification({
						type: "accept",
						message: "Te han invitado a ser miembro del club " + action.newClub.name,
						state: "unread",
						action: {
							type: "member",
							clubId: userInfoClub.clubId,
							userId: action.newClub.membersIdsnotConfirmedSel[index].userId
						},
						userId: action.newClub.membersIdsnotConfirmedSel[index].userId,
						created_at: new Date(),
						updated_at: new Date()
					});
				}
			}

			const userNew = yield api.getByFilter("user-infos", userInfoClub.id, "id");
			yield setItem('userInfo', userNew[0]);
			yield put({ type: FETCH_CREATE_CLUB_SUCCESS, payload: data });
			yield delay(100);
			Alert.alert("Club Creado");
		} else {
			yield delay(100);
			Alert.alert("Ha ocurrido un error con los datos ingresados o el nombre del Club ya esta en uso");
			yield put({ type: FETCH_CREATE_CLUB_FAILURE });
		}
		const userNew = yield api.getByFilter("user-infos", userInfoClub.id, "id");
		yield setItem('userInfo', userNew[0]);
		yield put({ type: FETCH_CREATE_CLUB_SUCCESS, payload: data });
		yield delay(100);
		Alert.alert(I18n('Club_Created'));
		yield put(clearClubInfo());
		yield getUserLoggedFunction();
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		yield loadClubInfo();
		//navigation.navigate('ProfileScreen');
		RootNavigation.navigate('ProfileScreen')
	} else {
		yield put({ type: FETCH_CREATE_CLUB_FAILURE });
	}
}

function* editClub(clubEditInfo) {
	try {
		const editClub = yield api.getByFilter("clubs", clubEditInfo.clubEditInfo.id, "id");
		if (editClub[0]) {
			var deletedMembers = [];
			clubEditInfo.clubEditInfo.initialUsers.forEach((userini) => {
				var noQuedo = true;

				clubEditInfo.clubEditInfo.selectedUsers.forEach((usuariosel) => {
					if (userini.userId == usuariosel.userId) {
						noQuedo = false;
					}
				});
				if (noQuedo) {
					var adminToDelete = clubEditInfo.clubEditInfo.adminId.adminsIds.find((admid) => {
						return admid == userini.userId;
					});
					var padminToDelete = clubEditInfo.clubEditInfo.adminId.adminsIdsnotConfirmed.find((admid) => {
						return admid == userini.userId;
					});
					if (adminToDelete) {
						Alert.alert(userini.name + I18n('Alert_Delete_Admin'));
					} else if (padminToDelete) {
						Alert.alert(userini.name + I18n('Alert_Added_Admin'));
					} else {
						userini.clubId = "";
						if (userini.photo) userini.photo = userini.photo.replace(/\?.+/g, "$'")
						api.putItem("user-infos", userini.id, userini);
					}
				}
			});
			editClub[0].adminId = clubEditInfo.clubEditInfo.admins;

			//ADMINS NOTIFICATIONS
			const userNoti = yield select((state) => state.userReducer.dataUser);
			for (let index = 0; index < clubEditInfo.clubEditInfo.adminsPending.length; index++) {
				if (clubEditInfo.clubEditInfo.adminsPending[index] != userNoti.userId) {
					let noti = yield api.sendNotification({
						type: "accept",
						message: "Ahora eres el admin del grupo " + clubEditInfo.clubEditInfo.name,
						state: "unread",
						action: {
							type: "admin",
							clubId: userNoti.userInfo.club.id,
							userId: clubEditInfo.clubEditInfo.adminsPending[index]
						},
						userId: clubEditInfo.clubEditInfo.adminsPending[index],
						created_at: new Date(),
						updated_at: new Date()
					});
				}
			}
			//MEMBERS NOTIFICATIONS
			if (clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel.length > 0) {
				for (let index = 0; index < clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel.length; index++) {
					if (clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel[index].userId != userNoti.id) {
						const oldMember = clubEditInfo.clubEditInfo.membersIdsnotConfirmed.find((memb) => {
							return memb.userId == clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel[index].userId;
						});
						if (!oldMember) {
							console.log("membernoti");
							let noti = yield api.sendNotification({
								type: "accept",
								message: "Te han invitado a ser miembro del club " + clubEditInfo.clubEditInfo.name,
								state: "unread",
								action: {
									type: "member",
									clubId: userNoti.userInfo.club.id,
									userId: clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel[index].userId
								},
								userId: clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel[index].userId,
								created_at: new Date(),
								updated_at: new Date()
							});
						}
					}
				}
			}

			editClub[0].memberId.membersNotConfirmed = clubEditInfo.clubEditInfo.membersIdsnotConfirmedSel;
			editClub[0].name = clubEditInfo.clubEditInfo.name;
			editClub[0].point = clubEditInfo.clubEditInfo.point;
			editClub[0].adminId.adminsIdsnotConfirmed = clubEditInfo.clubEditInfo.adminsPending;
			editClub[0].description = clubEditInfo.clubEditInfo.description;
			editClub[0].activity = clubEditInfo.clubEditInfo.activity;
			console.log(clubEditInfo.clubEditInfo.activity, "actId")
			editClub[0].image = clubEditInfo.clubEditInfo.image;
			if (editClub[0].image) editClub[0].image = editClub[0].image.replace(/\?.+/g, "$'")
			editClub[0].updated_at = new Date();
			editedClub = yield api.putItem("clubs", editClub[0].id, editClub[0]);
			console.log(editedClub)
			if (editedClub) {
				for (var admitem of clubEditInfo.clubEditInfo.selectedAdmin) {
					admitem.clubId = clubEditInfo.clubEditInfo.id;
					admitem.updated_at = new Date();
					if (admitem.photo) admitem.photo = admitem.photo.replace(/\?.+/g, "$'")
					yield api.putItem("user-infos", admitem.id, admitem);
				}
				for (var memitem of clubEditInfo.clubEditInfo.selectedUsers) {
					memitem.clubId = clubEditInfo.clubEditInfo.id;
					memitem.updated_at = new Date();
					if (memitem.photo) memitem.photo = memitem.photo.replace(/\?.+/g, "$'")
					yield api.putItem("user-infos", memitem.id, memitem);
				}
			}
		}
		const userInfoClubEdit = yield getItem('userInfo');
		const userNewEdit = yield api.getByFilter("user-infos", userInfoClubEdit.id, "id");
		yield setItem('userInfo', userNewEdit[0]);
		yield loadClubInfo();
		yield put({ type: FETCH_EDIT_CLUB_SUCCESS });
		yield delay(100);
		Alert.alert(I18n('Club_Edited'));
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		//navigation.navigate('ProfileScreen');
		RootNavigation.navigate('ProfileScreen')
	} catch (e) {
		yield put({ type: FETCH_EDIT_CLUB_FAILURE });
	}
}

function* deleteClub(clubInfo) {
	try {
		const delClub = yield api.getByFilter("clubs", clubInfo.clubInfo.id, "id");
		if (delClub[0]) {
			delClub[0].adminId.adminsIds = [];
			delClub[0].deleted_at = new Date();
			if (delClub[0].image) delClub[0].image = delClub[0].image.replace(/\?.+/g, "$'")
			yield api.putItem("clubs", delClub[0].id, delClub[0]);
			yield api.patchField('clubs', delClub[0].id, { 'deleted_at': new Date() });
			for (var item of clubInfo.clubInfo.userslist) {
				item.clubId = "";
				if (item.photo) item.photo = item.photo.split('?')[0]
				yield api.putItem("user-infos", item.id, item);
			}
			for (var adminitem of clubInfo.clubInfo.adminslist) {
				adminitem.clubId = "";
				if (adminitem.photo) adminitem.photo = adminitem.photo.replace(/\?.+/g, "$'")
				yield api.putItem("user-infos", adminitem.id, adminitem);
			}
			yield put(clearClubInfo());
		}
		const userInfoClubDel = yield getItem('userInfo');
		const userNewDel = yield api.getByFilter("user-infos", userInfoClubDel.id, "id");
		yield setItem('userInfo', userNewDel[0]);
		yield put({ type: FETCH_DELETE_CLUB_SUCCESS });
		yield delay(100);
		Alert.alert(I18n('Club_Deleted'));
		yield getUserLoggedFunction();
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		//navigation.navigate('ProfileScreen');
		RootNavigation.navigate('ProfileScreen')
	} catch (e) {
		yield put({ type: FETCH_DELETE_CLUB_FAILURE });
	}
}

function* loadClubInfo() {
	const loadUserClub = yield getItem('userInfo');
	if (loadUserClub) {
		try {
			var adminsClub = [];
			const dataLoadClub = yield api.getByFilter("clubs", loadUserClub.clubId, "id");
			if (dataLoadClub) {
				for (var item of dataLoadClub[0].adminId.adminsIds) {
					const userGet = yield api.getByFilter("user-infos", item, "userId");
					adminsClub = adminsClub.concat(userGet);
				}
			}
			const dataUsersInClub = yield api.getByFilter("user-infos", loadUserClub.clubId, "clubId");
			dataLoadClub[0].userslist = dataUsersInClub;
			dataLoadClub[0].adminslist = adminsClub;
			yield put({ type: FETCH_LOAD_CLUB_SUCCESS, payload: dataLoadClub[0] });
		} catch (e) {
			yield put({ type: FETCH_LOAD_CLUB_FAILURE });
		}
	}
}

function* filterClubMember(action) {
	if (action.filter.filterWord) {
		try {
			var membersSameActivity = [];
			const data = yield api.getUsersByFilter(action.filter.filterWord);
			if (data && (data.length > 0)) {
				for (var memberSr of data) {
					if (memberSr.activity == action.filter.activity) {
						membersSameActivity = membersSameActivity.concat(memberSr);
					}
				}
			}

			const dataMail = yield api.getUsersByMail(action.filter.filterWord);
			if (dataMail && (dataMail.length > 0)) {
				for (var memberMailSr of dataMail) {
					if (memberMailSr.userInfo.activity == action.filter.activity) {
						let alreadyInList = membersSameActivity.find((user) => {
							return user.id === memberMailSr.userInfo.id
						});
						if (!alreadyInList) {
							membersSameActivity = membersSameActivity.concat(memberMailSr.userInfo);
						}
					}
				}
			}
			yield put({ type: FETCH_FILTER_CLUB_MEMBER_SUCCESS, payload: membersSameActivity });
		} catch (e) {
			yield put({ type: FETCH_FILTER_CLUB_MEMBER_FAILURE });
		}
	} else {
		yield put({ type: FETCH_FILTER_CLUB_MEMBER_SUCCESS, payload: [] });
	}
}

function* filterClubAdmin(action) {
	if (action.adminFilter) {
		try {
			const data = yield api.getUsersByFilter(action.adminFilter);
			yield put({ type: FETCH_FILTER_CLUB_ADMIN_SUCCESS, payload: data });
		} catch (e) {
			yield put({ type: FETCH_FILTER_CLUB_ADMIN_FAILURE });
		}
	} else {
		yield put({ type: FETCH_FILTER_CLUB_ADMIN_SUCCESS, payload: [] });
	}
}

function* getUserApiDevices() {
	let userPolar = {};
	let userGarmin = {};
	let userSuunto = {};
	const loadUser = yield getItem('user');
	console.log('Info User to get Devices---', loadUser)
	const dataLoadPolar = yield api.getByFilter("polars", loadUser.id, "userId");
	const dataLoadGarmin = yield api.getByFilter("garmins", loadUser.id, "userId");
	const dataLoadSuunto = yield api.getByFilter("suuntos", loadUser.id, "userId");
	yield setItem('userPolar', dataLoadPolar[0]);
	yield setItem('userGarmin', dataLoadGarmin[0]);
	yield setItem('userSuunto', dataLoadSuunto[0]);
	const data = { polar: dataLoadPolar[0] ? dataLoadPolar[0] : {}, garmin: dataLoadGarmin[0] ? dataLoadGarmin[0] : {}, suunto: dataLoadSuunto[0] ? dataLoadSuunto[0] : {} };
	if (dataLoadPolar && dataLoadGarmin && dataLoadSuunto) {
		yield put({ type: GET_API_DEVICES_SUCCESS, payload: data });
	} else {
		yield put({ type: GET_API_DEVICES_FAILURE });
	}
}

function* getTrackings(action) {
	const loadUser = yield getItem('user');
	const trackings = yield api.getUserTrackings(loadUser.id, action.device);
	console.log('trackings', trackings)
	if (action.device == 'polar') {
		const data = { polar: trackings, garmin: [], suunto: [] };
		yield put({ type: GET_DEVICE_TRACKINGS_SUCCESS, payload: data });
	}
	if (action.device == 'garmin') {
		const data = { polar: [], garmin: trackings, suunto: [] };
		yield put({ type: GET_DEVICE_TRACKINGS_SUCCESS, payload: data });
	}
	if (action.device == 'suunto') {
		const data = { polar: [], garmin: [], suunto: trackings };
		yield put({ type: GET_DEVICE_TRACKINGS_SUCCESS, payload: data });
	}
}

function* getCurrentEventUser(action) {
	const loadUser = yield getItem('user');
	let filter = {
		where: {
			userId: loadUser.id,
			eventId: action.eventId
		}
	}
	const eventUser = yield api.get('event-users', filter);
	if (eventUser.length > 0) {
		yield put({ type: SAVE_CURRENT_EVENT, payload: true });
	} else {
		yield put({ type: SAVE_CURRENT_EVENT, payload: false });
	}
	console.log("eventtssss", eventUser);
}

function* getUserEvents(action) {
	let currentDate = new Date().toISOString();
	const loadUser = yield getItem('user');
	let filter = {
		where: {
			and: [
				{ 'deleted_at': { inq: [null, false] } },
				{ 'userId': loadUser.id },
			]
		},
		include: [{
			relation: 'challenge',
		}]
	}

	const eventUser = yield api.get('event-users', filter);
	let eventsFiltered = eventUser.filter((data) => { return (data.challenge.startDate < action.date && data.challenge.endDate > action.date && data.challenge.startDate < currentDate && data.challenge.endDate > currentDate) });
	let events = eventsFiltered.filter((data) => { return data.challenge.type == 'event' });
	let challenges = eventsFiltered.filter((data) => { return data.challenge.type == 'challenge' });
	const data = { events: events, challenges: challenges };
	yield put({ type: GET_USER_EVENTS_SUCCESS, payload: data });
}

function* postUserTrackingsCollection(action) {

	let parametersRequest = action.parameters;
	parametersRequest.altitude = !action.parameters.altitude && action.parameters.altitude != 0 ? 0 : action.parameters.altitude;
	parametersRequest.cadence = !action.parameters.cadence && action.parameters.cadence != 0 ? 0 : action.parameters.cadence;
	parametersRequest.distance = !action.parameters.distance && action.parameters.distance != 0 ? 0 : action.parameters.distance;
	parametersRequest.incline = !action.parameters.incline && action.parameters.incline != 0 ? 0 : action.parameters.incline;
	parametersRequest.maxSpeed = !action.parameters.maxSpeed && action.parameters.maxSpeed != 0 ? 0 : action.parameters.maxSpeed;
	parametersRequest.power = !action.parameters.power && action.parameters.power != 0 ? action.parameters.power : 0;
	parametersRequest.speed = !action.parameters.speed && action.parameters.speed != 0 ? 0 : action.parameters.speed;
	parametersRequest.time = !action.parameters.time && action.parameters.time != 0 ? 0 : action.parameters.time;
	parametersRequest.heartRate = !action.parameters.heartRate && action.parameters.heartRate != 0 ? 0 : action.parameters.heartRate;
	parametersRequest.calories = !action.parameters.calories && action.parameters.calories != 0 ? 0 : action.parameters.calories;

	parametersRequest.startPoint = !!action.parameters.startPoint ? action.parameters.startPoint : { trackLatitude: 0, trackLongitude: 0 };
	parametersRequest.finalPoint = !!action.parameters.finalPoint ? action.parameters.finalPoint : { trackLatitude: 0, trackLongitude: 0 };

	let tracking = yield api.putItem('user-trackings', action.id, action.parameters);
	if (!tracking.error) {
		yield put({ type: FETCH_SYNC_SUCCESS });
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		//navigation.navigate('ProfileScreen');
		RootNavigation.navigate('ProfileScreen')
		Alert.alert(I18n('Survey_Sent'));
	} else {
		yield put({ type: FETCH_SYNC_FAILURE });
	}
}

function* getUserProgress() {
	const loadUser = yield getItem('userInfo');
	console.log('userInfoProgress', loadUser);
	const userProgress = yield api.get('user-infos/progress/' + loadUser.id, {});
	console.log('progrress', userProgress);
	yield put({ type: SAVE_USER_PROGRESS, payload: userProgress });
}


/*WATCHERS*/
function* getUserLoggedSaga() {
	yield takeLatest(FETCH_USER_BEGIN, getUserLoggedFunction)
}

function* validateUserPaySagas() {
	yield takeLatest(VALIDATE_USER_PAY, function* validateUserPay(actionData) {
		const payStatus = yield api.get(`/currentPeriodPayStatus/${actionData.userId}`);
		//const navigation = yield select((state) => state.globalReducer.nav._navigation);
		//navigation.navigate(payStatus.status == "paid" || payStatus.status == "first" ? 'ProfileScreen' : 'MemberShipScreen');
		RootNavigation.navigate(payStatus.status == "paid" || payStatus.status == "first" ? 'ProfileScreen' : 'MemberShipScreen')
		const userInfo = yield getItem('userInfo');
		switch (payStatus.status) {
			case "paid":
				if (!userInfo.membership || !userInfo.activity) {
					let activityObj = { activity: payStatus.subscription.activity, membership: payStatus.subscription.type };
					yield api.patchField('user-infos', userInfo.id, activityObj);
					yield put(getUserLogged());
					Alert.alert('Bien!', "Se ha registrado el pago de tu suscripcion");
				}
				break;
			case "pending":
				Alert.alert('Información', "Nos encontramos validando tu pago vuelve mas tarde", []);
				break;
			case "rejected":
				Alert.alert('Información', "Tu ultimo pago ha sido rechazado");
				break;
			case "first":
				if (!userInfo.membership || !userInfo.activity) {
					let activityObj = { activity: payStatus.subscription.activity, membership: payStatus.subscription.type };
					yield api.patchField('user-infos', userInfo.id, activityObj);
					yield put(getUserLogged());
					Alert.alert('Bienvenido', "Bienvenido a los 7 dias de prueba de track it up");
				}
				break;
			case "inactive":
				break;
		}
	})
}

function* goGarminSaga() {
	yield takeLatest(GO_GARMIN_BEGIN, function* gofunction() {
		let go = yield api.garminAuth();
		if (go) {
			yield setItem('garmin_token_secret', go.oauth_token_secret);
			console.log("GARMIN ", go);
			const url = 'https://connect.garmin.com/modern/oauthConfirm?hl=en_US&oauth_token=' + go.oauth_token + '&oauth_callback=https://trackitup.co/deeplink.php'
			Linking.openURL(url);
			yield put({ type: GO_GARMIN_SUCCESS, payload: go })
		}
	})
}

function* goSuuntoSaga() {
	yield takeLatest(GO_SUUNTO_BEGIN, function* goSuuntoFunction() {
		//let go = yield api.garminAuth();
		//if(go){
		const url = 'https://cloudapi-oauth.suunto.com/oauth/authorize?response_type=code&client_id=738952f0-d5f1-4bca-b733-a8dfa37c1af1&redirect_uri=https://trackitup.co/deeplink.php'
		Linking.openURL(url);
		yield put({ type: GO_SUUNTO_SUCCESS })
		//}
	})
}
function* routing(component) {
	RootNavigation.navigate(component.component)
}

function* validateForm(stateRegister) {
	const startTime = Date.now();

	if (stateRegister.formRegister.origin == 'correo') {
		const errors = validateRegister(stateRegister.formRegister);
		if (errors.length == 0) {
			yield put({ type: appTypes.setLoadingLogin, payload: true });
			yield put({ type: SAVE_FORM_REGISTER, formRegister: stateRegister });
			const documentPhoto = yield select((state) => state.userReducer.documentUser);
			yield put({ type: FETCH_UPLOAD_EVENT_IMAGE_BEGIN, eventImage: documentPhoto });
			yield put({ type: appTypes.setLoadingLogin, payload: true });
		} else {
			yield put({ type: SAVE_LOADER, loader: false });
		}
	} else {
		yield put({ type: SAVE_LOADER, loader: false });
		var errors = [];
	}
	const endTime = Date.now(); // Marca el tiempo final
	console.log(`validateForm total execution time: ${endTime - startTime} ms`);
	//Alert.alert(`validateForm total execution time: ${endTime - startTime} ms`);
}

function* guardarForm(stateRegister) {
	if (stateRegister.formRegister.origin == 'correo') {
		const errors = validateRegister(stateRegister.formRegister);
		const errorLength = Object.keys(errors).length;
		if (errorLength === 0) {
			// Validando que el documento no este registrado.
			let cc = stateRegister.formRegister.idNumber;
			let tabla = 'bc_usuarios'
			let user = yield api.validationUserDocument(tabla, cc);
			if (!user) {
				yield put({ type: GUARDAR_FORM_REGISTER_FAILED });
				Alert.alert('Advertencia', 'El número de documento ingresado ya está siendo utilizado.');
			} else {
				console.log('estamos en USerSaga guardarForm y este es el ID de org', stateRegister.formRegister.empresa)
				const correo_cor = !!stateRegister.formRegister.email ? stateRegister.formRegister.email : 'correo@davivienda.com';
				let tablaEmail = `bc_empresas/email/${correo_cor}`;
				let emailCorporativo = yield call(apiPerfil.get__, tablaEmail);
				//console.log('emailCorporativo:' , emailCorporativo);

				if (emailCorporativo?.data && emailCorporativo.data.length > 0) {
					const empresa = emailCorporativo.data.find(
						emp => emp.emp_id === stateRegister.formRegister.empresa
					);

					if (empresa) {
						console.log('Dominio encontrado en esta empresa:', empresa);
						const idOrganization = stateRegister.formRegister.empresa;
						let tablaOrganization = `bc_empresas/organization/${idOrganization}`;
						let organizationStations = yield call(apiPerfil.get__, tablaOrganization);
						if (organizationStations?.data && organizationStations.data.length > 0) {
							const responseStations = organizationStations.data[0].bc_estaciones || [];
							const addOrganizationName = {
								formRegister: {
									...stateRegister.formRegister,
									"usu_empresa": organizationStations.data[0].emp_nombre
								},
								type: stateRegister.type
							};
							yield put({ type: GUARDAR_FORM_REGISTER, formRegister: addOrganizationName });
							yield put({ type: GET_STATIONS, stations: Array.isArray(responseStations) ? responseStations : [] });
						} else {
							console.warn('organizationStations no contiene datos');
						}
					} else {
						yield put({ type: GUARDAR_FORM_REGISTER_FAILED });
						console.log('No se encontró empresa con ese ID');
						Alert.alert('El correo no es corporativo.', 'Debe pertenecer a una organización');
					}
				} else {
					console.warn('emailCorporativo no contiene empresas');
				}


			}
		}
	}
}

function* updateForm(updateForm) {
	yield put({ type: UPDATE_FORM_REGISTER, formRegister: updateForm });
}

function* registerSelectors() {
	try {
		let whereIdType = {
			where: {
				and: [{ table: "users" }, { field: "idType" }]
			}
		}
		const idTypes = yield api.get('master-lists', whereIdType)
		const defaultIdTypes = [
			{ value: 'Cédula' },
			{ value: 'Cédula de extranjería' },
			{ value: 'Pasaporte' },
			{ value: 'Documento de identidad' }
		];
		yield put({ type: SAVE_ID_TYPE, idTypes: Array.isArray(idTypes) && idTypes.length > 0 ? idTypes : defaultIdTypes });
		//-------------------------------------------------------------------------------------------

		let whereResidentTypes = {
			where: {
				and: [{ table: "users" }, { field: "residentType" }]
			}
		}
		const residentTypes = yield api.get('master-lists', whereResidentTypes)
		yield put({ type: SAVE_RESIDENT_TYPE, residentTypes: Array.isArray(residentTypes) ? residentTypes : [] });

		//-------------------------------------------------------------------------------------------
		let whereGenders = {
			where: { and: [{ table: "users" }, { field: "gender" }] }
		}
		const genders = yield api.get('master-lists', whereGenders)
		yield put({ type: SAVE_GENDER, genders: Array.isArray(genders) ? genders : [] });

		//-------------------------------------------------------------------------------------------

		let whereCivilStates = {
			where: {
				and: [{ table: 'users' }, { field: 'civilState' }]
			}
		}
		const civilStates = yield api.get('master-lists', whereCivilStates)
		yield put({ type: SAVE_CIVIL_STATE, civilStates: Array.isArray(civilStates) ? civilStates : [] });

		//-------------------------------------------------------------------------------------------

		let whereWorksStatus = {
			where: {
				and: [{ table: 'users' }, { field: 'workStatus' }]
			}
		}
		const worksStatus = yield api.get('master-lists', whereWorksStatus)
		yield put({ type: SAVE_WORK_STATUS, worksStatus: Array.isArray(worksStatus) ? worksStatus : [] });

		//-------------------------------------------------------------------------------------------
		const company = yield api.get('organizations')
		yield put({ type: SAVE_COMPANY_TYPE, companyType: Array.isArray(company) ? company : [] });

		//-------------------------------------------------------------------------------------------
		let whereTransportationMode = {
			where: {
				and: [{ table: 'users' }, { field: 'transportationMode' }]
			}
		}
		const transportation = yield api.get('master-lists', whereTransportationMode)
		yield put({ type: SAVE_TRANSPORTATION_MODE, transportationMode: Array.isArray(transportation) ? transportation : [] });
	} catch (error) {
		console.log('Error in registerSelectors saga:', error);
	}
}


function* postUser(formUser) {
	console.log('[REGISTRO] Iniciando proceso de registro de usuario (solo MySQL)');
	let pass = formUser.user.formRegister.password;
	pass = pass.toString();

	// Construir payload único para el endpoint MySQL transaccional
	// Este payload se envía a POST /api/bc_usuarios/registrar
	// El controller crea registros en bc_registro_ext, bc_usuarios y bc_usuarios_roles
	const userData = {
		// Campos principales de bc_usuarios (mapeados por el controller)
		"usu_documento": formUser.user.formRegister.idNumber,
		"usu_tipo_documento": formUser.user.formRegister.idType,
		"usu_nombre": formUser.user.formRegister.name,
		"usu_email": formUser.user.formRegister.email.toLowerCase(),
		"usu_password": pass,
		"usu_telefono": formUser.user.formRegister.phoneNumber || 'Sin telefono',
		"usu_empresa": formUser.user.formRegister.usu_empresa,
		"usu_ciudad": formUser.user.formRegister.usu_ciudad || 'BOGOTA',
		"usu_fecha_nacimiento": formUser.user.formRegister.birthday || new Date().toISOString(),
		"usu_genero": formUser.user.formRegister.gender || 'No especificado',
		"usu_dir_trabajo": formUser.user.formRegister.usu_dir_trabajo || 'No especificado',
		"usu_dir_casa": formUser.user.formRegister.usu_dir_casa || 'No especificado',
		"usu_recorrido": formUser.user.formRegister.usu_recorrido || '0',
		"usu_img": formUser.s3Route || 'Sin url',
		"usu_habilitado": 0,
		"usu_prueba": false,
		"coorCasa": formUser.user.formRegister.coorCasa || null,
		"coorTrabajo": formUser.user.formRegister.coorTrabajo || null,

		// Campos para bc_registro_ext (defaults que serán usados por el controller)
		"transporte_primario": formUser.user.formRegister.transporte_primario || 'No especificado',
		"tiempo_casa_trabajo": formUser.user.formRegister.tiempo_casa_trabajo || '0',
		"tiempo_trabajo_casa": '0',
		"dias_trabajo": formUser.user.formRegister.dias_trabajo || '5',
		"satisfaccion_transporte": formUser.user.formRegister.satisfaccion_transporte || 3,
		"dinero_gastado_tranporte": formUser.user.formRegister.dinero_gastado_tranporte || '0',
		"alternativas": formUser.user.formRegister.alternativas || 'Ninguna',

		// Rol para bc_usuarios_roles
		"ur_rol_id": "6142ca4bd97a767dbd8ad130",
	};

	try {
		// Una sola llamada al endpoint MySQL que crea todo en transacción
		console.log('[REGISTRO] Enviando datos a MySQL...');
		const result = yield api.registerUserMySQL(userData);

		if (result && result.ok) {
			console.log('[REGISTRO] Registro completado exitosamente en MySQL');

			// Login automático después del registro
			yield put({ type: LOGIN_USER, email: formUser.user.formRegister.email.toLowerCase(), password: pass, token: 'token' });
			yield put({ type: ROUTING, component: "LoginScreen" });
			yield put({ type: SAVE_LOADER, loader: false });
		} else {
			console.error('[REGISTRO] Error al crear usuario en MySQL:', result?.message);

			if (result?.status === 500 && result?.message?.includes('ER_DUP_ENTRY')) {
				Alert.alert(
					"Error de Registro",
					"Este usuario ya existe en el sistema. Por favor verifica tu número de documento."
				);
			} else {
				Alert.alert(
					"Error de Registro",
					"Hubo un problema al crear tu cuenta. Por favor intenta nuevamente."
				);
			}
			yield put({ type: SAVE_LOADER, loader: false });
		}
	} catch (error) {
		console.error('[REGISTRO] Error en el proceso de registro:', error);
		Alert.alert(
			"Error de Registro",
			"Hubo un error inesperado. Por favor intenta nuevamente."
		);
		yield put({ type: SAVE_LOADER, loader: false });
	}
}




function* postUserSaga() {
	yield takeLatest(POST_USER, postUser);
}

function* registerSelectorsSaga() {
	yield takeLatest(SAVE_REGISTER_SELECTORS, registerSelectors);
}

function* getUserSaga() {
	yield takeLatest(FETCH_USER_GET_BEGIN, fetchData);
}

function* registerUserSaga() {
	yield takeLatest(FETCH_USER_REGISTER_BEGIN, addUser);
}
function* loginUserSaga() {
	yield takeLatest(FETCH_USER_LOGIN_BEGIN, loginUser);
}
function* routeLoginSaga() {
	yield takeLatest(ROUTE_LOGIN_BEGIN, routeLogin);
}
function* editProfileSaga() {
	yield takeLatest(FETCH_USER_PROFILE_BEGIN, editProfile);
}
function* uploadProfileImageSaga() {
	yield takeLatest(FETCH_IMAGE_PROFILE_BEGIN, uploadProfileImage);
}
function* uploadClubImageSaga() {
	yield takeLatest(FETCH_UPLOAD_CLUB_IMAGE_BEGIN, uploadClubImage);
}
function* addDeviceConfigurationSaga() {
	yield takeLatest(FETCH_DEVICE_CONFIGURATION_BEGIN, addDeviceConfiguration);
}

function* logoutSaga() {
	yield takeLatest(LOGOUT, dologOut);
}
function* sycnActionSaga() {
	yield takeLatest(FETCH_SYNC_BEGIN, sycnAction);
}
function* createClubSaga() {
	yield takeLatest(FETCH_CREATE_CLUB_BEGIN, createClub);
}
function* loadClubInfoSaga() {
	yield takeLatest(FETCH_LOAD_CLUB_BEGIN, loadClubInfo);
}
function* createUserEventSaga() {
	yield takeLatest(FETCH_USER_EVENT_BEGIN, createUserEvent);
}
function* deleteClubSaga() {
	yield takeLatest(FETCH_DELETE_CLUB_BEGIN, deleteClub);
}
function* getEventUserSaga() {
	yield takeLatest(GET_CURRENT_EVENT, getCurrentEventUser)
}
function* editClubSaga() {
	yield takeLatest(FETCH_EDIT_CLUB_BEGIN, editClub);
}
function* filterClubMemberSaga() {
	yield takeLatest(FETCH_FILTER_CLUB_MEMBER_BEGIN, filterClubMember);
}
function* filterClubAdminSaga() {
	yield takeLatest(FETCH_FILTER_CLUB_ADMIN_BEGIN, filterClubAdmin);
}
function* getApiDevices() {
	yield takeLatest(GET_API_DEVICES_BEGIN, getUserApiDevices);
}
function* getDeviceTrackings() {
	yield takeLatest(GET_DEVICE_TRACKINGS, getTrackings);
}
function* getUserCurrentEvents() {
	yield takeLatest(GET_USER_EVENTS, getUserEvents);
}
function* postUserTrackings() {
	yield takeLatest(POST_USER_TRACKINGS, postUserTrackingsCollection);
}
function* getUserProgressSaga() {
	yield takeLatest(GET_USER_PROGRESS, getUserProgress);
}
function* routingSaga() {
	yield takeLatest(ROUTING, routing);
}
function* validateFormSaga() {
	yield takeLatest(VALIDATE_FORM, validateForm);
}

function* guardarFormSaga() {
	yield takeLatest(GUARDAR_FORM, guardarForm);
}

function* updateFormSaga() {
	yield takeLatest(UPDATE_FORM, updateForm);
}

function* uploadEventImageSaga() {
	yield takeLatest(FETCH_UPLOAD_EVENT_IMAGE_BEGIN, uploadEventImage);
}

//update password
function* edit_password__(action) {
	console.log('estamos actualizando password desde la saga (MySQL)', action.clave);
	let user = yield getItem('user');
	console.log('cc user', user.idNumber);

	try {
		// Actualizar usu_password en la tabla bc_usuarios (MySQL)
		let tabla = 'bc_usuarios/' + user.idNumber;
		let data = { 'usu_password': action.clave };
		let updateUser = yield apiPerfil.patch__(tabla, data);
		console.log('Respuesta de actualización de password MySQL:', updateUser?.status);

		if (updateUser && updateUser.status === 200) {
			yield put({ type: UPDATE_PASSWORD_OK });
		} else {
			console.log('Error al actualizar contraseña en MySQL:', updateUser);
			Alert.alert('Error', 'No se pudo actualizar la contraseña. Intenta nuevamente.');
		}
	} catch (error) {
		console.log('Excepción al actualizar contraseña:', error);
		Alert.alert('Error', 'Ocurrió un error inesperado al actualizar la contraseña.');
	}
}

function* edit_password_() {
	yield takeLatest(UPDATE_PASSWORD, edit_password__);
}
////////




function* edit_perfil__(action) {
	console.log('estamos actualizando perfil desde userSaga JJJJJ');
	let request = {
		'email': action.profileSettings.email,
		'phoneNumber': action.profileSettings.phone,
		'name': action.profileSettings.name,
		'workStatus': action.profileSettings.area,
		'firstLastname': action.profileSettings.firstLastname,
	}
	let user = yield getItem('user');
	console.log('cc user', user.idNumber)
	console.log('id user', user.id)
	let updateUser = api.patchField('users', user.id, request);
	console.log('update user', updateUser);

	let tabla = 'bc_usuarios' + '/' + user.idNumber;
	let data = {
		'usu_nombre': action.profileSettings.name + ' ' + action.profileSettings.firstLastname,
		'usu_dir_trabajo': action.profileSettings.dirTrabajo,
		'coorTrabajo': action.profileSettings.coorTrabajo,
		'usu_dir_casa': action.profileSettings.dirCasa,
		'coorCasa': action.profileSettings.coorCasa,
		'usu_ciudad': action.profileSettings.ciudad,
	}
	let userini = yield apiPerfil.patch__(tabla, data);
	console.log('userini La Respuesta de patch de usur en mysql', userini.status)

	if (updateUser && userini.status === 200) {
		yield put({ type: EDITAR_PERFIL_USER_OK });
	}
}

function* edit_perfil_() {
	yield takeLatest(EDITAR_PERFIL_USER, edit_perfil__);
}

function* edit_photo_perfil__(action) {
	console.log('estamos actualizando photo perfil desde userSaga JJJJJ');
	let user = yield getItem('user');
	let Photo_perfil = yield select((state) => state.userReducer.documentUser);
	console.log('Photo_perfil', Photo_perfil)

	if (Photo_perfil && Photo_perfil.assets && Photo_perfil.assets.length > 0) {
		const imageAsset = Photo_perfil.assets[0];

		let formData = new FormData();
		formData.append('image', {
			uri: imageAsset.uri,
			type: imageAsset.type,
			name: imageAsset.fileName || `edit_profile_image_${Date.now()}.jpg`,
		});

		console.log('Subiendo nueva foto de perfil localmente...', formData);
		const uploadRes = yield api.postImgFile(formData, 'user');

		if (uploadRes && !uploadRes.error && uploadRes.imageUrl) {
			const s3Route = uploadRes.imageUrl;
			console.log('URL de foto generada:', s3Route);

			let request = {
				'usu_img': s3Route
			}
			console.log('cc user', user.idNumber)
			console.log('id user', user.id)
			let updateUser = yield api.patchFieldMysql('bc_usuarios', user.idNumber, request);
			console.log('update user', updateUser);
			if (updateUser) {
				yield put({ type: EDITAR_PERFIL_USER_OK });
			}

		} else {
			console.log("Error subiendo foto de perfil en edicion:", uploadRes);
		}
	} else {
		console.log("No habia imagen valida para actualizar");
	}
}

function* edit_photo_perfil_() {
	yield takeLatest(EDITAR_PHOTO_PERFIL_USER, edit_photo_perfil__);
}

export const sagas = [
	uploadEventImageSaga(),
	getUserSaga(),
	registerUserSaga(),
	loginUserSaga(),
	editProfileSaga(),
	createUserEventSaga(),
	uploadProfileImageSaga(),
	addDeviceConfigurationSaga(),
	sycnActionSaga(),
	deleteClubSaga(),
	routeLoginSaga(),
	uploadClubImageSaga(),
	logoutSaga(),
	createClubSaga(),
	editClubSaga(),
	filterClubMemberSaga(),
	filterClubAdminSaga(),
	loadClubInfoSaga(),
	getUserLoggedSaga(),
	goGarminSaga(),
	goSuuntoSaga(),
	getApiDevices(),
	getDeviceTrackings(),
	getUserCurrentEvents(),
	postUserTrackings(),
	getUserProgressSaga(),
	validateUserPaySagas(),
	getEventUserSaga(),
	routingSaga(),
	validateFormSaga(),
	guardarFormSaga(),
	updateFormSaga(),
	registerSelectorsSaga(),
	postUserSaga(),
	edit_password_(),
	edit_perfil_(),
	edit_photo_perfil_()
];
