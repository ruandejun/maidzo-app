import actions from './action'

const initState = {
    notifications: [],
    isFetching: false,
    isLoadingMore: false,
    canLoadMore: true,
    currentPage: 1,
    unread: 0
};

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_APP_NOTIFICATION:
            if(action.page == 1){
                return{...state, isFetching: true}
            } else {
                return{...state, isLoadingMore: true}
            }
            
        case actions.UPDATE_NOTIFICATION_READ:
            let index = state.notifications.indexOf(action.notification)
            let notifications = state.notifications
            if(index > -1){
                notifications[index].unread = false
            }
            return{...state, notifications: notifications, isFetching: true}
        case actions.UPDATE_NOTIFICATION_READ_ALL:
            return{...state, isFetching: true}
        case actions.UPDATE_NOTIFICATION_READ_SUCCESS:
        case actions.UPDATE_NOTIFICATION_READ_ALL_SUCCESS:
            return{...state, isFetching: false}
        case actions.GET_APP_NOTIFICATION_SUCCESS:
            if(action.page == 1){
                return{...state, notifications: action.data, currentPage: action.page, isFetching: false, canLoadMore: action.canLoadMore, unread: action.unread}
            } else {
                let notifications = state.notifications
                if(action.data){
                    action.data.map((item) => {
                        notifications.push(item)
                    })
                }
                
                return{...state, notifications: notifications, currentPage: action.page, isLoadingMore: false, canLoadMore: action.canLoadMore, unread: action.unread}
            }
            
        default:
            return state
  }
}
