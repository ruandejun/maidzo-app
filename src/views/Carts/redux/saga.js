import { takeEvery, put, call, fork, take } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchUnlengthApi } from "actions/api"
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

export function* deleteCartItem({pk, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item/', {pk, value, name});

  // console.log(response)
  if (response && response.success) {

    let cresponse = yield call(fetchApi, 'get', 'page/cart/show/');
    if (cresponse && cresponse.results) {

      yield put({
        type: actions.GET_CART_SUCCESS,
        data: cresponse.results,
        count: cresponse.count
      });
    }
  }

  if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* updateCartItem({pk, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item/', {pk, value, name});

  // console.log(response)
  if (response && response.success) {

    let cresponse = yield call(fetchApi, 'get', 'page/cart/show/');
    if (cresponse && cresponse.results) {

      yield put({
        type: actions.GET_CART_SUCCESS,
        data: cresponse.results,
        count: cresponse.count
      });
    }
  }

  if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* updateCartItemService({item_list, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item_list_service/', {item_list, value, name});

  // console.log(response)
  if (response && response.success) {

    let cresponse = yield call(fetchApi, 'get', 'page/cart/show/');
    if (cresponse && cresponse.results) {

      yield put({
        type: actions.GET_CART_SUCCESS,
        data: cresponse.results,
        count: cresponse.count
      });
    }
  }

  if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* addItemToCart({payload}) {
  // console.log(JSON.stringify(payload))
  let response = yield call(fetchApi, 'post', 'api/shop_module/cart/', payload);

  // console.log(response)
  if (response && response.id) {

    yield put({
      type: actions.ADD_CART_ITEM_SUCCESS,
      data: response
    });

    CustomAlert('Thêm sản phẩm vào giỏ hàng thành công')
    
    yield put({type: actions.GET_CART})
  } else {
    CustomAlert('Sản phẩm này không thêm được vào giỏ hàng, vui lòng chọn sản phẩm khác.')
  }
}



export default function* rootSaga() {
  yield [
    yield takeEvery(actions.GET_CART, getCart),
    yield takeEvery(actions.ADD_CART_ITEM, addItemToCart),
    yield takeEvery(actions.DELETE_CART_ITEM, deleteCartItem),
    yield takeEvery(actions.UPDATE_CART_ITEM, updateCartItem),
    yield takeEvery(actions.UPDATE_CART_ITEM_SERVICE, updateCartItemService),
  ]
}

