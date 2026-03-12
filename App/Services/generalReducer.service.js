import {
	FETCH_USER_REGISTER_BEGIN,
    FETCH_USER_REGISTER_SUCCESS,
    FETCH_USER_REGISTER_FAIL
}  from './sagas.service';
const initialState = {
    user: 'Iniciando'
};

const countReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_USER_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_USER_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                //userData: action.payload.userData.client,
                //userBalance: action.payload.userData.balance.epayco,
            };
        default:
            return state;
    }
};

export default countReducer;