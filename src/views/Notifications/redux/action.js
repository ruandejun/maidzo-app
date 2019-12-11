const actions = {
  GET_APP_NOTIFICATION: 'GET_APP_NOTIFICATION',
  GET_APP_NOTIFICATION_SUCCESS: 'GET_APP_NOTIFICATION_SUCCESS',
  UPDATE_NOTIFICATION_READ: 'UPDATE_NOTIFICATION_READ',
  UPDATE_NOTIFICATION_READ_SUCCESS: 'UPDATE_NOTIFICATION_READ_SUCCESS'
  }

  export const getAppNotifications = (page) => {
    return {
      type: actions.GET_APP_NOTIFICATION,
      page
    }
  }

  export const updateNotificationRead = (notification) => {
    return {
      type: actions.UPDATE_NOTIFICATION_READ,
      notification
    }
  }


  export default actions
  