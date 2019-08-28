import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import AppReducer from './reducers'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, AppReducer)

export default function configureStore() {
  const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga)
  let persistor = persistStore(store)
  return {store, persistor}
}