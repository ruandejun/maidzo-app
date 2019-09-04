import actions from './action'

const initState = {
    items: [],
    count: 0,
    user: null,
    isFetching: false
};

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_CART:
            return Object.assign({}, state, { 
                isFetching: true
            })
        case actions.GET_CART_SUCCESS:
            return Object.assign({}, state, { 
                items : action.data,
                count: action.count,
                user: action.user,
                isFetching: false
            })
        case actions.CREATE_ORDER_SUCCESS:
            return initState
        default:
            return state
  }
}
