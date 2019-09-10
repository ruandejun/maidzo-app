const actions = {
    GET_SETTING_INFORMATION: 'GET_SETTING_INFORMATION',
    GET_SETTING_INFORMATION_SUCCESS: 'GET_SETTING_INFORMATION_SUCCESS',
    GET_NOTIFICATION_SUCCESS: 'GET_NOTIFICATION_SUCCESS',
    GET_SETTINGS: 'GET_SETTINGS',
  }

  export const getSettings = () => {
    return {
      type: actions.GET_SETTINGS
    }
  }
  
  export default actions