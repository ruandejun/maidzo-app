import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchUnlengthApi } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'

export function* createOrderFromCart({full_name, street, district, city, phone_number, ship_method, order_note, facebook, item_submit}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/build_order_from_cart/', {full_name, street, district, city, phone_number, ship_method, order_note, facebook, item_submit});

  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }
  // console.log(response)
  if (response) {

    yield put({
      type: actions.CREATE_ORDER_SUCCESS,
      data: response
    });

    NavigationService.reset('DashboardView')

    if(response.order_number){
      NavigationService.navigate('OrderDetailView', {order_id: response.order_number})
    }

    yield put({
      type: actions.GET_ORDER
    });
  }
}

export function* getOrder({order = 'asc', offset = 0, limit = 10}) {
  
  let response = yield call(fetchApi, 'get', 'page/get_data_orders/data.json', {order, offset, limit});
  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

  // console.log(response)
  if (response) {

    yield put({
      type: actions.GET_ORDER_SUCCESS,
      data: response.rows,
      total: response.total
    });
  }
}

export function* getMoreOrder({order = 'asc', offset = 0, limit = 10}) {
  
  let response = yield call(fetchApi, 'get', 'page/get_data_orders/data.json', {order, offset, limit});
  console.log({response})
  if (response) {

    yield put({
      type: actions.GET_MORE_ORDER_SUCCESS,
      data: response.rows,
      total: response.total
    });
  }
}

export function* getDetailInfo({id}) {
  
  let response = yield call(fetchApi, 'get', `page/order/${id}/items/`);
  // console.log(response)
  if (response) {

    yield put({
      type: actions.GET_DETAIL_SUCCESS,
      data: response
    });
  }
}

export function* getDetailItems({id, offset = 0, limit = 20}) {
  
  let response = yield call(fetchApi, 'get', `page/order/${id}/get_items_by_offer/?offset=${offset}&limit=${limit}`);
  // console.log(response)
  if (response) {

    yield put({
      type: actions.GET_DETAIL_ITEMS_SUCCESS,
      data: response
    });
  }
}

export default function* rootSaga() {
  yield [
    yield takeEvery(actions.CREATE_ORDER, createOrderFromCart),
    yield takeEvery(actions.GET_ORDER, getOrder),
    yield takeEvery(actions.GET_MORE_ORDER, getMoreOrder),
    yield takeEvery(actions.GET_DETAIL, getDetailInfo),
    yield takeEvery(actions.GET_DETAIL_ITEMS, getDetailItems),
  ]
}

