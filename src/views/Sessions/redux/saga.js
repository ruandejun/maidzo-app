import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchUnlengthApi } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'
import CustomAlert from 'components/CustomAlert'

export function* login({username, password, device_id, registration_id, platform_type}) {
  console.log({username, password, device_id, registration_id, platform_type})
  let response = yield call(fetchApiLogin, 'post', 'api-token-auth/', {username, password});

  // console.log(response)

    if (response.token) {
    Global.userToken = response.token
    yield AsyncStorage.setItem('@USER_TOKEN', Global.userToken)
    
    let presponse = yield call(fetchApi, 'POST', 'api/user/auth/update_fcm/', {device_id, registration_id, platform_type})
    // console.log(presponse)
    
    let uresponse = yield call(fetchApi, 'get', 'api/user/myProfile/show/')
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
  // console.log(response)
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
  } else if(response.success) {
    
    yield put({
      type: actions.SIGN_UP_SUCCESS
    });
    CustomAlert('Thành công', 'Đăng ký tài khoản thành công. Đăng nhập lại với tài khoản của bạn')
    NavigationService.reset('LoginView', {username: username})
  } else {
    if(response && response.non_field_errors){
      CustomAlert(response.non_field_errors[0])
    } else if(response.error && response.error.username){
      CustomAlert(response.error.username[0])
    } else if(response.error && response.error.email){
      CustomAlert(response.error.email[0])
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

  if(response.error){
    CustomAlert(response.error)
  }
  if(response.message){
    CustomAlert(response.message)
  }
}

export function* updatePassword({current_password, new_password}) {
  let response = yield call(fetchApi, 'PUT', 'api/user/auth/changePassword/', {current_password, new_password});
  
  yield put({
    type: actions.UPDATE_PASSWORD_SUCCESS
  });

  if(response.message){
    CustomAlert(response.message)
  }
  if(response.success){
    CustomAlert('Cập nhật mật khẩu thành công')
  }
  if(response.error){
    CustomAlert(response.error)
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
    yield takeEvery(actions.UPDATE_PASSWORD, updatePassword),
    yield takeEvery(actions.LOGOUT, logout),
  ]
}

