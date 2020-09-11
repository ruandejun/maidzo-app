import actions from './action'

const initState = {
    items: [],
    count: 0,
    isFetching: false,
    detail: null,
    detailItems: [],
    detailFetching: false,
    canLoadMore: true,
    loadingMore: false
};

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_MORE_ORDER:
            return Object.assign({}, state, {
                loadingMore: true
            })
        case actions.GET_MORE_ORDER_SUCCESS:
            let items = state.items
            if(action.data){
                action.data.map((item) => {
                    items.push(item)
                })
            }
            
            return Object.assign({}, state, {
                items: items,
                loadingMore: false,
                canLoadMore: items.length < action.total
            })
        case actions.GET_ORDER:
            return Object.assign({}, state, {
                isFetching: true,
                canLoadMore: true,
                loadingMore: false,
            })
        case actions.GET_DETAIL_ITEMS:
            return Object.assign({}, state, {
                detailFetching: true
            })
        case actions.GET_ORDER_SUCCESS:
            return Object.assign({}, state, {
                items: action.data,
                count: action.total,
                isFetching: false,
                canLoadMore: (action.data && action.data.length < action.total)
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
        case actions.LOGOUT:
            return initState
        default:
            return state
    }
}
