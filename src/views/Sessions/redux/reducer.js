import actions from './action'

const initState = {
    user: null,
    isFetching: false,
    isLogin: false,
    updating: false
};

export default function appReducer(state = initState, action) {
    // console.log(action)
    switch (action.type) {
        case actions.UPDATE_PROFILE:
        case actions.UPDATE_PASSWORD:
            return {...state, updating: true}
        case actions.UPDATE_PROFILE_SUCCESS:
        case actions.UPDATE_PASSWORD_SUCCESS:
            return {...state, updating: false}
        case actions.LOGIN:
        case actions.SIGN_UP:
            return {...state,  isFetching: true, isLogin : false}
        case actions.LOGIN_SUCCESSFULLY:
            return {...state,  user: action.data, isFetching : false, isLogin : true};
        case actions.SIGN_UP_SUCCESS:
            return {...state,  isFetching : false, isLogin : false};
        case actions.LOGIN_FAIL:
        case actions.SIGN_UP_FAIL:
            return {...state,  isFetching: false, isLogin : false}
        case actions.LOGOUT_SUCCESS:
        return {...state,  user: null};
        case actions.UNMOUNT_ERROR:
            return { ...state,  isFetching : false};
        default:
        return state
  }
}
