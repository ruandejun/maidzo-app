import actions from './action'

const initState = {
    items: [],
    vendors: [],
    count: 0,
    user: null,
    isFetching: false
};

const groupBy = (array, key) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_CART:
            return Object.assign({}, state, { 
                isFetching: true
            })
        case actions.GET_CART_SUCCESS:
            return Object.assign({}, state, { 
                items : action.data,
                vendors: groupBy(action.data, 'vendor'),
                count: action.count,
                user: action.user,
                isFetching: false
            })
        case actions.GET_CART_COUNT_SUCCESS:
                return Object.assign({}, state, { 
                    count: action.data
                })
        case actions.CREATE_ORDER_SUCCESS:
            return initState
        default:
            return state
  }
}
