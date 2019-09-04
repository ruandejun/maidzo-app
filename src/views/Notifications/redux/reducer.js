import actions from './action'

const initState = {
    notifications: [],
    isFetching: false
};

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_NOTIFICATION_SUCCESS:
            return{...state, notifications: action.tintuc}
        default:
            return state
  }
}
