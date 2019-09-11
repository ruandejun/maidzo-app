import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native';
import Global from 'src/Global';
import { fetchApi, fetchApiLogin, fetchUnlengthApi } from "actions/api"
import NavigationService from 'actions/NavigationService'
import actions from './action'
import CustomAlert from 'components/CustomAlert'

export function* getWalletBalance({username}) {
    let response = yield call(fetchApi, 'get', `page/get_transaction_details/${username}/`);
    // console.log(response)
    if (response) {

        yield put({
            type: actions.GET_WALLET_BALANCE_SUCCESS,
            balance: (response.account_holder && response.account_holder.current_balance) ? response.account_holder.current_balance : 0,
            detail: response
        })
    }
}

export default function* rootSaga() {
    yield [
        yield takeEvery(actions.GET_WALLET_BALANCE, getWalletBalance),
    ]
}

