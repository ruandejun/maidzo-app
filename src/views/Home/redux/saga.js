import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchApiSignUp } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'

export default function* rootSaga() {
  yield [
  ]
}

