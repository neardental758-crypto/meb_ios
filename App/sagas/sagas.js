import userSaga from './userSaga'
import rideSaga from "./rideSaga";
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
    yield [
        fork(userSaga),
        fork(rideSaga),
    ];
}