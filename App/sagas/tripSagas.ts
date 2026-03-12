//agregado para ruedaporibague
import { 
    SET_STATUS_LOCK, 
    VERIFY_LOCK_STATUS_TRIP,
    CHANGE_STATUS_LOCK,
    CHANGE_STATUS_LOCK_CLOSED,
    CONFIRM_BLE_OPENED,
} from '../types/tripTypes';
import { SET_STATUS_LOCK_OPEN } from '../types/types'
import { api } from '../api/api.service';
import { put, takeLatest, select, delay } from 'redux-saga/effects';
import { Alert } from 'react-native';


function* verifyLockStatusTrip(): any {
    //console.log("Entro a la saga verifyLockStatusTrip");
    let apiData;
    let lockInfo = yield select((state) => state.tripReducer.statusLock);
    //leer variable de actual trip (userReducer)
    let actualTrip = yield select((state) => state.userReducer.actualTrip);

    if (lockInfo.lockStatus == "closed") {
        let filter:any = {
            where: {
                //id: lockInfo.id
            }
        };
        //Arma el filtro para buscar candado dependiendo de la información guardada de un candado o el candado relacionado a un bike 
        if(lockInfo.id){
            filter.where.id = lockInfo.id;
        }else{
            filter.where.bikeId = actualTrip.bikeId;
        }
        //Busca el candado
        try {
            apiData = yield api.get("locks", filter);
            //console.log("Lo que trae Apidata: ",apiData[0]);
            
        } catch (error) {
            console.log("Error: ",error);
        }

        yield put ({type: SET_STATUS_LOCK, statusLock: apiData[0]});
        //Validar el estado del candado
        if(apiData[0].lockStatus == "closed"){
            console.log("entro if closed");
            //espera 5 sec y vuelve a validar el estado del cadado
            //yield delay(5000);
            //yield put ({type: VERIFY_LOCK_STATUS_TRIP})
        }else{
            try {
                let patchField = yield api.patchField('trips', actualTrip.id, { lockOpenConfirmation: true });
            } catch (error) {
                console.log("hay un error: ",error);  
            }
        }
    } 
}

function* changeStatusLock(): any{
    let lockInfo = yield select((state) => state.rideReducer.lock);
    console.log('desde tripSagas lockInfo', lockInfo)
    let actualTrip = yield select((state) => state.tripReducer.newTrip);
    console.log('desde tripSagas actualTrip', actualTrip)
    if(lockInfo.id){
        try {
            console.log("cambiando el stado del candado");
            //yield api.patchField('locks', lockInfo.id, { lockStatus: "open" }); //con protocolo
            yield api.patchField('locks', lockInfo.id, { lockStatus: "closed" }); //sin protocolo

            yield put ({type: SET_STATUS_LOCK_OPEN });
        } catch (error) {
            console.log("hay un error: ",error);  
        }
        //lockInfo.lockStatus="open"
        //yield put ({type: SET_STATUS_LOCK, statusLock: lockInfo});
        
        try {
            yield api.patchField('trips', actualTrip.id, { lockOpenConfirmation: true });
        } catch (error) {
            console.log("hay un error: ",error);  
        }
    }else{
      yield delay(200);
      Alert.alert('Opps, estamos cargando la la informacion de candado. Intentalo otra vez');
    }
}

function* changeStatusLock_Closed(): any{
    let lockInfo = yield select((state) => state.rideReducer.lock);
    console.log('desde tripSagas lockInfo para estado lock closed', lockInfo)
    if(lockInfo.id){
        try {
            console.log("cambiando el stado del candado a cerrado");
            yield api.patchField('locks', lockInfo.id, { lockStatus: "closed" });
            //yield put ({type: SET_STATUS_LOCK_OPEN });
        } catch (error) {
            console.log("hay un error: ",error);  
        }
    }else{
      yield delay(200);
      Alert.alert('Opps, estamos cargando la la informacion de candado. Intentalo otra vez');
    }
}

function* confirmBleOpened(): any {
    let actualTrip = yield select((state) => state.userReducer.actualTrip);
    if(actualTrip.id){
        try {
            let patchField = yield api.patchField('trips', actualTrip.id, { lockOpenConfirmation: true });
        } catch (error) {
            console.log("hay un error: ",error);  
        }
    }
}


function* verifyLockStatusTripSaga() {
    yield takeLatest(VERIFY_LOCK_STATUS_TRIP, verifyLockStatusTrip);
}

function* changeStatusLockSaga(){
    yield takeLatest(CHANGE_STATUS_LOCK, changeStatusLock)
}

function* changeStatusLockSagaClosed(){
    yield takeLatest(CHANGE_STATUS_LOCK_CLOSED, changeStatusLock_Closed)
}

function* confirmBleOpenedSaga(){
    yield takeLatest(CONFIRM_BLE_OPENED, confirmBleOpened);
}

export const sagas = [
    verifyLockStatusTripSaga(),
    changeStatusLockSaga(),
    changeStatusLockSagaClosed(),
    confirmBleOpenedSaga(),
]

