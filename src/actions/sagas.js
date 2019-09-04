import { put, takeLatest, takeEvery, fork, all, spawn } from 'redux-saga/effects'
import authSaga from 'Sessions/redux/saga'
import cartSaga from 'Carts/redux/saga'
import notificationSaga from 'Notifications/redux/saga'
import orderSaga from 'Orders/redux/saga'
import walletSaga from 'Wallets/redux/saga'
import settingSaga from 'Setting/redux/saga'

export default function* rootSaga(getState) {
  yield all([
      authSaga(),
      cartSaga(),
      notificationSaga(),
      orderSaga(),
      walletSaga(),
      settingSaga()
    ]);
}