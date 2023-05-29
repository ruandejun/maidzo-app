import actions from './action'

const initState = {
    company_information: null,
    payment_information: null,
    huongdan: [],
    chinhsach: [],
    isFetching: false,
    showCart: false
};

export default function appReducer(state = initState, action) {
    // console.log(action)
    switch (action.type) {
        case actions.SET_SETTING:
            return {...state, showCart: action.showCart}
        case actions.GET_SETTINGS:
            return {...state, isFetching: true}
        case actions.GET_SETTING_INFORMATION_SUCCESS:
            return {...state, 
                    company_information: action.company_information, 
                    payment_information: action.payment_information, 
                    huongdan: action.huongdan,
                    chinhsach: action.chinhsach,
                    isFetching: false
                }
        default:
            return state
  }
}
