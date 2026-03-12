import { applyMiddleware, compose } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
//import createSagaMiddleware from 'redux-saga';
import  rootReducer  from '../reducers/reducers';
import userReducer from '../reducers/userReducer';
import rootSaga from '../sagas/rootSaga';

const createSagaMiddleware = require('redux-saga').default;
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configure = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

export default configure;
