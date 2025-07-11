import actions from './action'

const initState = {
    balance: 0,
    detail: null,
    isFetching: false
};

export default function appReducer(state = initState, action) {
    // console.log(action)
    switch (action.type) {
        case actions.GET_WALLET_BALANCE:
            return {...state, isFetching: true}
        case actions.GET_WALLET_BALANCE_SUCCESS:
            return {...state, isFetching: false, balance: action.balance, detail: action.detail}
        default:
            return state
  }
}
