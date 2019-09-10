import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchUnlengthApi } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'
import CustomAlert from 'components/CustomAlert'

export function* getSettings() {
    let response = yield call(fetchApi, 'get', 'page/get_balance/');
    // console.log(response)
    if (response) {

        yield put({
            type: actions.GET_SETTING_INFORMATION_SUCCESS,
            company_information: response.company_information,
            payment_information: response.payment_information,
            huongdan: (response.template_category && response.template_category.huongdan) ? response.template_category.huongdan : [],
            chinhsach: (response.template_category && response.template_category.chinhsach) ? response.template_category.chinhsach : [],
        })

        yield put({
            type: actions.GET_NOTIFICATION_SUCCESS,
            tintuc: (response.template_category && response.template_category.tintuc) ? response.template_category.tintuc : []
        })
    }
}

export default function* rootSaga() {
    yield [
        yield takeEvery(actions.GET_SETTINGS, getSettings),
    ]
}

