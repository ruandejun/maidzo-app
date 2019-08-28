import actions from './action'

const initState = {
    items: [],
    count: 0,
    isFetching: false,
    detail: null,
    detailItems: [],
    detailFetching: false
};

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_ORDER:
            return Object.assign({}, state, {
                isFetching: true
            })
        case actions.GET_DETAIL_ITEMS:
            return Object.assign({}, state, {
                detailFetching: true
            })
        case actions.GET_ORDER_SUCCESS:
            return Object.assign({}, state, {
                items: action.data,
                count: action.total,
                isFetching: false
            })
        case actions.GET_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                detail: action.data
            })
        case actions.GET_DETAIL_ITEMS_SUCCESS:
                return Object.assign({}, state, {
                    detailItems: action.data,
                    detailFetching: false
                })
        default:
            return state
    }
}
