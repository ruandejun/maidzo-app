import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchApiSignUp } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'

export function* getAppNotifications({page}) {
  let response = yield call(fetchApi, 'get', 'api/notification_module/notification/', {page})

  if(response && (response.detail == 'Invalid token.' || response.detail == 'Invalid token header. No credentials provided.')){
    yield put({
      type: 'LOGOUT'
    });
    return
  }
  console.log({response})
  if (response && response.results) {

    yield put({
      type: actions.GET_APP_NOTIFICATION_SUCCESS,
      data: response.results,
      canLoadMore: (response.next != null),
      page: page,
      unread: response.unread
    });
  } else {
    yield put({
      type: actions.GET_APP_NOTIFICATION_SUCCESS,
      data: [],
      canLoadMore: false,
      page: page,
      unread: response && response.unread ? response.unread : 0
    });
  }
}

export function* updateNotificationRead({notification}) {
  let response = yield call(fetchApi, 'get', `api/notification_module/notification/${notification.id}/mark_as_read/`)

  // console.log({response})
  yield put({
    type: actions.UPDATE_NOTIFICATION_READ_SUCCESS
  });
}

export function* updateNotificationAllRead({notification}) {
  let response = yield call(fetchApi, 'get', `api/notification_module/notification/mark_all_as_read/`)

  // console.log(response)
  yield put({
    type: actions.UPDATE_NOTIFICATION_READ_ALL_SUCCESS
  });

  yield put({
    type: actions.GET_APP_NOTIFICATION,
    page: 1
  });
}

export default function* rootSaga() {
  yield [
    yield takeEvery(actions.GET_APP_NOTIFICATION, getAppNotifications),
    yield takeEvery(actions.UPDATE_NOTIFICATION_READ, updateNotificationRead),
    yield takeEvery(actions.UPDATE_NOTIFICATION_READ_ALL, updateNotificationAllRead)
  ]
}

