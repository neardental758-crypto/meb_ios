import { appTypes } from '../types/types.js';
import {
	FETCH_DEVICE_CONFIGURATION_BEGIN,
	FETCH_DEVICE_CONFIGURATION_SUCCESS,
	FETCH_DEVICE_CONFIGURATION_FAILURE,
	FETCH_SUPPORT_BEGIN,
	FETCH_SUPPORT_SUCCESS,
	FETCH_SUPPORT_FAILURE,
	FETCH_SYNC_BEGIN,
	FETCH_SYNC_SUCCESS,
	FETCH_SYNC_FAILURE,
	FETCH_CREATE_CLUB_BEGIN,
	FETCH_CREATE_CLUB_SUCCESS,
	FETCH_CREATE_CLUB_FAILURE,
	FETCH_FORGOT_PASSWORD_BEGIN,
	FETCH_FORGOT_PASSWORD_SUCCESS,
	FETCH_FORGOT_PASSWORD_FAILURE,
	FETCH_UPLOAD_CLUB_IMAGE_BEGIN,
	FETCH_UPLOAD_CLUB_IMAGE_SUCCESS,
	FETCH_UPLOAD_CLUB_IMAGE_FAILURE,
	FETCH_FILTER_CLUB_MEMBER_BEGIN,
	FETCH_FILTER_CLUB_MEMBER_SUCCESS,
	FETCH_FILTER_CLUB_MEMBER_FAILURE,
	FETCH_USER_CONFIGURATION_BEGIN,
	FETCH_USER_CONFIGURATION_SUCCESS,
	FETCH_USER_CONFIGURATION_FAILURE,
	PATCH_CHANGE_LANGUAGE_CONFIGURATION_BEGIN,
	PATCH_CHANGE_LANGUAGE_CONFIGURATION_SUCCESS,
	PATCH_CHANGE_LANGUAGE_CONFIGURATION_FAILURE,
	PATCH_CHANGE_UNITS_CONFIGURATION_BEGIN,
	PATCH_CHANGE_UNITS_CONFIGURATION_SUCCESS,
	PATCH_CHANGE_UNITS_CONFIGURATION_FAILURE,
	PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_BEGIN,
	PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_SUCCESS,
	PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_FAILURE,
	PUT_EMAILANDPASS_FAILURE,
	PUT_EMAILANDPASS_BEGIN,
	PUT_EMAILANDPASS_SUCCESS,
	FETCH_FILTER_CLUB_ADMIN_BEGIN,
	FETCH_FILTER_CLUB_ADMIN_SUCCESS,
	FETCH_FILTER_CLUB_ADMIN_FAILURE,
	FETCH_NOTIFICATION_BEGIN,
	FETCH_NOTIFICATION_FAILURE,
	FETCH_NOTIFICATION_SUCCESS,
	FETCH_LOAD_CLUB_BEGIN,
	FETCH_LOAD_CLUB_SUCCESS,
	FETCH_LOAD_CLUB_FAILURE,
	FETCH_DELETE_CLUB_BEGIN,
	FETCH_DELETE_CLUB_SUCCESS,
	FETCH_DELETE_CLUB_FAILURE,
	CLEAR_CLUBINFO,
	FETCH_CLUB_INFO_SUCCESS,
	FETCH_CLUB_INFO_BEGIN,
	FETCH_CLUB_INFO_FAILURE,
	FETCH_EDIT_CLUB_BEGIN,
	FETCH_EDIT_CLUB_SUCCESS,
	FETCH_EDIT_CLUB_FAILURE,
	FETCH_SUBSCRIPTION_FAILURE,
	FETCH_SUBSCRIPTION_BEGIN,
	FETCH_SUBSCRIPTION_SUCCESS,
	ACCEPTED_TERMS,
	ACCEPT_TERMS,
	CHANGE_NOTIFICATION_BEGIN,
	CHANGE_NOTIFICATION_SUCCESS,
	CHANGE_NOTIFICATION_FAILURE,
	PUT_UPDATINGINFO_BEGIN,
	PUT_UPDATINGINFO_SUCCESS,
	SET_APP_CONNECTION_STATUS,
	SET_ACTIVE_TRIPS_BOOLEAN,
	SET_MASTER_LIST_TICKET_DATA,
	SET_USER_HAS_TRIP,
	SET_ACTIVE_TRIP,
} from '../types/othersTypes.js';

import { SET_CURRENT_TRIP, SET_FEEDBACK } from '../types/types';

import { LOGOUT, LOGOUTSUCCESS } from '../types/userTypes.js';

const initialState = {
	internetConnection: true,
	data: [],
	isFetching: false,
	club: { name: "no tiene aun" },
	createClubError: false,
	error: false,
	clubImage: '',
	filter: [],
	adminFilter: [],
	configuration: [],
	updatingEmail: false,
	emailSend: [],
	emailSupportSended: false,
	notifications: [],
	clubInfo: {},
	membershipTermsAccepted: false,
	clubActive: [],
	updatedEmail: true,
	deletingClub: false,
	notificationUpdated: false,
	uploadingClubImage: false,
	uploadingClubInfo: false,
	userHasTrip: false, //ticket_v_uht
	loadingClubInfo: false,
	subscriptionCreated: false,
	infoClubLoaded: false,
	updatingInfo: false,
	masterListTicketData: [],
	userHaveTrip: false,
	activeTrip: [],
	loaderLogin: false,
	selectedPhoto: "",
	currentTrip: {},
	feedback: {
		type: "endTrip",
		rating: 0,
		comment: ""
	}
};

export default othersReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER_HAS_TRIP:
			return {
				...state,
				userHaveTrip: action.payload
			}
		case SET_FEEDBACK:
			return {
				...state,
				feedback: action
			}
		case SET_CURRENT_TRIP:
			return {
				...state,
				currentTrip: action.payload
			}
		case SET_ACTIVE_TRIP:
			return {
				...state,
				activeTrip: action.payload
			}
		case SET_ACTIVE_TRIPS_BOOLEAN:
			return {
				...state,
				userHasTrip: action.payload
			}
		case SET_MASTER_LIST_TICKET_DATA:
			return {
				...state,
				masterListTicketData: action.payload
			}
		case FETCH_DEVICE_CONFIGURATION_BEGIN:
			return {
				...state,
				data: [],
				isFetching: true
			}
		case FETCH_DEVICE_CONFIGURATION_SUCCESS:
			return {
				...state,
				isFetching: false,
			}
		case FETCH_DEVICE_CONFIGURATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			}
		case FETCH_SUPPORT_BEGIN:
			return {
				...state,
				data: [],
				isFetching: true,
				error: false,
				emailSupportSended: false
			}
		case FETCH_SUPPORT_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false,
				emailSupportSended: true
			}
		case FETCH_SUPPORT_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				emailSupportSended: false
			}
		case ACCEPT_TERMS:
			return {
				...state,
			}
		case ACCEPTED_TERMS:
			return {
				...state,
				membershipTermsAccepted: true
			}
		case FETCH_SYNC_BEGIN:
			return {
				...state,
				data: [],
				isFetching: true,
				createClubError: false,
			}
		case FETCH_SYNC_SUCCESS:
			return {
				...state,
				isFetching: false,
				...state,
				isFetching: false,
				createClubError: false,
				club: action.payload ? action.payload : { name: "no tiene" },
			}
		case FETCH_SYNC_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				createClubError: true,
			}
		case FETCH_CREATE_CLUB_BEGIN:
			return {
				...state,
				isFetching: true,
				uploadingClubInfo: true
			}
		case FETCH_CREATE_CLUB_SUCCESS:
			return {
				...state,
				isFetching: false,
				uploadingClubInfo: false,
				clubInfo: action.payload,
			}
		case FETCH_CREATE_CLUB_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				uploadingClubInfo: false,
			}
		case FETCH_FORGOT_PASSWORD_BEGIN:
			return {
				...state,
				data: [],
				isFetching: true,
				error: false
			}
		case FETCH_FORGOT_PASSWORD_SUCCESS:
			return {
				...state,
				emailSend: action.payload,
				isFetching: false,
				error: false
			}
		case FETCH_FORGOT_PASSWORD_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			}
		case FETCH_UPLOAD_CLUB_IMAGE_BEGIN:
			return {
				...state,
				isFetching: true,
				uploadingClubImage: true
			}
		case FETCH_UPLOAD_CLUB_IMAGE_SUCCESS:
			return {
				...state,
				isFetching: false,
				clubImage: action.payload,
				error: false,
				uploadingClubImage: false
			}
		case FETCH_UPLOAD_CLUB_IMAGE_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				uploadingClubImage: false
			}
		case FETCH_FILTER_CLUB_MEMBER_BEGIN:
			return {
				...state,
				isFetching: true,
			}
		case FETCH_FILTER_CLUB_MEMBER_SUCCESS:
			return {
				...state,
				isFetching: false,
				filter: action.payload,
				error: false
			}
		case FETCH_FILTER_CLUB_MEMBER_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			}
		case FETCH_FILTER_CLUB_ADMIN_BEGIN:
			return {
				...state,
				isFetching: true,
			}
		case FETCH_FILTER_CLUB_ADMIN_SUCCESS:
			return {
				...state,
				isFetching: false,
				adminFilter: action.payload,
				error: false
			}
		case FETCH_FILTER_CLUB_ADMIN_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			}
		case FETCH_USER_CONFIGURATION_BEGIN:
			return {
				...state,
				isFetching: true,
				error: false
			};
		case FETCH_USER_CONFIGURATION_SUCCESS:
			return {
				...state,
				isFetching: false,
				configuration: action.payload,
				error: false
			};
		case FETCH_USER_CONFIGURATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			};
		case PATCH_CHANGE_LANGUAGE_CONFIGURATION_BEGIN:
			return {
				...state,
				isFetching: false,
				error: false
			};
		case PATCH_CHANGE_LANGUAGE_CONFIGURATION_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false
			};
		case PATCH_CHANGE_LANGUAGE_CONFIGURATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			};
		case PATCH_CHANGE_UNITS_CONFIGURATION_BEGIN:
			return {
				...state,
				isFetching: false,
				error: false
			}
		case PATCH_CHANGE_UNITS_CONFIGURATION_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false
			}
		case PATCH_CHANGE_UNITS_CONFIGURATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			};
		case PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_BEGIN:
			return {
				...state,
				isFetching: false,
				error: false
			};
		case PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false
			};
		case PATCH_CHANGE_NOTIFICATIONS_CONFIGURATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			};
		case PUT_EMAILANDPASS_FAILURE:
			return {
				...state,
				updatingEmail: false,
				updatedEmail: false,
				error: true
			};
		case PUT_EMAILANDPASS_BEGIN:
			return {
				...state,
				updatingEmail: true,
				updatedEmail: false,
				error: false
			};
		case PUT_EMAILANDPASS_SUCCESS:
			return {
				...state,
				updatingEmail: false,
				updatedEmail: true,
				error: false
			};
		case FETCH_NOTIFICATION_BEGIN:
			return {
				...state,
				isFetching: true,
				error: false
			};
		case FETCH_NOTIFICATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			};
		case FETCH_NOTIFICATION_SUCCESS:
			return {
				...state,
				notifications: action.payload,
				isFetching: false,
				error: false
			};
		case FETCH_LOAD_CLUB_BEGIN:
			return {
				...state,
				isFetching: true,
				loadingClubInfo: true,
				error: false
			};
		case FETCH_LOAD_CLUB_FAILURE:
			return {
				...state,
				isFetching: false,
				loadingClubInfo: false,
				error: true
			};
		case FETCH_LOAD_CLUB_SUCCESS:
			return {
				...state,
				clubInfo: action.payload,
				isFetching: false,
				loadingClubInfo: false,
				infoClubLoaded: true,
				error: false
			};
		case FETCH_DELETE_CLUB_BEGIN:
			return {
				...state,
				isFetching: true,
				deletingClub: true,
				error: false
			};
		case FETCH_CLUB_INFO_SUCCESS:
			return {
				...state,
				isFetching: false,
				clubActive: action.payload,
			}
		case FETCH_CLUB_INFO_BEGIN:
			return {
				...state,
				isFetching: true,
				error: false
			};
		case FETCH_DELETE_CLUB_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false,
				deletingClub: false,
				clubActive: action.payload,
				clubInfo: initialState.clubInfo,
			}
		case FETCH_CLUB_INFO_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			}
		case FETCH_SUBSCRIPTION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				errorMessage: action.payload,
				subscriptionCreated: false
			}
		case FETCH_SUBSCRIPTION_BEGIN:
			return {
				...state,
				isFetching: true,
				error: false,
				subscriptionCreated: false
			}
		case FETCH_SUBSCRIPTION_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false,
				subscriptionCreated: action.payload
			}
		case FETCH_DELETE_CLUB_FAILURE:
			return {
				...state,
				isFetching: false,
				deletingClub: false,
				error: true
			};
		case CLEAR_CLUBINFO:
			return {
				...state,
				clubInfo: initialState.clubInfo,
			};
		case FETCH_EDIT_CLUB_BEGIN:
			return {
				...state,
				isFetching: true,
				error: false,
				uploadingClubInfo: true,
			};
		case FETCH_EDIT_CLUB_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false,
				uploadingClubInfo: false,
			}
		case FETCH_EDIT_CLUB_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				uploadingClubInfo: false,
			};
		case CHANGE_NOTIFICATION_BEGIN:
			return {
				...state,
				isFetching: true,
				error: false,
				notificationUpdated: false,
			};
		case CHANGE_NOTIFICATION_SUCCESS:
			return {
				...state,
				isFetching: false,
				error: false,
				notificationUpdated: true,
			};
		case CHANGE_NOTIFICATION_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true,
				notificationUpdated: false,
			};
		case LOGOUT:
			return initialState;
		case PUT_UPDATINGINFO_BEGIN:
			return {
				...state,
				updatingInfo: true,
				error: false
			};
		case PUT_UPDATINGINFO_SUCCESS:
			return {
				...state,
				updatingInfo: false,
				error: false
			};
		case SET_APP_CONNECTION_STATUS:
			return {
				internetConnection: action.status
			}
		case appTypes.setLoadingLogin:
			return {
				...state,
				loaderLogin: action.payload
			}
		case appTypes.onSelectPhoto:
			return {
				...state,
				selectedPhoto: action.payload
			}
		default:
			return state;
	}
}


