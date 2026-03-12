import {
	ACCEPTED_TERMS,
	ACCEPT_TERMS,
	CHANGE_NOTIFICATION_BEGIN,
	CHANGE_NOTIFICATION_FAILURE,
	CHANGE_NOTIFICATION_SUCCESS,
	FETCH_CLUB_INFO_BEGIN,
	FETCH_CLUB_INFO_FAILURE,
	FETCH_CLUB_INFO_SUCCESS,
	FETCH_CLUB_MEMBER_INFO,
	FETCH_CLUB_MEMBER_INFO_FAILURE,
	FETCH_CLUB_MEMBER_INFO_SUCCESS,
	FETCH_FORGOT_PASSWORD_BEGIN,
	FETCH_FORGOT_PASSWORD_FAILURE,
	FETCH_FORGOT_PASSWORD_SUCCESS,
	FETCH_NOTIFICATION_BEGIN,
	FETCH_NOTIFICATION_FAILURE,
	FETCH_NOTIFICATION_SUCCESS,
	FETCH_SUBSCRIPTION_BEGIN,
	FETCH_SUBSCRIPTION_FAILURE,
	FETCH_SUBSCRIPTION_SUCCESS,
	FETCH_SUPPORT_BEGIN,
	FETCH_SUPPORT_FAILURE,
	FETCH_SUPPORT_SUCCESS,
	FETCH_USER_CONFIGURATION_BEGIN,
	FETCH_USER_CONFIGURATION_FAILURE,
	FETCH_USER_CONFIGURATION_SUCCESS,
	GET_ACTIVE_TRIPS,
	GET_MASTER_LIST_DATA,
	PATCH_CHANGE_LANGUAGE_CONFIGURATION_BEGIN,
	PATCH_CHANGE_LANGUAGE_CONFIGURATION_FAILURE,
	PATCH_CHANGE_LANGUAGE_CONFIGURATION_SUCCESS,
	PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_BEGIN,
	PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_FAILURE,
	PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_SUCCESS,
	PATCH_CHANGE_UNITS_CONFIGURATION_BEGIN,
	PATCH_CHANGE_UNITS_CONFIGURATION_FAILURE,
	PATCH_CHANGE_UNITS_CONFIGURATION_SUCCESS,
	PUT_EMAILANDPASS_BEGIN,
	PUT_EMAILANDPASS_FAILURE,
	PUT_EMAILANDPASS_SUCCESS,
	PUT_UPDATINGINFO_BEGIN,
	PUT_UPDATINGINFO_SUCCESS,
	SEND_FORM_DATE,
	SET_ACTIVE_TRIP,
	SET_MASTER_LIST_TICKET_DATA,
	SET_USER_HAS_TRIP,
	VALIDATE_TICKET_FORM,
} from '../types/othersTypes';
import I18n, { setLocale } from '../Utils/language.utils';
import { all, call, put, select, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { getItem, removeAllItems, setItem, setItems } from '../Services/storage.service';
import { getUserLogged, validateUserPay } from '../actions/actions';
import {
	validateCard,
	validateChangeEmail,
	validateConfiguration,
	validateCreateProfile,
	validateLogin,
	validateRegister
} from '../Utils/validation';
import {
	validateCreateClub,
	validateDeviceConfiguration,
	validateForgotPassword,
	validateSupport,
	validateSync,
} from '../Utils/validation';

/* eslint-disable prettier/prettier */
import { Alert } from 'react-native';
import { SAVE_DOCUMENT_USER } from "../types/userTypes";
import { SET_LOADING } from "../types/rideTypes";
import UserInfo from '../Components/UserInfo';
import { api } from '../api/api.service';
import { appTypes } from '../types/types';
import { get } from '../api/get.service';
import { noapi } from '../api/noauthapi.service';
import * as RootNavigation from '../RootNavigation';

function* changeNotifications(action) {
	yield put({ type: PUT_UPDATINGINFO_BEGIN });
	let request = {
		'notifications': {
			'audio': action.audio,
			'push': action.push,
			'email': action.email
		}
	};
	const changeNotidb = yield api.patchField('configurations', action.id, request);
	if (changeNotidb) {
		yield put({ type: PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_SUCCESS, payload: changeNotidb });
		yield put({ type: PUT_UPDATINGINFO_SUCCESS });
	} else {
		yield put({ type: PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_FAILURE });
		yield put({ type: PUT_UPDATINGINFO_SUCCESS });
	}
}

function* changeEmailPassword(action) {
	let credentials = {
		email: action.emailUser.emailUser,
		password: action.emailUser.password
	}
	var errors = validateChangeEmail(credentials);
	if (errors.length == 0) {
		const userInfo = yield getItem('user');
		userInfo.email = action.emailUser.emailUser.toLowerCase();
		userInfo.password = action.emailUser.password;
		let update = yield api.putItem('users', userInfo.id, userInfo);
		if (update) {
			const user = yield api.getByFilter('users', userInfo.id, 'id');
			user.email = action.emailUser.emailUser;
			yield setItem('user', user[0]);
			console.log("STOARAGE AHORA " + JSON.stringify(user))
			let result = {
				email: action.emailUser.emailUser,
				password: action.emailUser.password,
				type: 'correo'
			}
			setItems([['refresh', JSON.stringify(result)]]);
			yield put({ type: PUT_EMAILANDPASS_SUCCESS });
			yield delay(100)
			Alert.alert(I18n('Good'), I18n('Correctly_Updated'));
		} else {
			yield put({ type: PUT_EMAILANDPASS_FAILURE });
		}
	} else {
		yield put({ type: PUT_EMAILANDPASS_FAILURE });
	}
}

function* changeLanguage(action) {
	yield put({ type: PUT_UPDATINGINFO_BEGIN });
	let request = { 'language': action.language };
	const changeLanguagedb = yield api.patchField('configurations', action.id, request);
	if (changeLanguagedb) {
		console.log("SETEANDO LENGUAGE COMO " + action.language)
		yield setItem('language', action.language);
		yield put({ type: PATCH_CHANGE_LANGUAGE_CONFIGURATION_SUCCESS, payload: changeLanguagedb });
		yield put({ type: PUT_UPDATINGINFO_SUCCESS });
	} else {
		yield put({ type: PATCH_CHANGE_LANGUAGE_CONFIGURATION_FAILURE });
		yield put({ type: PUT_UPDATINGINFO_SUCCESS });
	}

}

function* changeUnits(action) {
	yield put({ type: PUT_UPDATINGINFO_BEGIN });
	let request = { 'units': action.units };
	const changeUnitsdb = yield api.patchField('configurations', action.id, request);
	if (changeUnitsdb) {
		yield setItem('units', action.units);
		yield put({ type: PATCH_CHANGE_UNITS_CONFIGURATION_SUCCESS, payload: changeUnitsdb });
		yield put({ type: PUT_UPDATINGINFO_SUCCESS });
	} else {
		yield put({ type: PATCH_CHANGE_UNITS_CONFIGURATION_FAILURE });
		yield put({ type: PUT_UPDATINGINFO_SUCCESS });
	}
}

function* getClubInfo(action) {
	try {
		let ret = {
			club: [],
		}
		const club = yield api.getByFilter('clubs', action.id, 'id');
		if (club[0]) {
			const members = yield api.getByFilter('user-infos', action.id, 'clubId');
			const eventUsers = yield api.getEventsClub(action.id);
			let events = [];
			eventUsers.forEach((event) => {
				event.challenge = Object.assign({}, event.challenge);
				events.push(event);
			});
			events.sort((a, b) => a.created_at < b.created_at);
			ret.club = club;
			ret.events = events;
			ret.members = members;
			console.log(members)
			ret.club.push(ret);
			yield put({ type: FETCH_CLUB_INFO_SUCCESS, payload: ret });
		} else {
			yield put({ type: FETCH_CLUB_INFO_FAILURE });
		}
	} catch (e) {
		yield put({ type: FETCH_CLUB_INFO_FAILURE });
	}
}

function* getMemberClubInfo(action) {
	try {
		let ret = {
			info: []
		}
		const members = yield api.getByFilter('user-infos', action.id, 'id');
		ret.info = members,
			console.log(members)
		yield put({ type: FETCH_CLUB_MEMBER_INFO_SUCCESS, payload: ret });
	} catch (e) {
		yield put({ type: FETCH_CLUB_MEMBER_INFO_FAILURE });
	}
}



function* supportRequest(action) {
	var errors = validateSupport(action.requestSupport);
	if (errors.length == 0) {
		let request = {
			email: "juliancruz300@gmail.com",
			subject: "Nuevo mensaje de solicitud de soporte",
			html: "<h5> Email: " + action.requestSupport.email + "</h5><br><b>" + action.requestSupport.message + "</b>"
		};
		let send = yield api.sendMail(request);
		if (send) {
			yield put({ type: FETCH_SUPPORT_SUCCESS, payload: send });
		} else {
			yield put({ type: FETCH_SUPPORT_FAILURE });
		}
	} else {
		yield put({ type: FETCH_SUPPORT_FAILURE });
	}
}

function* doPayment(action) {
	var errors = validateCard(action.action);
	if (errors.length == 0) {
		const user = yield select((state) => state.userReducer.dataUser);
		let createCustomer = yield api.createCustomerPayu(action.action.nameTarget, user.email);
		if (createCustomer.id) {
			let request = {
				name: action.action.nameTarget,
				document: action.action.document,
				type: action.action.type,
				number: parseInt(action.action.nTarget),
				expMonth: parseInt(action.action.month),
				expYear: parseInt(action.action.year),
			}
			let target = yield api.createTargetPayu(createCustomer.id, request);
			if (target && target.token) {
				let resSubscription = {
					quantity: 1,
					installments: 1,
					customer: {
						id: createCustomer.id,
						creditCards: [{
							token: target.token
						}]
					},
					plan: {
						planCode: action.action.planCode
					}
				}
				let subscription = yield api.createSubscriptionPayu(resSubscription, user.id);
				if (subscription.id) {
					yield put({ type: FETCH_SUBSCRIPTION_SUCCESS, payload: subscription });
					yield put(validateUserPay(user.id));
				}
			} else {
				yield put({ type: FETCH_SUBSCRIPTION_FAILURE, payload: target });
			}
		} else {
			yield put({ type: FETCH_SUBSCRIPTION_FAILURE, payload: createCustomer.description });
		}
	} else {
		yield put({ type: FETCH_SUBSCRIPTION_FAILURE });
	}
}


function* getNoti() {
	const userInfo = yield getItem('user');
	try {
		const userNotifications = yield api.getByFilterOrder('notifications', userInfo.id, 'userId');
		if (userNotifications[0]) {
			yield put({ type: FETCH_NOTIFICATION_SUCCESS, payload: userNotifications });
		} else {
			yield put({ type: FETCH_NOTIFICATION_FAILURE });
		}
	} catch (e) {
		yield put({ type: FETCH_NOTIFICATION_FAILURE });
	}
}


function* getConfiguration() {
	const userInfo = yield getItem('user');
	try {
		const userConfiguration = yield get.getByFilter('configurations', userInfo.id, 'userId');
		if (userConfiguration.id) {
			yield setItem('language', userConfiguration.language);
			yield setItem('units', userConfiguration.units);
			yield put({ type: FETCH_USER_CONFIGURATION_SUCCESS, payload: userConfiguration });
		} else {
			yield put({ type: FETCH_USER_CONFIGURATION_FAILURE });
		}
	} catch (e) {
		yield put({ type: FETCH_USER_CONFIGURATION_FAILURE });
	}
}

function* changeNoti(action) {
	if (action.notification.message.indexOf("miembro") != -1) {
		const userInfo = yield select((state) => state.userReducer.dataUserInfo);
		console.log("userinfo " + JSON.stringify(userInfo))
		console.log("llega esto", action)
		const club = yield get.getByFilter('clubs', action.notification.action.clubId, 'id');
		let newsnotConfirmed = [];
		const user = yield select((state) => state.userReducer.dataUser);
		if (club.memberId.membersNotConfirmed) {
			if (club.memberId.membersNotConfirmed.length != 0) {
				club.memberId.membersNotConfirmed.forEach((notConfirmed) => {
					if (notConfirmed.id != userInfo.id) {
						newsnotConfirmed.push(notConfirmed);
					}
				})
			}
		}
		if (action.finish == "accept") {
			if (response) {
				let data = response[0];
				data.adminId.adminsIds.map((admins) => {
					console.log(admins)
					let noti = api.sendNotification({
						type: "accept",
						message: `${userInfo.name} ha aceptado la solicitud para entrar a tu club.`,
						state: "unread",
						action: {
							type: "admin",
							clubId: action.notification.action.clubId,
							userId: admins,
						},
						userId: admins,
						created_at: new Date(),
						updated_at: new Date()
					});
				});
			}
			let filterClub = {
				where: { _id: action.notification?.action.clubId }
			}
			api.get("clubs", filterClub).then(response => {
				console.log(response);
				if (response) {

				}
			})
			let update = yield api.patchField('user-infos', userInfo.id, {
				clubId: club.id
			});
			yield put(getUserLogged());
		} else {
			let filterClub = {
				where: { _id: action.notification?.action.clubId }
			}
			let response = yield api.get("clubs", filterClub)
			if (response) {
				let data = response[0];
				data.adminId.adminsIds.map((admins) => {
					console.log(admins)
					let noti = api.sendNotification({
						type: "deny",
						message: `${userInfo.name} ha rechazado la solicitud para entrar a tu club.`,
						state: "unread",
						action: {
							type: "admin",
							clubId: action.notification.action.clubId,
							userId: admins,
						},
						userId: admins,
						created_at: new Date(),
						updated_at: new Date()
					});
				});
			}
		}
		club.updated_at = new Date();
		let send = yield api.patchField("clubs", club.id, {
			memberId: { "membersnotConfirmed": newsnotConfirmed }
		})
		let patch = yield api.patchField("notifications", action.notification.id, {
			state: "read"
		})
		if (send) {
			yield getNoti();
			yield delay(100)
			Alert.alert(I18n('Good'), I18n('Respond_Notification'));
			yield put(getUserLogged());
			yield put({ type: CHANGE_NOTIFICATION_SUCCESS, payload: send });
		} else {
			yield put({ type: CHANGE_NOTIFICATION_FAILURE });
		}

	} else {
		const club = yield get.getByFilter('clubs', action.notification.action.clubId, 'id');
		let newsnotConfirmed = [];
		const user = yield select((state) => state.userReducer.dataUser);
		if (club.adminId.adminsIdsnotConfirmed) {
			if (club.adminId.adminsIdsnotConfirmed.length != 0) {
				club.adminId.adminsIdsnotConfirmed.forEach((notConfirmed) => {
					if (notConfirmed != user.id) {
						newsnotConfirmed.push(notConfirmed);
					}
				})
			}
		}
		if (action.finish == "accept") {
			club.adminId.adminsIds.push(user.id);
		}
		club.updated_at = new Date();
		let send = yield api.patchField("clubs", club.id, {
			adminId: { "adminsIds": club.adminId.adminsIds, "adminsIdsnotConfirmed": newsnotConfirmed }
		})
		let patch = yield api.patchField("notifications", action.notification.id, {
			state: "read"
		})
		if (send) {
			yield getNoti();
			yield delay(100);
			Alert.alert(I18n('Good'), I18n('Respond_Notification'));
			yield put({ type: CHANGE_NOTIFICATION_SUCCESS, payload: send });
		} else {
			yield put({ type: CHANGE_NOTIFICATION_FAILURE });
		}
	}
}

function* forgotPasswordAction(action) {
	let request = {
		email: action.emailForgot.toLowerCase()
	}
	var errors = validateForgotPassword(request);
	if (errors.length == 0) {
		let forgot = yield noapi.postForgotEmail(request);
		console.log(forgot);
		if (!forgot.error) {
			yield put({ type: FETCH_FORGOT_PASSWORD_SUCCESS, payload: forgot });

		} else {
			yield put({ type: FETCH_FORGOT_PASSWORD_FAILURE });
			yield delay(100);
			Alert.alert(I18n('Error'), forgot.error.message ? forgot.error.message : I18n('Check_Email'));
		}
	} else {
		yield put({ type: FETCH_FORGOT_PASSWORD_FAILURE });
	}
}

function* acceptTerms() {
	yield put({ type: ACCEPTED_TERMS });
}


function* getMasterListData() {
	let response = yield api.get("master-lists", { where: {table: "ticket"}})
	yield put({ type: SET_MASTER_LIST_TICKET_DATA, payload: response });
}
function* validateTicketForm(form) {
	console.log('form',form)
	const img = yield select((state) => state.userReducer.documentUser);
	const selectedPhoto = yield select((state) => state.othersReducer.selectedPhoto);
	if (form.ticketForm.typeProblem && form.ticketForm.descriptionProblem) {
		yield put({ type: SET_LOADING, payload: true });
		if (selectedPhoto == 'ok' && Object.keys(img).length > 0) {
			console.log("subiendo foto");
			const s3Route = yield uploadImageS3(img.assets, "users");
			console.log("s3Route ticket", s3Route);
			yield put({ type: SEND_FORM_DATE, payload: { ...form.ticketForm, s3Route } });
		} else {
			yield put({ type: SEND_FORM_DATE, payload: form.ticketForm });
		}
	} else {
		yield delay(100);
		Alert.alert(I18n('Form_error'), I18n('Incomplete_form'));
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
	const result = yield api.postFileHeaders(table, "upload", formData)
	if (result.error == null) {
		if (result.files[0] != null) {
			return result.files[0].location;
		}
	}
}
function* sendFormData(action) {
	const user = yield getItem('user')
	const userHaveTrip = yield select((state) => state.othersReducer.userHaveTrip);
	const activeTrip = yield select((state) => state.othersReducer.activeTrip);
	let state = 'created';
	let img = 'no-picture';
	if (action.payload.s3Route) {
		img = action.payload.s3Route
	}

	let ticket = {
		state,
		type: action.payload.typeProblem,
		picture: img,
		description: action.payload.descriptionProblem,
		organizationId: user.organizationId,
		userId: user.id,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}

	if (activeTrip && activeTrip.length > 0) {
		ticket.tripId = activeTrip[0].id
	} else {
		ticket.tripId = "none";
	}
	yield api.postData("tickets", ticket)

	//const navigation = yield select((state) => state.globalReducer.nav._navigation,);
	yield put({ type: SET_LOADING, payload: false });
	yield delay(100);
	Alert.alert(I18n('Good'), I18n('Send_Message'));
	if (userHaveTrip) {
		RootNavigation.navigate('TripScreen');
	} else {
		RootNavigation.navigate('Home');
	}
}

function* getActiveTrips() {
	const user = yield getItem('user')
	let stateTrip
	let filter = {
		where: {
			and: [
				{ userId: user.id },
				{ state: 'active' }
			]
		}
	}
	let trip = yield api.get("trips", filter)
	trip.length != 0 ? stateTrip = true : stateTrip = false;
	if (stateTrip) {
		yield put({ type: SET_ACTIVE_TRIP, payload: trip });
	}
	yield put({ type: SET_USER_HAS_TRIP, payload: stateTrip });

}

function* toggleDrawer() {
	//const navigation = yield select((state) => state.globalReducer.nav._navigation,);
	//navigation.openDrawer(); PARA ABRIR EL DRAWER
}

function* getMasterListDataSaga() {
	yield takeLatest(GET_MASTER_LIST_DATA, getMasterListData);
}
function* validateTicketFormSaga() {
	yield takeLatest(VALIDATE_TICKET_FORM, validateTicketForm);
}
function* sendFormDataSaga() {
	yield takeLatest(SEND_FORM_DATE, sendFormData);
}
function* getActiveTripsSaga() {
	yield takeLatest(GET_ACTIVE_TRIPS, getActiveTrips);
}
//------------------------------

/*WATCHERS*/
function* supportRequestSaga() {
	yield takeLatest(FETCH_SUPPORT_BEGIN, supportRequest);
}

function* doPaymentSubscription() {
	yield takeLatest(FETCH_SUBSCRIPTION_BEGIN, doPayment)
}

function* clubinfoSaga() {
	yield takeLatest(FETCH_CLUB_INFO_BEGIN, getClubInfo);
}

function* clubmemberinfoSaga() {
	yield takeLatest(FETCH_CLUB_MEMBER_INFO, getMemberClubInfo);
}

function* getNotificationsSaga() {
	yield takeLatest(FETCH_NOTIFICATION_BEGIN, getNoti);
}

function* forgotPasswordActionSaga() {
	yield takeLatest(FETCH_FORGOT_PASSWORD_BEGIN, forgotPasswordAction);
}
function* acceptTermsSaga() {
	yield takeLatest(ACCEPT_TERMS, acceptTerms);
}
function* getConfigurationSaga() {
	yield takeLatest(FETCH_USER_CONFIGURATION_BEGIN, getConfiguration);
}
function* patchLanguageConfigurationSaga() {
	yield takeLatest(PATCH_CHANGE_LANGUAGE_CONFIGURATION_BEGIN, changeLanguage);
}
function* patchUnitsConfigurationSaga() {
	yield takeLatest(PATCH_CHANGE_UNITS_CONFIGURATION_BEGIN, changeUnits);
}
function* patchNotificationsConfigurationSaga() {
	yield takeLatest(PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_BEGIN, changeNotifications);
}
function* putEmailPassUserSaga() {
	yield takeLatest(PUT_EMAILANDPASS_BEGIN, changeEmailPassword)
}

function* changeNotificationSaga() {
	yield takeLatest(CHANGE_NOTIFICATION_BEGIN, changeNoti)
}

function* toggleDrawerSaga() {
	yield takeLatest(appTypes.toggleDrawer, toggleDrawer);
}

export const sagas = [
	getMasterListDataSaga(),
	validateTicketFormSaga(),
	sendFormDataSaga(),
	getActiveTripsSaga(),
	changeNotificationSaga(),
	getNotificationsSaga(),
	forgotPasswordActionSaga(),
	getConfigurationSaga(),
	supportRequestSaga(),
	acceptTermsSaga(),
	clubinfoSaga(),
	clubmemberinfoSaga(),
	patchLanguageConfigurationSaga(),
	patchUnitsConfigurationSaga(),
	patchNotificationsConfigurationSaga(),
	putEmailPassUserSaga(),
	doPaymentSubscription(),
	toggleDrawerSaga()
];