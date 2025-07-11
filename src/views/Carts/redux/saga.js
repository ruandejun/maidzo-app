import { takeEvery, put, call, fork, take } from 'redux-saga/effects'
import { Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchUnlengthApi } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'
import { SheetManager } from 'react-native-actions-sheet';

export function* getCart() {
  let response = yield call(fetchApi, 'get', 'page/cart/show/');
  
  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

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

export function* getCartCount() {
  let response = yield call(fetchApi, 'get', 'page/get_profile/');
  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

  if (response) {
    yield put({
      type: actions.GET_CART_COUNT_SUCCESS,
      data: response.cart_count
    });
  } else {
    yield put({
      type: actions.GET_CART_COUNT_SUCCESS,
      data: 0
    });
  }
}

export function* deleteCartItem({pk, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item/', {pk, value, name});

  // console.log(response)
  if (response && response.success) {

    yield put({type: actions.GET_CART})
    // yield put({type: actions.GET_CART_COUNT})
  } else if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* deleteSelected({pk, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item/', {pk, value, name});

  // console.log(response)
  if (response && response.success) {

    yield put({type: actions.GET_CART})
    // yield put({type: actions.GET_CART_COUNT})
  } else if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* updateCartItem({pk, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item/', {pk, value, name});

  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

  // console.log(response)
  if (response && response.success) {

    yield put({type: actions.GET_CART})
    yield put({type: actions.GET_CART_COUNT})
  } else if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* updateCartItemService({item_list, value, name}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_cart_item_list_service/', {item_list, value, name});

  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

  // console.log(response)
  if (response && response.success) {

    yield put({type: actions.GET_CART})
    // yield put({type: actions.GET_CART_COUNT})
  } else if(response.msg){
    CustomAlert(response.msg)
  }
  
}

export function* addItemToCart({payload}) {
  console.log(JSON.stringify(payload))
  let response = yield call(fetchApi, 'post', 'api/shop_module/cart/', payload);

  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

  // console.log(response)
  if (response && response.id) {

    yield put({
      type: actions.ADD_CART_ITEM_SUCCESS,
      data: response
    });

    SheetManager.hide('product-props')
    CustomAlert('Thêm sản phẩm vào giỏ hàng thành công')
    
    yield put({type: actions.GET_CART})
    // yield put({type: actions.GET_CART_COUNT})
  } else {
    alert('Sản phẩm này không thêm được vào giỏ hàng, vui lòng chọn sản phẩm khác.')
  }
}

export function* addManualItem({payload}) {
  // console.log(JSON.stringify(payload))
  let response = yield call(fetchUnlengthApi, 'post', 'page/add_item_to_cart/', payload);

  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }

  // console.log(response)
  if (response && response.success) {

    yield put({
      type: actions.ADD_CART_ITEM_SUCCESS,
      data: response
    });

    CustomAlert('Thêm sản phẩm vào giỏ hàng thành công')
    
    yield put({type: actions.GET_CART})
    // yield put({type: actions.GET_CART_COUNT})
  } else {
    CustomAlert('Sản phẩm này không thêm được vào giỏ hàng, vui lòng chọn sản phẩm khác.')
  }
}

export default function* rootSaga() {
  yield [
    yield takeEvery(actions.GET_CART, getCart),
    yield takeEvery(actions.GET_CART_COUNT, getCartCount),
    yield takeEvery(actions.ADD_CART_ITEM, addItemToCart),
    yield takeEvery(actions.ADD_CART_MANUAL, addManualItem),
    yield takeEvery(actions.DELETE_CART_ITEM, deleteCartItem),
    yield takeEvery(actions.DELETE_SELECTED_ITEM, deleteSelected),
    yield takeEvery(actions.UPDATE_CART_ITEM, updateCartItem),
    yield takeEvery(actions.UPDATE_CART_ITEM_SERVICE, updateCartItemService),
  ]
}

