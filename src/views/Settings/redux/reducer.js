import actions from './action'

const initState = {
    company_information: null,
    payment_information: null,
    huongdan: [],
    chinhsach: []
};

export default function appReducer(state = initState, action) {
    console.log(action)
    switch (action.type) {
        case actions.GET_SETTING_INFORMATION_SUCCESS:
            return {...state, 
                    company_information: action.company_information, 
                    payment_information: action.payment_information, 
                    huongdan: action.huongdan,
                    chinhsach: action.chinhsach}
        default:
            return state
  }
}
