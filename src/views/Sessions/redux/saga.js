import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchUnlengthApi } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'
import CustomAlert from 'components/CustomAlert'

export function* login({username, password}) {
  let response = yield call(fetchApiLogin, 'post', 'api-token-auth/', {username, password});

    if (response.token) {
    Global.userToken = response.token
    yield AsyncStorage.setItem('@USER_TOKEN', Global.userToken)
    
    let uresponse = yield call(fetchApi, 'get', 'api/user/myProfile/show/');
      if (uresponse) {

      yield put({
        type: actions.LOGIN_SUCCESSFULLY,
        data: uresponse
      });

      NavigationService.reset('DashboardView')
    }
  } else {
      if(response && response.non_field_errors){
        CustomAlert(response.non_field_errors[0])
      }
        yield put({
            type: actions.LOGIN_FAIL,
            data: response
        })
    }
}

export function* register({username, email, facebook, phone, password, verifypassword}) {
  let response = yield call(fetchApiLogin, 'post', 'api/user/auth/signup/', {username, email, facebook, phone, password, verifypassword});

    if (response.token) {
    Global.userToken = response.token
    yield AsyncStorage.setItem('@USER_TOKEN', Global.userToken)
    
    let uresponse = yield call(fetchApi, 'get', 'api/user/myProfile/show/');
      if (uresponse) {

      yield put({
        type: actions.LOGIN_SUCCESSFULLY,
        data: uresponse
      });

      NavigationService.reset('DashboardView')
    }
  } else {
    if(response && response.non_field_errors){
      CustomAlert(response.non_field_errors[0])
    }
        yield put({
            type: actions.SIGN_UP_FAIL,
            data: response
        })
    }
}


export function* getUser() {
  let uresponse = yield call(fetchApi, 'get', 'api/user/myProfile/show/');
  if (uresponse) {

    yield put({
      type: actions.LOGIN_SUCCESSFULLY,
      data: uresponse
    });
  }
}

export function* updateProfile({pk, name, value}) {
  let response = yield call(fetchUnlengthApi, 'post', 'page/update_information/', {pk, name, value});

  let uresponse = yield call(fetchApi, 'get', 'api/user/myProfile/show/');
      if (uresponse) {

      yield put({
        type: actions.LOGIN_SUCCESSFULLY,
        data: uresponse
      });
  }

  yield put({
    type: actions.UPDATE_PROFILE_SUCCESS
  });

  if(response.message){
    CustomAlert(response.message)
  }
}

export function* logout({username, password}) {
  yield call(fetchApiLogin, 'post', 'api/user/auth/logout', {username, password})

  Global.userToken = null
  yield AsyncStorage.removeItem('@USER_TOKEN')

  NavigationService.reset('LoginView')
}

export default function* rootSaga() {
  yield [
    yield takeEvery(actions.LOGIN, login),
    yield takeEvery(actions.SIGN_UP, register),
    yield takeEvery(actions.GET_USER, getUser),
    yield takeEvery(actions.UPDATE_PROFILE, updateProfile),
    yield takeEvery(actions.LOGOUT, logout),
  ]
}

