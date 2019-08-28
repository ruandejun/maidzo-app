import { takeEvery, put, call, fork, take } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchApiSignUp } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'

export function* getCart() {
  let response = yield call(fetchApi, 'get', 'page/cart/show/');
  if (response && response.results) {

    yield put({
      type: actions.GET_CART_SUCCESS,
      data: response.results,
      count: response.count,
      user: response.user
    });
  } else {
    yield put({
      type: actions.GET_CART_SUCCESS,
      data: []
    });
  }
}

export default function* rootSaga() {
  yield [
    yield takeEvery(actions.GET_CART, getCart)
  ]
}

